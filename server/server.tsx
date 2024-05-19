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
    NostrEvent, NDKPrivateKeySigner
} from '@nostr-dev-kit/ndk';
import RedisAdapter from '@nostr-dev-kit/ndk'
// import RedisAdapter from "@nostr-dev-kit/ndk-cache-redis";
import {uniqBy, groupBy, forOwn, debounce, sortBy, isArray} from 'lodash';
import {containsAnyTag, containsTag, valueFromTag} from "../src/utils/utils";
import { HfInference } from "@huggingface/inference";
import {request} from "../src/services/request";
import {Buffer} from "buffer";

const { Configuration, OpenAIApi } = require("openai");
const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfig);
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

(global as any).WebSocket = require('ws');



// import WebSocket, { WebSocketServer } from 'ws';
import {searchImageDatabase} from "../src/services/pixabay";
// import {Relay} from "nostr-tools";
// import {useWebSocketImplementation} from "nostr-tools";
// import RedisAdapter from "@nostr-dev-kit/ndk-cache-redis/dist/cjs";

// useWebSocketImplementation(WebSocket);

// const wss = new WebSocketServer({ port: 8082 });
// const websocket = new WebSocket(Config.SEARCH_RELAY_PUBLISH);



// websocket.on('error', (err: any) => {
//     console.log('websocket error', {err})
// })

// websocket.on('open', () => {

// })

// wss.on('connection', (ws) => {
//     console.log('websocket');
//     ws.on('websocket error', console.error);
//
//     ws.on('message', (data, isBinary) => {
//         // ws.send(data);
//         console.log('websocket: received:', {data});
//         // wss.clients.forEach((client) => {
//         //     if (client.readyState === WebSocket.OPEN) {
//         //         client.send(data, { binary: isBinary });
//         //     }
//         // });
//     });
//
//     ws.send('hello!')
//     ws.send('you have connected to the websocket server...');
// });

process.env.DEBUG = 'ndk:*';

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

(async () => {
    await pool.query('CREATE TABLE IF NOT EXISTS ' +
        'searches (query VARCHAR(255) NOT NULL, hits INT DEFAULT 0)');
    // await pool.query('CREATE TABLE IF NOT EXISTS ' +
    //     'caches ()')
})();

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
const EVENTS_SINCE = Math.floor(Date.now() / 1000 - 1 * 24 * 60 * 60);

const cacheAdapter = new RedisAdapter();
// const cacheAdapter = new NDKRedisCacheAdapter({ expirationTime: 365 * 60 * 60 * 24 });

// ndk instance used to subscribe to events with a given HASHTAG
// @ts-ignore
const ndk = new NDK({ explicitRelayUrls: [...SERVER_RELAYS, Config.SEARCH_RELAY_PUBLISH, Config.SEARCH_RELAY] });

// ndk instance used to publish events to search relay
// const ndkSearchnos = new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY_PUBLISH] });

// const publish = async (nostrEvent: NostrEvent, relayUrls?: string[]) => {
//     try {
//         const event = new NDKEvent(ndk, nostrEvent);
//         // console.log(`publishing new event`, {event});
//         try {
//             // @ts-ignore
//             const result = await event.publish(NDKRelaySet.fromRelayUrls(relayUrls, _ndk || ndk), 5000);
//             console.log(`event ${event.id} published!`, {result});
//         } catch (error) {
//             console.error(`unable to publish event ${nostrEvent.id}, ${JSON.stringify(nostrEvent)}`);
//             // setTimeout(() => {
//             //     publish(nostrEvent, relayUrls, _ndk || ndk)
//             // }, 500);
//         }
//     } catch (error) {
//         console.error(`unable to create NDKEvent from event ${nostrEvent.id}`);
//     }
// };

let ids: string[] = [];

const debouncedSub = debounce(() => {
    // console.log(`subscribing to ids: ${ids.join(',')}`);
    subscribe({ ids }, { closeOnEose: true });
    ids = [];
}, 2000);

// const publishToSearchRelay = async (nostrEvent: NostrEvent) => {
//     try {
//         await publish(nostrEvent, [Config.SEARCH_RELAY_PUBLISH], ndk)
//     } catch (e) {
//         console.error('Unable to publish to search relay');
//     }
// };

