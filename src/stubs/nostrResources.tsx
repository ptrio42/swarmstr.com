import {Guide} from "../components/Resources/NostrResources/NostrResources";

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
    '2840a196b4128d685345400072dff72199f62256cce159bf2c261fccf85067d1'
    // 'a508a7fa14bc308487737af8d1756155cf615483ae65c39f5845aa310b6e3cca',
    // '62fa89e3ed6e50ebaeae7f688a5229760262e6ccf015ab7accb46d1e944ef030',
    // 'da34ae690b22309caf65f1b5974f8f02e2924350e9ca703f5594df82f57139ac',
    // '5c3b9ddb6d87425826af78ae6014f276bb034f9aa7b2c6833af9d0da37a4e73a',
    // '0e8bdc70e99cbe7fdd8400d2192f82a692399f706879270b98c493f834585692',
    // 'a54309bd0b66be5e05416221cf3f2e5557e2876899bb5d6d2965a3f0bf555582',
    // '17f615a2b82640553ca7f5ea6fb417cf5b7e66be854d0e6f683d539174ec772a',
    // '08db8334578b5571cad7cc849f934b27b98019a3bf008a5a417b1468df9be71a',
    // '07f82ffd55cb4e0acf3f956ca1b18239a1a265cd4918e3cdc3a1244f37a6404d',
    // '5222361b78833d775dfb6a47e6dc0b5fbc761c4c11e34ce0315f5dd4bec0a318',
];

