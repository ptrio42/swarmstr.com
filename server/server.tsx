import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'
import App from "../src/App";
import {StaticRouter} from "react-router-dom/server";
import {Helmet, HelmetData} from "react-helmet";
import {nip19} from 'nostr-tools';
import {Config, SERVER_RELAYS} from "../src/resources/Config";
import NDK, {
    NDKEvent,
    NDKFilter, NDKRelay, NDKRelaySet, NDKSubscription,
    NDKSubscriptionCacheUsage,
    NDKSubscriptionOptions, NDKTag,
    NostrEvent, NDKPrivateKeySigner, serialize
} from '@nostr-dev-kit/ndk';
import getEventHash from '@nostr-dev-kit/ndk';
import NDKCacheAdapter from '@nostr-dev-kit/ndk'
// import RedisAdapter from "@nostr-dev-kit/ndk-cache-redis";
import {uniqBy, groupBy, forOwn, debounce, sortBy, isArray} from 'lodash';
import {containsAnyTag, containsTag, valueFromTag} from "../src/utils/utils";
import { HfInference } from "@huggingface/inference";
import {request} from "../src/services/request";
import {Buffer} from "buffer";
import NDKRedisCacheAdapter from "@nostr-dev-kit/ndk-cache-redis";


const { Configuration, OpenAIApi } = require("openai");
const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfig);
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

(global as any).WebSocket = require('ws');
import {searchImageDatabase} from "../src/services/pixabay";
import {createInvoice} from "./paymentProcessors/ZebedeePaymentProcessor";
// import {forOwn} from 'lodash';


// import WebSocket, { WebSocketServer } from 'ws';
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

    await pool.query('CREATE TABLE IF NOT EXISTS addresses (name VARCHAR(255) NOT NULL, pubkey VARCHAR(255) NOT NULL)');

    await pool.query('ALTER TABLE addresses ADD COLUMN IF NOT EXISTS domain VARCHAR(255)');

    await pool.query('ALTER TABLE addresses ADD COLUMN IF NOT EXISTS price INT DEFAULT 0');

    await pool.query('ALTER TABLE addresses ADD COLUMN IF NOT EXISTS price_paid INT DEFAULT 0');

    // await pool.query('DROP TABLE invoices');

    try {
        await pool.query('CREATE TABLE IF NOT EXISTS invoices (id VARCHAR(255) PRIMARY KEY, pubkey VARCHAR(255) NOT NULL, domain VARCHAR(255) NOT NULL, nip05 VARCHAR(255) NOT NULL, status VARCHAR(100) NOT NULL, bolt11 TEXT NOT NULL, expires_at BIGINT NOT NULL, confirmed_at BIGINT NOT NULL, amount INT NOT NULL)');
    } catch (e) {
        console.error('psql error: ', JSON.stringify(e))
    }

    await pool.query('ALTER TABLE addresses DROP CONSTRAINT addresses_pkey');
    await pool.query('ALTER TABLE addresses DROP CONSTRAINT uq_addresses');

    await pool.query('ALTER TABLE addresses ADD CONSTRAINT uq_addresses UNIQUE(name, domain, price_paid)');

    await pool.query('ALTER TABLE invoices ADD COLUMN IF NOT EXISTS domain VARCHAR(255)');

    // await pool.query('ALTER TABLE invoices ADD COLUMN IF NOT EXISTS id VARCHAR(255)');

    const response = await pool.query('SELECT * FROM addresses');
    console.log('server.tsx: all addresses: ', JSON.stringify(response.rows));

    // const resp = await pool.query('SELECT * FROM information_schema.table_constraints');
    // console.log('server.tsx: constraintss: ', JSON.stringify(resp.rows))
    // await pool.query('CREATE TABLE IF NOT EXISTS ' +
    //     'caches ()')
})();

