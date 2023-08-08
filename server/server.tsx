import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'
import App from "../src/App";
import {StaticRouter} from "react-router-dom/server";
import {Helmet} from "react-helmet";
import {nip19} from 'nostr-tools';
import {Config, SERVER_RELAYS} from "../src/resources/Config";
import NDK, {
    NDKEvent,
    NDKFilter, NDKRelay, NDKRelaySet, NDKSubscription,
    NDKSubscriptionCacheUsage,
    NDKSubscriptionOptions,
    NostrEvent
} from '@nostr-dev-kit/ndk';
import RedisAdapter from '@nostr-dev-kit/ndk-cache-redis';
import {uniqBy, groupBy, forOwn} from 'lodash';
import {containsTag, valueFromTag} from "../src/utils/utils";

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PWD,
    port: process.env.PG_PORT
});

const bodyParser = require('body-parser');
const baseUrl = process.env.BASE_URL;
const server = express();

process.on('unhandledRejection', (error: any, p) => {
    console.log('=== UNHANDLED REJECTION ===');
    console.dir(error);
    console.dir(p);
});

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use('/', express.static(path.join(__dirname, 'static')));
server.use(express.static('public'));
server.use(bodyParser.json());

const manifest = fs.readFileSync(
    path.join(__dirname, 'static/manifest.json'),
    'utf-8'
);
const assets = JSON.parse(manifest);

const events: NostrEvent[] = [];

const nevents: string[] = [];




const cacheAdapter = new RedisAdapter({ expirationTime: 60 * 60 * 24 });

// ndk instance used to subscribe to events with a given HASHTAG
// @ts-ignore
let ndk = new NDK({ explicitRelayUrls: SERVER_RELAYS, cacheAdapter });

// ndk instance used to publish events to search relay
let ndkSearchnos = new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY_PUBLISH] });

const ndkDev = new NDK({ explicitRelayUrls: ['wss://q.swarmstr.com'] });

let subscription: NDKSubscription;

const publish = async (ndk: NDK, nostrEvent: NostrEvent) => {
    try {
        const event = new NDKEvent(ndk, nostrEvent);
        console.log(`signing & publishing new event`, {event});
        try {
            await ndkSearchnos.connect();
            await event.publish();
            console.log(`event ${event.id} published!`);
        } catch (error) {
            console.error(`unable to publish event ${nostrEvent.id}`);
        }
    } catch (error) {
        console.error(`unable to create NDKEvent from event ${nostrEvent.id}`);
    }
};

const onEvent = (event: NDKEvent) => {
    const nostrEvent = event.rawEvent();
    const { tags } = nostrEvent;
    const referencedEventId = valueFromTag(nostrEvent, 'e');
    const referencedEventId1 = valueFromTag(event, 'e');
    console.log({referencedEventId, referencedEventId1})
    if (containsTag(tags, ['t', Config.HASHTAG])) {
        // if event contains referenced event tag, it serves at question hint
        // thus gotta fetch the referenced event
        if (!!referencedEventId) {
            subscribe({ ids: [referencedEventId] }, { closeOnEose: true, groupable: true, groupableDelay: 5000 }, false);
        } else {
            // event is a question
            // publish the event to search pseudo relay
            publish(ndkSearchnos, nostrEvent)
                .then(() => {
                    console.log(`event published to search relay (direct)!`);
                });
            publish(ndkDev, nostrEvent)
                .then(() => {
                    console.log(`event published to question relay (direct)!`);
                });
        }
    } else {
        // event doesn't contain the asknostr tag
        // but it was hinted by a quote event
        // publish the event to search pseudo relay
        publish(ndkSearchnos, nostrEvent)
            .then(() => {
                console.log(`event published to search relay (hinted)!`);
            });
        publish(ndkDev, nostrEvent)
            .then(() => {
                console.log(`event published to question relay (hinted)!`);
            });
    }
};

const filters: NDKFilter[] = [
    { ids: '53728d6c1de76f867d31dbdea22a60f21b2a150bba6c60a05ec880bd0c1248fd' },
    { ids: 'be52b4a8e43f4186863158f3e88b0f152cb70c94abe87d047ec5240bb321904e' },
    { ids: 'f96777692a307d5e036618331e97b19f53a81c38ac19887472167eecf33e677a' },
    { kinds: [1] }
];
const maxSize = 10;

const addDelayedSubscription = (filter: NDKFilter) => {
    filters.push(filter);
};

