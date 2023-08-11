This project is experimental. Use at your own risk!

#### What is Swarmstr?

Swarmstr is a q&a nostr web client.

React front-end is served by express.

![swarmstr preview image](https://swarmstr.com/images/swarmstr_cover-image.png)

### Dependencies

Requires redis (server side caching), postgres (nostr addresses database) 
and a separate search relay (https://github.com/darashi/searchnos) for search results.

Both back-end and front-end use NDK to interact with nostr.

Upon successful application start, a subscription to a given hashtag is started.
By default only events no older than ~ 7 days will be fetched (you can change that in server/server.tsx -> EVENTS_SINCE variable).
Received events are re-broadcasted to the search relay.

IndexedDB is used for caching on the client side (dexie).

### Configuration file

src/resources/Config.ts

#### Environmental variables

.development.env

```
cp .example.development.env .development.env
```
.env

```
cp .example.env .env
```

### Building

Install deps

```
npm i
```

Development

```
npm run start:dev
```

Prod

Build client

```
npm run build:client
```

Build server

```
npm run build:server
```

Run

```
node ./dist/server.js
```
