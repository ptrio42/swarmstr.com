import {Guide} from "../components/Resources/NostrResources/NostrResources";
import {getPeopleInvolvedInNostr, listToMarkup} from "../utils/utils";


// These are the notes ids that are used as discussion notes for
// most of the guides in the faq
export const NOTES = [
    '1bc4db2cd4822334c7ab5f13e907533d7276057ab91312c5b21b2ae0e70cf9a0',
    '17f615a2b82640553ca7f5ea6fb417cf5b7e66be854d0e6f683d539174ec772a',
    '05b334027170b8ca8bc953e6ba3fffd6f0d36bc1ee92a8478be528452c73d9eb',
    '8e74f0ffd303336d5f18507907c9f936be3645ac57230f17e61ce5d687a374a2',
    'f9769adf49cec7d13f68103f0dbc68ce4e02876a578d2622f07cd5f2d591f6de',
    '92d120f3efbc59da4025f58f19a2ac6b62fb52a4b620e5d3c50b34778ab7a3e7',
    '679570d6e77c5f0b15431dcc30a88c359c8c680f4a2d9b975959f7a970fcd8fc',
    '1fd1a9ac81f4a2a8b3364036659355e01e9bad42536ecfc6ca5f2823346c8df6',
    '4118cde32ca3946544c85ec761c1ebce7ff31e6187df30c98ad759bc7731beea',
    'c5d66fc688f59c06512ec989193d4d883d93761009a34d17a0742587c2f8e863',
    '2840a196b4128d685345400072dff72199f62256cce159bf2c261fccf85067d1',
    '16e0b43f67e111a168abcab297aafc27b18b48a4ab7b67582458197a86ac63a0',
    '556fb051744fd4a17a348c69ce95500971bc9a4f6305507ef01f0eda0f093695',
    'a902308552b36ad1863f830ec4b6648166d793b157f5188f20f463c3eaf94cf4',
    '6baf8bdbf85e4d8d27382e69c7c92d53efc2b01d4d945a461c170e5c586482a4',
    '375488c5378dd2a0f873578dcdd878d86b4f483a0310301e123a71fa9e1662b9',
    '9b94b0645bc2c755769b2c01304bf63aa1fe434a2be21948f33264ef810365ee',
    '9f158637de6ec5bd97e272ec3d1d2f10c14dffa6afedb04c0aee2869a3a18bbd',
    '8fe64dfee6323bd3971b4a5718eb890258dff9e952059f3b04adb1e6e9b0fc84',
    '863918f4e2c7530c006ac333a28b3cd37829b27879d556ceec5107e673b96839',
    '45a4d2808dcb4cdc99b17bd47f24e0d27111c9f0ab599e6c1b1b5a602c3b0e0c',
    '7810556aa05f2439e90b503a097776e4637f5c362ecfca0a4d242fbf172d5e95',
    'ea338ad542d718c40bc70f7b47cb24d5ac58d7136dc06ebdd35e8ebad971a343',
    '5f323b94489db9b48ef75f6353e26f1b455d374b98b4d67bab27ead8fbcf878a',
    '53a435eb103ef2ed7af2efa4c90d7391532efebfcec7ecb97ca0cfca57797fc6',
    'a755d5370b26976988d8da115af615d4233e02cff8cefafbec86fc4553a7c898',
    '0d1e655919007561763bf10207d2ac29c14a52caa7b705c23568197680ceed77',
    '59a938bcfadbe487ffcff86ebb3ee9f8415ec6f4a91f634ad647561b59e79cc4',
    '679570d6e77c5f0b15431dcc30a88c359c8c680f4a2d9b975959f7a970fcd8fc',
    'f6fda04013bcbca98b33bd419822ce1b807dc24796892389f74df22b78f312a9',
    'a6d79e2a426bef6a9ac75c159feb405584fa8fc8f9c683867ba789f392921efb',
    'a1bc9e57e7dd0a86350b1a4175e9120e83d4dc22ce0d2bb35e2cf7ac7aa2b893',
    'ba402b5b346aa49125f07504aa9d42cbc8003715c5c6f9d48f42cb9531307ff9',
    '54939b180633ebbc25d0e863b1e9372aeeca03fbe87dbf8c557bbcfaf4a1fbbf',
    'a5c3a106ff4d4b6ba50e3fdf08235a08c6f7c67854db86c549ad3cb89c4ca50f',
    'd6f703f3cb275f40417cbb1837197c7b488756967f2155db6681b68ba70a4939'
];

export const PUBKEYS = [
    '000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6',
    'ddfbb06a722e51933cd37e4ecdb30b1864f262f9bb5bd6c2d95cbeefc728f096',
    '0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c',
    'e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411',
    'c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11',
    'f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9',

];

export const GUIDES_LAST_UPDATE = '2023-04-06';

