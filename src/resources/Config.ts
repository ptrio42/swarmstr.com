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
    DEFAULT_RELAYS: [
      // 'wss://purplepag.es',
      'wss://nos.lol',
      'wss://relay.f7z.io',
      'wss://relay.damus.io',
      'wss://nostr.mom',
      'wss://relay.nostr.band',
      // 'wss://nostr.terminus.money',
      // 'wss://atlas.nostr.land/',
      'wss://offchain.pub/',
      'wss://nostr.uselessshit.co',
      // 'wss://relay.plebstr.com',
      // 'wss://relay.primal.net',
      // 'wss://relay.snort.social',
      // 'wss://nostr-pub.wellorder.net',
      // 'wss://blastr.f7z.xyz',
      'wss://nostr.wine',
      // 'wss://eden.nostr.land',
      // 'wss://nostr.milou.lol',
      // 'wss://nostr.fmt.wiz.biz',
      // 'wss://relay.nostr.info',
      // 'wss://brb.io',
      // 'wss://relay.current.fyi',
      // 'wss://nostr.relayer.se',
      'wss://nostr.bitcoiner.social',
      // 'wss://nostr.zebedee.cloud',
      // 'wss://relay.nostr.bg',
      // 'wss://nostr.mutinywallet.com',

    ]
  },
  APP_TITLE: 'Swarmstr - Your knowledge hub for curious minds',
  APP_DESCRIPTION: 'Swarmstr is a simple Q&A web-client, powered by #nostr, where users tap into collective wisdom. Ask questions, find answers, and enjoy expert insights. ',
  APP_IMAGE: `${process.env.BASE_URL}/images/swarmstr-cover-2.jpeg`,
  APP_KEYWORDS: 'nostr, questions, answers, q&a, nostr client',
  HASHTAG: 'asknostr',
  SEARCH_RELAY: `wss://search.swarmstr.com`,
  SEARCH_RELAY_PUBLISH: `wss://search.swarmstr.com?api_key=${process.env.SEARCHNOS_API_KEY}`
};

export const DEFAULT_RELAYS = [...Config.NOSTR_CLIENT.DEFAULT_RELAYS];