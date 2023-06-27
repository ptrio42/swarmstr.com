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
      'wss://nostr.uselessshit.co',
      'wss://nostr.wine',
      'wss://relay.damus.io',
      'wss://eden.nostr.land',
      'wss://nostr.milou.lol',
      // 'wss://nostr.fmt.wiz.biz',
      'wss://nostr-pub.wellorder.net',
      'wss://relay.snort.social',
      // 'wss://relay.nostr.info',
      'wss://offchain.pub',
      'wss://nos.lol',
      // 'wss://brb.io',
      'wss://relay.current.fyi',
      'wss://nostr.relayer.se',
      'wss://nostr.bitcoiner.social',
      'wss://nostr.zebedee.cloud',
      'wss://relay.nostr.bg',
      'wss://purplepag.es',
      'wss://nostr.mutinywallet.com',
      'wss://blastr.f7z.xyz',
      'wss://relay.nostr.band'
    ]
  }
};

export const DEFAULT_RELAYS = [...Config.NOSTR_CLIENT.DEFAULT_RELAYS];