export const subscribeToDelayedSubscriptions = () => {
    const finalFilters = [];
    const groupedFilters = groupBy(filters, (_filter: NDKFilter) => Object.keys(_filter));
    forOwn(groupedFilters, (f) => {})
    const mappedFilters = Object.keys(groupedFilters).map((key) => ({
        [key]: groupedFilters[key].map((f) => f[key])
    }));

    console.log({mappedFilters});
};

subscribeToDelayedSubscriptions();

const subscribe = (
    filter: NDKFilter,
    opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
    override: boolean = true
) => {
    // when set to true:
    //  1. stop all active subs
    //  2. recreate ndk instances
    if (override) {
        // stopping all active subs
        ndk.pool.relays.forEach((relay: NDKRelay) => {
            relay.activeSubscriptions
                .forEach((_sub: NDKSubscription) => _sub.stop())
        });
        ndkSearchnos.pool.relays
            .forEach((relay: NDKRelay) => relay
                .activeSubscriptions
                .forEach((_sub: NDKSubscription) => _sub.stop()));
        // a dummy 'hack' to deal with relay connectivity issues
        // todo: find a way to constantly stay connected to as many relays as possible
        // @ts-ignore
        ndk = new NDK({ explicitRelayUrls: SERVER_RELAYS, cacheAdapter });
        ndkSearchnos = new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY_PUBLISH] });
        Promise.all([
            ndk.connect(5000),
            ndkSearchnos.connect(5000)
        ])
            .then(() => {
                console.log('connected to relays')
            });
    }
    // subscribe
    const sub = ndk.subscribe(filter, opts);

    console.log(`new sub created...`);

    sub.on('event', onEvent);

    sub.on('eose', () => {
        console.log(`eose received`);
    });

    sub.on('close', () => {
        console.log(`the sub was closed...`);
    });

    // if (override) {
    //     subscription?.stop();
    //     subscription = sub;
    //     subscription.start()
    //         .then(() => {
    //             console.log(`sub started...`);
    //         });
    //
    // }
};

// connect to relays
ndk.connect(2100)
    .then(() => {
        console.log(`Connected to relays`);
    });

let delay: number = 0;

setInterval(() => {
    console.log(`relays: ${ndk.pool.stats().connected}/${ndk.pool.stats().total}`);
}, 30000);

setInterval(() => {
    // console.log(`subs: ${Array.from(ndk.pool.relays.values()).reduce((relay, { activeSubscriptions }) => relay.activeSubscriptions.size() + activeSubscriptions.size())}`);
}, 30000);

ndk.pool.on('notice', (notice) => {
    console.log(`got a notice`);
});

ndk.pool.on('flapping', (flapping) => {
    console.log(`some relays flapping`);
});

// connect to search relay
ndkSearchnos.connect(2100)
    .then(() => {
        console.log(`Connected to search relay`);
    });

// initially subscribe to hashtag events
subscribe({
    kinds: [1, 30023],
    '#t': [Config.HASHTAG],
    since: Date.now() / 1000 - 24 * 60 * 60,
}, { closeOnEose: false, groupable: false});

// connect to search relay
ndkDev.connect(2100)
    .then(() => {
        console.log(`Connected to search relay`);
    });

// subscribe to events with a given HASHTAG
// every x seconds to deals with relay connectivity issues
// more info in subscribe method
setInterval(() => {
    console.log(`'re-subscribe' attempt...`);
    subscribe({
        kinds: [1, 30023],
        '#t': [Config.HASHTAG],
        since: Date.now() / 1000 - 60 * 60,
    }, { closeOnEose: false, groupable: false}, true);
}, 5 * 60 * 1000);

const isNameAvailable = async (name: string): Promise<boolean> => {
    if (!(new RegExp(/([a-z0-9_.]+)/, 'gi').test(name)) || name.length < 1) return false;
    try {
        const response = await pool.query('SELECT * FROM addresses WHERE name = $1', [name]);
        if (response.rows.length > 0) return false;
        return true;
    } catch (error) {
        console.error(`unable to fetch name...`, {error});
    }
    return false;
};

const isPubkeyValid = (pubkey: string): boolean => {
    try {
        return pubkey.length === 64 && !!nip19.npubEncode(pubkey);
    } catch (error) {

    }
    return false;
} ;


server.get('/api/events', (req, res) => {
    res.json(uniqBy(events, 'id'));
});

server.get('/api/nevents', (req, res) => {
    res.json(uniqBy(nevents, (nevent) => {
        const data = nip19.decode(nevent);
        console.log({data})
        return data.data.id;
    }));
});

