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
    NDKSubscriptionOptions, NDKTag,
    NostrEvent
} from '@nostr-dev-kit/ndk';
import RedisAdapter from '@nostr-dev-kit/ndk-cache-redis';
import {uniqBy, groupBy, forOwn, debounce} from 'lodash';
import {containsTag, valueFromTag} from "../src/utils/utils";

const redis = require("redis");
// @ts-ignore
let redisClient;

(async () => {
    // @ts-ignore
    redisClient = redis.createClient();
    // @ts-ignore
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

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

// only subscribe to events since given timestamp
// default 7 days
const EVENTS_SINCE = Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60);

const cacheAdapter = new RedisAdapter({ expirationTime: 365 * 60 * 60 * 24 });

// ndk instance used to subscribe to events with a given HASHTAG
// @ts-ignore
const ndk = new NDK({ explicitRelayUrls: SERVER_RELAYS, cacheAdapter });

// ndk instance used to publish events to search relay
const ndkSearchnos = new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY_PUBLISH] });

const publish = async (nostrEvent: NostrEvent, relayUrls?: string[], _ndk?: NDK) => {
    try {
        const event = new NDKEvent(_ndk || ndk, nostrEvent);
        // console.log(`publishing new event`, {event});
        try {
            // @ts-ignore
            const result = await event.publish(NDKRelaySet.fromRelayUrls(relayUrls, _ndk || ndk), 5000);
            console.log(`event ${event.id} published!`, {result});
        } catch (error) {
            console.error(`unable to publish event ${nostrEvent.id}, ${JSON.stringify(nostrEvent)}`);
            // setTimeout(() => {
            //     publish(nostrEvent, relayUrls, _ndk || ndk)
            // }, 500);
        }
    } catch (error) {
        console.error(`unable to create NDKEvent from event ${nostrEvent.id}`);
    }
};

let ids: string[] = [];

const debouncedSub = debounce(() => {
    // console.log(`subscribing to ids: ${ids.join(',')}`);
    subscribe({ ids }, { closeOnEose: true });
    ids = [];
}, 2000);

const publishToSearchRelay = async (nostrEvent: NostrEvent) => {
    try {
        await publish(nostrEvent, [Config.SEARCH_RELAY_PUBLISH], ndkSearchnos)
    } catch (e) {
        console.error('Unable to publish to search relay');
    }
};

const handleHashTagEvent = (event: NDKEvent) => {
    const nostrEvent = event.rawEvent();
    const { tags } = nostrEvent;
    const referencedEventId = valueFromTag(nostrEvent, 'e');
    const referencedEventId1 = valueFromTag(event, 'e');
    // console.log({referencedEventId, referencedEventId1})
    if (containsTag(tags, ['t', Config.HASHTAG])) {
        // if event contains referenced event tag, it serves at question hint
        // thus gotta fetch the referenced event
        if (!!referencedEventId) {
            ids.push(referencedEventId);
            debouncedSub();
        } else {
            // event is a question
            // publish the event to search pseudo relay
            publishToSearchRelay(nostrEvent)
                .then(() => {
                    console.log(`event published to search relay (direct)!`);
                })
                .catch((e) => {
                    // retry in 5 secs
                    setTimeout(() => {
                        publishToSearchRelay(nostrEvent);
                    }, 5000);
                });
            publish(nostrEvent, ['wss://q.swarmstr.com'])
                .then((response) => {
                    console.log(`event published to question relay (direct)!`, {response});
                });
        }
    } else {
        // event doesn't contain the asknostr tag
        // but it was hinted by a quote event
        // publish the event to search pseudo relay
        publishToSearchRelay(nostrEvent)
            .then(() => {
                console.log(`event published to search relay (hinted)!`);
            })
            .catch((e) => {
            // retry in 5 secs
            //     setTimeout(() => {
            //         publishToSearchRelay(nostrEvent);
            //     }, 5000);
            });
        publish(nostrEvent, ['wss://q.swarmstr.com'])
            .then((response) => {
                console.log(`event published to question relay (hinted)!`, {response});
            });
    }
};