const handleHashTagEvent = async (event: NDKEvent) => {
    const nostrEvent = event.rawEvent();
    const { tags } = nostrEvent;
    const referencedEventId = valueFromTag(nostrEvent, 'e');
    if (containsAnyTag(tags, Config.NOSTR_TAGS.map((t: string) => ['t', t]))) {
        console.log('handleHashTagEvent: ', { tags: Config.NOSTR_TAGS.map((t: string) => ['t', t]) });
        console.log({tags})
        console.log(`handleHashTagEvent: connectedRelays: ${ndk.pool.connectedRelays().map(({url}) => url).join(',')}`)
        // if event contains referenced event tag, it serves at question hint
        // thus gotta fetch the referenced event
        if (!!referencedEventId) {
            ids.push(referencedEventId);
            debouncedSub();
        } else {
            // TODO: enable labelling
            // addAISimplifiedVersionOfQuestionLabel(nostrEvent);

            // event is a question
            // publish the event to search pseudo relay
            event.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`], ndk))
                .then(() => {
                    console.log(`event published to search relay (direct)!`);
                })
                .catch((e) => {
                    // retry in 5 secs
                    // setTimeout(() => {
                    //     publishToSearchRelay(nostrEvent);
                    // }, 5000);
                });

            event.publish(NDKRelaySet.fromRelayUrls(['wss://q.swarmstr.com/'], ndk))
            // publish(nostrEvent, ['wss://q.swarmstr.com'])
                .then((response) => {
                    console.log(`event published to question relay (direct)!`, {response});
                    console.log(`handleHashtagEvent: event: publish: response: ${JSON.stringify(response)}`)
                });
        }
    } else {
        // TODO: enable labelling
        // addAISimplifiedVersionOfQuestionLabel(nostrEvent);

        // event doesn't contain the asknostr tag
        // but it was hinted by a quote event
        // publish the event to search pseudo relay

        // TODO: label as hinted
        event.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`], ndk))
            .then(() => {
                console.log(`event published to search relay (hinted)!`);
            })
            .catch((e) => {
            // retry in 5 secs
            //     setTimeout(() => {
            //         publishToSearchRelay(nostrEvent);
            //     }, 5000);
            });
        event.publish(NDKRelaySet.fromRelayUrls(['wss://q.swarmstr.com/'], ndk))
            .then((response) => {
                console.log(`event published to question relay (hinted)!`, {response});
            });
    }
};

const handleMetadataEvent = (event: NDKEvent) => {

};

const subscribe = (
    filter: NDKFilter,
    opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
    onEvent?: (event: NDKEvent) => void,
    onEose?: () => void
) => {
    const sub = ndk
        .subscribe(filter, opts, NDKRelaySet.fromRelayUrls(Config.SERVER_RELAYS, ndk));

    console.log(`new sub created...`);

    sub
        .on('event',  async (e: NDKEvent) => {
            console.log('server.tsx: subscribe: ', JSON.stringify(e.rawEvent()))
            onEvent ? onEvent(e) : handleHashTagEvent(e);
            // handleMetadataEvent(event);
            // onEvent &&
        })
        .on('eose', () =>  {
            console.log(`server client: eose received`);
            onEose && onEose();
        })
        .on('close', () => {
            console.log(`the sub was closed...`);
        });
};

// connect to relays
ndk.connect(2100)
    .then(() => {
        console.log(`server.tsx: Connected to relays`);

    });

// connect to search relay
// ndkSearchnos.connect(2100)
//     .then(() => {
//         console.log(`Connected to search relay`);
//     });

setInterval(() => {
    console.log(`relays: ${ndk.pool.stats().connected}/${ndk.pool.stats().total}`);
}, 30000);

ndk.pool.on('notice', (notice) => {
    console.log(`got a notice`);
});

ndk.pool.on('flapping', (flapping) => {
    console.log(`some relays flapping`);
});