// console.log('nostrich.love hello!');
//
// // @ts-ignore
// const names = {"00000":"000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6","_":"f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8","Sperry":"11d0b66747887ba9a6d34b23eb31287374b45b1a1b161eac54cb183c53e00ef7","reallhex":"29630aed66aeec73b6519a11547f40ca15c3f6aa79907e640f1efcf5a2ee9dc8","poor-satoshi":"a78f617aaa9851fd27b9fb33f6fa874110bf23bc23de62aeeb50bf04e50a954d","captjack":"5e5fc1434c928bcdcba6f801859d5238341093291980fd36e33b7416393d5a2c","jared":"92e3aac668edb25319edd1d87cadef0b189557fdd13b123d82a19d67fd211909","paul":"52b9e1aca3df269710568d1caa051abf40fbdf8c2489afb8d2b7cdb1d1d0ce6f","MonKota":"f67de9f8b9181bbefc71266f8dd87de3c9a882d05dc96974640e1297d37b52e9","crabalcrypto":"c95c4591bb8709d9461b9a2b6cbe86cc4018a65e02e923887a6f2b7919ef9af1","spacemonkey":"23b26fea28700cd1e2e3a8acca5c445c37ab89acaad549a36d50e9c0eb0f5806","Bachman":"a9880ed6c01a6d409902a3886dd4a3372f934d26ca842bd75e78c67a5dacbd96","DecentWisdom":"cbbc79530ca7d31cc2252ca1d2130670510fad313aff5d4ea56c340b2dcfba11","npub1d0enakal":"6bf33edbbfe348c1f04d9b708fd51fb6004485812adab49f1d70ad0b66d7c715","FloridaBitcoin":"e779a58151fb1d2655d3fadbf695a97e4d6664158b72b7a54c6ec1b75a07510e","lukeonchain":"89d1ce9164f1f172daaa9c784153178cb1dec7912bf55f5dc07e0f1dabe40e6c","zeppelin2125":"1043f9dfaac80de0c8e39147d9cdc50375864d95124da0fa11f645f940f756b4","adam_sandals":"4d6355f38e13d9c937252500308de30b11dcda2f2a809ac6c7bb45ddaff6aa87","goldfumed":"3718ee454bf3d3abb6b121ca2a2d0efbb0cf4e86d4312793a9bf2255b250ea27","iefan":"c6f7077f1699d50cf92a9652bfebffac05fc6842b9ee391089d959b8ad5d48fd","behere":"cd704bdf5f926232abd61cb44ad009df0e6373b532d295eab77fe7c59c9989a2","Noerms":"746a245ad214e69529e544ef8a42766c55fb60b79cf00ad0640905037a8d8b34","DylanJames":"7c3737bac46584101cf0c59ef9ec18936b0adc611d94c2f43d3afa4c485cc1ad","stefcioikokos":"00000040e0fd1e71c0a7ba6877e0a47ce42769e3082e42a7ab8d7595aaaea6a5","Daniel":"9ef7029c02ceb2e248faa21ddf4ae5f3df5ca8105888b29ffa63dc3692377398","onwardjourney":"12045a7a79da78b87db7f5a58362a01e5180069b665b782564fad421dd7f09be","paulo":"a8171781fd9e90ede3ea44ddca5d3abf828fe8eedeb0f3abb0dd3e563562e1fc","ec":"84451d46ddd687a9c6e736c54d6e508fe90861d08dbc31bd53ba19349330124b","yutaro":"75f457569d7027f819de92e8bb13795c0febe9750dc3fb1b5c42aeb502d0841d","jimcramer":"de0e4a6d4c35276bfc32a12aee0acd5ac83b0de8657e1649f735b62ebef1e68f","AshToHashes 24.0.1 🪢⛏⚡️#FreeRoss":"4eea97cd68c1d89a92ca6a54c143602243517d504bc15b092e7ee88e02d14127","peterzander@nostrich.love":"ce2fb8588e047b61e738bee312bf63e03f9c1fd849ab67ab4c5f9b39643d5ffd","AshToHashes":"4eea97cd68c1d89a92ca6a54c143602243517d504bc15b092e7ee88e02d14127","hermit":"72fb03e7922b7040a73f44522732d18e3ad25de1a1661be1965ecf5d01ae719d","nostr":"000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6","peterzander":"ce2fb8588e047b61e738bee312bf63e03f9c1fd849ab67ab4c5f9b39643d5ffd","hp":"7881b7e17529283107551a5b21b5d4c38349c0fb62836b23032699081f2b9db1","TiagoCorreia":"37932ad6e2bc9b872a4e093fff85a8cdca40017e4a234e613d23a6ed1d785b3c","mykopikid":"1bb2128b8dce5a837294628f0a2d4b6478d8c33a7e86c68e6686e4cc746f21ab","The_Bit_Baby":"ddc0adf807b1c989554912e31279f1f4ad186e8a6ddb2ff2ea57d78881812ebc","SatsGrid":"10836982d6f0c4f9e580cf392ecf89bd7cb90141d06537ce4cf49efc629c2b9e","ReformedSaint":"adc14fa3ad590856dd8b80815d367f7c1e6735ad00fd98a86d002fbe9fb535e1","Dsbatten":"8fec426247845bdd26f36ae4f737508c15dbec07d43ce18f8c136ab9e35ac212","Susie":"bb90e7f0531d4abaa39ff85091577434fb6fd3aff9cfb8da275199e241eb4eff","alpha":"3334b41af198438031e6aa5f5b812c4bf028fe161204d8a58b4e55d9e2330ee6","Coco_Ardo":"c48a6fb09a03558b1ecf501de2ce09ac935bc3fc2d73ef5b59637e75bcddf255","togo":"f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8","Dirt":"e660e4db22273250bbf0428b3b0b3c3cb2d3fba9ec2b2c0e3f1ac8af256d3fea","dirt":"e660e4db22273250bbf0428b3b0b3c3cb2d3fba9ec2b2c0e3f1ac8af256d3fea","Aury":"f4bff909cac26110bdd9abc87d90fa10ba57f1654e92fb68857c86a894d0d2ff","Diehardman":"a9c46f3cd91d863ff4188317b40728dad9e44a64471f3ab383c984ce96de7b93","crayZfishy":"ddc2f07890f8fda6ab47046b1127482b572da96377de3d525d568b73a67be3cc","Colossiansbtc":"e22c95d5a45323bb306afdf22e98ab8d3f718a7d7c529eeb7801c4c51e6526d2","coisasleveszona":"e58c371c74432991136ce4cc4f3c23c03dcf3b2dcc89be88d680946a2bde4ba6","Marco":"2473af513d649f4f59d5c5e06c24f5dfe844836e16680ecc2e811eba657b4f13","Harambe":"11d0b66747887ba9a6d34b23eb31287374b45b1a1b161eac54cb183c53e00ef7","ugali":"51cec5ed6c4a7bea98c16ad92306e6bb77e82190e763282481d5d5e1f37d549e","ElenaB":"a160714f8fc7a6cc872aff23214d30eab49644cd7a77e11149d981f2e294a375","marcelo":"7f8c4e081af5d2701ba970e9008e189714f088dbe5d08d7ed6735ddd4418c9cc"};
//
// console.log('nostrich.love names', {names});
// forOwn(names,(pubkey: string, name: string) => {
//     console.log('nostrich.love name: ', name);
//     pool.query('INSERT INTO addresses (name, pubkey, domain, price, price_paid) VALUES ($1, $2, $3, $4, $5)', [
//         name, pubkey, 'nostrich.love', 420, 420
//     ]);
// });

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