server.get('/.well-known/nostr.json', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM addresses');
        const names: any = {};
        response.rows.forEach(({ name, pubkey }: any) => {
            names[name] = pubkey;
        });
        res.json({names});
    } catch (error) {
        console.error(`unable to get nostr addresses...`, {error});
    }
});

server.get('/api/check-name/:name', async (req, res) => {
    // console.log({params: req.params});
    const name = req.params.name.toLowerCase();
    const nameAvailable = await isNameAvailable(name);
    res.json({ nameAvailable });
});

server.post('/api/register-name', async (req, res) => {
    console.log({body: req.body});
    let { name, pubkey } = req.body;
    try {
        name = name.toLowerCase();
        pubkey = new RegExp(/(npub)/).test(pubkey) ? nip19.decode(pubkey).data as string : pubkey;
        const nameAvailable = await isNameAvailable(name);
        const pubkeyValid = await isPubkeyValid(pubkey);
        if (!nameAvailable || !pubkeyValid) {
            res.sendStatus(400);
            return;
        }

        try {
            const response = await pool.query('INSERT INTO addresses (name, pubkey) VALUES ($1, $2) RETURNING *', [name, pubkey]);
            if (response.rows[0]) {
                res.sendStatus(204);
                return;
            }
            res.sendStatus(400);
            return;
        } catch (error) {

        }
    } catch (error) {

    }
    res.sendStatus(400);
    console.log({name, pubkey});
});

server.get('/api/ai', async (req, res) => {
    // Load the model.
    // @ts-ignore
    // use.load().then(model => {
    //     // Embed an array of sentences.
    //     const sentences = [
    //         'Hello.',
    //         'How are you?'
    //     ];
    //     // @ts-ignore
    //     model.embed(sentences).then(embeddings => {
    //         console.log({embeddings})
    //         // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    //         // So in this example `embeddings` has the shape [2, 512].
    //         embeddings.print(true /* verbose */);
    //     });
    // });
    // const id = '2f02d76f09666ae076e65beb60ff195eb7f44b51c73147a6a37748bfabd60a7c';
    // const content = 'can anyone explain in simple terms what nostr is and how to start using it?!';
    // try {
    //     const response = await ai.createEmbedding({
    //         model: 'text-embedding-ada-002',
    //         input: content
    //     });
    //     const [{ embedding }] = response.data.data;
    //
    //     console.log({embedding});
    //
    //     try {
    //         const response = await pool.query('INSERT INTO events (id, content, embedding) VALUES ($1, $2, $3)', [id, content, embedding]);
    //         if (response) {
    //             res.sendStatus(204);
    //         }
    //     } catch (error) {
    //         console.error('error adding event...', {error});
    //         res.sendStatus(400);
    //     }
    //
    // } catch (error) {
    //     console.error('error getting embedding...', {error})
    //     res.sendStatus(400);
    //     // @ts-ignore
    //     console.log({data: error?.response?.data})
    // }

});

server.get('/*', (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    if (path === '/resources/nostr/' || path === '/resources/nostr' || path === '/nostr/resources' || path === '/swarmstr') {
        res.writeHead(301, {
            Location: `/`
        }).end();
    }
    const pathArr = path.split('/');
    const noteIdBech32 = pathArr && pathArr[pathArr.length - 1];
    try {
        const noteIdHex = nip19.decode(noteIdBech32);
        console.log({noteIdHex})
        const noteId = noteIdHex && noteIdHex.data;
        if (noteId) {
            const note = events.find((e: any) => e.id === noteId);
            if (note) {
                const title = note.content.replace(/#\[([0-9]+)\]/g, '');
                helmet = {
                    ...helmet,
                    title: {
                        ...helmet.title,
                        toString(): string {
                            return `<title>${title} - UseLessShit.co</title>`
                        }
                    },
                    meta: {
                    ...helmet.meta,
                        toString(): string {
                            return `<meta property="og:title" content="${title} - UseLessShit.co" />` +
                                `<meta itemProp="name" content="${title} - UseLessShit.co" />` +
                                `<meta name="twitter:title" content="${title} - UseLessShit.co" />`;
                        }
                    }
                };

            }
        }
        console.log({path, noteId})
    } catch (error) {
        console.error({error});
    }

    const component =
        renderToString(
        <StaticRouter location={path}>
            <App/>
        </StaticRouter>
    );
    res.render('client', { assets, component, helmet, baseUrl })
});

server.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});

