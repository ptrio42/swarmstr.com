import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'
import App from "../src/App";
import {StaticRouter} from "react-router-dom/server";
import {Helmet} from "react-helmet";
import {nip19} from 'nostr-tools';
import {DEFAULT_RELAYS} from "../src/resources/Config";
import NDK, {NDKEvent, NDKRelaySet, NDKSubscriptionCacheUsage, NostrEvent} from '@nostr-dev-kit/ndk';
import RedisAdapter from '@nostr-dev-kit/ndk-cache-redis';
import { uniqBy } from 'lodash';

const baseUrl = process.env.BASE_URL;
const server = express();

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use('/', express.static(path.join(__dirname, 'static')));
server.use(express.static('public'));

const manifest = fs.readFileSync(
    path.join(__dirname, 'static/manifest.json'),
    'utf-8'
);
const assets = JSON.parse(manifest);
const eventsFile = fs.readFileSync(path.join(__dirname, '../public/events.json'), 'utf-8');
const events = JSON.parse(eventsFile);

const redisAdapter = new RedisAdapter({ expirationTime: 60 * 60 * 24 });
// @ts-ignore
const ndk = new NDK({ explicitRelayUrls: DEFAULT_RELAYS, cacheAdapter: redisAdapter });
let serverEvents: any[] = [];

const subscription = ndk.subscribe({
        kinds: [1],
        // ids: NOTES
        '#t': ['ask', 'nostr', 'asknostr']
    }, { closeOnEose: false, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST }, NDKRelaySet.fromRelayUrls(DEFAULT_RELAYS, ndk));

subscription.eventReceived = (e: NDKEvent, r: any) => {
    e.toNostrEvent()
        .then((e1: NostrEvent) => {
            const hashtags = e1.tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
            if ((hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr') && !serverEvents.includes(e1)) {
                serverEvents.push(e1);
            }
        });
};
subscription.eoseReceived = (r: any) => {
    console.log('eose');
};

serverEvents.push(...events);
let iterator = 0;

const connectToRelays = (ndk: NDK) => {
    ndk.connect()
        .then(() => {
            console.log('connected');
            ndk.fetchEvents({
                kinds: [1],
                // ids: NOTES
                '#t': ['ask', 'nostr', 'asknostr']
            }, {skipCache: false})
                .then((set: any) => {
                    serverEvents.push(...Array.from(set)
                        .filter(({tags}: any) => {
                            const hashtags = tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
                            return (hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr');
                        })
                        .filter(({content}: any) => {
                            return !content.includes('https://dev.uselessshit.co/resources/nostr');
                        })
                        .map(({id, content, created_at, kind, tags, sig, pubkey}: any) => ({
                            id, content, created_at, kind, tags, sig, pubkey
                        })));
                });
            subscription.start()
                .then(() => {
                    console.log('sub started')
                });
        })
        .catch((e: any) => {
            console.error({e});
            while (iterator <= 10) {
                console.log(`reconnect attempt #${iterator}`);
                connectToRelays(ndk);
                iterator++;
            }
        })
};
connectToRelays(ndk);

server.get('/api/events', (req, res) => {
    res.json(uniqBy(serverEvents, 'id'));
});

server.get('/*', (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    if (path === '/resources/nostr/') {
        res.writeHead(301, {
            Location: `/resources/nostr`
        }).end();
    }
    const pathArr = path.split('/');
    const noteIdBech32 = pathArr && pathArr[pathArr.length - 1];
    try {
        const noteIdHex = nip19.decode(noteIdBech32);
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