export const GUIDES: Guide[] = [
    {
        id: 'what-is-nostr',
        issue: 'What\'s NOSTR?',
        fix: 'Notes and Other Stuff Transmitted by Relays, ' +
            'or NOSTR, is an open protocol, designed to create a censorship-resistant social network. ',
        bulletPoints: [
            'https://uselessshit.co/images/nostr-ostrich.jpeg',
            '#### Nostr Protocol',
            'https://github.com/nostr-protocol/nostr',
            '#### NIPs',
            'https://github.com/nostr-protocol/nips',
            '#### Development',
            'https://github.com/nbd-wtf/nostr-tools',
            '#### Resources',
            '#### nostr-resources.com by @dergigi',
            'https://nostr-resources.com',
            'npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc:6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93:dergigi',
            '#### Beginner\'s guide by @walker',
            'https://www.btctimes.com/news/what-is-nostr-how-does-it-work-why-does-it-matter',
            'npub1cj8znuztfqkvq89pl8hceph0svvvqk0qay6nydgk9uyq7fhpfsgsqwrz4u:c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11:walker',
            '#### usenostr.org by @pluja',
            'https://usenostr.org',
            '#### Nostr introduction',
            'npub1fl7pr0azlpgk469u034lsgn46dvwguz9g339p03dpetp9cs5pq5qxzeknp:4ffc11bfa2f8516ae8bc7c6bf82275d358e47045446250be2d0e5612e2140828:SovrynMatt',
            'https://sovryn.com/all-things-sovryn/introducing-nostr-a-decentralized-social-network-for-sovereign-individuals',
            '#### More Resources',
            'https://github.com/vishalxl/nostr_console/discussions/31',
            'https://wiki.wellorder.net/post/nostr-intro/',
            'https://audaciousdenizen.substack.com/p/my-quick-guide-to-nostr',
            'https://www.austrich.net/nostr/',
            '',
            'https://uselessshit.co/images/explain-it-to-me-like-i-m-5.png',
            'Image credits: @coderjourney1'
        ],
        createdAt: '2023-01-09',
        updatedAt: '2023-03-24',
        attachedNoteId: NOTES[1],
        tags: ['Basics', 'Protocol']
    },
    {
        id: 'how-does-nostr-work',
        issue: 'How does NOSTR work?',
        fix: '',
        bulletPoints: [
            '💡 There are two components: clients and relays. Each user runs a client. Anyone can run a relay.',
            '💡 Every user is identified by a public key. Every post is signed. Every client validates these signatures.',
            '💡 Clients fetch data from relays of their choice and publish data to other relays of their choice. ' +
            'A relay doesn\'t talk to another relay, only directly to users.',
            '💡 For example, to "follow" someone a user just instructs their client to query the relays it knows for posts ' +
            'from that public key.',
            '💡 On startup, a client queries data from all relays it knows for all users it follows (for example, ' +
            'all updates from the last day), then displays that data to the user chronologically.',
            '💡 A "post" can contain any kind of structured data, but the most used ones are going to find their way into ' +
            'the standard so all clients and relays can handle them seamlessly.',
            'https://github.com/nostr-protocol/nostr#how-does-nostr-work',
            'https://uselessshit.co/images/how-does-nostr-work-02.jpeg',
            'Image credits: unknown'
        ],
        tags: ['Basics', 'Protocol'],
        updatedAt: '2023-03-24',
        attachedNoteId: NOTES[12]
    },
    {
        id: 'about-nostr-clients',
        issue: 'What are nostr clients?',
        fix: '"Everybody runs a client. It can be a native client, a web client, etc. ' +
            'To publish something, you write a post, sign it with your key and send it ' +
            'to multiple relays (servers hosted by someone else, or yourself). To get updates from other people, ' +
            'you ask multiple relays if they know anything about these other people. [...] ' +
            'Signatures are verified on the client side."',
        bulletPoints: [
            'https://github.com/nostr-protocol/nostr#very-short-summary-of-how-it-works-if-you-dont-plan-to-read-anything-else'
        ],
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Protocol'],
        attachedNoteId: NOTES[13]
    },
    {
        id: 'about-relays',
        issue: 'What\'s a (nostr) relay?',
        fix: '"Anyone can run a relay. ' +
            'A relay is very simple and dumb. It does nothing besides accepting posts from some people and forwarding to others. ' +
            'Relays don\'t have to be trusted. "',
        bulletPoints: [
            'https://github.com/nostr-protocol/nostr#very-short-summary-of-how-it-works-if-you-dont-plan-to-read-anything-else'
        ],
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Protocol'],
        attachedNoteId: NOTES[14]
    },
    {
        id: 'the-list',
        issue: 'People involved in NOSTR',
        updatedAt: '2023-03-24',
        fix: 'You can open each person\'s profile in a client of your choice by tapping on the copy icon ' +
            'next to their name and selecting <i>Open in client</i>' +
            '<br/><br/>' +
            'On a desktop/laptop you can use <i>Show QR</i> option to display qr code ' +
            'which will take you to that profile on your mobile device.',
        bulletPoints: [
            '"<i>Following and zapping ⚡️ them is highly adviseable especially if you use their product!</i>',
            '<i>Forgive me if I you are not included. Add yourself in the comments with your project\'s name and github or just shoot me a DM and I will make sure you will be added.</i>',
            '<i>Let me know if anything is wrong or missing and I will change it."</i>',
            ...listToMarkup(getPeopleInvolvedInNostr())
        ],
        tags: ['Lists', 'People'],
        attachedNoteId: NOTES[10]
    },
    {
        id: 'nostr-clients',
        issue: 'List of Nostr clients.',
        fix: '',
        bulletPoints: [
            '#### iOS/MacOS',
            '<i>Damus</i>',
            'https://damus.io',
            '<i>Daisy</i>',
            'https://www.neb.lol/nostr',
            '<i>Iris.to</i>',
            'https://testflight.apple.com/join/5xdoDCmG',
            '<i>Current</i>',
            'https://testflight.apple.com/join/mB0EwMiV',
            '<i>Nostur</i>',
            'https://testflight.apple.com/join/TyrRNCXA',
            '<i>Plebstr</i>',
            'https://plebstr.com',
            '#### Web',
            'https://astral.ninja',
            'https://yosup.app',
            'https://iris.to',
            'https://snort.social',
            'https://hamstr.to',
            'https://nostrgram.co',
            'https://web.nostrid.app',
            'https://member.cash',
            'https://coracle.social',
            'https://habla.news',
            'https://blogstack.io',
            'https://primal.net',
            '#### Android',
            '<i>nostros</i>',
            'https://github.com/KoalaSat/nostros',
            '<i>Daisy</i>',
            'https://www.neb.lol/nostr',
            '<i>Amethyst</i>',
            'https://github.com/vitorpamplona/amethyst',
            '<i>Nostrid</i>',
            'https://github.com/lapulpeta/Nostrid',
            '<i>Plasma</i>',
            'https://github.com/plasma-social/plasma',
            '<i>Iris.to</i>',
            'https://play.google.com/store/apps/details?id=to.iris.twa',
            '<i>Current</i>',
            'https://play.google.com/apps/testing/io.getcurrent.current',
            '<i>Plebstr</i>',
            'https://plebstr.com',
            '#### Desktop',
            '<i>Nostrid</i>',
            'https://github.com/lapulpeta/Nostrid',
            '<i>Gossip</i>',
            'https://github.com/mikedilger/gossip',
            '<i>Monstr</i>',
            'https://github.com/alemmens/monstr'
        ],
        updatedAt: '2023-03-24',
        tags: ['Lists', 'Clients'],
        attachedNoteId: NOTES[15]
    },
    {
        id: 'keys',
        issue: 'Getting the keys 🔑',
        fix: 'The keys are your identity. ' +
            'They consist of a public key which starts with <i>npub</i> and a private key starting with <i>nsec</i> (bech32 encoding). ' +
            'A public key can be treated as a username, whereas a private key is more like a password. ' +
            'Be cautious when entering your private on different sites - if it gets leaked and falls into wrong hands,' +
            'you can think of your \'account\' as compromised.',
        bulletPoints: [
            'There are different ways to get nostr pair of keys.',
            'If you\'re going to use a mobile client like Damus, you\'re probably fine obtaining your keys through the app.',
            '#### You should never paste your private key into websites',
            'For web clients use Alby or nos2x browser extension.',
            '#### How to use Nostr with the Alby extension',
            'https://blog.getalby.com/how-to-use-nostr-with-the-alby-extension/',
            '#### The nos2x browser extension',
            'https://youtu.be/IoLw-3ok3_M',
            'You can also check out the nos2x fork for Firefox',
            '#### nos2x-fox',
            'https://github.com/diegogurpegui/nos2x-fox'
        ],
        createdAt: '2023-01-05',
        updatedAt: '2023-02-09',
        tags: ['Basics', 'Keys'],
        attachedNoteId: NOTES[16]
    },
    {
        id: 'using-nostr-with-alby-or-nos2x',
        issue: 'How to use Nostr with the Alby or nos2x extension.',
        fix: 'As a rule of thumb, <b>you should never paste your private key into websites</b>. ' +
            'To generate your keys and handle your keys, use Alby or nos2x extension.',
        bulletPoints: [
            '#### How to use Nostr with the Alby extension',
            'https://blog.getalby.com/how-to-use-nostr-with-the-alby-extension/',
            '#### The nos2x browser extension',
            'https://youtu.be/IoLw-3ok3_M'
        ],
        updatedAt: '2023-01-23',
        tags: ['Tutorials', 'Keys'],
        attachedNoteId: NOTES[2]
    },
    {
        id: 'generate-and-manage-keys-and-sign-events',
        issue: 'How to generate and manage Nostr keys and sign events.',
        fix: 'Feel free to share, provide suggestions and changes if any.',
        bulletPoints: [
            'Courtesy of',
            'npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox',
            'https://orangepill.dev/nostr-guides/guide-nostr-key-generation-and-management/'
        ],
        updatedAt: '2023-01-22',
        tags: ['Tutorials', 'Keys'],
        attachedNoteId: NOTES[17]
    },
    {
        id: 'nostr-sources-list-for-new-users',
        issue: 'Sources list for new users by Intuitive Guy',
        fix: '',
        updatedAt: '2023-01-23',
        bulletPoints: [
            'https://uploads-ssl.webflow.com/63c880de767a98b3372e30e7/63cbd0fd993f001b403a8377_How%20It%20Started.png',
            'HELLO! WELCOME TO #NOSTR\n',
            'Here is my daily update #Nostr (and Bitcoin visualization data) sources\' list for new users. Probably you know already many of them, but maybe you will find somethng new I added TODAY.. at least a new amazing cover image (from Nostrland).\n',
            'Thank you if you consider repostig it or giving me a follow; also do comment below with new info or sources if you have.\n',
            'Cheers to all nostriches and #Plebchain!\n',
            '\n',
            'Basic Intro\n',
            '\n',
            'Article about Nostr on BTCtimes:\n',
            'https://www.btctimes.com/news/what-is-nostr-and-how-do-i-use-it\n',
            '\n',
            '@Dergigi list sources. Already translated into Chinese, French, and Spanish!\n',
            'https://nostr-resources.com/\n',
            '\n',
            'Others\n',
            'https://usenostr.org/\n',
            'https://uselessshit.co/resources/nostr\n',
            'https://wiki.wellorder.net/post/nostr-intro/\n',
            '\n',
            'Get NIP-05 verified:\n',
            'https://nostrplebs.com/\n',
            'https://www.Nostr-Check.com/ (free)\n',
            'https://nostr.industries/ (free)\n',
            'HOW to create a POW #Nostr key pair by mads@NostrVerified.com\n',
            'https://telegra.ph/How-to-create-a-POW-nostr-key-pair-01-04\n',
            '\n',
            'Now that you have your own NIP5 handle, make it a Lightning Address to! Here is how:\n',
            'https://nvk.org/alby-? Pay with lightning\n',
            'Guide to create Lightning Address redirection on your domain:\n',
            'https://orangepill.dev/lightning-guides/guide-to-create-lnaddress-redirection-on-your-domain/\n',
            '\n',
            'Search for RELAYS near to you:\n',
            'https://nostr.watch/\n',
            '@Ezofox free relay uptime monitoring page:\n',
            'https://uptime.orangepill.dev/\n',
            'Safer Nostr relays (good for filtering out spam on replies and global feed):\n',
            'wss://nostr.milou.lol (1000 sats)\n',
            'wss://eden.nostr.land (5000 sats)\n',
            '\n',
            'Set up a Nostr Relay server in under 5 minutes:\n',
            'https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under\n',
            '\n',
            'Nostr network stats:\n',
            'https://nostr.io/stats\n',
            '\n',
            'Find your Twitter follows on Nostr and connect your pubkey with Twitter\n',
            'https://nostr.directory/\n',
            '\n',
            'Top Users on #Nostr you should follow:\n',
            'https://nostrum.pro/search/#users\n',
            '\n',
            'Nostrum Search home page:\n',
            'https://nostrum.pro/search/\n',
            'If you want to search through #nostr notes by keyword:\n',
            'https://nostr.band\n',
            'Want to follow a hashtag or a keyword? Create your bot and follow it:\n',
            'https://sb.nostr.band\n',
            '\n',
            'If you want to upload free image on a note (copy/paste image address link):\n',
            'https://nostr.build\n',
            'If you want to upload gif on a note (copy/paste image address link):\n',
            'https://tenor.com/\n',
            'https://giphy.com/\n',
            'Cool page for Nostr art by karnage@nostrplebs.com:\n',
            'https://www.nostrland.com/\n',
            '\n',
            'Do you need more Nostr in your life? If the answer to that is YES, then you\'ll want to check out the new Nostrovia podcast:\n',
            'https://nostrovia.org/\n',
            'By plebs, for plebs. A synopsis of the best content of the day:\n',
            '@NostReport\n',
            '\n',
            'Whitelist for Damus:\n',
            'https://damus.io/\n',
            '\n',
            'Amhetyst app download:\n',
            'https://apkpure.com/it/amethyst/com.vitorpamplona.amethyst\n',
            '\n',
            'Iris app download:\n',
            'https://apkpure.com/iris/to.iris.twa\n',
            '\n',
            'Here is a @BTCsession video about #Nostr:\n',
            'https://www.youtube.com/watch?v=qn-Zp491t4Y\n',
            '\n',
            'Fiatjaf\'s tools for developing Nostr clients:\n',
            'https://github.com/fiatjaf/nostr-tools[#readme](/hashtag/readme)\n',
            '\n',
            'https://uploads-ssl.webflow.com/63c880de767a98b3372e30e7/63d9e20726c7fb097c67057c_KeysToMyHeart.png\n',
            'TAKE BOTH PILLS.. A bit of #Bitcoin now:\n',
            '\n',
            'Here are many beautiful and soothing visualisations also for your journey into the #Bitcoin rabbit hole:\n',
            '\n',
            'https://bitfeed.live/\n',
            'Transactions fall tetris-like calmly in their spot. You see the mempool fill up and once the block is mined something magical happens and all the transaction transform into this colourful block. My favourite!\n',
            'https://mempool.space/\n',
            'Cant go wrong with Mempool.space. The blocks are nicely lined-up and move when the new one is mined. Pretty colours and some nice stats! Made with a lot of love and it shows!\n',
            '* https://timechaincalendar.com/\n',
            'Cool one-pager with all the timechain info you need. You can even go back in time to see what block was mined at a specific date and time!\n',
            'http://bitcoinrain.io/\n',
            'New transactions fall like raindrops, simple and elegant!\n',
            'http://bitcoin.interaqt.nl/\n',
            'Bubbles, whats not to love? Each dot is a transaction and they get added smooth and playful!\n',
            'https://lnvisualizer.com/\n',
            'All the lightning channels to see! Zoom in, zoom out, have it static, it\'s nice.\n',
            'https://bitnodes.io/nodes/network-map/\n',
            'Galaxy like view of Bitcoin nodes, this one is beautiful!\n',
            'https://blocks.wizb.it\n',
            'A spinning globe centring a transaction! A bit to fast, bit noisy. Fun to watch anyway! Good distraction for a few minutes!\n',
            'https://txstreet.com/v/btc\n',
            'The mempool, but then as a crowded bus station. Cartoonish and fun to watch!\n',
            'https://utxo.live/\n',
            '\n',
            'Thanks if you read all to here.. hope I did not spam your feed and You will find something you needed. Cheers! #Plebchain\n',
            '\n',
            '⚡️ wrigglypie41@walletofsatoshi.com ⚡️ 💜🍀'
        ],
        attachedNoteId: NOTES[18],
        tags: ['Lists', 'Resources']
    },
    {
        id: 'nostrich-origins',
        issue: 'What\'s a nostrich?',
        fix: 'Nostrich (a purple ostrich) is a nostr mascott.',
        bulletPoints: [
            'The term came to life when',
            'npub1cj8znuztfqkvq89pl8hceph0svvvqk0qay6nydgk9uyq7fhpfsgsqwrz4u:c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11:walker',
            'asked ChatGPT to write a joke about nostr.',
            'https://nostr.build/i/nostr.build_c7549ccb80f6bfea2afc464a9467491168a278e78a763299178e62e0850169ea.jpeg',
            'Here\'s some Nostrich images',
            'https://nostr.build/i/walker/01.png',
            'https://nostr.build/i/walker/LxHDoJ7P_400x400.jpg',
            'https://nostr.build/i/walker/2087.jpeg'
        ],
        updatedAt: '2023-01-25',
        attachedNoteId: NOTES[19],
        tags: ['Stories']
    },
    {
        id: 'what-is-damus',
        issue: 'What is Damus?',
        fix: '',
        bulletPoints: [
            'Watch this simple explainer video to find out about Damus.',
            'https://youtu.be/I_A7NLIyX1o',
            'https://techcrunch.com/2023/02/01/damus-another-decentralized-social-networking-app-arrives-to-take-on-twitter/'

        ],
        createdAt: '2023-01-10',
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Clients']
    },
    {
        id: 'running-damus',
        issue: 'Running Damus',
        fix: '<strike>To be able to test Damus without participating in the TestFlight beta you\'ll need a Mac and optionally an ' +
            'iOS device (iPhone or iPad).</strike>',
        bulletPoints: [
            '#### Damus is now officially available in the App Store.',
            'If you\'d like to try the latest Damus features, you can get the source from github and build the app yourself.',
            'You\'ll need a Mac and optionally an iOS device.',
            '1. Download Xcode from the AppStore on your Mac OS.',
            '2. Clone the official Damus repository from GitHub.',
            'https://github.com/damus-io/damus',
            '3. Open the project (the repo you\'ve just cloned) with Xcode.',
            '4. Don\'t have/want to use your mobile device? Jump directly to #15.',
            '#### Follow the steps below if you\'re building on iPhone.',
            '5. Enable Developer mode on your iPhone (Settings -> Privacy & Security) and restart your device.',
            '6. Connect your iPhone to your Mac.',
            '7. In Xcode, click on iPhone 14 Pro text (top panel, in the middle, next to damus).',
            '8. From the list that will open, select your iPhone.',
            '9. Click on the play icon (left panel, on top).',
            '10. If you build it to iPhone for the first time, it will fail.',
            '11. Click on the failures you have, to change the &nbsp;<i>Team</i>&nbsp; to your account (Apple ID).',
            '12. Change the bundle identifier to whatever you like.',
            '13. Delete &nbsp;<i>Associated Domains</i>, &nbsp;<i>Keychain Sharing</i>&nbsp; and &nbsp;<i>Push Notifications</i>.',
            '14. On your iPhone, go to Settings -> General -> VPN & Device Management and trust &nbsp;<i>yourself</i>.',
            '14. Build the app again.',
            '#### Building on simulator.',
            '15. You can use a simulator instead of a mobile Apple device.',
            '16. Click on the play icon (left panel, on top).',
            '#### Running Damus.',
            '17. Wait for the application to build.',
            '18. That\'s it! You can now use Damus without participating in TestFlight beta.',
            '',
            'Thanks to npub1fmd02wwyjrs3yagacdrhzar75vgu9wu0utzf6trvumdrz3l3mzrsm7vmml:realmuster for contributing to this particular guide.'

        ],
        tags: ['Tutorials', 'Damus'],
        updatedAt: '2023-02-01',
        attachedNoteId: NOTES[20]
    },
    {
        id: 'vanity-keys',
        issue: 'Mining vanity keys with Rana.',
        fix: 'Since your keys are your identity, it\'s advisable to, instead of getting a random key pair, find (or mine) ' +
            'one that can be tied to your online presence.',
        bulletPoints: [
            'Here\'s some vanity keys:',
            'npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc',
            'npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9',
            'npub1artur379gp42kd39rlsgx703ytke8fwhydytdf6qlezv8mtlqk6q8akg37',
            '#### What\'s special about these keys?',
            'If you look closely, you\'ll see that each of these keys has a certain prefix (respectively dergg, sn0wden, artur).',
            'It means that the owners had to use some energy to guess a key which contains that given prefix.',
            'The difficulty of finding a key with a given prefix grows exponentially for every character added.',
            'Depending on a prefix, mining can take minutes, hours, days or even weeks.',
            'In other words, vanity keys are the proof of work that was needed to find them.',
            '#### So how do I mine a vanity key?',
            'Check out Rana, which is available at',
            'https://github.com/grunch/rana',
            'Here\'s a good explainer by',
            'npub1rpes5hhk6mxun5ddt5kecxfm8y3xdr0h5jwal32mc6mxafr48hxsaj2et2:18730a5ef6d6cdc9d1ad5d2d9c193b3922668df7a49ddfc55bc6b66ea4753dcd:Mads',
            'which can shed some light on the whole process',
            'https://telegra.ph/How-to-create-a-POW-nostr-key-pair-01-04',
            '------------------',
            '<b>Mining a HEX key online</b>',
            'https://nostr.rest'
            // TODO: Add info about needing to login through a webclient after mining vanity keys (Damus)
        ],
        updatedAt: '2023-03-08',
        tags: ['Tutorials', 'Keys'],
        attachedNoteId: NOTES[21]
    },
    {
        id: 'logging-in-with-someone-else-s-key',
        issue: 'Logging in with someone else\'s key.',
        fix: 'One of the cool features of Nostr is that you can log in with someone else\'s public key ' +
            'and see the world through their lens.',
        createdAt: '2023-01-09',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Keys']
    },
    {
        id: 'how-do-i-tag-a-person',
        issue: 'How do I tag someone?',
        fix: '' +
            '<strike>Use this person\'s public key instead of their handle. ' +
            'The public key can be obtained in a person\'s profile, under the key icon. ' +
            'Then, to tag this person, you got to put the @ symbol in front of their pubkey ' +
            '(@pubkey) eg. @npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4)</strike>',
        bulletPoints: [
            '#### These days, most nostr clients support tagging by user name.',
            'To tag someone in a note, type the <i>@</i> symbol and at least ' +
            'the first letter/digit from the user name you\'re looking for.',
            'A list with user profiles should show up.',
            'Tap on a profile to select it.',
            'https://uselessshit.co/images/tagging-example.png',
            'You can tag multiple people in a single note.',
            '<i>You might only be able to tag people you follow.</i>',
            '<i>Also the search might be case sensitive.</i>'
        ],
        createdAt: '2022-12-25',
        updatedAt: '2023-02-01',
        tags: ['Tutorials', 'Notes']
    },
    {
        id: 'adding-images',
        issue: 'How to add an image to a post?',
        fix: 'Image urls are processed and displayed as images. ',
        createdAt: '2022-12-26',
        updatedAt: '2023-02-14',
        bulletPoints: [
            'For now, only some clients (like snort.social) allow you to upload images directly from your device. ',
            'In most cases, the image has to be hosted somewhere before it can be used. ',
            'Here\'s a list of free public image hosting services are listed below.',
            'https://nostr.build',
            'https://nostrimg.com',
            'https://imgbb.com',
            'https://postimages.org',
            'https://imgur.com',
            'https://void.cat'
        ],
        tags: ['Basics', 'Media'],
        attachedNoteId: NOTES[22]
    },
    {
        id: 'adding-pfp',
        issue: 'Adding a profile picture',
        fix: 'For now, most clients don\'t support direct image uploads.',
        bulletPoints: [
            '#### You\'ll need to upload the desired image to a public image hosting service. ',
            'https://nostr.build',
            'https://nostrimg.com',
            'https://imgbb.com',
            'https://postimages.org',
            'https://imgur.com',
            'https://void.cat',
            'Once the image is online, copy the image url and paste it into the <i>PROFILE PICTURE</i> input under Profile <i>Edit</i> view.',
            'https://uselessshit.co/images/profile-pic-edit-damus.png',
            '<i>Note: You can set the profile banner in the same way.</i>'
        ],
        createdAt: '2022-12-26',
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Media', 'Damus'],
        attachedNoteId: NOTES[23]
    },
    {
        id: 'gifs',
        issue: 'GIFs',
        fix: 'GIFs work just like any other images.',
        bulletPoints: [
          '<b>Turning videos into GIFs</b>',
          'https://ezgif.com',
          '<b>Animating images</b>',
          'Motionleap (available on Android and iOS)',
          '<b>Finding GIFs online</b>',
          'https://tenor.com',
          'https://giphy.com'
        ],
        updatedAt: '2023-03-08',
        tags: ['Basics', 'Media']
    },
    {
        id: 'gifs-will-not-display',
        issue: 'Changed my profile pic to GIF but it won\'t display',
        fix: 'Some clients prevent GIFs larger than 1MB from loading. ' +
            'Try an image-compressing tool to downsize.',
        updatedAt: '2023-01-05',
        tags: ['Basics', 'Media', 'Troubleshooting']
    },
    {
        id: 'multiple-images',
        issue: 'Adding multiple images to a post.',
        fix: 'For multiple images to be displayed in a single post, simply add a direct image url for every image you\'d like to see. ' +
            'They\'ll appear in a carousel (swipe left/right to browse).',
        updatedAt: '2022-12-27',
        tags: ['Basics', 'Media']
    },
    {
        id: 'adding-videos',
        issue: 'How to make a post with a video?',
        fix: 'Video urls are processed and displayed as videos. ' +
            'Simply copy the direct video link (it has to be hosted somewhere public) and paste it into a post 🔥 ' +
            'That\'s it!',
        createdAt: '2022-12-29',
        updatedAt: '2022-01-11',
        tags: ['Basics', 'Media']
    },
    {
        id: 'how-to-quote-a-note',
        issue: 'How to refer to an existing post (note)?',
        fix: 'Click (press) and hold on the note you would like to quote. A menu should pop up. Select Copy Note ID. ' +
            'Then use that id prefixed by @ in your new post.',
        updatedAt: '2023-01-03',
        tags: ['Basics', 'Notes']
    },
    {
        id: 'deleting-notes',
        issue: 'Deleting posts on NOSTR',
        fix: '<b>You cannot delete on protocol level, you can just tag a note as deleted.</b> ' +
            'How relays and clients deal with this information is their choice. ' +
            'Eg. clients can choose to not show deleted-tagged notes; relays can actually delete it. ' +
            'However you can never be sure all relays to which your note got propagated do this. ' +
            'Pretty impossible to actually delete your note through the whole network.',
        bulletPoints: [
            'Courtesy of ',
            'npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats'
        ],
        createdAt: '2023-01-06',
        updatedAt: '2023-01-17',
        tags: ['Basics', 'Notes'],
        attachedNoteId: NOTES[3]
    },
    {
        id: 'deleting-accounts',
        issue: 'Deleting accounts',
        fix: 'You cannot delete on the protocol level. ' +
            'Some clients might allow you to delete your account, but they only mark it as deleted.',
        bulletPoints: [
            'You can `delete` your account on Damus in <i>Settings</i> by tapping on <i>Delete Account</i>.',
            'https://uselessshit.co/images/deleting-accounts.png'
        ],
        updatedAt: '2023-02-14',
        tags: ['Basics', 'Clients'],
        attachedNoteId: NOTES[24]
    },
    {
        id: 'sharing-notes',
        issue: 'Sharing notes.',
        fix: 'In some clients it\'s now possible to share notes between different apps. ' +
            'Simply tap on the Share icon under the post and choose a desired option.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-11',
        tags: ['Basics', 'Notes']
    },
    {
        id: 'reactions',
        issue: 'Reactions.',
        fix: 'Since Damus build 1.0.0-6 you can now see who liked your posts with the new reactions view.' +
            'Reactions can be viewed from the Thread screen.',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Clients', 'Damus']
    },
    {
        id: 'left-handers',
        issue: 'Left hand option for the post button.',
        fix: 'In the latest Damus build (1.0.0-6) it\'s now possible to move the post button to the left. ' +
            'To do that, go to Settings (tap on your pfp in top left corner to open side panel), ' +
            'scroll down to LEFT HANDED section and then tap on the toggle. Restart the app for the changes to take effect.',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Clients', 'Damus']
    },
    {
        id: 'banner-image',
        issue: 'Banner images.',
        fix: 'You can now set your own banner image. To achieve that, go to your profile, tap Edit and set the BANNER IMAGE ' +
            '(it has to be a direct image url). The banner image ratio should be ~ 3:1 (width:height). Also note that ' +
            'Damus does some auto-cropping so even though your image dimensions do not fit the ratio requirements, ' +
            'it can still be displayed properly. If you\'d like more control over what\'s ' +
            'being cropped off you can try the image processor linked below (alpha).',
        createdAt: '2023-01-14',
        updatedAt: '2023-01-15',
        urls: ['https://uselessshit.co/card-generator'],
        tags: ['Basics', 'Media', 'Damus']
    },
    {
        id: 'dms',
        issue: 'Are DMs on NOSTR private?',
        fix: '<b>Consider your DMs as public, not private! Never ever share any sensible data via DMs!</b><br/></br> ' +
            'All DMs are publicly visible. However, since they are all encrypted, they can only be read with your or your ' +
            'chat partners private key. If one of the two keys gets leaked, the full chat history is visible to the public. ' +
            'Since you do not have any control over the key management of your chat partner, you should be very cautious what information ' +
            'you share via DMs!',
        bulletPoints: [
            'Courtesy of ',
            'npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats'
        ],
        updatedAt: '2023-01-15',
        tags: ['Basics', 'Notes'],
        attachedNoteId: NOTES[4]
    },
    {
        id: 'dms-mirroring',
        issue: 'Do DMs on nostr disappear after certain time?',
        fix: '',
        bulletPoints: [
            'Answered by',
            'npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s:32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245:jb55',
            '"DMs may not be mirrored between relays, so they may get lost over time when relays disappear."'
        ],
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Notes'],
        attachedNoteId: NOTES[32]
    },
    {
        id: 'zaps',
        issue: 'WTF are zaps ⚡️?',
        fix: '',
        bulletPoints: [
            'https://uselessshit.co/images/zaps-definition.png',
            '1. to send unstoppable, ungovernable and permissionless money to a person or a group of people ' +
            'in a matter of seconds as an appreciation for their doings.',
            '<i>"I just zapped you 1k sats"</i>',
            '<i>"Thanks to whomever zapped me 69 sats"</i>',
            '<i>"Zapping is highly appeciated"</i>',
            'https://media.tenor.com/UcJMMDEAkOMAAAAS/big-trouble-in-little-china-raiden.gif',

            '#### Zapping people on NOSTR is a breeze.',
            'Most clients support zapping through profiles, whereas Damus, Amethyst and snort.social ' +
            'also allow for zapping through notes.',

            '#### This guide is for zapping on Damus.',

            '#### Zapping through profile',
            'Once on the profile view, look for a button with a lightning bolt symbol and tap it.',
            'https://uselessshit.co/images/zaps/zaps-06.png',
            'A new view should pop up, asking you to select the lightning wallet you\'d like to use for zapping.',
            'https://uselessshit.co/images/zaps/zaps-07.png',
            'Tap on the desired one and enter the amount you\'d like to send.',
            'https://uselessshit.co/images/zaps/zaps-08.png',
            'Tap on <i>DONE</i> and <i>OK</i> (for Wallet of Satoshi).',
            'https://uselessshit.co/images/zaps/zaps-09.png',
            'That\'s it!',
            '',
            '#### Zapping through a note',
            'Look for a lightning bolt under a specific note and tap it.',
            'https://uselessshit.co/images/zaps/zaps-01.png',
            'The lightning bolt should rotate 90 degrees and turn yellow.',
            'https://uselessshit.co/images/zaps/zaps-02.png',
            'Select the lightning wallet you\'d like to use for zapping.',
            'https://uselessshit.co/images/zaps/zaps-03.png',
            'The zap amount will be whatever you\'ve set in Damus <i>Settings</i> -> <i>DEFAULT ZAP AMOUNT IN SATS</i> (the default is 1k sats).',
            'https://uselessshit.co/images/zaps/zaps-04.png',
            'Tap on <i>Pay</i>.',
            'https://uselessshit.co/images/zaps/zaps-05.png',
            'Hoorey! You just zapped someone through a note!',

            // TODO: zaps on snort.social
        ],
        tags: ['Basics', 'Lightning', 'Zaps'],
        updatedAt: '2023-02-14',
        attachedNoteId: NOTES[25]
    },
    {
        id: 'receiving-zaps',
        issue: 'Receiving zaps ⚡',
        fix: 'With bitcoin and lightning it\'s easy to exchange value. ' +
            'Nostr protocol is where this can be seen in action. ' +
            'Make sure your profile is set up correctly and people can send you sats ' +
            'and you can experience the V4V magic first hand.' +
            '',
        bulletPoints: [
            '#### Instructions for setting up your profile to be able to receive sats',
            'You\'ll need a lightning wallet which supports LNURL pay.',
            '#### Some people put lightning invoices in their profile, which are one time only, thus aren\'t able to receive sats.',
            'Wallet of Satoshi for mobile (custodial) might be a good choice to get you started.',
            'For desktop/browser try Alby.',
            'Below instructions are for Wallet of Satoshi.',
            'To get your LNURL or lightning address, open WoS.',
            'Tap Receive.',
            'Make sure you select &nbsp;<i>Lightning Address</i>&nbsp; tab in the top right corner.',
            'Either click on &nbsp;<i>Copy</i>&nbsp; to use your lightning address (e-mail like)',
            'or on &nbsp;<i>QR Code</i>&nbsp; to use LNURL (start with LNURL...)',
            'Now navigate to your profile in the client where you\'re logged in.',
            'Tap &nbsp;<i>Edit</i>.',
            'Find BITCOIN LIGHTNING TIPS input (depends on the client; could be named differently)',
            'Paste the LNURL or lightning address into the input.',
            'Tap save.',
            'That\'s it!',
            'Now remember to test if it\'s working!',
            '-------------------------------',
            '#### Instructions for dropping a one time only lightning invoice.',
            'You can drop these in a note or a DM.',
            'Here are examples for a custodial and a non-custodial wallets and Damus client.',
            '#### Wallet of Satoshi',
            'https://uselessshit.co/images/lightning-invoice-wos.png',
            '#### Phoenix Wallet',
            'https://uselessshit.co/images/lightning-invoice-phoenix.png',
            'Then simply paste the lightning invoice into the note.',
            'https://uselessshit.co/images/lightning-invoice-damus.png',
            'Now someone will be able to pay that invoice.'

        ],
        imageUrls: [
            'https://uselessshit.co/images/receive-sats-with-lightning.jpeg'
        ],
        createdAt: '2022-12-26',
        updatedAt: '2022-02-03',
        tags: ['Basics', 'Lightning', 'Zaps'],
        attachedNoteId: NOTES[5]
    },
    {
        id: 'dropping-an-invoice',
        issue: 'Dropping lightning invoices',
        fix: 'Open a Lightning Wallet of your choice, click Receive, edit the amount and copy the Lightning Invoice. ',
        bulletPoints: [
            'Instructions for different wallets are pretty similar.',
            'Here\'s some examples',
            '#### Wallet of Satoshi',
            // '<i>Great for beginners. Custodial.</i>',
            'https://uselessshit.co/images/lightning-invoice-wos.png',
            '#### Phoenix Wallet',
            // '<i>More advanced. Self-custody.</i>',
            'https://uselessshit.co/images/lightning-invoice-phoenix.png',
            'Then simply paste the lightning invoice into the note.',
            'https://uselessshit.co/images/lightning-invoice-damus.png',
            'Now someone will be able to pay that invoice.',
            '<i>Some clients support dropping multiple invoices in a single note. Simply copy & paste lnurls, ' +
            'separated by spaces, into a new note.</i>'
        ],
        createdAt: '2022-12-26',
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Lightning'],
        attachedNoteId: NOTES[33]
    },
    {
        id: 'free-100-sats',
        issue: '#100SatsTheStandard',
        fix: '',
        bulletPoints: [
            '<i>Want to test out lightning on nostr and get free 100 sats?</i>',
            '',
            'Post a lightning invoice for 100 sats.',
            'Tag @bitcoinbull',
            'npub1gl23nnfmlewvvuz7xgrrauuexx2xj70whdf5yhd47tj0r8p68t6sww70gt:47d519cd3bfe5cc6705e32063ef39931946979eebb53425db5f2e4f19c3a3af5:bitcoinbull',
            'Watch the magic happen before your own eyes 🪄'
        ],
        createdAt: '2023-01-11',
        updatedAt: '2023-01-16',
        tags: ['Basics', 'Lightning']
    },
    {
        id: 'zaps-compatible-wallets',
        issue: '(NIP-57) Zaps compatible wallets',
        fix: 'All Lightning wallets can send Lightning tips on Nostr. Only the ones listed below are aware that Nostr exists ' +
            'and can communicate with Nostr, allowing for the Zap count on posts and profiles to increment.',
        bulletPoints: [
            'strike.army',
            'vida.page',
            'Bitcoin Jungle',
            'ln.tips (LightningTipBot)',
            'Geyser',
            'Bitcoin Beach',
            'Wallet of Satoshi',
            'stacker.news',
            'Alby',
            'ZBD',
            'Current (Client+Wallet)',
            'fountain.fm',
            '',
            'Courtesy of',
            'npub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:DerekRoss'
        ],
        updatedAt: '2023-03-06',
        tags: ['Basics', 'Lightning', 'Zaps'],
        attachedNoteId: NOTES[35]
    },
    {
        id: 'disable-allow-to-paste',
        issue: 'How to turn off \'Allow to paste\' prompt on iOS?',
        fix: '',
        bulletPoints: [
            'For a smoother experience, when interacting with nostr & lightning, you might want to disable the ' +
            '<i>Don\'t Allow Paste \ Allow Paste</i> prompt.',
            'https://uselessshit.co/images/deny-allow-prompt-01.jpeg',
            '#### Disabling the prompt on iOS',
            'You need to go to the wallet\'s of your choice settings, ' +
            'in your phone settings app (eg. <i>Settings</i> -> <i>Wallet of Satoshi</i>) and ' +
            'change <i>Paste from Other Apps</i> from the default to either <i>Deny</i> ' +
            'or <i>Allow</i>.',
            'https://uselessshit.co/images/deny-allow-prompt-02.png',
            'https://uselessshit.co/images/deny-allow-prompt-03.png',
        ],
        updatedAt: '2023-02-13',
        tags: ['Basics', 'Lightning', 'Wallets'],
    },
    {
        id: 'global-feed-filters',
        issue: 'Global Feed',
        fix: 'Nowadays, if you\'re using free relays, your global feed will likely be full of spam. ' +
            'With the raise of paid relays, came a solution to cut it out - the admission fee keeps the ' +
            'spammers at bay most of the times.',
        bulletPoints: [
            'If you\'d like to keep your global feed clean, you might want to add a bunch of paid relays to your relay list.',
            'Previously it would mean that you\'d have to drop some (or all) of the free relays.',
            'This would also mean that you wouldn\'t be able to see any profiles or notes that are stored on those relays.',
            'With the <i>Global Feed</i> filters you can take the advantage of subscribing to paid relays without losing any of your data.',

            '<i>Tip: The admission fee usually applies to write access, so you don\'t need to pay the fee if you only want your</i>' +
            ' <i>client to read the data from a paid relay.</i>',

            '#### Instructions for Global Feed filtering on Damus',
            'Once you have some paid relays added to your relay list, you can change the filters on the Global Feed ' +
            'to only show data from paid relays',
            'Go to <i>Global Feed</i> view and tap on the funnel symbol in the top right corner.',
            'https://uselessshit.co/images/global-feed-01.png',
            'Pick desired relays by them toggling on/off on the list that will show up.',
            'For a clean feed you might want to select paid relays only or experiment with different setups.',
            'https://uselessshit.co/images/global-feed-02.png',
            'Now you can enjoy a clean Global Feed.',
            'https://uselessshit.co/images/global-feed-03.png',
            '',
            'If you\'d like to keep Global Feed clean and still be able to see data from free relays, ',
            'you might want to consider adding a paid filter relay.',
            'Check out this link for more information.',
            'https://github.com/nostr-wine/filter-relay/blob/main/README.md'
        ],
        updatedAt: '2023-02-14',
        tags: ['Basics', 'Notes'],
        attachedNoteId: NOTES[26]
    },
    {
        id: 'starter-pack',
        issue: 'Nostr Starter Pack™️ 🔥',
        fix: 'Nostr is unlike any other place you know. At the heart of it are passionate individuals, ' +
            'with a simple mission to make this world a bit better place for everyone. ' +
            'When you first join nostr, you quickly notice it\'s unique vibe full of love and care.',
        bulletPoints: [
            'To get more familiar with the vibe on nostr, have a look at the <b>Starter Pack™️</b> by',
            'npub1lrnvvs6z78s9yjqxxr38uyqkmn34lsaxznnqgd877j4z2qej3j5s09qnw5:f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9:corndalorian',
            'https://uselessshit.co/images/nostr-starter-pack.jpeg',
            'These are a big part of the nostr history and its present.',
            'As you spend more time on nostr, you\'ll get to experience its essence in many different forms and have the freedom ' +
            'and power to shape its future.'
        ],
        createdAt: '2022-12-26',
        updatedAt: '2023-02-01',
        attachedNoteId: NOTES[9],
        tags: ['Stories']
    },
    {
        id: 'badges',
        issue: 'WTF are badges?',
        fix: '',
        bulletPoints: [
            '<i>Users MAY be awarded badges (but not limited to) in recognition, in gratitude, for participation, or in appreciation of a certain goal, task or cause.\n</i>',
            '<i> Users MAY choose to decorate their profiles with badges for fame, notoriety, recognition, support, etc., from badge issuers they deem reputable.</i>',
            'https://github.com/nostr-protocol/nips/blob/master/58.md#motivation',
            'https://uselessshit.co/images/badge-01.png',
            'Visit https://badges.page to create badges or to accept one you\'ve been awarded.',
            '<b>When you log in on browser, be sure to use a browser extension for security reasons!</b>',
            'nostrich.love badge:',
            'https://badges.page/b/naddr1qqxxummnw3exjcmgd3hhvegzyqqqqqazeqrkggc53ls4u0l47xpwqvzvlak7fxdr74844hlrkq2wvqcyqqq82wglxtgyl'
        ],
        updatedAt: '2023-03-06',
        tags: ['Basics', 'Badges']
    },
    {
        id: 'selecting-default-lightning-wallet',
        issue: 'How do I select a default wallet?',
        fix: 'Open Damus Settings, accessible through side panel, ' +
            'which can be opened through tapping on your profile picture in the left top corner.' +
            'Scroll down to WALLET SELECTOR section. ' +
            'The default wallet can be chosen from the list under "Select default wallet".',
        createdAt: '2023-01-06',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Lightning', 'Damus']
    },
    {
        id: 'dark-mode',
        issue: 'How to switch to dark mode?',
        fix: 'Set you iOS theme to dark.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-11',
        tags: ['Basics', 'Clients', 'Damus']
    },
    {
        id: 'clearing-cache',
        issue: 'How does one clear cache?',
        fix: 'Clear cache option is located in Settings (side panel, accessible through tapping on your pfp) under CLEAR CACHE section.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Clients', 'Damus']
    },
    {
        id: 'saving-images-to-library',
        issue: 'How to save an image posted by someone to my Library?',
        fix: 'Tap on the picture you want to save. In the newly opened window tap & hold on the image and select Save Image.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-11',
        tags: ['Basics', 'Media', 'Damus']
    },
    {
        id: 'who-to-follow',
        issue: 'Who to follow?',
        fix: 'Start with following yourself ⚡ (apparently you can\'t do than now in Astral). ' +
            'Next best step is to find a Bitcoiner and follow some plebs they\'re following. ' +
            'Also you can check under the hashtag #Plebchain or look at the profiles with the most followers at nostr.io',
        urls: ['https://nostr.io/stats', 'https://bitcoinnostr.com/lfg'],
        updatedAt: '2023-01-06'
    },
    {
        id: 'bitcoin-nostr',
        issue: 'Finding people on BitcoinNostr.com',
        fix: 'A list of prominent Bitcoiners that most plebs would want to follow when they get started on Nostr. ' +
            'This makes it very easy to do so, as you can just go down @BitcoinerInfo\'s "Following" list and add ' +
            'those Bitcoiners to your own list. ' +
            'The (identical) list on bitcoinnostr.com serves as a way to verify the authenticity of all the accounts (and as a backup)',
        updatedAt: '2023-01-06',
        urls: ['https://bitcoinnostr.com']
    },
    {
        id: 'finding-others',
        issue: 'Finding others.',
        fix: 'To find out if any of the people you follow on the bird app are on NOSTR as well, check out nostr.directory',
        urls: ['https://nostr.directory', 'https://twitter.com/search?q=%22verifying%20my%20account%20on%20nostr%22&f=live&pf=1'],
        updatedAt: '2023-01-02'

    },
    {
        id: 'uploading-to-nostr-build',
        issue: 'Uploading to nostr.build',
        fix: 'nostr.build is a nice place to upload your images. ' +
            'Check nostr.build/profilepic.html for profile picture uploads.' +
            'Be cautious when uploading images there as anyone can see them even without a direct link.',
        urls: ['https://nostr.build/', 'https://nostr.build/profilepic.html'],
        updatedAt: '2023-01-05',
        // tags: ['Media']
    },
    {
        id: 'markdown',
        issue: 'Using markdown in posts.',
        fix: 'Some of the markdown tags are supported by clients. Try formatting your posts with a guide at markdownguide.org',
        urls: ['https://markdownguide.org'],
        tags: ['Basics', 'Notes'],
        updatedAt: '2022-12-27'
    },
    {
        id: 'paid-relays',
        issue: 'Paid relays',
        fix: 'One of the promises of paid relays is to cut spam and provide better reliability.',
        bulletPoints: [
            '#### Instructions for gaining write access to a paid relay',
            '1. Add the desired relay(s) to your relay list. ',
            '2. You should receive a DM afterwards with a lightning invoice which you should pay to get admitted.',
            '3. If you didn\'t receive an invoice via DM, visit a given relay\'s website and take it from there (replace wss with https to get the url).',
            '<i>If you\'re using Damus, you can also find each relay\'s website url by tapping on it\'s name on the RELAYS view ' +
            '(after it\'s been added to your relay list).',
            '#### Fees are one time only (for now at least).',
            '<i>When using multiple nostr clients, it should be enough to update the relay list in a single client.</i>',
            '',
            '#### Paid relays',
            'wss://paid.spore.ws',
            '420 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://relay.nostriches.org',
            '421 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.milou.lol',
            '1,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://bitcoiner.social',
            '1,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://relay.nostrati.com',
            '2,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://relay.nostrich.land',
            '2,100 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.uselessshit.co',
            '2,169 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.ownscale.org',
            '4,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.naut.social',
            '4,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.rocketstyle.com.au',
            '4,242 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://relay.orangepill.dev',
            '4,500 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://eden.nostr.land',
            '5,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.inosta.cc',
            '5,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.howtobitcoin.shop',
            '5,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.bitcoinplebs.de',
            '5,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://relay.nostr.com.au',
            '6,969 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.plebchain.org',
            '6,969 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://bitcoiner.social',
            '7,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.decentony.com',
            '7,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.wine',
            '8,888 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://private.red.gb.net',
            '8,888 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://puravida.nostr.land',
            '10,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.gives.africa',
            '10,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr.bitcoinpuertori.co',
            '10,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://atlas.nostr.land',
            '15,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'wss://nostr-pub.semisol.dev',
            '15,000 <i class="fak fa-satoshisymbol-solidtilt" />',
            'Courtesy of',
            'npub10jnx6stxk9h4fgtgdqv3hgwx8p4fwe3y73357wykmxm8gz3c3j3sjlvcrd:7ca66d4166b16f54a16868191ba1c6386a976624f4634f3896d9b6740a388ca3:stacksatsio',
            'You will find an up to date list of paid relays at',
            'https://relay.exchange'
        ],
        updatedAt: '2023-03-06',
        tags: ['Lists', 'Relays'],
        attachedNoteId: NOTES[34]
    },
    {
        id: 'setting-up-a-paid-relay',
        issue: 'Setting up a paid relay',
        fix: 'Check out the link below for a guide on how to set up a paid nostr relay with Nostream and ZBD payment processor.',
        bulletPoints: [
            'https://andreneves.xyz/p/how-to-setup-a-paid-nostr-relay'
        ],
        updatedAt: '2023-02-09',
        tags: ['Tutorials', 'Relays']
    },
    {
        id: 'stats',
        issue: 'NOSTR stats',
        fix: 'Checking network and relay stats:',
        bulletPoints: [
            '#### nostr.band',
            'https://nostr.band/stats.html',
            'by',
            'npub1xdtducdnjerex88gkg2qk2atsdlqsyxqaag4h05jmcpyspqt30wscmntxy:3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd:brugeman',
            '#### nostr.io',
            'https://nostr.io',
            'by',
            'npub1mkq63wkt4v94cvq869njlwpszwpmf62c84p3sdvc2ptjy04jnzjs20r4tx:dd81a8bacbab0b5c3007d1672fb8301383b4e9583d431835985057223eb298a5:plantimals',
            '#### nostr.watch',
            'https://nostr.watch',
            'by',
            'npub1uac67zc9er54ln0kl6e4qp2y6ta3enfcg7ywnayshvlw9r5w6ehsqq99rx:e771af0b05c8e95fcdf6feb3500544d2fb1ccd384788e9f490bb3ee28e8ed66f:sandwich',
            'Courtesy of',
            'npub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa:51c059f3cc1802997fe1c4e60d6315c22079a025823256160ac7bfc1bca7c2d7:BitcoinNostrich'
        ],
        updatedAt: '2023-02-05',
        tags: ['Lists', 'Stats']
    },
    {
        id: 'twitter-nostr-migration',
        issue: 'Twitter 👉 NOSTR migration',
        fix: 'A quick guide on how to find out who from you twitter followers is already on nostr and how to add them to your list.',
        bulletPoints: [
            '1. Verify yourself in ',
            'https://nostr.directory',
            '2. Use the Snort client and go to ',
            'https://snort.social/new',
            '3. Insert your twitter handle and see a list of your twitter followers who are also on nostr.',
            '4. Follow with 1 button press or follow one by one.',
            '<i>If you used this successfully, spread wide to others so that we can find each other and make it easier to drop twitter altogether.</i>',
            'Courtesy of',
            'npub1sqaxzwvh5fhgw9q3d7v658ucapvfeds3dcd2587fcwyesn7dnwuqt2r45v:803a613997a26e8714116f99aa1f98e8589cb6116e1aaa1fc9c389984fcd9bb8:Nakadai',
        ],
        urls: [
            'https://nostr-twit.glitch.me'
        ],
        updatedAt: '2023-02-09',
        tags: ['Tutorials', 'Snort']
    },
    {
        id: 'adding-more-relays',
        issue: 'The content won\'t load or loads extremely slow.',
        fix: 'You can find a list of public relays at nostr.watch and add some more items to RELAYS section of your Settings. ' +
            'You might also want to check the RECOMMENDED RELAYS section and pick up some from there.',
        urls: ['https://nostr.watch'],
        createdAt: '2022-12-30',
        updatedAt: '2022-01-11',
        tags: ['Basics', 'Clients', 'Troubleshooting']
    },
    {
        id: 'too-many-relays',
        issue: 'The NOSTR client I\'m using seems to use up a lot of bandwidth.',
        fix: 'While having more relays added in your SETTINGS will make your client fetch the data faster, ' +
            'resulting in better experience, ' +
            'having too many relays could be an issue as well. Be cautious when using a mobile internet with limited bandwidth ' +
            'and try limiting the amount of relays to well under 10.',
        updatedAt: '2023-01-02',
        tags: ['Basics', 'Clients', 'Troubleshooting']
    },
    {
        id: 'removing-relays',
        issue: 'How to remove a relay?',
        fix: 'In your SETTINGS view (side panel - to open it tap on your pfp in the left top corner), swipe left on a relay you\'d ' +
            'like to remove and click on the trash icon to confirm removal. ' +
            'You might want to restart the client for the changes to take place.',
        createdAt: '2022-12-30',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Clients']
    },
    {
        id: 'nip-05',
        issue: 'How to setup NIP-05 identifier (checkmark)?',
        fix: 'Check out these explainers on setting up a NIP-05 identifier below. ' +
            'If you don\'t own a domain you can ask someone to create an id for you at their domain (for free or a small fee). ' +
            'Check out <i>Free NIP-05 handles</i> and <i>Paid NIP-05 providers</i> sections for more info.',
        bulletPoints: [
            'npub1pvuugp6fyj6t6yeq9ajzv28p54w07sg6jpxvzuu5yc7qmu9edpkqm2d7a5:0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c:MainStreetChungs',
            'https://mainstreetchungus.com/nostr-nip-05-verification/',
            '#### metasikander',
            'https://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e',
            'npub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8:e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411:NVK',
            'https://nvk.org/n00b-nip5',
            'Once you got your handle, you need update your profile.',
            '',
            '#### Updating profile on Damus',
            '<i>Note NIP-05 VERIFICATION input</i>',
            'https://uselessshit.co/images/nip05-01.png'
        ],
        createdAt: '2023-03-01',
        updatedAt: '2023-01-25',
        tags: ['Tutorials', 'NIP-05']
    },
    {
        id: 'free-nip-05',
        issue: 'Free NIP-05 handles.',
        fix: 'Looking for a free NIP-05 handle? Check out your options below 😎',
        bulletPoints: [
            '#### orangepill.dev',
            'npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox',
            '#### bitcoinnostr.com',
            'npub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa:51c059f3cc1802997fe1c4e60d6315c22079a025823256160ac7bfc1bca7c2d7:BitcoinerInfo',
            '#### satoshivibes.com',
            'npub138guayty78ch9k42n3uyz5ch3jcaa3u390647hwq0c83m2lypekq6wk36k:89d1ce9164f1f172daaa9c784153178cb1dec7912bf55f5dc07e0f1dabe40e6c:lukeonchain',
            '#### nostr.industries',
            'https://nostr.industries',
            '#### stacker.news',
            'https://stacker.news',
            '#### getalby.com',
            'https://getalby.com',
            '#### bitpaint.club',
            'npub1t8makd5nzwt36nym6j4mrn9dkv4cn43m24tqy8rxv34v3gflxwjqkqlw4s:59f7db369313971d4c9bd4abb1ccadb32b89d63b5556021c66646ac8a13f33a4:bitpaint',
            '#### Nostr-Check.com',
            'npub1mhamq6nj9egex0xn0e8vmvctrpj0ychehddadsketjlwl3eg7ztqrv9a4h:ddfbb06a722e51933cd37e4ecdb30b1864f262f9bb5bd6c2d95cbeefc728f096:',
            'https://nostr-check.com',
            '#### lnmarkets.com',
            'https://lnmarkets.com',
            '#### hitchhikersguidethroughthemetaverse.info',
            'npub132vp7xhrl2enqz65338jqe2vkrcax5zf339kdpymw059gcqpmjsq6fm80g:8a981f1ae3fab3300b548c4f20654cb0f1d350498c4b66849b73e8546001dca0:WShakesp',
            '#### Verified-Nostr.com',
            'https://verified-nostr.com',
            '#### NostrCheck.me',
            'https://nostrcheck.me',
            '#### uselessshit.co',
            'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited'
        ],
        updatedAt: '2023-03-24',
        attachedNoteId: NOTES[28],
        tags: ['Lists']
    },
    {
        id: 'paid-nip-05-providers',
        issue: 'Paid NIP-05 providers.',
        fix: 'Here\'a list of NIP-05 providers that charge for setting up handles with them.',
        bulletPoints: [
            '#### nostrplebs.com',
            'https://nostrplebs.com',
            '#### satoshis.lol',
            'https://satoshis.lol',
            '#### plebs.place',
            'https://plebs.place',
            '#### nostrverified.com',
            'https://nostrverified.com',
            '#### no.str.cr',
            'https://no.str.cr/verify.html',
            '#### Verified-Nostr.com',
            'https://verified-nostr.com',
            '#### nostrich.love',
            'https://uselessshit.co/nostr/nip-05/'
        ],
        updatedAt: '2023-03-01',
        attachedNoteId: NOTES[27],
        tags: ['Lists']
    },
    {
        id: 'lnurlp-with-alby',
        issue: 'How to turn my NIP-05 handle into lightning address? (Alby)',
        fix: 'Navigate to the url below to make your NIP-05 handle a lightning address (Alby). ' +
            'If you\'d like a lightning address @uselessshit.co let me know (see Contact)',
        urls: ['https://nvk.org/alby-lnurlp'],
        createdAt: '2023-01-10',
        updatedAt: '2023-01-11',
        tags: ['Tutorials']
    },
    {
        id: 'lnurlp-with-wos',
        issue: 'How to turn NIP-05 handle into lightning address? (WoS)',
        fix: '',
        createdAt: '2023-01-13',
        updatedAt: '2023-01-15',
        bulletPoints: [
            'Create an empty file accessible at https://yourdomain.tld/.well-known/lnurlp/your-username',
            'If you\'re running Apache, in your .htaccess file add the following: ',
            'Redirect /.well-known/lnurlp/your-username https://walletofsatoshi.com/.well-known/lnurlp/your-WoS-usernname ',
            'eg. Redirect /.well-known/lnurlp/pitiunited https://walletofsatoshi.com/.well-known/lnurlp/furiouschina21',
            'There\'re other means of achieving the same result on Apache (like editing the conf file).',
            'If you\'d like to learn more or you\'re using Nginx,',
            'npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:EzoFox',
            'got you covered (link below).'
        ],
        urls: ['https://orangepill.dev/lightning-guides/guide-to-create-lnaddress-redirection-on-your-domain/'],
        tags: ['Tutorials']
    },
    {
        id: 'grey-and-purple-checkmarks',
        issue: 'What\'s the difference between grey and purple checkmark?',
        fix: 'People you aren\'t following have grey checkmarks, whereas the ones you follow have purple checkmarks.',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-17',
        // tags: ['Basics', 'Damus']
    },
    {
        id: 'finding-others-by-npub-only',
        issue: 'How to find someone by their npub?',
        fix: '',
        bulletPoints: [
            '#### Damus',
            'On Damus, simply copy the npub of the person you\'re looking for and paste it into the search bar ' +
            '(available on the search tab).',
            'You should be able to visit the profile by tapping on <i>Goto profile npub...</i>',
            '#### snort.social',
            'On Snort, simply go to https://snort.social/p/pubkey ' +
            '(replace pubkey with the npub of the person you\'re looking for).'
        ],
        updatedAt: '2023-01-27',
        // tags: ['Damus', 'Snort']
    },
    {
        id: 'blocking-users',
        issue: 'How do I block users?',
        fix: 'Similarly to how your notes cannot be deleted on a protocol level (but rather flagged as deleted), ' +
            'blocking can be performed on the client level only.',
        bulletPoints: [
            '#### Blocking a user on Damus',
            'To block a user, you can either tap & hold on a note of the user you want to block, until a menu shows up',
            'https://nostr.build/i/nostr.build_8fed7311c247547176e701d2621dd49f4395a24e50105e008546de93dd24bb45.png',
            'OR go to their profile and tap on the three dots next to the pfp.',
            'https://nostr.build/i/nostr.build_60863c8a9262c4dee988b650fe6acdd15e8fb179254e50d9c86fe32d4a525c48.png',
            'From the menu, select <i>Block</i>',
            'Confirm your choice.',
            'https://nostr.build/i/nostr.build_cca50d4af67b33130656cb7a6df37981124433a2b695337bcc888760584d3635.png',
            'If that\'s your first time blocking someone, a prompt asking to create a new mutelist will pop up.',
            'https://nostr.build/i/nostr.build_012ad9815bb8b12293078b8781a8b6d940146a8bee4e9d135641e3a1ed32cfbd.png',
            '#### Unblocking',
            'Open the side panel by clicking on your pfp in the top left corner.',
            'https://nostr.build/i/nostr.build_2527fd237c0c07d5983ffcc8d1266a33caf1662a2636a98d33e8e4b88b4ae35f.png',
            'Tap on <i>Blocked</i>.',
            'https://nostr.build/i/nostr.build_ba5f222efa67659b6674b56a30d5a077ceb1f410d41bf6bd53b8149b36d889c9.png',
            'Find the user you\'d like to unblock.',
            'Swipe left and tap the delete icon that will show up.',
            'https://nostr.build/i/nostr.build_41b6ee72193f5debf7d1a4e5731440b69a679778a1a75a9668c8163c9d363806.png'
        ],
        updatedAt: '2023-01-27',
        tags: ['Basics', 'Clients'],
        attachedNoteId: NOTES[29]
    },
    {
        id: 'running-nostr',
        issue: 'How do I setup my own NOSTR relay?',
        fix: 'Check out the resources below to set up a Nostr relay in under 5 minutes.',
        urls: ['https://github.com/Cameri/nostream', 'https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under'],
        createdAt: '2022-12-30',
        updatedAt: '2023-01-09',
        tags: ['Tutorials']
    },
    {
        id: 'converting-nostr-keys',
        issue: 'How to convert my npub key to hex format (or hex back to npub)?',
        fix: '',
        bulletPoints: [
                '#### (Beginner) Try this online tool to convert your npub key to hex format.',
                'https://damus.io/key/',
                '#### (Advanced) Command line users can try \"key-convertr\" tool instead (it also converts \"hex back to npub\" for other use cases).',
                'https://github.com/rot13maxi/key-convertr',
            ],
        updatedAt: '2023-01-17',
        attachedNoteId: NOTES[30],
        tags: ['Tutorials']
    },
    {
        id: 'security-and-privacy-tips',
        issue: 'Security and Privacy tips.',
        fix: '',
        urls: ['https://ron.stoner.com/nostr_Security_and_Privacy/'],
        updatedAt: '2022-12-30',
        attachedNoteId: NOTES[31],
        tags: ['Tutorials']
    },
    {
        id: 'blurred-images',
        issue: 'Some images are blurred. Need to click on the image to see it. What\'s up?',
        fix: 'You can only see images from the people you\'re following, the remaining ones come up blurred.',
        updatedAt: '2022-12-30',
        tags: ['Basics', 'Clients', 'Troubleshooting']
    },
    {
        id: 'reposting-issues',
        issue: 'I can\'t repost (previously boost).',
        fix: 'Sometimes it\'s not possible to repost a note from a feed. ' +
            'The workaround is to open a given thread and repost the note from there.',
        createdAt: '2023-01-09',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Clients', 'Troubleshooting']
    },
    {
        id: 'bookmarks',
        issue: 'Bookmarks',
        fix: 'Starting Damus 1.1.0 (9), you can bookmark notes.',
        bulletPoints: [
            'To bookmark a given note, tap and hold on its content.',
            'From the menu that will show up, select <i>Add Bookmark</i>.',
            'https://uselessshit.co/images/bookmarks-01.png',
            'You can see all bookmarked notes from the side menu (which you can open by clicking on your pfp) -> <i>Bookmarks</i>.',
            'https://uselessshit.co/images/bookmarks-02.png',
            'https://uselessshit.co/images/bookmarks-03.png'
        ],
        updatedAt: '2023-03-01',
        tags: ['Basics', 'Clients', 'Damus']
    },
    {
        id: 'more-resources',
        issue: 'Additional NOSTR resources.',
        fix: 'Check out the urls listed below for additional resources.',
        urls: [
            'https://gist.github.com/dergigi/1ee8dc7e3da4b6572ed785ab24bc9907',
            'https://medium.com/@ValentinNagacevschi/nosrt-an-introduction-ab946879a727',
            'https://www.btctimes.com/news/what-is-nostr-and-how-do-i-use-it',
            'https://github.com/vishalxl/nostr_console/discussions/31',
            'https://wiki.wellorder.net/post/nostr-intro/',
            'https://t.me/NostrTalk/73'
        ],
        updatedAt: '2023-01-02',
        tags: ['Lists', 'Resources']
    },
    {
        id: 'contact',
        issue: 'Didn\'t find what you\'ve been looking for?',
        fix: 'I\'m trying to keep this guide up to date. If you happen to find something missing or outdated, let me know. ' +
            'Also, since you\'re here, ' +
            'you may also want to check our bitcoin resources page for a list of Bitcoiners, bitcoin books, pods, apps ' +
            '& wallets.',
        bulletPoints: [
            'Go ahead and DM/tag me on nostr 🤙 ',
            'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited'
        ],
        urls: ['https://uselessshit.co/resources/bitcoin'],
        createdAt: '2022-12-29',
        updatedAt: '2023-01-16',
        tags: ['Contact']
    }
];