(async () => {
    //initially subscribe to hashtag events
    subscribe({
        kinds: [1, 30023],
        '#t': Config.NOSTR_TAGS,
        since: EVENTS_SINCE,
    }, { closeOnEose: false, groupable: false });

    // const searchRelay = await Relay.connect(Config.SEARCH_RELAY_PUBLISH)
    // console.log('server.tsx: connected to search relay')

    subscribe({
        kinds: [0],
        limit: 500
        // authors: ["8387b34f1af0e114062552303c3f7bcab7c0acbc35232253e22706b0ae2b234f", "f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8"],
        // ids: ["57f2c044dd4446a42127b4e7e9e6c13889d1d260a058b2cd02ce14a8957fbe3d", "4f3a20184073b2a461e32c8038bffef67d1c208f94f138a9f1db4779b2f8fc53"]
    }, { closeOnEose: true, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY }, async (_event: NDKEvent) => {
        // const ev = _event;
        const validate = _event.validate();
        // const verifySignature = _event.verifySignature(true);
        // console.log('server.tsx: kind 0 event validate', {validate, verifySignature})
        // console.log('server.tsx: event', JSON.stringify(_event.rawEvent()), JSON.stringify(ev.rawEvent()))

        // _event.toNostrEvent(_event.pubkey)
        //     .then((event: NostrEvent) => console.log('server.tsx: toNostrEvent: ', JSON.stringify(event)))

        // const e = new NDKEvent(ndk, _event.rawEvent());

        // @ts-ignore
        // delete _event.isReplaceable;
        // _event.isReplaceable = () => false;
        // console.log('server.tsx: event is ephemeral', _event.isReplaceable())

        // websocket.send('["EVENT",' + JSON.stringify(_event.rawEvent()) + ']');
        console.log(`server.tsx: metadataEvent: connectedRelays: ${ndk.pool.connectedRelays().map(({url}) => url).join(',')}`)

        //@ts-ignore
        _event.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`], ndk))
            .then((relays: any) => {
                console.log('server.tsx: search: ', {ev: _event.rawEvent(), sig: _event.sig, sig2: _event.rawEvent().sig})
                console.log(`event published to search relay (direct)!`, { relays: JSON.stringify(relays) });
            })
            .catch((e: any) => {
                console.error('server.tsx: error: ', {e})
                // retry in 5 secs
                // setTimeout(() => {
                //     publishToSearchRelay(ev);
                // }, 5000);
            });
    });
})();



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

const findFirstUpperCaseIndex = (str: string): number => {
    for (let i = 0; i < str.length; i++) {
        if (!new RegExp(/[a-zA-Z0-9]/).test(str[i])) continue;
        if (str[i] === str[i].toUpperCase()) {
            return i; // Return the index of the first uppercase letter
        }
    }
    return -1; // Return -1 if no uppercase letter is found
};

const createNewLabel = async (id: string, label: string, relayUrls?: string[]) => {
    const event = new NDKEvent(ndk);
    event.kind = 1985;
    event.tags = [
        ['L', '#e'],
        ['l', label, '#e'],
        ['e', id!]
    ];
    event.content = '';

    // get private key from dotenv file
    let privateKey = process.env.SWARMSTR_BOT_PRIVATE_KEY;
    // if it's an nsec, convert to hex
    if (privateKey!.indexOf('nsec') > -1) {
        // @ts-ignore
        privateKey = nip19.decode(privateKey!).data;
    }
    const signer = new NDKPrivateKeySigner(privateKey!);
    const user = await signer.user();
    event.pubkey = user?.pubkey;

    await event.sign(signer);
    console.log('new event', {event})
    event.publish(NDKRelaySet.fromRelayUrls(relayUrls || [], ndk));
};

const addAISimplifiedVersionOfQuestionLabel = async (nostrEvent: NostrEvent) => {
    const {content, id} = nostrEvent;
    // do not summarize the question if it's length is 250 chars or less
    if (content.length <= 250 || !process.env.SWARMSTR_BOT_PRIVATE_KEY) return;
    try {
        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `turn this text into a simple question: ${content}`
                }
            ],
            temperature: 0.4,
            // max_tokens: 50,
        });

        let botReply = result.data.choices[0].message.content.trim();
        const index = findFirstUpperCaseIndex(botReply);
        if (index !== -1) {
            botReply = botReply.slice(index);
        }
        console.log({botReply}, {message: nostrEvent.content});

        // create new nostr kind 1985 event
        if (id) await createNewLabel(id, 'question/summary', Config.SERVER_RELAYS);
        // res.send({ reply: botReply });
    } catch (error) {
        console.error('botReply error', error);
        // res.status(500).send({ error: 'An error occurred' });
    }
};

const dotProduct = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
};

const getAIQuestionsSuggestions = (search: string, tags?: string[], since?: number): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        // TODO: find labels which point to notes previously considered accurate by ai
        // TODO: get the latest note and use it's timestamp to construct after filter
        const filter = {
            search,
            kinds: [1, 30023],
            limit: 10000,
            ...(tags && tags.length > 0 && { '#t': tags }),
            ...(since && since > 0 && { since })
        };
        console.log('getAIQuestionsSuggestions: ', {tags}, {filter})
        const events: NDKEvent[] = [];
        // websocket.send('nostr: searching for notes...');
        const sub = ndk
            .subscribe(filter, { closeOnEose: true }, NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY}/`], ndk));

        sub
            .on('event', async (event: NDKEvent) => {
                events.push(event);
                if (events.length % (Math.floor(Math.random()*10) + 1) === 0) {
                    // websocket.send(`nostr: ${events.length} notes related to search found...`)
                }
            })
            .on('eose', async () => {
                if (events.length === 1) return resolve([events[0].id]);
                // websocket.send('nostr: all notes received...');
                let content: string = `given array of objects `;
                const questions = events
                    .filter(({ content }) => content.length <= 1000)
                    .map(({ id, content }) => ({ id, content }))
                // .slice(0, 20);
                content += JSON.stringify(questions);
                content += `, find the ones with content most relevant to ${search}`;
                content += '; return ids only';
                // .join(`,`);
                console.log('eventsLength2511',{eventsLength: events.length})

                let msg = 'ai: extracting most relevant notes';
                let dots = '';
                const intervalId = setInterval(() => {
                    if (dots.length === 3) {
                        dots = '';
                    } else {
                        dots += '.';
                    }
                    // websocket.send(`${msg}${dots}`);
                }, 500);
                if (questions.length === 0) resolve([]);
                try {
                    let similarities = [];
                    const result = await hf.featureExtraction({
                        model: 'sentence-transformers/all-MiniLM-L6-v2',
                        inputs: search
                    });

                    // websocket.send(`${msg}${dots}`);
                    const result1 = await hf.featureExtraction({
                        model: 'sentence-transformers/all-MiniLM-L6-v2',
                        inputs: questions.map(({content}) => content)
                    });
                    clearInterval(intervalId);

                    // console.log({result, result1})

                    for (let i = 0; i < result1.length; i++) {
                        //@ts-ignore
                        const similarity = dotProduct(result, result1[i]);
                        console.log(`${similarity} between: ${search} and ${questions[i].content}`)
                        similarities.push({ similarity, content: questions[i].content, id: questions[i].id })
                    }
                    if (similarities.length > 1) {
                        similarities = sortBy(similarities, 'similarity').reverse()
                            .filter(({similarity}) => /\s/g.test(search) ? (similarities.length <= 21 ? similarity >= 0.4 : similarity >= 0.7) : similarity >= 0.2);
                    }
                    console.log({similarities});
                    // return new Promise.resolve(similarities.map(({content}) => content))

                    // TODO: create labels
                    try {
                        const ids = similarities.map(({id}) => id);
                        ids.forEach((id: string) => {
                            createNewLabel(id, `search/${encodeURIComponent(search)}`, Config.SERVER_RELAYS)
                        });
                    } catch (error) {
                        console.log('unable to parse response')
                    }
                    // websocket.send('done')

                    resolve(similarities.map(({id}) => id))
                    // console.log({result, result1})
                } catch (e) {
                    clearInterval(intervalId);
                    // websocket.send('ai: failed')
                    if (questions.length <= 100) {
                        resolve(questions.map(({ id }) => id));
                    }
                    console.error({e})
                }
            });
        // resolve([]);
    })
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
            {[`#${tag! || 'e'}`]: [value!], kinds: [+kind || 1] } as NDKFilter,
            { closeOnEose: true, groupable: true, groupableDelay: 1000 },
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

