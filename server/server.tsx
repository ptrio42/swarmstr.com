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
import NDK, {NDKEvent, NDKSubscriptionCacheUsage, NostrEvent} from '@nostr-dev-kit/ndk';
import RedisAdapter from '@nostr-dev-kit/ndk-cache-redis';
import {uniqBy} from 'lodash';

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
// const eventsFile = fs.readFileSync(path.join(__dirname, '../public/events.json'), 'utf-8');
// const events = JSON.parse(eventsFile);

const redisAdapter = new RedisAdapter({ expirationTime: 60 * 60 * 24 });
// @ts-ignore
const ndk = new NDK({ explicitRelayUrls: DEFAULT_RELAYS, cacheAdapter: redisAdapter });
const events: NostrEvent[] = [];

const nevents: string[] = [];

const subscription = ndk.subscribe({
        kinds: [1],
        // ids: NOTES
        '#t': ['ask', 'nostr', 'asknostr']
    }, { closeOnEose: false, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY });


subscription.eventReceived = (e: NDKEvent, r: any) => {
    const {id, pubkey} = e;
    e.toNostrEvent()
        .then((e1: NostrEvent) => {
            const hashtags = e1.tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
            if (((hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr')) && !events.includes(e1)) {
                const nevent = nip19.neventEncode({
                    id,
                    author: pubkey,
                    relays: [r.url]
                });

                // console.log({nevent})

                nevents.push(nevent);

                events.push(
                    e1
                );
            }
        })
        .catch((e: any) => {
            console.log('eventReceived error', {e})
        });
};
subscription.eoseReceived = (r: any) => {
    console.log('eose');
};

// serverEvents.push(...events);
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
                    // serverEvents.push(...Array.from(set)
                    //     .filter(({tags}: any) => {
                    //         const hashtags = tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
                    //         return (hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr');
                    //     })
                    //     .filter(({content}: any) => {
                    //         return !content.includes('https://dev.uselessshit.co/resources/nostr');
                    //     })
                    //     .map(({id, content, created_at, kind, tags, sig, pubkey}: any) => ({
                    //         id, content, created_at, kind, tags, sig, pubkey
                    //     })));
                })
                .catch((e: any) => {
                    console.error('fetchEvents error', {e});
                });
            subscription.start()
                .then(() => {
                    console.log('sub started')
                })
                .catch((e: any) => {
                    console.error('start error', {e});
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
    const { name, pubkey } = req.body;
    try {
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