export const PUBKEYS = [
    '000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6',
    'ddfbb06a722e51933cd37e4ecdb30b1864f262f9bb5bd6c2d95cbeefc728f096',
    '0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c',
    'e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411',
    'c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11',
    'f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9',

];

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
            '#### More Resources',
            'https://github.com/vishalxl/nostr_console/discussions/31',
            'https://wiki.wellorder.net/post/nostr-intro/',
            'https://audaciousdenizen.substack.com/p/my-quick-guide-to-nostr',
            '',
            'Image credits: @coderjourney1'
        ],
        createdAt: '2023-01-09',
        updatedAt: '2023-01-23',
        imageUrls: ['https://uselessshit.co/images/explain-it-to-me-like-i-m-5.png'],
        attachedNoteId: NOTES[1],
        tags: ['Basics', 'Essentials']
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
            'https://github.com/nostr-protocol/nostr#how-does-nostr-work'
        ],
        tags: ['Basics', 'Essentials'],
        updatedAt: '2023-02-01'
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
        tags: ['Basics', 'Clients']
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
        tags: ['Basics', 'Relays']
    },
    {
        id: 'the-list',
        issue: 'People involved in NOSTR',
        fix: 'Following and zapping ⚡️ them is highly adviseable especially if you use their product!\n' +
            '\n' +
            'Forgive me if I you are not included. Add yourself in the comments with your project\'s name and github or just shoot me a DM and I will make sure you will be added.\n' +
            'Let me know if anything is wrong or missing and I will change it.',
        updatedAt: '2023-01-18',
        bulletPoints: [
            '#### List put together by',
            'npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats',
            '#### Nostr creator',
            'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:fiatjaf',
            'https://github.com/fiatjaf',
            '#### Damus',
            'npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s:32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245:jb55',
            'https://github.com/jb55',
            'npub13prsf02zzus79yhdhl6zadm4gllpzhr0lxp9kz8uxe47fntfa8mqyrh6a9:884704bd421721e292edbff42eb77547fe115c6ff9825b08fc366be4cd69e9f6:0xlt',
            'https://github.com/0xtlt/',
            'npub1jutptdc2m8kgjmudtws095qk2tcale0eemvp4j2xnjnl4nh6669slrf04x:971615b70ad9ec896f8d5ba0f2d01652f1dfe5f9ced81ac9469ca7facefad68b:BenGWeeks',
            'https://github.com/BenGWeeks',
            'npub146e625cxmwc93c8jpw5p0slkrna4t0j3lmzu94g07tkrrqg0staqjup4e0:aeb3a55306dbb058e0f20ba817c3f61cfb55be51fec5c2d50ff2ec31810f82fa:sdub',
            'https://github.com/sdub18',
            'npub1yaul8k059377u9lsu67de7y637w4jtgeuwcmh5n7788l6xnlnrgs3tvjmf:2779f3d9f42c7dee17f0e6bcdcf89a8f9d592d19e3b1bbd27ef1cffd1a7f98d1:tyiu',
            'https://github.com/tyiu',
            'npub107e29x735swe4r9y8gv60h8n4pfz7x7qndqgvff48yvsa8pfc5dq3p0cr5:7fb2a29bd1a41d9a8ca43a19a7dcf3a8522f1bc09b4086253539190e9c29c51a:olegaba',
            'https://github.com/OlegAba',
            'npub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt:2f4fa408d85b962d1fe717daae148a4c98424ab2e10c7dd11927e101ed3257b2:Klabo',
            'https://github.com/joelklabo/',
            'npub1uqeexjx2djkfwzxdnrnrrch5h2k4xn0uapcgsxm94ftaxrlhy5lqywjckg:e0339348ca6cac9708cd98e631e2f4baad534dfce870881b65aa57d30ff7253e:jsm',
            'https://github.com/realprogrammersusevim',
            '#### nostream, SMTP Nostr Gateway, Tnsor',
            'npub1qqqqqqyz0la2jjl752yv8h7wgs3v098mh9nztd4nr6gynaef6uqqt0n47m:00000000827ffaa94bfea288c3dfce4422c794fbb96625b6b31e9049f729d700:cameri',
            'https://github.com/cameri',
            '#### iris.to',
            'npub1g53mukxnjkcmr94fhryzkqutdz2ukq4ks0gvy5af25rgmwsl4ngq43drvk:4523be58d395b1b196a9b8c82b038b6895cb02b683d0c253a955068dba1facd0',
            'https://github.com/mmalmi',
            '#### yosupp.app',
            'npub1klrxeehhh0srf6ttu4xzllq2ma334zy6hsyrfws5xyt3ke7y3x4qze9lh3:b7c66ce6f7bbe034e96be54c2ffc0adf631a889abc0834ba1431171b67c489aa:Thomas',
            'https://github.com/tmathews',
            'https://git.sr.ht/~tomtom/damus',
            '#### astral.ninja',
            'npub13sx6fp3pxq5rl70x0kyfmunyzaa9pzt5utltjm0p8xqyafndv95q3saapa:8c0da4862130283ff9e67d889df264177a508974e2feb96de139804ea66d6168:monlovesmango',
            'https://github.com/monlovesmango',
            '#### reddit / nostr.rocks / nostr.chat / git + nostr',
            'npub1melv683fw6n2mvhl5h6dhqd8mqfv3wmxnz4qph83ua4dk4006ezsrt5c24:de7ecd1e2976a6adb2ffa5f4db81a7d812c8bb6698aa00dcf1e76adb55efd645',
            'https://github.com/melvincarvalho',
            '#### snort.social',
            'npub1v0lxxxxutpvrelsksy8cdhgfux9l6a42hsj2qzquu2zk7vc9qnkszrqj49:63fe6318dc58583cfe16810f86dd09e18bfd76aabc24a0081ce2856f330504ed:Kieran',
            'https://github.com/v0l',
            'npub107jk7htfv243u0x5ynn43scq9wrxtaasmrwwa8lfu2ydwag6cx2quqncxg:7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194:verbicha',
            'https://github.com/verbiricha',
            'npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac:1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411:Karnage',
            '#### blend',
            'npub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:semisol',
            'https://github.com/semisol',
            '#### Amethyst App',
            'npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z:460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c:vitorpamplona',
            'https://github.com/vitorpamplona',
            '#### Bija',
            'npub1qqqqqqqut3z3jeuxu70c85slaqq4f87unr3vymukmnhsdzjahntsfmctgs:000000001c5c45196786e79f83d21fe801549fdc98e2c26f96dcef068a5dbcd7:CarlosAutonomous',
            'https://github.com/BrightonBTC',
            '#### Daisy',
            'npub1e0usfsrs9gmpjywyd4un0xn22q4u80gtf3tdy5ufuckna0620kuq5w732v:cbf904c0702a361911c46d79379a6a502bc3bd0b4c56d25389e62d3ebf4a7db8:neb_b',
            'https://github.com/neb-b',
            '#### hamstr.to',
            'npub1duedmhed2nevtejwz4c2hjuu0gz7spqm4s8wnaprta55ln9k3dwssvgpq4:6f32dddf2d54f2c5e64e1570abcb9c7a05e8041bac0ee9f4235f694fccb68b5d:styppo',
            'https://github.com/styppo',
            '#### nostrid.app',
            'npub14uc57wfq2zd0g3qh5lpvkq2svvkjl9fruzyxnz9zh95ev2japw7ql2g0sq:af314f3920509af44417a7c2cb0150632d2f9523e0886988a2b969962a5d0bbc:lapulpeta',
            'https://github.com/lapulpeta',
            '#### nostros',
            'npub1v3tgrwwsv7c6xckyhm5dmluc05jxd4yeqhpxew87chn0kua0tjzqc6yvjh:645681b9d067b1a362c4bee8ddff987d2466d49905c26cb8fec5e6fb73af5c84:KoalaSat',
            'https://github.com/KoalaSat',
            '#### nostr.console',
            'npub1xg6sx67sj47lkf7vmgpdg5khca3musxfrgdvpq46dxpmy53c8zxqqy7kwr:3235036bd0957dfb27ccda02d452d7c763be40c91a1ac082ba6983b25238388c:vishalxl',
            'https://github.com/vishalxl',
            'npub14j0vqgqhq92lpl4nglcdwalwtlpcm50nvdfsjvzxxgmydnl4z60sdv04f4:ac9ec020170155f0feb347f0d777ee5fc38dd1f36353093046323646cff5169f:radixrat',
            'https://github.com/radixrat/',
            '#### Coracle',
            'npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn:97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322:hodlbod',
            'https://github.com/staab/coracle',
            '####  Blockcore Notes',
            'npub1zl3g38a6qypp6py2z07shggg45cu8qex992xpss7d8zrl28mu52s4cjajh:17e2889fba01021d048a13fd0ba108ad31c38326295460c21e69c43fa8fbe515:sondreb',
            'https://github.com/sondreb',
            '#### nostroid',
            'npub1gm7tuvr9atc6u7q3gevjfeyfyvmrlul4y67k7u7hcxztz67ceexs078rf6:46fcbe3065eaf1ae7811465924e48923363ff3f526bd6f73d7c184b16bd8ce4d:Giszmo',
            'https://github.com/Giszmo',
            '#### nostriushand',
            'npub1axvv6p3e6qt8ldca8lxpc9qdccjp7degsn2l6vqthmy4ugrpvw6s63ksnl:e998cd0639d0167fb71d3fcc1c140dc6241f372884d5fd300bbec95e206163b5:Tertiushand',
            'https://github.com/tertiushand',
            '#### gossip',
            'npub1acg6thl5psv62405rljzkj8spesceyfz2c32udakc2ak0dmvfeyse9p35c:ee11a5dff40c19a555f41fe42b48f00e618c91225622ae37b6c2bb67b76c4e49:MichaelDilger',
            'https://github.com/mikedilger',
            '#### nostrimg.com',
            'npub1xv6axulxcx6mce5mfvfzpsy89r4gee3zuknulm45cqqpmyw7680q5pxea6:3335d373e6c1b5bc669b4b1220c08728ea8ce622e5a7cfeeb4c0001d91ded1de:henry',
            'https://github.com/michaelhall923',
            '#### joinstr',
            'npub1v6qjdzkwgaydgxjvlnq7vsqxlwf4h0p4j7pt8ktprajd28r82tvs54nzyr:6681268ace4748d41a4cfcc1e64006fb935bbc359782b3d9611f64d51c6752d9',
            'https://github.com/1440000bytes/',
            '#### alphaama',
            'npub1nmr6w7qk0ta36vxysv77jv3d5rqghfc6d8sez8240rf3gja4vsmsd2yha8:9ec7a778167afb1d30c4833de9322da0c08ba71a69e1911d5578d3144bb56437:balas',
            'https://github.com/eskema',
            '#### nostr.lib / client',
            'npub1qqqqq2z444usdf6k306djuwcyptfjj4x0teu7qzg4qj5zkkfqeeq3hlwh5:0000002855ad7906a7568bf4d971d82056994aa67af3cf0048a825415ac90672:Sgiath',
            'https://github.com/Sgiath',
            '#### nostr-lib',
            'npub1alyr7qwglvcfmukgse4cc7fyej9k7pvq4lw7r4hpdc4kzp7zsckqmy0qkx:efc83f01c8fb309df2c8866b8c7924cc8b6f0580afdde1d6e16e2b6107c2862c:roosoft',
            'https://github.com/RooSoft',
            '#### nostr-rs-relay',
            'npub1xhfxu35se0s63x90v8xr29txr66l5a3m277skshy2zvu3ve0658sla4xw3:35d26e4690cbe1a898af61cc3515661eb5fa763b57bd0b42e45099c8b32fd50f:scsibug',
            'https://github.com/scsibug',
            '#### nostr-rs-sdk',
            'npub1drvpzev3syqt0kjrls50050uzf25gehpz9vgdw08hvex7e0vgfeq0eseet:68d81165918100b7da43fc28f7d1fc12554466e1115886b9e7bb326f65ec4272:yuki',
            'https://github.com/yukibtc',
            '#### nostr-ruby',
            'npub10000003zmk89narqpczy4ff6rnuht2wu05na7kpnh3mak7z2tqzsv8vwqk:7bdef7be22dd8e59f4600e044aa53a1cf975a9dc7d27df5833bc77db784a5805:dtonon',
            'https://github.com/dtonon',
            '#### Lee Salminen',
            'npub1taycl7qfuqk9dp0rhkse8lxhz3az9eanjug8j4ympwehvslnetxqkujg5y:5f498ff809e02c5685e3bda193fcd7147a22e7b3971079549b0bb37643f3cacc:lee',
            'https://github.com/leesalminen',
            '#### emon.chat',
            'npub1xfpn52slhcz8rcwc6vg5px6cmrj5zu3twcm0z9nleq6fqgj825ts78h0sd:32433a2a1fbe0471e1d8d311409b58d8e541722b7636f1167fc8349022475517:Sebastiaan',
            'https://github.com/SebastiaanWouters',
            '#### nostr-relay',
            'npub14lu6nuqh7v4jazmqw49yzqkmnkw0nletjeuqfdgwqurcp2j9ex5qz37m8m:aff9a9f017f32b2e8b60754a4102db9d9cf9ff2b967804b50e070780aa45c9a8:aaron',
            'https://github.com/atdixon/me.untethr.nostr-relay',
            '#### Bitcoin & Nostr Art',
            'npub1z4m7gkva6yxgvdyclc7zp0vz4ta0s2d9jh8g83w03tp5vdf3kzdsxana6p:1577e4599dd10c863498fe3c20bd82aafaf829a595ce83c5cf8ac3463531b09b:yegorpetrov',
            'npub1qv0nc6gxr80sgredulxm7g6zm6z9gp4ns9nudq6mfxq0ed87gsnq7wswaz:031f3c690619df040f2de7cdbf2342de845406b38167c6835b4980fcb4fe4426:BitcoinImagined',
            'npub19v2e3xgzwa7xydw7k7ky9tngjcmtnpqgpctzvl9ak3v37mkn54js988kdv:2b15989902777c6235deb7ac42ae689636b984080e16267cbdb4591f6ed3a565:rabbinstein',
            '#### nostr.band',
            'npub1xdtducdnjerex88gkg2qk2atsdlqsyxqaag4h05jmcpyspqt30wscmntxy:3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd:brugeman',
            'https://github.com/brugeman',
            '#### nostrplebs.com',
            'npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424:3f770d65d3a764a9c5cb503ae123e62ec7598ad035d836e2a810f3877a745b24:derekross',
            'https://github.com/derekross',
            'npub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:semisol',
            '#### nostr.io',
            'npub1mkq63wkt4v94cvq869njlwpszwpmf62c84p3sdvc2ptjy04jnzjs20r4tx:dd81a8bacbab0b5c3007d1672fb8301383b4e9583d431835985057223eb298a5:plantimals',
            'https://github.com/plantimals',
            '#### nostr.directory',
            'npub1xhe9408d5hm3dpwax78sy9nuc5warycnvcy4r3qzv6jacwu26r6s5m56yf:35f25abceda5f71685dd378f02167cc51dd19313660951c40266a5dc3b8ad0f5',
            'https://github.com/pseudozach',
            '#### orangepill.dev',
            'npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox',
            'https://github.com/Sakhalinfox',
            '#### nostr.build',
            'npub1nxy4qpqnld6kmpphjykvx2lqwvxmuxluddwjamm4nc29ds3elyzsm5avr7:9989500413fb756d8437912cc32be0730dbe1bfc6b5d2eef759e1456c239f905:nostr.build',
            'https://github.com/nostrbuild',
            '#### camelus.app',
            'npub1w9llyw8c3qnn7h27u3msjlet8xyjz5phdycr5rz335r2j5hj5a0qvs3tur:717ff238f888273f5d5ee477097f2b398921503769303a0c518d06a952f2a75e',
            'https://camelus.app/',
            '',
            'https://github.com/leo-lox/',
            'npub1cldxy9f5shk0kxm90yk8nn3lum7wdmta3m6ndjcjr4aqcuewjt0sx3rps5:c7da62153485ecfb1b65792c79ce3fe6fce6ed7d8ef536cb121d7a0c732e92df:dave',
            'https://github.com/davestgermain/nostr_relay',
            'https://github.com/davestgermain/aionostr',
            '',
            'npub148jmlutaa49y5wl5mcll003ftj59v79vf7wuv3apcwpf75hx22vs7kk9ay:a9e5bff17ded4a4a3bf4de3ff7be295ca85678ac4f9dc647a1c3829f52e65299:LiranCohen',
            'https://github.com/LiranCohen',
            '',
            'npub1x8dzy9xegwmdk2vy30l8u08caspcqq2yzncxehdsa6kvnte9pr3qnt8pg4:31da2214d943b6db29848bfe7e3cf8ec0380014414f06cddb0eeacc9af2508e2:solobalbo',
            '#### nostore',
            'npub19pw5egjuhcsfsv42zkjtjs6nhpm69lnv8w2dacdyez7rvacrqnds6xjtwk:285d4ca25cbe209832aa15a4b94353b877a2fe6c3b94dee1a4c8bc36770304db:Ryan',
            'https://github.com/ursuscamp/nostore',
            '#### nostr-resources.com',
            'npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc:6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93:dergigi',
            '#### nostrgram.co',
            'npub1t9a59hjk48svr8hz6rx727ta6kx53n5d6fw8x26vsua0zytpl87sa6h4uw:597b42de56a9e0c19ee2d0cde5797dd58d48ce8dd25c732b4c873af11161f9fd:jleger2023',
            'https://nostrgram.co',
            'https://nostrum.com',
            '#### NostrReport',
            'npub19mduaf5569jx9xz555jcx3v06mvktvtpu0zgk47n4lcpjsz43zzqhj6vzk:2edbcea694d164629854a52583458fd6d965b161e3c48b57d3aff01940558884:NostrReport',
            '',
            '#### key-convertr',
            'https://github.com/rot13maxi',
            'npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:rot13maxi',
            '#### List maintainer',
            'https://github.com/ptrio42/uselessshit.co',
            'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited',

        ],
        tags: ['Essentials', 'People', 'Projects'],
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
            '#### Web',
            'https://astral.ninja',
            'https://yosup.app',
            'https://iris.to',
            'https://snort.social',
            'https://hamstr.to',
            'https://nostrgram.co',
            'https://web.nostrid.app',
            '#### Android',
            '<i>nostros</i>',
            'https://github.com/KoalaSat/nostros',
            '<i>Daisy</i>',
            'https://www.neb.lol/nostr',
            '<i>Amethyst</i>',
            'https://github.com/vitorpamplona/amethyst',
            '<i>Nostrid</i>',
            'https://github.com/lapulpeta/Nostrid',
            '#### Windows',
            '<i>Nostrid</i>',
            'https://github.com/lapulpeta/Nostrid'
        ],
        updatedAt: '2023-01-25',
        tags: ['Basics', 'Clients']
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
            'https://youtu.be/IoLw-3ok3_M'
        ],
        createdAt: '2023-01-05',
        updatedAt: '2023-01-29',
        tags: ['Basics', 'Keys', 'Essentials']
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
        tags: ['Basics', 'Keys'],
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
        tags: ['Keys', 'Guides']
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
        attachedNoteId: '8fe64dfee6323bd3971b4a5718eb890258dff9e952059f3b04adb1e6e9b0fc84',
        tags: ['People', 'Projects']
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
        updatedAt: '2023-01-25'
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
        tags: ['Damus', 'Clients']
    },
    // {
    //     id: 'damus-test-flight',
    //     issue: 'Damus TestFlight',
    //     fix: '',
    //     updatedAt: '2023-02-01'
    // },
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
        tags: ['Damus', 'Intermediate'],
        updatedAt: '2023-02-01'
    },
    {
        id: 'mining-the-public-hex-key',
        issue: 'How to mine a public key?',
        fix: 'You can mine your public HEX key with a desired prefix. Check out nostr.rest to find out how.',
        urls: ['https://nostr.rest'],
        updatedAt: '2023-01-06',
        tags: ['Keys']
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
            'https://telegra.ph/How-to-create-a-POW-nostr-key-pair-01-04'
        ],
        updatedAt: '2023-01-29',
        tags: ['Keys']
    },
    {
        id: 'logging-in-with-someone-else-s-key',
        issue: 'Logging in with someone else\'s key.',
        fix: 'One of the cool features of Nostr is that you can log in with someone else\'s public key ' +
            'and see the world through their lens.',
        createdAt: '2023-01-09',
        updatedAt: '2023-01-14',
        tags: ['Keys']
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
        tags: ['Basics', 'Keys']
    },
    {
        id: 'adding-images',
        issue: 'How to add an image to a post?',
        fix: 'Image urls are processed and displayed as images. ' +
            'For now, it\'s not possible to upload images directly from your device. ' +
            'The image has to be hosted somewhere before it can be used. ' +
            'Several free public image hosting services are listed below.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-25',
        bulletPoints: [
            'https://nostr.build',
            'https://nostrimg.com',
            'https://imgbb.com',
            'https://postimages.org',
            'https://imgur.com',
            'https://void.cat'
        ],
        tags: ['Basics', 'Media']
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
    },
    {
        id: 'gifs',
        issue: 'User avatars and post images can be GIFs.',
        fix: 'Animated user avatars and post images work just like any other images.',
        urls: ['https://tenor.com'],
        updatedAt: '2022-12-26',
        tags: ['Media']
    },
    {
        id: 'gifs-will-not-display',
        issue: 'Changed my profile pic to GIF but it won\'t display',
        fix: 'Some clients prevent GIFs larger than 1MB from loading. ' +
            'Try an image-compressing tool to downsize.',
        updatedAt: '2023-01-05',
        tags: ['Media', 'Troubleshooting']
    },
    {
        id: 'turning-images-into-gifs',
        issue: 'How to turn static images into gifs?',
        fix: 'Download MotionLeap (available on Android and iOS) to add animations to your image. ' +
            'With a free version you\'d also need ezgif.com to convert MotionLeap output to GIF.',
        urls: ['https://ezgif.com'],
        updatedAt: '2023-01-05',
        tags: ['Media']
    },
    {
        id: 'multiple-images',
        issue: 'Adding multiple images to a post.',
        fix: 'For multiple images to be displayed in a single post, simply add a direct image url for every image you\'d like to see. ' +
            'They\'ll appear in a carousel (swipe left/right to browse).',
        updatedAt: '2022-12-27',
        tags: ['Media']
    },
    {
        id: 'adding-videos',
        issue: 'How to make a post with a video?',
        fix: 'Video urls are processed and displayed as videos. ' +
            'Simply copy the direct video link (it has to be hosted somewhere public) and paste it into a post 🔥 ' +
            'That\'s it!',
        createdAt: '2022-12-29',
        updatedAt: '2022-01-11',
        tags: ['Media', 'Damus']
    },
    {
        id: 'dropping-an-invoice',
        issue: 'How do I drop a lightning invoice?',
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
            'Now someone will be able to pay that invoice.'
        ],
        createdAt: '2022-12-26',
        updatedAt: '2023-02-01',
        tags: ['Basics', '⚡️ Lightning']
    },
    {
        id: 'multiple-invoices',
        issue: 'Can I drop more than one invoice in a note?',
        fix: 'Yes, some clients support dropping multiple invoices in a single note. Simply copy & paste lnurls, ' +
            'separated by spaces, into a new note.',
        updatedAt: '2023-01-03',
        tags: ['⚡️ Lightning']
    },
    {
        id: 'how-to-quote-a-note',
        issue: 'How to refer to an existing post (note)?',
        fix: 'Click (press) and hold on the note you would like to quote. A menu should pop up. Select Copy Note ID. ' +
            'Then use that id prefixed by @ in your new post.',
        updatedAt: '2023-01-03',
        tags: ['Basics']
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
        tags: ['Basics', 'Essentials'],
        attachedNoteId: NOTES[3]
    },
    {
        id: 'deleting-accounts',
        issue: 'Deleting accounts',
        fix: 'You cannot delete on the protocol level. ' +
            'Some clients might allow you to delete your account, but they only mark it as deleted.',
        updatedAt: '2023-02-01',
        tags: ['Basics', 'Essentials']
    },
    {
        id: 'sharing-notes',
        issue: 'Sharing notes.',
        fix: 'In some clients it\'s now possible to share notes between different apps. ' +
            'Simply tap on the Share icon under the post and choose a desired option.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-11',
        tags: ['Basics']
    },
    {
        id: 'reactions',
        issue: 'Reactions.',
        fix: 'Since Damus build 1.0.0-6 you can now see who liked your posts with the new reactions view.' +
            'Reactions can be viewed from the Thread screen.',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Damus']
    },
    {
        id: 'left-handers',
        issue: 'Left hand option for the post button.',
        fix: 'In the latest Damus build (1.0.0-6) it\'s now possible to move the post button to the left. ' +
            'To do that, go to Settings (tap on your pfp in top left corner to open side panel), ' +
            'scroll down to LEFT HANDED section and then tap on the toggle. Restart the app for the changes to take effect.',
        updatedAt: '2023-01-14',
        tags: ['Damus']
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
        tags: ['Media', 'Damus']
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
        tags: ['Basics', 'Essentials'],
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
        tags: ['Basics']
    },
    {
        id: 'receiving-sats',
        issue: 'NOSTR and Lightning ⚡',
        fix: 'With bitcoin and lightning it\'s easy to exchange value. ' +
            'Nostr protocol is where this can be seen in action. ' +
            'Make sure your profile is set up correctly and people can send you sats, so you can experience the V4V magic first hand.' +
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
        tags: ['Basics', '⚡️ Lightning', 'Damus', 'Essentials'],
        attachedNoteId: NOTES[5]
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
        attachedNoteId: NOTES[9]
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
        tags: ['⚡️ Lightning', 'Damus']
    },
    {
        id: 'dark-mode',
        issue: 'How to switch to dark mode?',
        fix: 'Set you iOS theme to dark.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-11',
        tags: ['Damus']
    },
    {
        id: 'clearing-cache',
        issue: 'How does one clear cache?',
        fix: 'Clear cache option is located in Settings (side panel, accessible through tapping on your pfp) under CLEAR CACHE section.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-14',
        tags: ['Basics', 'Damus']
    },
    {
        id: 'saving-images-to-library',
        issue: 'How to save an image posted by someone to my Library?',
        fix: 'Tap on the picture you want to save. In the newly opened window tap & hold on the image and select Save Image.',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-11',
        tags: ['Media', 'Damus']
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
        id: 'markdown',
        issue: 'Using markdown in posts.',
        fix: 'Some of the markdown tags are supported by clients. Try formatting your posts with a guide at markdownguide.org',
        urls: ['https://markdownguide.org'],
        updatedAt: '2022-12-27'
    },
    {
        id: 'uploading-to-nostr-build',
        issue: 'Uploading to nostr.build',
        fix: 'nostr.build is a nice place to upload your images. ' +
            'Check nostr.build/profilepic.html for profile picture uploads.' +
            'Be cautious when uploading images there as anyone can see them even without a direct link.',
        urls: ['https://nostr.build/', 'https://nostr.build/profilepic.html'],
        updatedAt: '2023-01-05',
        tags: ['Media']
    },
    {
        id: 'adding-more-relays',
        issue: 'The content won\'t load or loads extremely slow.',
        fix: 'You can find a list of public relays at nostr.watch and add some more items to RELAYS section of your Settings. ' +
            'You might also want to check the RECOMMENDED RELAYS section and pick up some from there.',
        urls: ['https://nostr.watch'],
        createdAt: '2022-12-30',
        updatedAt: '2022-01-11',
        tags: ['Basics', 'Damus']
    },
    {
        id: 'too-many-relays',
        issue: 'The NOSTR client I\'m using seems to use up a lot of bandwidth.',
        fix: 'While having more relays added in your SETTINGS will make your client fetch the data faster, ' +
            'resulting in better experience, ' +
            'having too many relays could be an issue as well. Be cautious when using a mobile internet with limited bandwidth ' +
            'and try limiting the amount of relays to well under 10.',
        updatedAt: '2023-01-02'
    },
    {
        id: 'removing-relays',
        issue: 'How to remove a relay?',
        fix: 'In your SETTINGS view (side panel - to open it tap on your pfp in the left top corner), swipe left on a relay you\'d ' +
            'like to remove and click on the trash icon to confirm removal. ' +
            'You might want to restart the client for the changes to take place.',
        createdAt: '2022-12-30',
        updatedAt: '2023-01-14',
        tags: ['Basics']
    },
    {
        id: 'nip-05',
        issue: 'How to setup NIP-05 identifier (checkmark)?',
        fix: 'Check out these explainers on setting up a NIP-05 identifier below. ' +
            'If you don\'t own a domain you can ask someone to create an id for you at their domain.',
        bulletPoints: [
            'npub1pvuugp6fyj6t6yeq9ajzv28p54w07sg6jpxvzuu5yc7qmu9edpkqm2d7a5:0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c:MainStreetChungs',
            'https://mainstreetchungus.com/nostr-nip-05-verification/',
            '#### metasikander',
            'https://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e',
            'npub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8:e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411:NVK',
            'https://nvk.org/n00b-nip5'
        ],
        createdAt: '2023-01-04',
        updatedAt: '2023-01-25'
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
            '#### stacker.new',
            'https://stacker.news',
            '#### bitpaint.club',
            'npub1t8makd5nzwt36nym6j4mrn9dkv4cn43m24tqy8rxv34v3gflxwjqkqlw4s:59f7db369313971d4c9bd4abb1ccadb32b89d63b5556021c66646ac8a13f33a4:bitpaint',
            '#### Nostr-Check.com',
            'npub1mhamq6nj9egex0xn0e8vmvctrpj0ychehddadsketjlwl3eg7ztqrv9a4h:ddfbb06a722e51933cd37e4ecdb30b1864f262f9bb5bd6c2d95cbeefc728f096:',
            'https://nostr-check.com',
            '### lnmarkets.com',
            'https://lnmarkets.com',
            '#### uselessshit.co',
            'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited'
        ],
        updatedAt: '2023-01-19',
        attachedNoteId: '679570d6e77c5f0b15431dcc30a88c359c8c680f4a2d9b975959f7a970fcd8fc'
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
            'https://nostrverified.com'
        ],
        updatedAt: '2023-01-25'
    },
    {
        id: 'lnurlp-with-alby',
        issue: 'How to turn my NIP-05 handle into lightning address? (Alby)',
        fix: 'Navigate to the url below to make your NIP-05 handle a lightning address (Alby). ' +
            'If you\'d like a lightning address @uselessshit.co let me know (see Contact)',
        urls: ['https://nvk.org/alby-lnurlp'],
        createdAt: '2023-01-10',
        updatedAt: '2023-01-11'
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
        urls: ['https://orangepill.dev/lightning-guides/guide-to-create-lnaddress-redirection-on-your-domain/']
    },
    {
        id: 'grey-and-purple-checkmarks',
        issue: 'What\'s the difference between grey and purple checkmark?',
        fix: 'People you aren\'t following have grey checkmarks, whereas the ones you follow have purple checkmarks.',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-17',
        tags: ['Basics', 'Damus']
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
        tags: ['Damus', 'Snort']
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
        tags: ['Damus']
    },
    {
        id: 'running-nostr',
        issue: 'How do I setup my own NOSTR relay?',
        fix: 'Check out the resources below to set up a Nostr relay in under 5 minutes.',
        urls: ['https://github.com/Cameri/nostream', 'https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under'],
        createdAt: '2022-12-30',
        updatedAt: '2023-01-09'
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
        updatedAt: '2023-01-17'
    },
    {
        id: 'security-and-privacy-tips',
        issue: 'Security and Privacy tips.',
        fix: '',
        urls: ['https://ron.stoner.com/nostr_Security_and_Privacy/'],
        updatedAt: '2022-12-30'
    },
    {
        id: 'blurred-images',
        issue: 'Some images are blurred. Need to click on the image to see it. What\'s up?',
        fix: 'You can only see images from the people you\'re following, the remaining ones come up blurred.',
        updatedAt: '2022-12-30'
    },
    {
        id: 'reposting-issues',
        issue: 'I can\'t repost (previously boost).',
        fix: 'Sometimes it\'s not possible to repost a note from a feed. ' +
            'The workaround is to open a given thread and repost the note from there.',
        createdAt: '2023-01-09',
        updatedAt: '2023-01-14',
        tags: ['Troubleshooting', 'Damus']
    },
    {
        id: 'damus-is-crashing',
        issue: 'Damus keeps crashing.',
        fix: 'Damus is still in beta, so bugs are not uncommon. ' +
            'If your app keeps crashing, make sure you\'ve updated Damus and iOS to the latest versions.',
        updatedAt: '2023-01-09',
        tags: ['Troubleshooting', 'Damus']
    },
    {
        id: 'free-100-sats',
        issue: 'Want to test lightning and get free 100 sats?',
        fix: '',
        bulletPoints: [
            'Post a lightning invoice for 100 sats.',
            'Tag @bitcoinbull',
            'npub1gl23nnfmlewvvuz7xgrrauuexx2xj70whdf5yhd47tj0r8p68t6sww70gt:47d519cd3bfe5cc6705e32063ef39931946979eebb53425db5f2e4f19c3a3af5:bitcoinbull',
            'Watch the magic happen before your own eyes 🪄'
        ],
        createdAt: '2023-01-11',
        updatedAt: '2023-01-16',
        tags: ['⚡️ Lightning']
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
        updatedAt: '2023-01-02'
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
        updatedAt: '2023-01-16'
    }
];