// const textFromImage = async () => {
//     // const imageUrl = 'https://image.nostr.build/020e88bd1e096f93dbfd391e15ca597643185153ed653fe7ea99c7b2f0b2c51f.jpg';
//     // const imageUrl = 'https://m.media-amazon.com/images/M/MV5BYjA2MDM2YjctYzNhNC00NGEzLWFmYWEtODExODFkNmUyOGE2XkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_.jpg';
//     // const imageUrl = 'https://image.nostr.build/937a78a42a29f32f547183b3add5363654a82aaae61afd8c27c36c1fdb59857c.jpg';
//     // const imageUrl = 'https://image.nostr.build/f2dbe4c617c090c4c03e5b738cd24f61ba2def8fe8b0b4102dd7ed9c068aac3f.jpg';
//     // const imageUrl = 'https://cdn.nostr.build/i/b5c598b4d6a57d99b937263e9338fdc21bf294d27adbbebdd0dd949bdcd31f3d.jpg';
//     // const imageUrl = 'https://www.rd.com/wp-content/uploads/2020/04/DogMeme16.jpg';
//     // const imageUrl = 'https://image.nostr.build/59e8da1b71194bb1d41a2ee7f3de6b6472745c3efeaead290a2b798e85117b9a.jpg';
//     // const imageUrl = 'https://image.nostr.build/eb4e686e74a9d9a6f2ac8fbff88602d695de97ad01caa432c01b62e8ef19db0d.jpg';
//     // const imageUrl = 'https://image.nostr.build/1b5fae747b17ceeaa7c43684404e30a973b717309cd8954bf927e425565f45db.jpg'
//     // const imageUrl = 'https://image.nostr.build/596a9153e3e977c3bf34ac2b8a3a6594b8dbd700314a99061e43eefac560a880.jpg';
//     // const imageUrl = 'https://image.nostr.build/bc9ab09b1287afcb20854250ef26d00f7d98970587827016f717ee8315341bd6.jpg';
//     // const imageUrl = 'https://image.nostr.build/9ba896c4f595763c802214a384ab5866f56dce418b6c6bd2d05d704dd7d20514.jpg';
//     const imageUrl = 'https://static.wikia.nocookie.net/onepiece/images/e/e1/Kinoko_Island_Infobox.png/revision/latest?cb=20191102104753&path-prefix=pl'
//     const response = await request({ url: imageUrl, responseType: 'blob' });
//
//
//     const image: any = fs.readFileSync(
//         path.join(__dirname, '../public/images/420-gang-team-logo.png'),
//         'utf-8'
//     );
//     console.log({response})
//     const buffer: any = Buffer.from(response.data);
//     const imageBlob = new Uint8Array(buffer).buffer
//     console.log({imageBlob});
//
//     // const result = await hf.featureExtraction({
//     //     model: 'deepset/roberta-base-squad2',
//     //     inputs: 'what is the meaning of life?'
//     // });
//
//     // console.log('roberta', {result})
//
//
//     const result = await hf.imageToText({
//         // model: 'nlpconnect/vit-gpt2-image-captioning',
//         model: 'Salesforce/blip-image-captioning-base',
//         data: await (await fetch(imageUrl)).blob()
//     });
//
//     console.log('textFromImage', {result})
// };
//
// server.get('/text-from-image', async (req, res) => {
//    await textFromImage();
//    res.sendStatus(204);
// });