// const cacheAdapter = new RedisAdapter();
const cacheAdapter = new NDKRedisCacheAdapter();

// ndk instance used to subscribe to events with a given HASHTAG
// @ts-ignore
const ndk = new NDK({ explicitRelayUrls: [...SERVER_RELAYS, Config.SEARCH_RELAY_PUBLISH, Config.SEARCH_RELAY] }, cacheAdapter);

// ndk instance used to publish events to search relay
// const ndkSearchnos = new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY_PUBLISH+'/'] });

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

const publishToSearchRelay = async (event: NDKEvent, eventId?: string) => {
    // event.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`.toLowerCase()], ndk))
    const { tags } = {...event.rawEvent()};

    const newEvent = new NDKEvent(ndk);
    newEvent.pubkey = event.pubkey;
    newEvent.content = event.content;
    newEvent.tags = tags;
    newEvent.created_at = event.created_at;
    newEvent.kind = event.kind;
    newEvent.id = eventId || event.id;
    newEvent.sig = event.sig;
    // if (eventId && eventId !== event.id) {
    //     newEvent.id = eventId;
    // }
    const serializeResult = newEvent.getEventHash();
    // const serializedWithSig = getEventHash(serialize.apply(newEvent, [true]));
    // newEvent.kind = event.kind;
    const nosterEvent = await newEvent.toNostrEvent();
    console.log('publishToSearchRelay12: event: ', JSON.stringify(nosterEvent) + ';', {eventId}, {}, {serializeResult, 'serializedWithSig': ''} );
    newEvent.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`], ndk))
        .then(() => {
            console.log(`server.tsx: event published to search relay (direct)!`);
        })
        .catch(async (e) => {
            const nostrEvent = await newEvent.toNostrEvent();

            console.error(`server.tsx unable to publish event12 ${eventId}: ${JSON.stringify(e)}; ${JSON.stringify(nostrEvent)}`);

            // retry in 0.5 secs
            throw e;
        });
};

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
            let delay = 500;
            try {
                console.log('nostr event ', event.id, nostrEvent.id)
                publishToSearchRelay(event, nostrEvent.id);
            } catch (e) {
                // if (delay < 1000) {
                //     delay += 100;
                //     setTimeout(() => {
                //         publishToSearchRelay(event);
                //     }, delay)
                // }
            }

            event.publish(NDKRelaySet.fromRelayUrls(['wss://q.swarmstr.com'], ndk))
            // publish(nostrEvent, ['wss://q.swarmstr.com'])
                .then((response) => {
                    console.log(`handleHashtagEvent: event published to q.swarmstr.com!`, {response});
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
    }, { closeOnEose: false, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST });

    // const searchRelay = await Relay.connect(Config.SEARCH_RELAY_PUBLISH)
    // console.log('server.tsx: connected to search relay')

    // subscribe({
    //     kinds: [0],
    //     limit: 1
    //     // authors: ["8387b34f1af0e114062552303c3f7bcab7c0acbc35232253e22706b0ae2b234f", "f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8"],
    //     // ids: ["57f2c044dd4446a42127b4e7e9e6c13889d1d260a058b2cd02ce14a8957fbe3d", "4f3a20184073b2a461e32c8038bffef67d1c208f94f138a9f1db4779b2f8fc53"]
    // }, { closeOnEose: true, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY }, async (_event: NDKEvent) => {
    //     // const ev = _event;
    //     const validate = _event.validate();
    //     // const verifySignature = _event.verifySignature(true);
    //     // console.log('server.tsx: kind 0 event validate', {validate, verifySignature})
    //     // console.log('server.tsx: event', JSON.stringify(_event.rawEvent()), JSON.stringify(ev.rawEvent()))
    //
    //     // _event.toNostrEvent(_event.pubkey)
    //     //     .then((event: NostrEvent) => console.log('server.tsx: toNostrEvent: ', JSON.stringify(event)))
    //
    //     // const e = new NDKEvent(ndk, _event.rawEvent());
    //
    //     // @ts-ignore
    //     // delete _event.isReplaceable;
    //     // _event.isReplaceable = () => false;
    //     // console.log('server.tsx: event is ephemeral', _event.isReplaceable())
    //
    //     // websocket.send('["EVENT",' + JSON.stringify(_event.rawEvent()) + ']');
    //     console.log(`server.tsx: metadataEvent: connectedRelays: ${ndk.pool.connectedRelays().map(({url}) => url).join(',')}`)
    //
    //     //@ts-ignore
    //     _event.publish(NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY_PUBLISH}/`], ndk))
    //         .then((relays: any) => {
    //             console.log('server.tsx: search: ', {ev: _event.rawEvent(), sig: _event.sig, sig2: _event.rawEvent().sig})
    //             console.log(`event published to search relay (direct)!`, { relays: JSON.stringify(relays) });
    //         })
    //         .catch((e: any) => {
    //             console.error('server.tsx: error: ', {e})
    //             // retry in 5 secs
    //             // setTimeout(() => {
    //             //     publishToSearchRelay(ev);
    //             // }, 5000);
    //         });
    // });
})();



