import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from "../src/App";
import {StaticRouter} from "react-router-dom/server";
import {Helmet} from "react-helmet";

const baseUrl = process.env.BASE_URL;
const server = express();

console.log({baseUrl});

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use('/', express.static(path.join(__dirname, 'static')))
server.use(express.static('public'));

const manifest = fs.readFileSync(
    path.join(__dirname, 'static/manifest.json'),
    'utf-8'
);
const assets = JSON.parse(manifest);

server.get('/*', (req, res) => {
    const path = req.originalUrl;
    const helmet = Helmet.renderStatic();
    const component = ReactDOMServer.renderToString(
        <StaticRouter location={path}>
            <App/>
        </StaticRouter>
    );
    res.render('client', { assets, component, helmet, baseUrl })
});

server.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});