server.get('/search-suggestions/:search', async (req, res) => {
    let { search } = req.params;
    search = search.toLowerCase().replace(/([.?\-,_=])/gm, '');

    const response = await pool.query('SELECT * FROM searches');
    if (response.rows.length > 0) {
        const searches = response.rows.filter(({query}: any) => query !== search);
        const searchRecord = response.rows.find(({query}: any) => query === search);
        if (searchRecord) {
            const { query, hits } = searchRecord;
            await pool.query('UPDATE searches SET hits = $1 WHERE query = $2', [hits+1, query]);
        } else {
            await pool.query('INSERT INTO searches (query, hits) VALUES ($1, $2)', [search, 1]);
        }
        try {
            let similarities = [];
            const result = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: search
            });

            const result1 = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: searches.map(({query}: any) => query.replace(`#${Config.HASHTAG}`, ''))
            });

            // console.log({result, result1})

            for (let i = 0; i < result1.length; i++) {
                //@ts-ignore
                const similarity = dotProduct(result, result1[i]);
                console.log(`${similarity} between: ${search} and ${searches[i].query}`)
                similarities.push({ similarity, query: searches[i].query, hits: searches[i].hits })
            }

            similarities = sortBy(similarities, 'similarity').reverse()
                .filter(({similarity}) => similarity >= 0.7);
            console.log(`### similar searches for ${search}`,{similarities});
            res.json(similarities)

            try {
                // const ids = similarities.map(({id}) => id);
                // similarities.map((s: any) => ).forEach((id: string) => {
                //     createNewLabel(id, `search/${encodeURIComponent(search)}`)
                // });
                // const questions = events
                //     .filter(({id}) => ids.includes(id))
                //     .map(({content}) => content);
                // console.log({questions})
            } catch (error) {
                console.log('unable to parse response')
            }

            // console.log({result, result1})
        } catch (e) {
            console.error({e})
        }
    } else {
        await pool.query('INSERT INTO searches (query, hits) VALUES ($1, $2)', [search, 1]);
        res.sendStatus(204);
    }
});