const isNameAvailable = async (name: string, domain?: string): Promise<boolean> => {
    if (!(new RegExp(/([a-z0-9_.]+)/, 'gi').test(name)) || name.length < 1) return false;
    try {
        let response;
        if (!domain || domain === Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS[0].name) response = await pool.query('SELECT * FROM addresses WHERE (name = $1 AND domain = $2 AND price = price_paid) OR (name = $1 AND domain IS NULL  AND price = price_paid)', [name, Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS[0].name])
        else response = await pool.query('SELECT * FROM addresses WHERE name = $1 AND domain = $2 AND price = price_paid', [name, domain]);
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
            ...(tags && tags.length > 0 && tags[0] !== '' && { '#t': tags }),
            ...(since && since > 0 && { since })
        };
        console.log('getAIQuestionsSuggestions: ', {tags}, {filter})
        const events: NDKEvent[] = [];
        // websocket.send('nostr: searching for notes...');
        const sub = ndk
            .subscribe(filter, { closeOnEose: true }, NDKRelaySet.fromRelayUrls([`${Config.SEARCH_RELAY}/`], ndk));

        sub
            .on('event', async (event: NDKEvent) => {
                const npubs = event.content.match(/nostr:npub1([a-z0-9]+)/gmi);
                console.log('server: npubs: ', {npubs})

                // if (npubs.length > 0) {
                //     ndk
                //         .subscribe({
                //             kinds: [0],
                //             authors: npubs.map((npub: string) => nip19.decode(npub).data)
                //         }, { closeOnEose: true })
                //         .on('event', async (event: NDKEvent) => {
                //
                //         })
                //         .on('eose', () => {
                //
                //         })
                // }

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
    const { host } = req.headers;
    // const { domain } = req.query;

    console.log('client host: ', {host})
    try {
        let response;
        if (host === Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS[0].name) response = await pool.query('SELECT * FROM addresses WHERE (domain = $1 OR domain IS NULL) AND price = price_paid', [host]);
        else response = await pool.query('SELECT * FROM addresses WHERE domain = $1 AND price = price_paid', [host]);
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
    const { domain } = req.query;
    const nameAvailable = await isNameAvailable(name, domain as string);
    res.json({ nameAvailable });
});

server.post('/api/register-name', async (req, res) => {
    console.log({body: req.body});
    let { name, pubkey } = req.body;
    const { domain } = req.query;
    try {
        name = name.toLowerCase();
        pubkey = new RegExp(/(npub)/).test(pubkey) ? nip19.decode(pubkey).data as string : pubkey;
        const nameAvailable = await isNameAvailable(name, domain as string);
        const pubkeyValid = await isPubkeyValid(pubkey);
        if (!nameAvailable || !pubkeyValid) {
            res.sendStatus(400);
            return;
        }

        const { price } = Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS.find((d: any) => d.name === domain) || { price: 0 }

        try {
            const response = await pool.query('INSERT INTO addresses (name, pubkey, domain, price, price_paid) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, pubkey, domain as string, price, 0]);
            if (response.rows[0]) {
                if (price > 0) {
                    const invoice = await createInvoice(
                        pool,
                        price * 1000,
                        pubkey,
                        `${name}@${domain as string}`,
                        domain as string,
                        `${name}@${domain} NIP-05 handle fee.`,
                        'A'
                    );
                    console.log('createInvoice response: ', {invoice})
                    res.json({
                        invoice: invoice.bolt11,
                        expiresAt: invoice.expiresAt,
                        status: invoice.status
                    });
                    return;
                }
                res.sendStatus(204);
                return;
            }
            res.sendStatus(400);
            return;
        } catch (error) {
            console.error('server.tsx: error: insert into', JSON.stringify(error))
        }
    } catch (error) {

    }
    res.sendStatus(400);
    console.log({name, pubkey});
});

server.get('/api/invoice-status/:name', async (req, res) => {
    const { name } = req.params;
    const { domain } = req.query;

    const result = await pool.query('SELECT status FROM invoices WHERE nip05 = $1', [`${name.toLowerCase()}@${domain as string}`]);
    res.json(result.rows[0]);
});

server.post('/api/update-invoice', async (req, res) => {
    const { domain } = req.query;
    const { id, amount, expiresAt, status, confirmedAt } = req.body;

    try {
        const result = await pool.query('UPDATE invoices SET status = $1, confirmed_at = $2 WHERE id = $3 AND amount = $4 AND status = $5 AND expires_at = $6 AND domain = $7 RETURNING *', [status, Date.parse(confirmedAt), id, +amount / 1000, 'pending', Date.parse(expiresAt), domain as string]);
        console.log({result})
        if (result.rows[0]) {
            const { nip05 } = result.rows[0];
            const [name, domain] = nip05.split('@');
            await pool.query('UPDATE addresses SET price_paid = $1 WHERE name = $2 AND domain = $3', [+amount / 1000, name, domain as string]);
        }
    } catch (e) {
        console.error('update-invoice error: ', e);
    }
    res.sendStatus(204);
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
    // if (eventIds?.length > 0) {
    //     // @ts-ignore
    //     const events = await redisClient.mGet(eventIds);
    //     const parsedEvents = events.map((event: string) => JSON.parse(event))
    //     // console.log('cached eventsList', {parsedEvents})
    //     res.json(parsedEvents);
    // } else {
        // const events: NostrEvent[] = [];
        // otherwise create subscription and cache the events
        const events = await getEvents({[`#${tag! || 'e'}`]: [value!], kinds: [+kind || 1] } as NDKFilter);
        // subscribe(
        //     {[`#${tag! || 'e'}`]: [value!], kinds: [+kind || 1] } as NDKFilter,
        //     { closeOnEose: true, groupable: true, groupableDelay: 1000 },
        //     async (event: NDKEvent) => {
        //         // console.log('got event: ', {event});
        //         events.push(event.rawEvent());
        //     },
        //     () => {
        //         let list: string = '';
        //         if (tag === 'e') list = uniqBy(events, 'id').map(({id}: NostrEvent) => id).join(':');
        //         if (tag === 'd') list = uniqBy(events, 'id')
        //             .map(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 'e').map((tag: NDKTag) => tag[1])).flat(2).join(':');
        //         // console.log('saving list...', { list });
        //         // @ts-ignore
        //         redisClient.set(`${value}:#${tag || 'e'}:${+kind || 1}`, list);
        //     });
        res.json(events);
    // }
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
    const response = await pool.query('SELECT * FROM searches ORDER BY hits DESC LIMIT 21');
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

const getEvents = (filter: NDKFilter) => {
    const events: NDKEvent[] = [];
    console.log('getEvents: filter', {filter});
    return new Promise((resolve => {
        subscribe(
            filter, { closeOnEose: true, groupable: false },
            (event: NDKEvent) => {
                events.push(event);
                console.log('getEvents: new event', {event});
            },
            () => {
                console.log(`getEvents: resolving ${events.length} events`);
                resolve(uniqBy(events, 'id'));
            }
        );
    }))
};

const getMeta = (content: string, helmet: HelmetData, path: string) => {
    // if (event) {
        try {
            // const {content} = event;
            // let length = content;
            let title = content.replace(/#\[([0-9]+)\]/g, '').slice(0, content.indexOf('?') > -1 ? content.indexOf('?') + 1 : content.length);
            if (title.length > 150) title = `${title.slice(0, 150)}...`;
            console.log('question title', {title})
            return {
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
                            `<meta name="twitter:image:src" content="${Config.APP_IMAGE}" />` +
                            `<meta name="twitter:card" content="summary" />` +
                            `<meta name="twitter:site" content="@swarmstr" />` +
                            `<meta name="description" content="${content.slice(0, 500)}" />` +
                            `<meta property="og:description" content="${content.slice(0, 500)}" />` +
                            `<meta name="twitter:description" content="${content.slice(0, 500)}" />` +
                            `<meta property="og:url" content="${process.env.BASE_URL}${path}" />` +
                            `<meta property="og:image" content="${Config.APP_IMAGE}" />` +
                            `<meta itemProp="image" content="${Config.APP_IMAGE}" />`;
                    }
                }
            };
        } catch (e) {
            return helmet;
        }
    // }
};

server.get('/*', async (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    const {host} = req.headers;

    // @ts-ignore
    if (!process.env.BASE_URL.includes(host)) {
        res.redirect(`${process.env.BASE_URL}/nostr-address?domain=${host}`)
    }

    const pathArr = path.split('/');
    const nevent = pathArr && pathArr[pathArr.length - 1];
    try {
        const eventPointer = nip19.decode(nevent);
        // @ts-ignore
        const { id } = eventPointer?.data;

        if (id) {
            // @ts-ignore
            const [event] = await getEvents({ ids: [id] });
            // @ts-ignore
            // const event = await redisClient.get(id);
            console.log('#redis: ', {id, event})
            helmet = getMeta(event?.content, helmet, `/e/${nevent}`);
        } else {
            let content = '';
            let path = '';
            if (pathArr[pathArr.length - 2] === 'recent') {
                content = `Recent from ${pathArr[pathArr.length - 1]}`;
                path = `/recent/${pathArr[pathArr.length - 1]}`;
            } else {
                content = 'Your knowledge hub for all kinds of minds';
                path = '/';
            }
            helmet = getMeta(content, helmet, path);
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

