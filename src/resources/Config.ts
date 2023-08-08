const API_COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_LIGHTNING_GIFTS_BASE_URL = 'https://api.lightning.gifts';
const API_BLOCKCHAIN_INFO_BASE_URL = 'https://blockchain.info';
const NOSTR_BUILD_BASE_URL = 'https://nostr.build';

export const Config = {
  API_COINGECKO_BASE_URL,
  API_LIGHTNING_GIFTS_BASE_URL,
  API_BLOCKCHAIN_INFO_BASE_URL,
  NOSTR_BUILD_BASE_URL,
  NOSTR_CLIENT: {
    MIN_RELAYS: 3,
    RELAY_TIMEOUT: 10000,
  },
  APP_TITLE: 'Swarmstr - Your knowledge hub for curious minds',
  APP_DESCRIPTION: 'Swarmstr is a simple Q&A web-client, powered by #nostr, where users tap into collective wisdom. Ask questions, find answers, and enjoy expert insights. ',
  APP_IMAGE: `${process.env.BASE_URL}/images/swarmstr_cover-image.png`,
  APP_KEYWORDS: 'nostr, asknostr, questions, answers, q&a, nostr clients, zaps, relays, nips, bitcoin, lightning',
  HASHTAG: 'asknostr',
  SLOGAN: 'Use search to explore questions or pick a popular keyword',
  LOGO_IMG: `${process.env.BASE_URL}/images/swarmstr.png`,
  SEARCH_RELAY: `wss://search.swarmstr.com`,
  SEARCH_RELAY_PUBLISH: `wss://search.swarmstr.com?api_key=${process.env.SEARCHNOS_API_KEY}`,
  SERVER_RELAYS: [
    'wss://nos.lol',
    'wss://relay.f7z.io',
    'wss://relay.damus.io',
    'wss://nostr.mom',
    'wss://relay.nostr.band',
    'wss://offchain.pub/',
    'wss://nostr.uselessshit.co',
    'wss://relay.plebstr.com',
    'wss://relay.snort.social',
    'wss://nostr-pub.wellorder.net',
    'wss://blastr.f7z.xyz',
    'wss://nostr.wine',
    'wss://eden.nostr.land',
    'wss://nostr.milou.lol',
    'wss://relay.current.fyi',
    'wss://nostr.bitcoiner.social',
    'wss://relay.nostr.bg',
    'wss://nostr.mutinywallet.com',
    'wss://purplepag.es'
  ],
  CLIENT_RELAYS: [
    'wss://nos.lol',
    'wss://relay.nostr.band',
    'wss://q.swarmstr.com',
    'wss://relay.damus.io',
    'wss://relay.f7z.io',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr.wine',
    // 'wss://nostr.bitcoiner.social',
  ]
};

export const CLIENT_RELAYS = [...Config.CLIENT_RELAYS];
export const SERVER_RELAYS = [...Config.SERVER_RELAYS];