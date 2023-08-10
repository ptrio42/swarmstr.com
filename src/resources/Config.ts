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
  // APP_TITLE: 'Biblestr.com = Nostr + Bible',
  APP_TITLE: 'Swarmstr - Your knowledge hub for curious minds',
  // APP_DESCRIPTION: 'The Nostr protocol unites all bible readers from all across the world.',
  APP_DESCRIPTION: 'Swarmstr is a simple Q&A web-client, powered by #nostr, where users tap into collective wisdom. Ask questions, find answers, and enjoy expert insights.',
  // APP_IMAGE: `${process.env.BASE_URL}/images/biblestr-preview.jpeg`,
  APP_IMAGE: `${process.env.BASE_URL}/images/swarmstr_cover-image.png`,
  // APP_KEYWORDS: 'nostr, biblestr, bible, questions, answers, q&a, nostr clients, zaps, relays, nips, bitcoin, lightning',
  APP_KEYWORDS: 'nostr, asknostr, questions, answers, q&a, nostr clients, zaps, relays, nips, bitcoin, lightning',
  // HASHTAG: 'biblestr',
  HASHTAG: 'asknostr',
  // SLOGAN: 'Find content from all bible readers from all across the world.',
  SLOGAN: 'Find answers to your questions. Assist others in resolving theirs.',
  // LOGO_IMG: `${process.env.BASE_URL}/images/biblestr.png`,
  LOGO_IMG: `${process.env.BASE_URL}/images/swarmstr.png`,
  // SEARCH_RELAY: `wss://biblestr-search.swarmstr.com`,
  SEARCH_RELAY: `wss://search.swarmstr.com`,
  // SEARCH_RELAY_PUBLISH: `wss://biblestr-search.swarmstr.com?api_key=${process.env.SEARCHNOS_API_KEY}`,
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
    'wss://nostr-pub.wellorder.net',
    'wss://relay.f7z.io',
    'wss://nostr.mom',
    'wss://offchain.pub/',
    'wss://nostr.wine'
    // 'wss://nostr.bitcoiner.social',
  ],
  // EXPLICIT_TAGS: [
  //   'biblestr',      'bible',            'god',
  //   'faith',         'saviour',          'wordofgod',
  //   'jesuschrist',   'jesus',            'christ',
  //   'jesusislord',   'sonofgod',         'father',
  //   'holyspirit',    'hallelujah',       'pray',
  //   'prayer',        'praisegod',        'amen',
  //   'almighty',      'lord',             'king',
  //   'religion',      'spirituality',     'enlightenment',
  //   'eternallife',   'everlastinglife',  'truth',
  //   'innerpeace',    'oldtestament',     'newtestament',
  //   'genesis',       'exodus',           'psalms',
  //   'proverbs',      'revelations',      'romans',
  //   'godsgrace',     'grace',            'creator',
  //   'sin',           'sinful',           'moral',
  //   'immoral',       'heaven',           'hell',
  //   'repent',        'repentance',       'forgiveness',
  //   'glory',         'markofthebeast',   'prophecy',
  //   'biblical',      'kindness',         'worship',
  //   'godislove',     'followgod',        'godisgood',
  //   'praisethelord', 'theprinceofpeace', 'miracles',
  //   'christian',     'christianity',     'angels',
  //   'demons',        'devil',            'spiritual',
  //   'holy',          'endtimes',         'light',
  //   'religion',      'gospel',           'jesusisking',
  //   'christisking',  'kingofkings',      'lordoflords',
  //   'themosthigh',   'mosthigh',         'reformed',
  //   'bornagain',     'orthodox',         'catholic',
  //   'catholicism',   'protestant',       'protestantism',
  //   'virgin',        'marriage',         '10commandments',
  // ],
  EXPLICIT_TAGS: [
    'relays', 'nips', 'badges', 'lightning', 'snort', 'primal', 'keys',
    'alby', 'clients', 'beginner', 'zaps', 'damus', 'amethyst', 'plebstr',
    'zapathon', 'coracle', 'WoS', 'newbie', 'gossip', 'zeus', 'node', 'drivechains'
  ],
  // CONTRIBUTORS: [
  //     '4ffc11bfa2f8516ae8bc7c6bf82275d358e47045446250be2d0e5612e2140828',
  //     'f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8'
  // ],
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