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
  APP_DESCRIPTION: 'Swarmstr is a simple Q&A web-client, powered by #nostr, where users tap into collective wisdom. Ask questions, find answers, and enjoy expert insights.',
  APP_IMAGE: `${process.env.BASE_URL}/images/swarmstr_cover-image.png`,
  APP_KEYWORDS: 'nostr, asknostr, questions, answers, q&a, nostr clients, zaps, relays, nips, bitcoin, lightning',
  HASHTAG: 'asknostr',
  REPLIES_HASHTAG: 'asknostr-reply',
  SLOGAN: 'Find answers to your questions. Assist others in resolving theirs.',
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
    'wss://nostr-pub.wellorder.net',
    'wss://relay.f7z.io',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr.wine'
  ],
  CLIENT_READ_RELAYS: [
    'wss://nos.lol',
    'wss://relay.nostr.band',
    'wss://q.swarmstr.com',
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.f7z.io',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr.wine',
  ],
  CLIENT_WRITE_RELAYS: [
    'wss://nos.lol',
    'wss://relay.nostr.band',
    'wss://q.swarmstr.com',
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://blastr.f7z.xyz'
  ],
  EXPLICIT_TAGS: [
    'relays', 'nips', 'badges', 'lightning', 'snort', 'primal', 'keys',
    'alby', 'clients', 'beginner', 'zaps', 'damus', 'amethyst', 'plebstr',
    'zapathon', 'coracle', 'WoS', 'newbie', 'gossip', 'zeus', 'node', 'drivechains'
  ],
  CONTRIBUTORS: [
    'f747b6b3202555cbf39c74b14da9a89585e5fb21431c1e630071e5c86cfb7a2b',
    '89d1ce9164f1f172daaa9c784153178cb1dec7912bf55f5dc07e0f1dabe40e6c',
    '1577e4599dd10c863498fe3c20bd82aafaf829a595ce83c5cf8ac3463531b09b',
    '1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411',
    'f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8'
  ]
};

export const CLIENT_RELAYS = [...Config.CLIENT_RELAYS];
export const SERVER_RELAYS = [...Config.SERVER_RELAYS];