const subscribe = (
    filter: NDKFilter,
    opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
    onEvent?: (event: NDKEvent) => void,
    onEose?: () => void
) => {
    const sub = ndk.subscribe(filter, opts);

    console.log(`new sub created...`);

    sub
        .on('event', onEvent || handleHashTagEvent)
        .on('eose', onEose || (() =>  {
            console.log(`server client: eose received`);
        }))
        .on('close', () => {
            console.log(`the sub was closed...`);
        });
};

// connect to relays
ndk.connect(2100)
    .then(() => {
        console.log(`Connected to relays`);
    });

// connect to search relay
ndkSearchnos.connect(2100)
    .then(() => {
        console.log(`Connected to search relay`);
    });

setInterval(() => {
    console.log(`relays: ${ndk.pool.stats().connected}/${ndk.pool.stats().total}`);
}, 30000);

ndk.pool.on('notice', (notice) => {
    console.log(`got a notice`);
});

ndk.pool.on('flapping', (flapping) => {
    console.log(`some relays flapping`);
});

// initially subscribe to hashtag events
subscribe({
    kinds: [1, 30023],
    '#t': [Config.HASHTAG],
    since: EVENTS_SINCE,
}, { closeOnEose: false, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST });

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
};

const isNoteValid = (id: string): boolean => {
    try {
        return id.length === 64 && !!nip19.noteEncode(id);
    } catch (error) {

    }
    return false;
};

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

server.get('/api/cache/:value/:kind/:tag', async (req, res) => {
    const { value, kind, tag } = req.params;
    if (!value) return;
    // get list of kind 1 events from filter {"#e", "eventId"}
    // @ts-ignore
    const eventIdsString = await redisClient.get(`${value}:#${tag || 'e'}:${+kind || 1}`);
    const eventIds = eventIdsString && eventIdsString?.split(':');
    // console.log({eventIds})
    // if cached list exists, fetch events on the list from cache
    if (eventIds?.length > 0) {
        // @ts-ignore
        const events = await redisClient.mGet(eventIds);
        const parsedEvents = events.map((event: string) => JSON.parse(event))
        // console.log('cached eventsList', {parsedEvents})
        res.json(parsedEvents);
    } else {
        const events: NostrEvent[] = [];
        // otherwise create subscription and cache the events
        subscribe(
            {[`#${tag || 'e'}`]: [value], kinds: [+kind || 1] },
            { closeOnEose: true, groupable: false },
            async (event: NDKEvent) => {
                // console.log('got event: ', {event});
                events.push(event.rawEvent());
            },
            () => {
                let list: string = '';
                if (tag === 'e') list = uniqBy(events, 'id').map(({id}: NostrEvent) => id).join(':');
                if (tag === 'd') list = uniqBy(events, 'id')
                    .map(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 'e').map((tag: NDKTag) => tag[1])).flat(2).join(':');
                // console.log('saving list...', { list });
                // @ts-ignore
                redisClient.set(`${value}:#${tag || 'e'}:${+kind || 1}`, list);
            });
        res.sendStatus(204);
    }
});

server.get('/*', async (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    const pathArr = path.split('/');
    const nevent = pathArr && pathArr[pathArr.length - 1];
    try {
        const eventPointer = nip19.decode(nevent);
        const { id } = eventPointer?.data;
        if (id) {
            // @ts-ignore
            const event = await redisClient.get(id);
            if (event) {
                try {
                    const { content } = JSON.parse(event);
                    let length = content;
                    let title = content.replace(/#\[([0-9]+)\]/g, '').slice(0, content.indexOf('?') > -1 ? content.indexOf('?') + 1 : content.length);
                    if (title.length > 150) title = `${title.slice(0, 150)}...`;
                    // console.log('question title', { title } )
                    helmet = {
                        ...helmet,
                        title: {
                            ...helmet.title,
                            toString(): string {
                                return `<title>${title} - Swarmstr.com</title>`
                            }
                        },
                        meta: {
                            ...helmet.meta,
                            toString(): string {
                                return `<meta property="og:title" content="${title} - Swarmstr.com" />` +
                                    `<meta itemProp="name" content="${title} - Swarmstr.com" />` +
                                    `<meta name="twitter:title" content="${title} - Swarmstr.com" />`;
                            }
                        }
                    };
                } catch (e) {

                }
            }
        }
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