server.get('/search-api/:search', async (req, res) => {
    let { search } = req.params;
    const {tags, since} = req.query;
    console.log('server.tsx: ', {tags})
    search = search.toLowerCase().replace(/([.?\-,_=:!])/gm, ' ').trim();
    console.log({search});

    if (search) {
        const results = await getAIQuestionsSuggestions(search, (tags as string).split(','), +(since || 0));
        res.json(results);
    } else {
        res.sendStatus(204);
    }
});

server.get('/popular-searches', async (req, res) => {
    const response = await pool.query('SELECT * FROM searches ORDER BY hits DESC LIMIT 10');
    const searches = response.rows;
    res.json(searches);
});

server.get('/api/images/:search/:page', async (req, res) => {
    let {search, page} = req.params;
    try {
        const images = await searchImageDatabase(search, +page);
        res.json(images);
    } catch (e) {
        res.sendStatus(404);
    }
});

server.get('/*', async (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    const pathArr = path.split('/');
    const nevent = pathArr && pathArr[pathArr.length - 1];
    try {
        const eventPointer = nip19.decode(nevent);
        // @ts-ignore
        const { id } = eventPointer?.data;
        if (id) {
            // @ts-ignore
            const event = await redisClient.get(id);
            console.log({id, event})
            if (event) {
                try {
                    const { content } = JSON.parse(event);
                    let length = content;
                    let title = content.replace(/#\[([0-9]+)\]/g, '').slice(0, content.indexOf('?') > -1 ? content.indexOf('?') + 1 : content.length);
                    if (title.length > 150) title = `${title.slice(0, 150)}...`;
                    console.log('question title', { title } )
                    helmet = {
                        ...helmet,
                        title: {
                            ...helmet.title,
                            toString(): string {
                                return `<title>${title} - Swarmstr.com</title>`;
                            }
                        },
                        meta: {
                            ...helmet.meta,
                            toString(): string {
                                return `<meta property="og:title" content="${title} - Swarmstr.com" />` +
                                    `<meta itemProp="name" content="${title} - Swarmstr.com" />` +
                                    `<meta name="twitter:title" content="${title} - Swarmstr.com" />` +
                                    `<meta property="description" content="${content.slice(0, 500)}" />` +
                                    `<meta property="og:description" content="${content.slice(0, 500)}" />` +
                                    `<meta name="twitter:description" content="${content.slice(0, 500)}" />` +
                                    `<meta property="og:url" content="${process.env.BASE_URL}/e/${nevent}" />` +
                                    `<meta property="og:image" content="${Config.APP_IMAGE}" />` +
                                    `<meta itemProp="image" content="${Config.APP_IMAGE}" />` +
                                    `<meta name="twitter:image" content="${Config.APP_IMAGE}" />`;
                            }
                        }
                    };
                } catch (e) {

                }
            } else {
                subscribe({ ids: [id] }, { closeOnEose: true, groupable: false })
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

