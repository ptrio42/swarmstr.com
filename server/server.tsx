import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from "../src/App";
import {StaticRouter} from "react-router-dom/server";
import {Helmet} from "react-helmet";
import {nip19} from 'nostr-tools';
import {GUIDES} from "../src/stubs/nostrResources";

const baseUrl = process.env.BASE_URL;
const server = express();

console.log({baseUrl});

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

server.get('/*', (req, res) => {
    let helmet = Helmet.renderStatic();
    const path = req.originalUrl;
    console.log({path})
    if (path === '/resources/nostr/') {
        res.writeHead(301, {
            Location: `/resources/nostr`
            // Location: `https://uselessshit.co`
        }).end();
    }
    const pathArr = path.split('/');

    // let subtitle;
    const noteIdBech32 = pathArr && pathArr[pathArr.length - 1];
    try {
        const noteIdHex = nip19.decode(noteIdBech32);
        const noteId = noteIdHex && noteIdHex.data;
        if (noteId) {
            const note = events.find((e: any) => e.id === noteId);
            if (note) {
                // subtitle = guide.issue;
                helmet = {
                    ...helmet,
                    title: {
                        ...helmet.title,
                        toString(): string {
                            return `<title>${note.content} - UseLessShit.co</title>`
                        }
                    },
                    meta: {
                    ...helmet.meta,
                        toString(): string {
                            return `<meta property="og:title" content="${note.content} - UseLessShit.co" />` +
                                `<meta itemProp="name" content="${note.content} - UseLessShit.co" />` +
                                `<meta name="twitter:title" content="${note.content} - UseLessShit.co" />`;
                        }
                    }
                };

                console.log({meta: helmet.meta.toString()})
            }
        }
        console.log({path, noteId})
    } catch (error) {

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