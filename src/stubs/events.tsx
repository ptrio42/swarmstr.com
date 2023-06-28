export const DEFAULT_EVENTS = [
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "What's NOSTR?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "603ef2db5a749933ecb8df282a7210613f2bdd2ab012bd1112b340abc42efd77",
        "sig": "a99409548a8858f728eaccb830b09f7b50c83f1a896a58a9593b654a45f33d482ac9ec14c8891b2280e58eacb353b960ce03b6425e09330ff98f273bd8fbb6b4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "603ef2db5a749933ecb8df282a7210613f2bdd2ab012bd1112b340abc42efd77"
            ]
        ],
        "content": "Notes and Other Stuff Transmitted by Relays, or NOSTR, is an open protocol, designed to create a censorship-resistant social network. \nhttps://uselessshit.co/images/nostr-ostrich.jpeg\n#### Nostr Protocol\nhttps://github.com/nostr-protocol/nostr\n#### NIPs\nhttps://github.com/nostr-protocol/nips\n#### Development\nhttps://github.com/nbd-wtf/nostr-tools\n#### Resources\n#### nostr-resources.com by @dergigi\nhttps://nostr-resources.com\nnpub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc:6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93:dergigi\n#### Beginner's guide by @walker\nhttps://www.btctimes.com/news/what-is-nostr-how-does-it-work-why-does-it-matter\nnpub1cj8znuztfqkvq89pl8hceph0svvvqk0qay6nydgk9uyq7fhpfsgsqwrz4u:c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11:walker\n#### usenostr.org by @pluja\nhttps://usenostr.org\n#### Nostr introduction\nnpub1fl7pr0azlpgk469u034lsgn46dvwguz9g339p03dpetp9cs5pq5qxzeknp:4ffc11bfa2f8516ae8bc7c6bf82275d358e47045446250be2d0e5612e2140828:SovrynMatt\nhttps://sovryn.com/all-things-sovryn/introducing-nostr-a-decentralized-social-network-for-sovereign-individuals\n#### More Resources\nhttps://github.com/vishalxl/nostr_console/discussions/31\nhttps://wiki.wellorder.net/post/nostr-intro/\nhttps://audaciousdenizen.substack.com/p/my-quick-guide-to-nostr\nhttps://www.austrich.net/nostr/\n\nhttps://uselessshit.co/images/explain-it-to-me-like-i-m-5.png\nImage credits: @coderjourney1",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "947ba019cfc57818e24ddc225f1b49cf6c6d23cb15d14f832d78de21f6f89998",
        "sig": "9ec257030c0d687178cecefb96932b1daa09c90ac6bc52a5e46084a2ab73f56f1448235892927f867a84f52412beeec20a089acfcb45f94cc197cbd3b54cfba4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How does NOSTR work?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e1f20d8a63f9bd73364b7d27b6f44630327c2c4300607a5ad9fc782b3e8beda2",
        "sig": "332d09dbc0f3fd8c195874d81567ec6fc8e25588436c0c6f7af260a00a7073ad34c696fad38062e682a3fb719abd4b14200160055fd00eeeb3c082b164173081"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "e1f20d8a63f9bd73364b7d27b6f44630327c2c4300607a5ad9fc782b3e8beda2"
            ]
        ],
        "content": "\n💡 There are two components: clients and relays. Each user runs a client. Anyone can run a relay.\n💡 Every user is identified by a public key. Every post is signed. Every client validates these signatures.\n💡 Clients fetch data from relays of their choice and publish data to other relays of their choice. A relay doesn't talk to another relay, only directly to users.\n💡 For example, to \"follow\" someone a user just instructs their client to query the relays it knows for posts from that public key.\n💡 On startup, a client queries data from all relays it knows for all users it follows (for example, all updates from the last day), then displays that data to the user chronologically.\n💡 A \"post\" can contain any kind of structured data, but the most used ones are going to find their way into the standard so all clients and relays can handle them seamlessly.\nhttps://github.com/nostr-protocol/nostr#how-does-nostr-work\nhttps://uselessshit.co/images/how-does-nostr-work-02.jpeg\nImage credits: unknown",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "0aa83ab9f37a1fb1879035bf904c0d17819f5a1031a58ec22dcdf2f87b4f95fd",
        "sig": "dd675221ab3162b3b2a0adfdaa9533d3f3cb157ac5ed92204affadd6a0a16a474e6fee045f29c6370fe635caa265f730066b42c2674382324026f74fdfefd377"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "What are nostr clients?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "10a2567d111b602eb559636181e9bb9094b36864ab06eefd8e7edcb1a5ec11f7",
        "sig": "cb367c1e0dbd97ef950c86c0e82264b20b9324782112041f6680d645e61f6a066f78bbd3c707123d0502e20793799facfac1c160584a8bd0c997e2bbd474a34d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "10a2567d111b602eb559636181e9bb9094b36864ab06eefd8e7edcb1a5ec11f7"
            ]
        ],
        "content": "\"Everybody runs a client. It can be a native client, a web client, etc. To publish something, you write a post, sign it with your key and send it to multiple relays (servers hosted by someone else, or yourself). To get updates from other people, you ask multiple relays if they know anything about these other people. [...] Signatures are verified on the client side.\"\nhttps://github.com/nostr-protocol/nostr#very-short-summary-of-how-it-works-if-you-dont-plan-to-read-anything-else",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "bb6821e11ffe4c9de2b367ed7bdac5660ee5aad2422258558126b89ce43b4dd4",
        "sig": "ecc5f3d092f003d150fa8531d5f522259a7070bf276afbef4e0f5cfa26bba523920b87eadc20748713262896d35b2a0c222c0d5b4a6f929bb04a1d7453c33626"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "What's a (nostr) relay?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "d7a3d2a5230902ccb9941a13e1523f8b250993814a8bc8561bda65da5d9a6bf2",
        "sig": "4362e8546b897bff15349b0e9ed7d255af742409e2368a834a444a3550ccbe3f4544219fed114c49f9c8baab5c49503ae7589a4803d6cccec7438d9bc3f3042d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "d7a3d2a5230902ccb9941a13e1523f8b250993814a8bc8561bda65da5d9a6bf2"
            ]
        ],
        "content": "\"Anyone can run a relay. A relay is very simple and dumb. It does nothing besides accepting posts from some people and forwarding to others. Relays don't have to be trusted. \"\nhttps://github.com/nostr-protocol/nostr#very-short-summary-of-how-it-works-if-you-dont-plan-to-read-anything-else",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "7163075d5eb4862281b1e9434ccdbab719fe5905fd590a0342cef81e739c4277",
        "sig": "2c42afbcd01249fd7b700c309f7bdbcbd6016e204d7351acb7b1afaa46363d55cff4e93e18b73b693beab31f5c857868be03617e2e21bcf0f5b6f05f3d45a81d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "People involved in NOSTR",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "d2b317671f59951352d37aeb2c012273438b436828614903ea5fbe60cff6ef0b",
        "sig": "6b6c8b8be5d193aacb47786b3fec0e4d29f94f08dfb33e5aa3d1a956f5a3a28ec2da657ec28970dc83b88dce124c8dde158bb5796a8cdb01e54f4d55a2573b1d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "d2b317671f59951352d37aeb2c012273438b436828614903ea5fbe60cff6ef0b"
            ]
        ],
        "content": "You can open each person's profile in a client of your choice by tapping on the copy icon next to their name and selecting <i>Open in client</i><br/><br/>On a desktop/laptop you can use <i>Show QR</i> option to display qr code which will take you to that profile on your mobile device.\n\"<i>Following and zapping ⚡️ them is highly adviseable especially if you use their product!</i>\n<i>Forgive me if I you are not included. Add yourself in the comments with your project's name and github or just shoot me a DM and I will make sure you will be added.</i>\n<i>Let me know if anything is wrong or missing and I will change it.\"</i>\n#### List creator\nnpub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats\n#### Currently 93 pubkeys listed.\n\n#### Nostr creator\nnpub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:fiatjaf\nhttps://github.com/fiatjaf\n#### Damus\nnpub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s:32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245:jb55\nhttps://github.com/jb55\nnpub13prsf02zzus79yhdhl6zadm4gllpzhr0lxp9kz8uxe47fntfa8mqyrh6a9:884704bd421721e292edbff42eb77547fe115c6ff9825b08fc366be4cd69e9f6:0xtlt\nhttps://github.com/0xtlt/\nnpub1jutptdc2m8kgjmudtws095qk2tcale0eemvp4j2xnjnl4nh6669slrf04x:971615b70ad9ec896f8d5ba0f2d01652f1dfe5f9ced81ac9469ca7facefad68b:BenGWeeks\nhttps://github.com/BenGWeeks\nnpub146e625cxmwc93c8jpw5p0slkrna4t0j3lmzu94g07tkrrqg0staqjup4e0:aeb3a55306dbb058e0f20ba817c3f61cfb55be51fec5c2d50ff2ec31810f82fa:sdub\nhttps://github.com/sdub18\nnpub1yaul8k059377u9lsu67de7y637w4jtgeuwcmh5n7788l6xnlnrgs3tvjmf:2779f3d9f42c7dee17f0e6bcdcf89a8f9d592d19e3b1bbd27ef1cffd1a7f98d1:tyiu\nhttps://github.com/tyiu\nnpub107e29x735swe4r9y8gv60h8n4pfz7x7qndqgvff48yvsa8pfc5dq3p0cr5:7fb2a29bd1a41d9a8ca43a19a7dcf3a8522f1bc09b4086253539190e9c29c51a:olegaba\nhttps://github.com/OlegAba\nnpub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt:2f4fa408d85b962d1fe717daae148a4c98424ab2e10c7dd11927e101ed3257b2:Klabo\nhttps://github.com/joelklabo/\nnpub1uqeexjx2djkfwzxdnrnrrch5h2k4xn0uapcgsxm94ftaxrlhy5lqywjckg:e0339348ca6cac9708cd98e631e2f4baad534dfce870881b65aa57d30ff7253e:jsm\nhttps://github.com/realprogrammersusevim\n#### nostream, SMTP Nostr Gateway, Tnsor\nnpub1qqqqqqyz0la2jjl752yv8h7wgs3v098mh9nztd4nr6gynaef6uqqt0n47m:00000000827ffaa94bfea288c3dfce4422c794fbb96625b6b31e9049f729d700:cameri\nhttps://github.com/cameri\n#### iris.to\nnpub1g53mukxnjkcmr94fhryzkqutdz2ukq4ks0gvy5af25rgmwsl4ngq43drvk:4523be58d395b1b196a9b8c82b038b6895cb02b683d0c253a955068dba1facd0:sirius\nhttps://github.com/mmalmi\n#### yosupp.app\nnpub1klrxeehhh0srf6ttu4xzllq2ma334zy6hsyrfws5xyt3ke7y3x4qze9lh3:b7c66ce6f7bbe034e96be54c2ffc0adf631a889abc0834ba1431171b67c489aa:Thomas\nhttps://github.com/tmathews\n#### astral.ninja\nnpub13sx6fp3pxq5rl70x0kyfmunyzaa9pzt5utltjm0p8xqyafndv95q3saapa:8c0da4862130283ff9e67d889df264177a508974e2feb96de139804ea66d6168:monlovesmango\nhttps://github.com/monlovesmango\n#### reddit / nostr.rocks / nostr.chat / git + nostr\nnpub1melv683fw6n2mvhl5h6dhqd8mqfv3wmxnz4qph83ua4dk4006ezsrt5c24:de7ecd1e2976a6adb2ffa5f4db81a7d812c8bb6698aa00dcf1e76adb55efd645:melvincarvalho\nhttps://github.com/melvincarvalho\n#### snort.social\nnpub1v0lxxxxutpvrelsksy8cdhgfux9l6a42hsj2qzquu2zk7vc9qnkszrqj49:63fe6318dc58583cfe16810f86dd09e18bfd76aabc24a0081ce2856f330504ed:Kieran\nhttps://github.com/v0l\nnpub107jk7htfv243u0x5ynn43scq9wrxtaasmrwwa8lfu2ydwag6cx2quqncxg:7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194:verbiricha\nhttps://github.com/verbiricha\nnpub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac:1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411:Karnage\n\n#### blend\nnpub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:semisol\nhttps://github.com/semisol\n#### Amethyst App\nnpub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z:460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c:vitorpamplona\nhttps://github.com/vitorpamplona\n#### Bija\nnpub1qqqqqqqut3z3jeuxu70c85slaqq4f87unr3vymukmnhsdzjahntsfmctgs:000000001c5c45196786e79f83d21fe801549fdc98e2c26f96dcef068a5dbcd7:CarlosAutonomous\nhttps://github.com/BrightonBTC\n#### Daisy\nnpub1e0usfsrs9gmpjywyd4un0xn22q4u80gtf3tdy5ufuckna0620kuq5w732v:cbf904c0702a361911c46d79379a6a502bc3bd0b4c56d25389e62d3ebf4a7db8:neb_b\nhttps://github.com/neb-b\n#### hamstr.to\nnpub1duedmhed2nevtejwz4c2hjuu0gz7spqm4s8wnaprta55ln9k3dwssvgpq4:6f32dddf2d54f2c5e64e1570abcb9c7a05e8041bac0ee9f4235f694fccb68b5d:styppo\nhttps://github.com/styppo\n#### nostrid.app\nnpub14uc57wfq2zd0g3qh5lpvkq2svvkjl9fruzyxnz9zh95ev2japw7ql2g0sq:af314f3920509af44417a7c2cb0150632d2f9523e0886988a2b969962a5d0bbc:lapulpeta\nhttps://github.com/lapulpeta\n#### nostros\nnpub1v3tgrwwsv7c6xckyhm5dmluc05jxd4yeqhpxew87chn0kua0tjzqc6yvjh:645681b9d067b1a362c4bee8ddff987d2466d49905c26cb8fec5e6fb73af5c84:KoalaSat\nhttps://github.com/KoalaSat\n#### nostr.console\nnpub1xg6sx67sj47lkf7vmgpdg5khca3musxfrgdvpq46dxpmy53c8zxqqy7kwr:3235036bd0957dfb27ccda02d452d7c763be40c91a1ac082ba6983b25238388c:vishalxl\nhttps://github.com/vishalxl\nnpub14j0vqgqhq92lpl4nglcdwalwtlpcm50nvdfsjvzxxgmydnl4z60sdv04f4:ac9ec020170155f0feb347f0d777ee5fc38dd1f36353093046323646cff5169f:radixrat\nhttps://github.com/radixrat/\n#### nostrit.com\nnpub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:pablof7z\nhttps://nostrit.com\n#### nostri.chat\nnpub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:pablof7z\nhttps://nostri.chat\n#### ananostr.com\nnpub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:pablof7z\nhttps://ananostr.com\n#### Coracle\nnpub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn:97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322:hodlbod\nhttps://github.com/staab/coracle\n#### Blockcore Notes\nnpub1zl3g38a6qypp6py2z07shggg45cu8qex992xpss7d8zrl28mu52s4cjajh:17e2889fba01021d048a13fd0ba108ad31c38326295460c21e69c43fa8fbe515:sondreb\nhttps://github.com/sondreb\n#### nostroid\nnpub1gm7tuvr9atc6u7q3gevjfeyfyvmrlul4y67k7u7hcxztz67ceexs078rf6:46fcbe3065eaf1ae7811465924e48923363ff3f526bd6f73d7c184b16bd8ce4d:Giszmo\nhttps://github.com/Giszmo\n#### nostriushand\nnpub1axvv6p3e6qt8ldca8lxpc9qdccjp7degsn2l6vqthmy4ugrpvw6s63ksnl:e998cd0639d0167fb71d3fcc1c140dc6241f372884d5fd300bbec95e206163b5:Tertiushand\nhttps://github.com/tertiushand\n#### gossip\nnpub1acg6thl5psv62405rljzkj8spesceyfz2c32udakc2ak0dmvfeyse9p35c:ee11a5dff40c19a555f41fe42b48f00e618c91225622ae37b6c2bb67b76c4e49:MichaelDilger\nhttps://github.com/mikedilger\n#### nostrimg.com\nnpub1xv6axulxcx6mce5mfvfzpsy89r4gee3zuknulm45cqqpmyw7680q5pxea6:3335d373e6c1b5bc669b4b1220c08728ea8ce622e5a7cfeeb4c0001d91ded1de:henry\nhttps://github.com/michaelhall923\n#### joinstr\nnpub1v6qjdzkwgaydgxjvlnq7vsqxlwf4h0p4j7pt8ktprajd28r82tvs54nzyr:6681268ace4748d41a4cfcc1e64006fb935bbc359782b3d9611f64d51c6752d9:\nhttps://github.com/1440000bytes/\n#### alphaama\nnpub1nmr6w7qk0ta36vxysv77jv3d5rqghfc6d8sez8240rf3gja4vsmsd2yha8:9ec7a778167afb1d30c4833de9322da0c08ba71a69e1911d5578d3144bb56437:balas\nhttps://github.com/eskema\n#### nostr.lib / client\nnpub1qqqqq2z444usdf6k306djuwcyptfjj4x0teu7qzg4qj5zkkfqeeq3hlwh5:0000002855ad7906a7568bf4d971d82056994aa67af3cf0048a825415ac90672:Sgiath\nhttps://github.com/Sgiath\n#### nostr-lib\nnpub1alyr7qwglvcfmukgse4cc7fyej9k7pvq4lw7r4hpdc4kzp7zsckqmy0qkx:efc83f01c8fb309df2c8866b8c7924cc8b6f0580afdde1d6e16e2b6107c2862c:roosoft\nhttps://github.com/RooSoft\n#### nostr-rs-relay\nnpub1xhfxu35se0s63x90v8xr29txr66l5a3m277skshy2zvu3ve0658sla4xw3:35d26e4690cbe1a898af61cc3515661eb5fa763b57bd0b42e45099c8b32fd50f:scsibug\nhttps://github.com/scsibug\n#### nostr-rs-sdk\nnpub1drvpzev3syqt0kjrls50050uzf25gehpz9vgdw08hvex7e0vgfeq0eseet:68d81165918100b7da43fc28f7d1fc12554466e1115886b9e7bb326f65ec4272:yuki\nhttps://github.com/yukibtc\n#### nostr-ruby\nnpub10000003zmk89narqpczy4ff6rnuht2wu05na7kpnh3mak7z2tqzsv8vwqk:7bdef7be22dd8e59f4600e044aa53a1cf975a9dc7d27df5833bc77db784a5805:dtonon\nhttps://github.com/dtonon\n#### emon.chat\nnpub1xfpn52slhcz8rcwc6vg5px6cmrj5zu3twcm0z9nleq6fqgj825ts78h0sd:32433a2a1fbe0471e1d8d311409b58d8e541722b7636f1167fc8349022475517:Sebastiaan\nhttps://github.com/SebastiaanWouters\n#### nostr-relay\nnpub14lu6nuqh7v4jazmqw49yzqkmnkw0nletjeuqfdgwqurcp2j9ex5qz37m8m:aff9a9f017f32b2e8b60754a4102db9d9cf9ff2b967804b50e070780aa45c9a8:aaron\nhttps://github.com/atdixon/me.untethr.nostr-relay\n#### Bitcoin & Nostr Art\nnpub1z4m7gkva6yxgvdyclc7zp0vz4ta0s2d9jh8g83w03tp5vdf3kzdsxana6p:1577e4599dd10c863498fe3c20bd82aafaf829a595ce83c5cf8ac3463531b09b:yegorpetrov\n\nnpub1qv0nc6gxr80sgredulxm7g6zm6z9gp4ns9nudq6mfxq0ed87gsnq7wswaz:031f3c690619df040f2de7cdbf2342de845406b38167c6835b4980fcb4fe4426:BitcoinImagined\n\nnpub19v2e3xgzwa7xydw7k7ky9tngjcmtnpqgpctzvl9ak3v37mkn54js988kdv:2b15989902777c6235deb7ac42ae689636b984080e16267cbdb4591f6ed3a565:rabbinstein\n\n#### nostrland\nnpub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac:1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411:Karnage\nhttps://nostrland.com\n#### nostr.band\nnpub1xdtducdnjerex88gkg2qk2atsdlqsyxqaag4h05jmcpyspqt30wscmntxy:3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd:brugeman\nhttps://github.com/brugeman\n#### nostrum.pro\nnpub1t9a59hjk48svr8hz6rx727ta6kx53n5d6fw8x26vsua0zytpl87sa6h4uw:597b42de56a9e0c19ee2d0cde5797dd58d48ce8dd25c732b4c873af11161f9fd:jleger2023\nhttps://nostrum.pro\n#### nostrplebs.com\nnpub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:derekross\nhttps://github.com/derekross\nnpub1mkq63wkt4v94cvq869njlwpszwpmf62c84p3sdvc2ptjy04jnzjs20r4tx:dd81a8bacbab0b5c3007d1672fb8301383b4e9583d431835985057223eb298a5:semisol\nhttps://github.com/semisol\n#### nostr.io\nnpub1mkq63wkt4v94cvq869njlwpszwpmf62c84p3sdvc2ptjy04jnzjs20r4tx:dd81a8bacbab0b5c3007d1672fb8301383b4e9583d431835985057223eb298a5:plantimals\nhttps://github.com/plantimals\n#### nostr.directory\nnpub1xhe9408d5hm3dpwax78sy9nuc5warycnvcy4r3qzv6jacwu26r6s5m56yf:35f25abceda5f71685dd378f02167cc51dd19313660951c40266a5dc3b8ad0f5:\nhttps://github.com/pseudozach\n#### orangepill.dev\nnpub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox\nhttps://github.com/Sakhalinfox\n#### nostr.build\nnpub1nxy4qpqnld6kmpphjykvx2lqwvxmuxluddwjamm4nc29ds3elyzsm5avr7:9989500413fb756d8437912cc32be0730dbe1bfc6b5d2eef759e1456c239f905:nostr.build\nhttps://github.com/nostrbuild\n#### camelus.app\nnpub1w9llyw8c3qnn7h27u3msjlet8xyjz5phdycr5rz335r2j5hj5a0qvs3tur:717ff238f888273f5d5ee477097f2b398921503769303a0c518d06a952f2a75e:\nhttps://camelus.app/\n#### nostore\nnpub19pw5egjuhcsfsv42zkjtjs6nhpm69lnv8w2dacdyez7rvacrqnds6xjtwk:285d4ca25cbe209832aa15a4b94353b877a2fe6c3b94dee1a4c8bc36770304db:Ryan\nhttps://github.com/ursuscamp/nostore\n#### nostr-resources.com\nnpub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc:6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93:dergigi\nhttps://nostr-resources.com\n#### nostrgram.co\nnpub1t9a59hjk48svr8hz6rx727ta6kx53n5d6fw8x26vsua0zytpl87sa6h4uw:597b42de56a9e0c19ee2d0cde5797dd58d48ce8dd25c732b4c873af11161f9fd:jleger2023\nhttps://nostrgram.co\n#### NostrReport\nnpub19mduaf5569jx9xz555jcx3v06mvktvtpu0zgk47n4lcpjsz43zzqhj6vzk:2edbcea694d164629854a52583458fd6d965b161e3c48b57d3aff01940558884:NostrReport\nhttps://nostreport.com\nnpub1pvuugp6fyj6t6yeq9ajzv28p54w07sg6jpxvzuu5yc7qmu9edpkqm2d7a5:0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c:MainStreetChungus\n\nnpub1xy54p83r6wnpyhs52xjeztd7qyyeu9ghymz8v66yu8kt3jzx75rqhf3urc:3129509e23d3a6125e1451a5912dbe01099e151726c4766b44e1ecb8c846f506:doc\n\nnpub1lrnvvs6z78s9yjqxxr38uyqkmn34lsaxznnqgd877j4z2qej3j5s09qnw5:f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9:corndalorian\n\nnpub1t2wy3j850q34zy6amzw9mzfsl66eedcx2tlaxlv3v7leytedzp5szs8c2u:5a9c48c8f4782351135dd89c5d8930feb59cb70652ffd37d9167bf922f2d1069:Lau\n\n#### key-convertr\nnpub1mxrssnzg8y9zjr6a9g6xqwhxfa23xlvmftluakxqatsrp6ez9gjssu0htc:d987084c48390a290f5d2a34603ae64f55137d9b4affced8c0eae030eb222a25:rot13maxi\nhttps://github.com/rot13maxi\n#### brb.io\nnpub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8:e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411:NVK\nhttps://brb.io\n#### bountsr.org\nnpub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8:e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411:NVK\nhttps://bounstr.org\n#### nosbin.com\nnpub1s8gvenj9j87yux0raa6j52cq8mer4xrvkv08sd020kxhektdgl4qu7ldqa:81d0ccce4591fc4e19e3ef752a2b003ef23a986cb31e7835ea7d8d7cd96d47ea:JackChakany\nhttps://nosbin.com\n#### nostrstuff.com\nnpub1vp8fdcyejd4pqjyrjk9sgz68vuhq7pyvnzk8j0ehlljvwgp8n6eqsrnpsw:604e96e099936a104883958b040b47672e0f048c98ac793f37ffe4c720279eb2:SamSamskies\nhttps://nostrstuff.com\n#### nsotrgram.co\nnpub1t9a59hjk48svr8hz6rx727ta6kx53n5d6fw8x26vsua0zytpl87sa6h4uw:597b42de56a9e0c19ee2d0cde5797dd58d48ce8dd25c732b4c873af11161f9fd:jleger2023\nhttps://nsotrgram.co\n#### getcurrent.io\nnpub1mz3vx0ew9le6n48l9f2e8u745k0fzel6thksv0gwfxy3wanprcxq79mymx:d8a2c33f2e2ff3a9d4ff2a5593f3d5a59e9167fa5ded063d0e49891776611e0c:starbuilder\nhttps://getcurrent.io\n#### zaplife.lol\nnpub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:pablof7z\nhttps://zaplife.lol\n#### getflamingo.org\nnpub1fh3uydhtwxawwe8hrpy9aacwjra6c59yw6gkkr45hgax7tfxtzjsa2y9wx:4de3c236eb71bae764f718485ef70e90fbac50a476916b0eb4ba3a6f2d2658a5:Tristan\nhttps://getflamingo.org\n#### badges.page\nnpub107jk7htfv243u0x5ynn43scq9wrxtaasmrwwa8lfu2ydwag6cx2quqncxg:7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194:verbiricha\nhttps://github.com/verbiricha\nnpub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac:1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411:Karnage\n\n#### footstr.com\nnpub1hu3hdctm5nkzd8gslnyedfr5ddz3z547jqcl5j88g4fame2jd08qh6h8nh:bf2376e17ba4ec269d10fcc996a4746b451152be9031fa48e74553dde5526bce:CARLA\n\nnpub1cj8znuztfqkvq89pl8hceph0svvvqk0qay6nydgk9uyq7fhpfsgsqwrz4u:c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11:walker\n\n#### notabot.net\nnpub1avar8zfzwswhq9xh3t0gc5l38pf5kesrkqe2s2ymrnymv3ddl2ps38t7kg:eb3a338922741d7014d78ade8c53f138534b6603b032a8289b1cc9b645adfa83:jason\nhttps://notabot.net\n#### nostrbounties.com\n::diego\nhttps://nostrbounties.com\n#### migrate.nostr.com\nnpub13a56exdeda7y44vtnrxr3ljaxh8q9kh04e73vzw8jl8rknuj7h7sst4t9m:8f69ac99b96f7c4ad58b98cc38fe5d35ce02daefae7d1609c797ce3b4f92f5fd:talvasconcelos\nhttps://migrate.nostr.com\n#### nostr-mux\n::murakmii\nhttps://github.com/murakmii/nostr-mux\n#### nostryfied.online\nnpub1cmmswlckn82se7f2jeftl6ll4szlc6zzh8hrjyyfm9vm3t2afr7svqlr6f:c6f7077f1699d50cf92a9652bfebffac05fc6842b9ee391089d959b8ad5d48fd:iefan\nhttps://nostryfied.online\n#### mostro\nnpub1qqqqqqqx2tj99mng5qgc07cgezv5jm95dj636x4qsq7svwkwmwnse3rfkq:000000000652e452ee68a01187fb08c899496cb46cb51d1aa0803d063acedba7:negrunch\nhttps://github.com/MostroP2P/mostro\n#### nostr.capital\nnpub1c3765rxjrfc8jllfgp8clcxr7euu9drpfpug6y54uepyyvsxfuwslj9ezu:c47daa0cd21a70797fe9404f8fe0c3f679c2b46148788d1295e6424232064f1d:maciek\nhttps://nostr.capital\n#### nostr.guru\nnpub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:fiatjaf\nhttps://github.com/fiatjaf/nostr-gateway\n#### nostrfiles.dev\n::Tobias Masiak\nhttps://nostrfiles.dev\n#### nostrapps.com\nnpub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac:1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411:Karnage\nhttps://nostrapps.com\n#### nostrbadges.com\nnpub1avar8zfzwswhq9xh3t0gc5l38pf5kesrkqe2s2ymrnymv3ddl2ps38t7kg:eb3a338922741d7014d78ade8c53f138534b6603b032a8289b1cc9b645adfa83:jason@paperlight.studio\nhttps://nostrbadges.com\n#### satprism.com\nnpub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc:6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93:dergigi\nhttps://satprism.com\n#### Notable individuals\nnpub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m:82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2:jack\n\nnpub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9:84dee6e676e5bb67b4ad4e042cf70cbd8681155db535942fcc6a0533858a7240:Snowden\n\nnpub1qny3tkh0acurzla8x3zy4nhrjz5zd8l9sy9jys09umwng00manysew95gx:04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9:ODELL\n\nnpub13ql75nq8rldygpkjke47y893akh5tglqtqzs6cspancaxktthsusvfqcg7:883fea4c071fda4406d2b66be21cb1edaf45a3e058050d6201ecf1d3596bbc39:adamcurry\n\nnpub1taycl7qfuqk9dp0rhkse8lxhz3az9eanjug8j4ympwehvslnetxqkujg5y:5f498ff809e02c5685e3bda193fcd7147a22e7b3971079549b0bb37643f3cacc:lee\nhttps://github.com/leesalminen\nnpub1cldxy9f5shk0kxm90yk8nn3lum7wdmta3m6ndjcjr4aqcuewjt0sx3rps5:c7da62153485ecfb1b65792c79ce3fe6fce6ed7d8ef536cb121d7a0c732e92df:dave\nhttps://github.com/davestgermain\nnpub148jmlutaa49y5wl5mcll003ftj59v79vf7wuv3apcwpf75hx22vs7kk9ay:a9e5bff17ded4a4a3bf4de3ff7be295ca85678ac4f9dc647a1c3829f52e65299:LiranCohen\nhttps://github.com/LiranCohen\nnpub1x8dzy9xegwmdk2vy30l8u08caspcqq2yzncxehdsa6kvnte9pr3qnt8pg4:31da2214d943b6db29848bfe7e3cf8ec0380014414f06cddb0eeacc9af2508e2:solobalbo\n\nnpub13pnmakf738yn6rv2ex9jgs7924renmderyp5d9rtztsr7ymxg3gqej06vw:8867bed93e89c93d0d8ac98b2443c5554799edb9190346946b12e03f13664450:IntuitiveGuy\n\nnpub1sqaxzwvh5fhgw9q3d7v658ucapvfeds3dcd2587fcwyesn7dnwuqt2r45v:803a613997a26e8714116f99aa1f98e8589cb6116e1aaa1fc9c389984fcd9bb8:Nakadai\n\nnpub1gl23nnfmlewvvuz7xgrrauuexx2xj70whdf5yhd47tj0r8p68t6sww70gt:47d519cd3bfe5cc6705e32063ef39931946979eebb53425db5f2e4f19c3a3af5:bitcoinbull\n\nnpub10jnx6stxk9h4fgtgdqv3hgwx8p4fwe3y73357wykmxm8gz3c3j3sjlvcrd:7ca66d4166b16f54a16868191ba1c6386a976624f4634f3896d9b6740a388ca3:stacksatsio\n\nnpub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa:51c059f3cc1802997fe1c4e60d6315c22079a025823256160ac7bfc1bca7c2d7:BitcoinNostrich\n\nnpub1fl7pr0azlpgk469u034lsgn46dvwguz9g339p03dpetp9cs5pq5qxzeknp:4ffc11bfa2f8516ae8bc7c6bf82275d358e47045446250be2d0e5612e2140828:SovrynMatt\nhttps://github.com/SovrynMatt/Nostr-Website-Button-Design\nnpub1u8lnhlw5usp3t9vmpz60ejpyt649z33hu82wc2hpv6m5xdqmuxhs46turz:e1ff3bfdd4e40315959b08b4fcc8245eaa514637e1d4ec2ae166b743341be1af:benthecarman\n\nnpub1gpppr3hfwcl5njxqmp3zumaly9j4pd6gvapywsq2y5n7p7278fus6nz7l5:404211c6e9763f49c8c0d8622e6fbf216550b748674247400a2527e0f95e3a79:GuBi\n\nnpub1gdu7w6l6w65qhrdeaf6eyywepwe7v7ezqtugsrxy7hl7ypjsvxksd76nak:4379e76bfa76a80b8db9ea759211d90bb3e67b2202f8880cc4f5ffe2065061ad:saifedean\n\nnpub1excellx58e497gan6fcsdnseujkjm7ym5yp3m4rp0ud4j8ss39js2pn72a:c9b19ffcd43e6a5f23b3d27106ce19e4ad2df89ba1031dd4617f1b591e108965:Excellion\n\n#### List contributors\nnpub138guayty78ch9k42n3uyz5ch3jcaa3u390647hwq0c83m2lypekq6wk36k:89d1ce9164f1f172daaa9c784153178cb1dec7912bf55f5dc07e0f1dabe40e6c:lukeonchain\n\nnpub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft:fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52:pablof7z\n\n#### List maintainer\nnpub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited\nhttps://github.com/ptrio42/uselessshit.co",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9856453a90a54c84152bb2fa38ed224ddaea0f4d6f3beb2ba186b94c5f7f0ebe",
        "sig": "4d9341abbd04b2d92c8a9f6d2ece3515e7cd013bcad46c806eed845b53399a629e0a6cc498c65b813dad8c9db4a5b1ec97053fbf617440bf6e3c938d686b7368"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "List of Nostr clients.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "edf28a145ebc656544358f14b75aef2f50d3e542ffdf0384819e01d240152dfe",
        "sig": "2baec7a76d17af70698f2a459d654a13e654c7adb506f6a87222b845a991c74a31b1fa0318013f577509d828f0b27633d54c77e381179749c8c555150fc9e512"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "edf28a145ebc656544358f14b75aef2f50d3e542ffdf0384819e01d240152dfe"
            ]
        ],
        "content": "\n#### iOS/MacOS\n<i>Damus</i>\nhttps://damus.io\n<i>Daisy</i>\nhttps://www.neb.lol/nostr\n<i>Iris.to</i>\nhttps://apps.apple.com/app/iris-the-nostr-client/id1665849007\nhttps://docs.iris.to\n<i>Current</i>\nhttps://testflight.apple.com/join/mB0EwMiV\n<i>Nostur</i>\nhttps://testflight.apple.com/join/TyrRNCXA\n<i>Plebstr</i>\nhttps://plebstr.com\n#### Web\nhttps://astral.ninja\nhttps://yosup.app\nhttps://iris.to\nhttps://snort.social\nhttps://hamstr.to\nhttps://nostrgram.co\nhttps://web.nostrid.app\nhttps://member.cash\nhttps://coracle.social\nhttps://habla.news\nhttps://blogstack.io\nhttps://primal.net\n#### Android\n<i>nostros</i>\nhttps://github.com/KoalaSat/nostros\n<i>Daisy</i>\nhttps://www.neb.lol/nostr\n<i>Amethyst</i>\nhttps://github.com/vitorpamplona/amethyst\n<i>Nostrid</i>\nhttps://github.com/lapulpeta/Nostrid\n<i>Plasma</i>\nhttps://github.com/plasma-social/plasma\n<i>Iris.to</i>\nhttps://play.google.com/store/apps/details?id=to.iris.twa\nhttps://github.com/irislib/iris-messenger/releases\nhttps://docs.iris.to\n<i>Current</i>\nhttps://play.google.com/apps/testing/io.getcurrent.current\n<i>Plebstr</i>\nhttps://plebstr.com\n#### Desktop\n<i>Nostrid</i>\nhttps://github.com/lapulpeta/Nostrid\n<i>Gossip</i>\nhttps://github.com/mikedilger/gossip\n<i>Monstr</i>\nhttps://github.com/alemmens/monstr\n<i>Iris.to</i>\nhttps://github.com/irislib/iris-messenger\nhttps://docs.iris.to",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "bd55102cc0deab023240086c0eecc7bc533e92166f56d6ee733d563c933078dd",
        "sig": "40c27c27baff2a3403749014e63414435597ae0e6d80b6512dd6b3f179b2714c98de7ddf5fc328b2d211b877633511d86530cca9366a57519c69b04601b5d9e7"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Getting the keys 🔑",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "8bad9db887f63b7dd72c4f4e2621b4a2c192722323d83a0cfa7f0398013d2c52",
        "sig": "d04ecec9be004459fdce1571bddd8c94e1902b4f5352e24bb72c9d8da71b66865dcafe12f4fd9397e567c796d0bfb17528840fa8b732c2bb639d371281f63efe"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "8bad9db887f63b7dd72c4f4e2621b4a2c192722323d83a0cfa7f0398013d2c52"
            ]
        ],
        "content": "The keys are your identity. They consist of a public key which starts with <i>npub</i> and a private key starting with <i>nsec</i> (bech32 encoding). A public key can be treated as a username, whereas a private key is more like a password. Be cautious when entering your private on different sites - if it gets leaked and falls into wrong hands,you can think of your 'account' as compromised.\nThere are different ways to get nostr pair of keys.\nIf you're going to use a mobile client like Damus, you're probably fine obtaining your keys through the app.\n#### You should never paste your private key into websites\nFor web clients use Alby or nos2x browser extension.\n#### How to use Nostr with the Alby extension\nhttps://blog.getalby.com/how-to-use-nostr-with-the-alby-extension/\n#### The nos2x browser extension\nhttps://youtu.be/IoLw-3ok3_M\nYou can also check out the nos2x fork for Firefox\n#### nos2x-fox\nhttps://github.com/diegogurpegui/nos2x-fox",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "8cd7a03aff25716be7d4f919a4ade82389c5eb2a187a6d9d02c1160fea9a05f2",
        "sig": "d61581bc094793f5c3d74aa33efa9596044fb6a7f9a68665b8bcd36001d307bfbfec2966e9d315150baf018205e39fc2d8b4887ff405db646383dff3e4fab96e"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to use Nostr with the Alby or nos2x extension.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "71b7ce235e862fc3e622cb6184f3c2d3a5ce94bc811264c014c060d4e12c87f2",
        "sig": "d40607620f7662ef9b30b143bdef679b9041fcc703c281151b064fd30317260bcd296b1e7673c0e181fd85ef57dbf451fc71264662560e10492fa8d6ad7ad25b"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "71b7ce235e862fc3e622cb6184f3c2d3a5ce94bc811264c014c060d4e12c87f2"
            ]
        ],
        "content": "As a rule of thumb, <b>you should never paste your private key into websites</b>. To generate your keys and handle your keys, use Alby or nos2x extension.\n#### How to use Nostr with the Alby extension\nhttps://blog.getalby.com/how-to-use-nostr-with-the-alby-extension/\n#### The nos2x browser extension\nhttps://youtu.be/IoLw-3ok3_M",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4ab3ed8c470a77731793062d446f62a4bb27d67cb2299127f794bb798f71e41c",
        "sig": "d611cdf67bd92b61d6d884ddc372e56819bed168e661e56efd45d957f1e8fd0fd175ace81dc63725b966f9ffc94ccbacdf938e31f19fef83d7ecde0aa21b85b1"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to generate and manage Nostr keys and sign events.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "c25d178ff070222cf6f7317729bcbc81d9e46c75b45ce16a84804e5f2f0884e0",
        "sig": "95243c2961ca40456993dec8c941ce436035c233d31342c5e73a5409fa976e81658966a0cf548fe70df81db38bcc1e575272db80406a2f2c365627256c514fd0"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "c25d178ff070222cf6f7317729bcbc81d9e46c75b45ce16a84804e5f2f0884e0"
            ]
        ],
        "content": "Feel free to share, provide suggestions and changes if any.\nCourtesy of\nnpub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox\nhttps://orangepill.dev/nostr-guides/guide-nostr-key-generation-and-management/",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e8a94170deb9d3ded2f60974251b0a93b83bd7e6c5ecbe2ef41fa374a8b24ba9",
        "sig": "4ca7abe424a8203e4f8c0829dd0dc81c581431f37dfdcdf52ba7e609189f6da01ad68c66a5ab89012c8ff18a0423192a850da5f23c8599bcb03cab91430f8a3f"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Sources list for new users by Intuitive Guy",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "232d0f7de237af9590bb4c13e546713d9b9b2e310d1a0178ea96a3d76534102b",
        "sig": "cfb2547eae3269feb94479431756555f19d03b643392aad90c79dd35688c6932d43c188fe7ff92bf295003a3090861b69b0fc1373f5832e9f9722f77c7e43872"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "232d0f7de237af9590bb4c13e546713d9b9b2e310d1a0178ea96a3d76534102b"
            ]
        ],
        "content": "\nhttps://uploads-ssl.webflow.com/63c880de767a98b3372e30e7/63cbd0fd993f001b403a8377_How%20It%20Started.png\nHELLO! WELCOME TO #NOSTR\n\nHere is my daily update #Nostr (and Bitcoin visualization data) sources' list for new users. Probably you know already many of them, but maybe you will find somethng new I added TODAY.. at least a new amazing cover image (from Nostrland).\n\nThank you if you consider repostig it or giving me a follow; also do comment below with new info or sources if you have.\n\nCheers to all nostriches and #Plebchain!\n\n\n\nBasic Intro\n\n\n\nArticle about Nostr on BTCtimes:\n\nhttps://www.btctimes.com/news/what-is-nostr-and-how-do-i-use-it\n\n\n\n@Dergigi list sources. Already translated into Chinese, French, and Spanish!\n\nhttps://nostr-resources.com/\n\n\n\nOthers\n\nhttps://usenostr.org/\n\nhttps://uselessshit.co/resources/nostr\n\nhttps://wiki.wellorder.net/post/nostr-intro/\n\n\n\nGet NIP-05 verified:\n\nhttps://nostrplebs.com/\n\nhttps://www.Nostr-Check.com/ (free)\n\nhttps://nostr.industries/ (free)\n\nHOW to create a POW #Nostr key pair by mads@NostrVerified.com\n\nhttps://telegra.ph/How-to-create-a-POW-nostr-key-pair-01-04\n\n\n\nNow that you have your own NIP5 handle, make it a Lightning Address to! Here is how:\n\nhttps://nvk.org/alby-? Pay with lightning\n\nGuide to create Lightning Address redirection on your domain:\n\nhttps://orangepill.dev/lightning-guides/guide-to-create-lnaddress-redirection-on-your-domain/\n\n\n\nSearch for RELAYS near to you:\n\nhttps://nostr.watch/\n\n@Ezofox free relay uptime monitoring page:\n\nhttps://uptime.orangepill.dev/\n\nSafer Nostr relays (good for filtering out spam on replies and global feed):\n\nwss://nostr.milou.lol (1000 sats)\n\nwss://eden.nostr.land (5000 sats)\n\n\n\nSet up a Nostr Relay server in under 5 minutes:\n\nhttps://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under\n\n\n\nNostr network stats:\n\nhttps://nostr.io/stats\n\n\n\nFind your Twitter follows on Nostr and connect your pubkey with Twitter\n\nhttps://nostr.directory/\n\n\n\nTop Users on #Nostr you should follow:\n\nhttps://nostrum.pro/search/#users\n\n\n\nNostrum Search home page:\n\nhttps://nostrum.pro/search/\n\nIf you want to search through #nostr notes by keyword:\n\nhttps://nostr.band\n\nWant to follow a hashtag or a keyword? Create your bot and follow it:\n\nhttps://sb.nostr.band\n\n\n\nIf you want to upload free image on a note (copy/paste image address link):\n\nhttps://nostr.build\n\nIf you want to upload gif on a note (copy/paste image address link):\n\nhttps://tenor.com/\n\nhttps://giphy.com/\n\nCool page for Nostr art by karnage@nostrplebs.com:\n\nhttps://www.nostrland.com/\n\n\n\nDo you need more Nostr in your life? If the answer to that is YES, then you'll want to check out the new Nostrovia podcast:\n\nhttps://nostrovia.org/\n\nBy plebs, for plebs. A synopsis of the best content of the day:\n\n@NostReport\n\n\n\nWhitelist for Damus:\n\nhttps://damus.io/\n\n\n\nAmhetyst app download:\n\nhttps://apkpure.com/it/amethyst/com.vitorpamplona.amethyst\n\n\n\nIris app download:\n\nhttps://apkpure.com/iris/to.iris.twa\n\n\n\nHere is a @BTCsession video about #Nostr:\n\nhttps://www.youtube.com/watch?v=qn-Zp491t4Y\n\n\n\nFiatjaf's tools for developing Nostr clients:\n\nhttps://github.com/fiatjaf/nostr-tools[#readme](/hashtag/readme)\n\n\n\nhttps://uploads-ssl.webflow.com/63c880de767a98b3372e30e7/63d9e20726c7fb097c67057c_KeysToMyHeart.png\n\nTAKE BOTH PILLS.. A bit of #Bitcoin now:\n\n\n\nHere are many beautiful and soothing visualisations also for your journey into the #Bitcoin rabbit hole:\n\n\n\nhttps://bitfeed.live/\n\nTransactions fall tetris-like calmly in their spot. You see the mempool fill up and once the block is mined something magical happens and all the transaction transform into this colourful block. My favourite!\n\nhttps://mempool.space/\n\nCant go wrong with Mempool.space. The blocks are nicely lined-up and move when the new one is mined. Pretty colours and some nice stats! Made with a lot of love and it shows!\n\n* https://timechaincalendar.com/\n\nCool one-pager with all the timechain info you need. You can even go back in time to see what block was mined at a specific date and time!\n\nhttp://bitcoinrain.io/\n\nNew transactions fall like raindrops, simple and elegant!\n\nhttp://bitcoin.interaqt.nl/\n\nBubbles, whats not to love? Each dot is a transaction and they get added smooth and playful!\n\nhttps://lnvisualizer.com/\n\nAll the lightning channels to see! Zoom in, zoom out, have it static, it's nice.\n\nhttps://bitnodes.io/nodes/network-map/\n\nGalaxy like view of Bitcoin nodes, this one is beautiful!\n\nhttps://blocks.wizb.it\n\nA spinning globe centring a transaction! A bit to fast, bit noisy. Fun to watch anyway! Good distraction for a few minutes!\n\nhttps://txstreet.com/v/btc\n\nThe mempool, but then as a crowded bus station. Cartoonish and fun to watch!\n\nhttps://utxo.live/\n\n\n\nThanks if you read all to here.. hope I did not spam your feed and You will find something you needed. Cheers! #Plebchain\n\n\n\n⚡️ wrigglypie41@walletofsatoshi.com ⚡️ 💜🍀",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ac66880fef3a21a03068e308d7187102a26cb8ba6a043220a6396a1b365ab910",
        "sig": "c103e493ac63b261d24ccabd9f77ee9073cae9f6cf40ace176fcb3c7f1a0651abcb169dff62befeba005bfcb1b7f5f484cef48ad0a70baecf331c5ef5c475287"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "What's a nostrich?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "fbbb8ca12b8658011b8df89b517938c28de56a7039dd99edc309650404e2f616",
        "sig": "673e7793cdc8d9054720d6e7dfa8be4c7e0132e58211f096b011a45f29151ea629c071463e9a08c1abb742c922037f27307a70da64637c13ca81a5bc5a2e8217"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "fbbb8ca12b8658011b8df89b517938c28de56a7039dd99edc309650404e2f616"
            ]
        ],
        "content": "Nostrich (a purple ostrich) is a nostr mascott.\nThe term came to life when\nnpub1cj8znuztfqkvq89pl8hceph0svvvqk0qay6nydgk9uyq7fhpfsgsqwrz4u:c48e29f04b482cc01ca1f9ef8c86ef8318c059e0e9353235162f080f26e14c11:walker\nasked ChatGPT to write a joke about nostr.\nhttps://nostr.build/i/nostr.build_c7549ccb80f6bfea2afc464a9467491168a278e78a763299178e62e0850169ea.jpeg\nHere's some Nostrich images\nhttps://nostr.build/i/walker/01.png\nhttps://nostr.build/i/walker/LxHDoJ7P_400x400.jpg\nhttps://nostr.build/i/walker/2087.jpeg",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e8c933dda7e67e81a27ca86e11359528917b4fe29347da14a72b324d0db427d0",
        "sig": "6e762da8098f0624837a3f7977fc4fb277865b9adb3ea64d2c1afefc49713675bcb7442c6f05f9d6fb4cf9563e192c2144a046696bbf3e48cd4cd0c1f9e89724"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "What is Damus?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "49ebcd635ceacadf9b375af249e05cfcb0924248ed35dccb33b3164ec98dfb59",
        "sig": "a03bbbef6684a1dea5077553db3b9352be63397c25912067693e63ec92cf2fdec86729c47144512d3b65e2ec935e2859dda96e8001e5ad1e096e272384a5b7d0"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "49ebcd635ceacadf9b375af249e05cfcb0924248ed35dccb33b3164ec98dfb59"
            ]
        ],
        "content": "\nWatch this simple explainer video to find out about Damus.\nhttps://youtu.be/I_A7NLIyX1o\nhttps://techcrunch.com/2023/02/01/damus-another-decentralized-social-networking-app-arrives-to-take-on-twitter/",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "b34888cc9ffcb44da5bef2c805a096e5d23ff5207b3dfbc1f81d10c683d69097",
        "sig": "5c3e56aedce578d4f4b71cf197c9a5e0b4437d21cf8e90c9f1ea6f653f2e456f5db4596fe43467e163dcf0f1907a5adcb46d5f5f5cf7d0bf15dbdfed79deca67"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Running Damus",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "cf299647dbd0216922d865802eaad6e6e381c7be3a918441c8ac2023e26bf2c7",
        "sig": "a296a44374e48793f5a9e642c0b977bd27d3fdc9ad33f93f0621deac675ec43a544dd3021d131ea88ff371a43089ceffce272988fd11eb61c8bb5849fe1c2b3f"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "cf299647dbd0216922d865802eaad6e6e381c7be3a918441c8ac2023e26bf2c7"
            ]
        ],
        "content": "<strike>To be able to test Damus without participating in the TestFlight beta you'll need a Mac and optionally an iOS device (iPhone or iPad).</strike>\n#### Damus is now officially available in the App Store.\nIf you'd like to try the latest Damus features, you can get the source from github and build the app yourself.\nYou'll need a Mac and optionally an iOS device.\n1. Download Xcode from the AppStore on your Mac OS.\n2. Clone the official Damus repository from GitHub.\nhttps://github.com/damus-io/damus\n3. Open the project (the repo you've just cloned) with Xcode.\n4. Don't have/want to use your mobile device? Jump directly to #15.\n#### Follow the steps below if you're building on iPhone.\n5. Enable Developer mode on your iPhone (Settings -> Privacy & Security) and restart your device.\n6. Connect your iPhone to your Mac.\n7. In Xcode, click on iPhone 14 Pro text (top panel, in the middle, next to damus).\n8. From the list that will open, select your iPhone.\n9. Click on the play icon (left panel, on top).\n10. If you build it to iPhone for the first time, it will fail.\n11. Click on the failures you have, to change the &nbsp;<i>Team</i>&nbsp; to your account (Apple ID).\n12. Change the bundle identifier to whatever you like.\n13. Delete &nbsp;<i>Associated Domains</i>, &nbsp;<i>Keychain Sharing</i>&nbsp; and &nbsp;<i>Push Notifications</i>.\n14. On your iPhone, go to Settings -> General -> VPN & Device Management and trust &nbsp;<i>yourself</i>.\n14. Build the app again.\n#### Building on simulator.\n15. You can use a simulator instead of a mobile Apple device.\n16. Click on the play icon (left panel, on top).\n#### Running Damus.\n17. Wait for the application to build.\n18. That's it! You can now use Damus without participating in TestFlight beta.\n\nThanks to npub1fmd02wwyjrs3yagacdrhzar75vgu9wu0utzf6trvumdrz3l3mzrsm7vmml:realmuster for contributing to this particular guide.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ef29442dc7c48cd801612a873128b442e30dd1e17e3dd0861cec228ef3389885",
        "sig": "0d9494f3ed0722f64464ed3d4c8bb0b91a3c6a9422654475dc3b7dfb09136cbc3e45292ecf3f81783b45be7cddbdaa960c922492993ccda4c648db5abf8ad3cd"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Mining vanity keys with Rana.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ff615801317612424e77809d084d3174d4be3aa7ce094f0bb780fedc797bd548",
        "sig": "33bf50a88b5b14a9cee5f9c58fc475a5ec8cd8985b3d7e6be3655fbd042cffa3df44a725eb0fa83d2a60fd3aa4020eb9bfcb3ef8e5f932d7ab9e0a92bb986075"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "ff615801317612424e77809d084d3174d4be3aa7ce094f0bb780fedc797bd548"
            ]
        ],
        "content": "Since your keys are your identity, it's advisable to, instead of getting a random key pair, find (or mine) one that can be tied to your online presence.\nHere's some vanity keys:\nnpub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc\nnpub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9\nnpub1artur379gp42kd39rlsgx703ytke8fwhydytdf6qlezv8mtlqk6q8akg37\n#### What's special about these keys?\nIf you look closely, you'll see that each of these keys has a certain prefix (respectively dergg, sn0wden, artur).\nIt means that the owners had to use some energy to guess a key which contains that given prefix.\nThe difficulty of finding a key with a given prefix grows exponentially for every character added.\nDepending on a prefix, mining can take minutes, hours, days or even weeks.\nIn other words, vanity keys are the proof of work that was needed to find them.\n#### So how do I mine a vanity key?\nCheck out Rana, which is available at\nhttps://github.com/grunch/rana\nHere's a good explainer by\nnpub1rpes5hhk6mxun5ddt5kecxfm8y3xdr0h5jwal32mc6mxafr48hxsaj2et2:18730a5ef6d6cdc9d1ad5d2d9c193b3922668df7a49ddfc55bc6b66ea4753dcd:Mads\nwhich can shed some light on the whole process\nhttps://telegra.ph/How-to-create-a-POW-nostr-key-pair-01-04\n------------------\n<b>Mining a HEX key online</b>\nhttps://nostr.rest",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9f940382e3ae12170dee09b11cb05ea94c9ba85a5e95adb23e01f25558bd5fa4",
        "sig": "8254ac6cebae802b5bb3da8b207ab46afb92d83b58056e8a6561e6188f6a638d7117b94d5519c3e6bfa6c2a4b7df37340848845d39c7d83e1ac3b9282fbc63ed"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Logging in with someone else's key.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "f6adb1f72a5eee0486a909970fcaa49e58165f143790a7e1bee569ded5fadab3",
        "sig": "46aa4d53b937af88a37964e255f421360c113038085002bb1cad1c13cd9ea04984e3db16d203b4c5b9185fc7e4c2126323deee58cb3fb9b7c7a2057908d74709"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "f6adb1f72a5eee0486a909970fcaa49e58165f143790a7e1bee569ded5fadab3"
            ]
        ],
        "content": "One of the cool features of Nostr is that you can log in with someone else's public key and see the world through their lens.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "20cd42de95e03727ee533d1e47de7fb4318c19c5ca9e23a36b60a48f476d6f42",
        "sig": "f6fd51f7ff68d8d55d6b9be454dea21f7be1eba5cf73b07f7bfff8b0d84ec6bb70ecdd7ee53722e61b8478326d0feb14d7f23316e7eb7c5143a55ffb0802f8b5"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How do I tag someone?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "26f62427ce6947b04fed6e40a87acc643f64f1ca1247f21edc7b8cff3aed7e74",
        "sig": "1029d0862c5794b6013b33b4040579af70915bf65cc6fadce971ae9bedd6f8fce01ec3ae5fb9b8fc50bcdb89658d4d352f82c05ca47f0d47e2f53ad276e90bc1"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "26f62427ce6947b04fed6e40a87acc643f64f1ca1247f21edc7b8cff3aed7e74"
            ]
        ],
        "content": "<strike>Use this person's public key instead of their handle. The public key can be obtained in a person's profile, under the key icon. Then, to tag this person, you got to put the @ symbol in front of their pubkey (@pubkey) eg. @npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4)</strike>\n#### These days, most nostr clients support tagging by user name.\nTo tag someone in a note, type the <i>@</i> symbol and at least the first letter/digit from the user name you're looking for.\nA list with user profiles should show up.\nTap on a profile to select it.\nhttps://uselessshit.co/images/tagging-example.png\nYou can tag multiple people in a single note.\n<i>You might only be able to tag people you follow.</i>\n<i>Also the search might be case sensitive.</i>",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "8acf5a4647bef8c7b79862d025ba90071c7ebeeeb331b5ceec18e2243c9ef470",
        "sig": "d5e6d3f080390eeabfe7c243deea647c321152ac0a997b73004ed0c2905e56ffc360995a7d91cee99d91db7b3619c22951cfb63a005fbbdcc6c5415c7aa5773d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to add an image to a post?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e0d7a9d264aca8e2d904b3a63d7898c8247c1c027cd130d62a9eea1e09f2f4d8",
        "sig": "343aa35a044b8748c2cdd455a17f6efe241bda1f783007ebbe4bffbb25c1b484d1ae0cb5a75cce896e2269a439e5f90214a18da6f7be9737d318fdd388034a2e"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "e0d7a9d264aca8e2d904b3a63d7898c8247c1c027cd130d62a9eea1e09f2f4d8"
            ]
        ],
        "content": "Image urls are processed and displayed as images. \nFor now, only some clients (like snort.social) allow you to upload images directly from your device. \nIn most cases, the image has to be hosted somewhere before it can be used. \nHere's a list of free public image hosting services are listed below.\nhttps://nostr.build\nhttps://nostrimg.com\nhttps://imgbb.com\nhttps://postimages.org\nhttps://imgur.com\nhttps://void.cat",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "04462f2585ca3a7c21bdddbaa989cd6174c66edc56817c1464239ae7ef7ee7d2",
        "sig": "5ad2779d43e9a4d43a3d8faee562c2331b68661c853840371fd4f7cedd7ac31c4d748fd4f28a4ad4d11a13518e71c48008b3398d693246946d2d3d705d89b580"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Adding a profile picture",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "d25497854f35acc094b722510e98086f441beaf700208e5e52049a6eec2f0767",
        "sig": "ea35f33751dd1674c85a43e847d492f89b03b9d17eae3b202222f01ff24ecd2e542e66fa46b39815b670c74dd5165be0f9f1125098c8adfe77acba080ae69310"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "d25497854f35acc094b722510e98086f441beaf700208e5e52049a6eec2f0767"
            ]
        ],
        "content": "For now, most clients don't support direct image uploads.\n#### You'll need to upload the desired image to a public image hosting service. \nhttps://nostr.build\nhttps://nostrimg.com\nhttps://imgbb.com\nhttps://postimages.org\nhttps://imgur.com\nhttps://void.cat\nOnce the image is online, copy the image url and paste it into the <i>PROFILE PICTURE</i> input under Profile <i>Edit</i> view.\nhttps://uselessshit.co/images/profile-pic-edit-damus.png\n<i>Note: You can set the profile banner in the same way.</i>",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "c38b762a2bea82882447608cf38ef2d2131fedc5316f1bc7ed6605588dab4b14",
        "sig": "a8b556711305fc31f05c709915a92e0271674a4b870f1d894649ebce807076eead06a58b7c3b9760ed67b8938523a469d5f592b377172a1700d014c9aa90fc6a"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "GIFs",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9e79956e80457edc1f4517492c0ce6ddc792319ee641b30d25dc8285eb5c082c",
        "sig": "3ce00129a0b9506a7b586afb74d62cf582cb44e96da1149779b20845beae24090a1b449318d08091787b0417558041908d2c2f17cfa6870dca4c892817f13f50"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "9e79956e80457edc1f4517492c0ce6ddc792319ee641b30d25dc8285eb5c082c"
            ]
        ],
        "content": "GIFs work just like any other images.\n<b>Turning videos into GIFs</b>\nhttps://ezgif.com\n<b>Animating images</b>\nMotionleap (available on Android and iOS)\n<b>Finding GIFs online</b>\nhttps://tenor.com\nhttps://giphy.com",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "7022c7aacf52d099f3a4ff0baa1713f48f5c35cb99e44b53fb41c3b677e1eea7",
        "sig": "463036e80ccddb041ce0bfe025eaaec7b4cc6c0d2809d6a31063bcd7c25dee48234d9bd55714c7c557b611e248c8b8ac98337b3fde5218bc5e800b63b1fd13f5"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Changed my profile pic to GIF but it won't display",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "47bad0c758576944e2fadcfd218a452811eb1f022e5e0558d06805a958c3ff37",
        "sig": "418a5f7d92cabf5ed25fffd433b3c482a079bd7fdd393e4b6e34f28924dc70c8559274b1921894bd24252849e439a1ad91004bafe5eab816ec30b85ada269fba"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "47bad0c758576944e2fadcfd218a452811eb1f022e5e0558d06805a958c3ff37"
            ]
        ],
        "content": "Some clients prevent GIFs larger than 1MB from loading. Try an image-compressing tool to downsize.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "7ea10310fa06b7b2241a368059a476ece8111f4b4ac90913ab969b5542c5c8a3",
        "sig": "60eb8a33a44ea8b87249e987a7dfdd81012476b72467aefc62f11da9ab3b85ae59f11651983285e6bf114679003e7dc32ab095040e61afca5bbb15ab5658977c"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Adding multiple images to a post.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "702df2d5120794af383246d6a714d48eeae86ae32f7484093ed895bc7b7bfd3d",
        "sig": "5dd22453414b48f8842fd1a52ee1d3e5ad3362bba486dd51e02d3bfb88ebf8a2c51164a4ada395435bc20369933cedde5b8a50689f3044baff68068892c528f4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "702df2d5120794af383246d6a714d48eeae86ae32f7484093ed895bc7b7bfd3d"
            ]
        ],
        "content": "For multiple images to be displayed in a single post, simply add a direct image url for every image you'd like to see. They'll appear in a carousel (swipe left/right to browse).\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ac9980868da6f93cd1f8f942ef2efd59dfd36cb58df05818bf11771d0b2da36c",
        "sig": "4760d7c0fd2bccf712f9f66b908ca09267113c8b16003f477c5f6f03a27420abc3f44601bbc8a95c9114e29b3e2033bb4728c6c2148526972b79301d07c588a3"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to make a post with a video?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "92b3697f0ba5920b78086f052fef2dc68e91647e1177caf73e814bc01750588c",
        "sig": "07b51b00c92cbe3efc5822e0f4f026302b6a93ada25f8298710654f92c2d34160f2fd3e6da71e1967555804da43a4d3202d8d2960600776d014637d55239ae38"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "92b3697f0ba5920b78086f052fef2dc68e91647e1177caf73e814bc01750588c"
            ]
        ],
        "content": "Video urls are processed and displayed as videos. Simply copy the direct video link (it has to be hosted somewhere public) and paste it into a post 🔥 That's it!\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "a7922fa10c2e29039802d1209f0802794b7f086094492802db1e634bf51fa891",
        "sig": "a4ce15422fc510eacf45967bd36c32accfe0b3b0531ef4fa4d29b94a899deaa1a065b99023912120a42f0732b68392af8bb063b30d1cfd1e9a476596f586494b"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to refer to an existing post (note)?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ac538e516224d6bfe19aefd2bb6bacd203616f7373b43705752caf9816f854ad",
        "sig": "17695067e767211d9c3ed895590a104b258d0a8b637f6b41b371d92fc83e374e6504c640109d9cd14ee2bcdf590bef3dbfa0258634747382da1695f3de79c4e6"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "ac538e516224d6bfe19aefd2bb6bacd203616f7373b43705752caf9816f854ad"
            ]
        ],
        "content": "Click (press) and hold on the note you would like to quote. A menu should pop up. Select Copy Note ID. Then use that id prefixed by @ in your new post.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9ad3321a59a52f72b5df34508160972c0fa226a1520fa2f2cc8ac4a47727eb7a",
        "sig": "5d19aa7244a771a6b235502290a53b72ad2725dba6cea190a14ded8a9022e2cd4f5b6c7dd13f67e9f87a128519a1f56c679145bb6043636813bc6fc6ba838181"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Deleting posts on NOSTR",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "c8931d4a468919dc33c57f068cdab49d6492cae824d3770ebe377763f4c7c2e1",
        "sig": "de803e01e9219bd7d63c678acda56f7b418923a74947bbda4285758ed48617857e6abdbcc2ec2e36f3f8fd49c2dcc9647f235c276c2cceb6a929cb11825fdb15"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "c8931d4a468919dc33c57f068cdab49d6492cae824d3770ebe377763f4c7c2e1"
            ]
        ],
        "content": "<b>You cannot delete on protocol level, you can just tag a note as deleted.</b> How relays and clients deal with this information is their choice. Eg. clients can choose to not show deleted-tagged notes; relays can actually delete it. However you can never be sure all relays to which your note got propagated do this. Pretty impossible to actually delete your note through the whole network.\nCourtesy of \nnpub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ff694c5dc66337d16de5267c27a7becc6b8a8b09bbda71e9129c9427672a247f",
        "sig": "8df2d6f0c54539d7e3af57f09288470c45ac7ddf1e8824a0db24577d0794abd62135ba0493999f45e113cc8cbdd5b1734b821f9c2a88c7fd4f2a99cd4467da0c"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Deleting accounts",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "78a992d765605da9e3b49258a8434bee970ec70398da080f35358ae5bf7e5132",
        "sig": "aab264eacf7c0b931301d45e725855e1522800699ff0a06ed6ccbabd4ca949fe8c4159d56f02a1f9fdff829dcc520f0e049ade1f8ab384e003454ccd87dc98fe"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "78a992d765605da9e3b49258a8434bee970ec70398da080f35358ae5bf7e5132"
            ]
        ],
        "content": "You cannot delete on the protocol level. Some clients might allow you to delete your account, but they only mark it as deleted.\nYou can `delete` your account on Damus in <i>Settings</i> by tapping on <i>Delete Account</i>.\nhttps://uselessshit.co/images/deleting-accounts.png",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "b7f42c1c370ab0e65b7199c858e99442f72bccd609ac84b4197e6abc57558611",
        "sig": "2f94caf08919c53cc95214df0673aca6e37d484ee7bb0eef206dd6fec288e713cf323df8b6a785c3c6cf8187892f5a2a11ecbcb511eef6e608001f05d2d2cda4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Sharing notes.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "671af410cc8cb8db3294586ac04bba36a89877ff4ae2b675085d68e8e9944306",
        "sig": "63ed9bfe1dab973db3a9d5d47db798eae47584cb262e92b3e0a98a07465ddc0f1e94e3c8e26632ae0bf0ec5efe2c6539098e5ce694b6b93e02407c1ffa78196a"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "671af410cc8cb8db3294586ac04bba36a89877ff4ae2b675085d68e8e9944306"
            ]
        ],
        "content": "In some clients it's now possible to share notes between different apps. Simply tap on the Share icon under the post and choose a desired option.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "54210c866cc47d438a25dedb0771657c3cbbe2b7d94c82d1967387e5add2f1b6",
        "sig": "eaacc0b50bd8645426c1fd928df3ff33e8394bf1f8d918f94101d3eafe45395e78fb55054405662acc37a8690acdb5192440c997b95caae86fe96a8b81c07bd0"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Reactions.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "535ee86bf9de200c2fd2b24d1a2661244038cdabf557f5eb683657ad4b65604a",
        "sig": "1ea7026d706cad383c5f2033d67b4051739a629e441300054dd2ea63da37b9565ca18df0f3846e2ef6fc0e78b28588264263357aeb6ea454dc98e4e6e322e396"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "535ee86bf9de200c2fd2b24d1a2661244038cdabf557f5eb683657ad4b65604a"
            ]
        ],
        "content": "Since Damus build 1.0.0-6 you can now see who liked your posts with the new reactions view.Reactions can be viewed from the Thread screen.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4f6af29a63007259f477f25de06078707d5b49dc9d3b5b3ec6fb0d23d54d6339",
        "sig": "94bb5f37db8fa1b31c80cec7c6b6a5191c4afa2492e4858ad0cf25d497da60dd88f71ee2d1e406aee6bca35e0dd885fe52ed7406e05cdad3c1d3ac7920bc747f"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Left hand option for the post button.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "1ed4700a75f4b2817447341f96309098d365045fdeae6b4a3e2cbf3045ddecc1",
        "sig": "7ce3071f87553105dddb3a54aa782d83074012c9a4dc678980771ba78f98c5de9642bad7c90daee7e3edc04a12edb71f005c75c9dc57bd14f903113604a5d682"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "1ed4700a75f4b2817447341f96309098d365045fdeae6b4a3e2cbf3045ddecc1"
            ]
        ],
        "content": "In the latest Damus build (1.0.0-6) it's now possible to move the post button to the left. To do that, go to Settings (tap on your pfp in top left corner to open side panel), scroll down to LEFT HANDED section and then tap on the toggle. Restart the app for the changes to take effect.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "484fd2bbee71af0383975e9f8ee4d98916f696cc374909d2309f2405b6770b3a",
        "sig": "775b0db16153a7f249c8f9ae949b4885ae8edce5194ba8efe87f4896e40c27bdddb2b4f4d0b3826e6a4c77eb610ef5fdfc799b93cf7fbb7d773905e65bd9c8b8"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Are DMs on NOSTR private?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e1d45d659fa0c949b406c71802c98ac9d83310513810dc2a1b8a62eaed7925ed",
        "sig": "61053a20275d1b817270abc93af96b59bbac56e0ffcbea511f183b6ee3ed337d029cc2d26b1fd53684715b31715c34c69596677f368f9bc7c83daad931c3af54"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "e1d45d659fa0c949b406c71802c98ac9d83310513810dc2a1b8a62eaed7925ed"
            ]
        ],
        "content": "<b>Consider your DMs as public, not private! Never ever share any sensible data via DMs!</b><br/></br> All DMs are publicly visible. However, since they are all encrypted, they can only be read with your or your chat partners private key. If one of the two keys gets leaked, the full chat history is visible to the public. Since you do not have any control over the key management of your chat partner, you should be very cautious what information you share via DMs!\nCourtesy of \nnpub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3:b93049a6e2547a36a7692d90e4baa809012526175546a17337454def9ab69d30:StackSats",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "31519c73adf48aec7634eb5a6955488882bbcfc40ca5a04f3e5089119b4ad82f",
        "sig": "ba35c7987f5020a7032b64a32eaf79b09b60e65aee31c8cd21c94b046e6ae845baa0b293225aa9d8d6de2c7411ce644c4ddaa38ed8e2f26a7a46901713e34f27"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Do DMs on nostr disappear after certain time?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4da130ac3f95ef0b5d5b80f5cb3ab0ad5e9e044abc0062c2213c92f36a1a80f6",
        "sig": "3e18e813ad5256ed96f493ee80a97ac6307c048dc57e0a54f5227b56e968a774b302e12f97e31af502f4d1de39dfc98469305d5379f8bd77468fa1c33043bed6"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "4da130ac3f95ef0b5d5b80f5cb3ab0ad5e9e044abc0062c2213c92f36a1a80f6"
            ]
        ],
        "content": "\nAnswered by\nnpub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s:32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245:jb55\n\"DMs may not be mirrored between relays, so they may get lost over time when relays disappear.\"",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ca5d361c732e4366070a6d6e5d3a01d48d9c28eaa64bdb6567b446814d135594",
        "sig": "19ae0cb34ba5259f29e155aeffb9ee573de5636765c422ee0a9003412950d16372133dc2e3291f14f85a6ea8a6b90010a644f659b714c1a53a4369862c2acce2"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "WTF are zaps ⚡️?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "0ba8ce69de3f8c81b9eaaa87f035ca3d281e28078aa31b35dd176641c3197ce7",
        "sig": "dce0503eca49612ed0841efdf212fc0f5344bb744e7242f560becdde72ad91284ce3181b0b5dbd9d7d4ee5bb8d9d36b29264fd942bbdc7d486d7b34f5b3c440f"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "0ba8ce69de3f8c81b9eaaa87f035ca3d281e28078aa31b35dd176641c3197ce7"
            ]
        ],
        "content": "\nhttps://uselessshit.co/images/zaps-definition.png\n1. to send unstoppable, ungovernable and permissionless money to a person or a group of people in a matter of seconds as an appreciation for their doings.\n<i>\"I just zapped you 1k sats\"</i>\n<i>\"Thanks to whomever zapped me 69 sats\"</i>\n<i>\"Zapping is highly appeciated\"</i>\nhttps://media.tenor.com/UcJMMDEAkOMAAAAS/big-trouble-in-little-china-raiden.gif\n#### Zapping people on NOSTR is a breeze.\nMost clients support zapping through profiles, whereas Damus, Amethyst and snort.social also allow for zapping through notes.\n#### This guide is for zapping on Damus.\n#### Zapping through profile\nOnce on the profile view, look for a button with a lightning bolt symbol and tap it.\nhttps://uselessshit.co/images/zaps/zaps-06.png\nA new view should pop up, asking you to select the lightning wallet you'd like to use for zapping.\nhttps://uselessshit.co/images/zaps/zaps-07.png\nTap on the desired one and enter the amount you'd like to send.\nhttps://uselessshit.co/images/zaps/zaps-08.png\nTap on <i>DONE</i> and <i>OK</i> (for Wallet of Satoshi).\nhttps://uselessshit.co/images/zaps/zaps-09.png\nThat's it!\n\n#### Zapping through a note\nLook for a lightning bolt under a specific note and tap it.\nhttps://uselessshit.co/images/zaps/zaps-01.png\nThe lightning bolt should rotate 90 degrees and turn yellow.\nhttps://uselessshit.co/images/zaps/zaps-02.png\nSelect the lightning wallet you'd like to use for zapping.\nhttps://uselessshit.co/images/zaps/zaps-03.png\nThe zap amount will be whatever you've set in Damus <i>Settings</i> -> <i>DEFAULT ZAP AMOUNT IN SATS</i> (the default is 1k sats).\nhttps://uselessshit.co/images/zaps/zaps-04.png\nTap on <i>Pay</i>.\nhttps://uselessshit.co/images/zaps/zaps-05.png\nHoorey! You just zapped someone through a note!",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "23c059fb4657399e300b952f97f76cf7ae6e6d72406c935b590f76f0ae7335a0",
        "sig": "8a6fccec0319ffec475236216ec15343f6a20fafa1868b5b4cbe11c9aea14338420d71ad8504f44204de46cc1e3eaedeb1b033f9c2a4bf4f3a37666c4d1da684"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Receiving zaps ⚡",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "f8a30b3826c725ea24c6acd52aa3b8b3338df98ce0da4035322c13c91539e30e",
        "sig": "99ea880d1b7c20f1d16a5051441e9273e12acbf9b717522a7a3ecf0cc80442564e670d129b02c6c0d3eb1764f1690cf1ba4bbd7cbf18b69a1389ffd24314c2fe"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "f8a30b3826c725ea24c6acd52aa3b8b3338df98ce0da4035322c13c91539e30e"
            ]
        ],
        "content": "With bitcoin and lightning it's easy to exchange value. Nostr protocol is where this can be seen in action. Make sure your profile is set up correctly and people can send you sats and you can experience the V4V magic first hand.\n#### Instructions for setting up your profile to be able to receive sats\nYou'll need a lightning wallet which supports LNURL pay.\n#### Some people put lightning invoices in their profile, which are one time only, thus aren't able to receive sats.\nWallet of Satoshi for mobile (custodial) might be a good choice to get you started.\nFor desktop/browser try Alby.\nBelow instructions are for Wallet of Satoshi.\nTo get your LNURL or lightning address, open WoS.\nTap Receive.\nMake sure you select &nbsp;<i>Lightning Address</i>&nbsp; tab in the top right corner.\nEither click on &nbsp;<i>Copy</i>&nbsp; to use your lightning address (e-mail like)\nor on &nbsp;<i>QR Code</i>&nbsp; to use LNURL (start with LNURL...)\nNow navigate to your profile in the client where you're logged in.\nTap &nbsp;<i>Edit</i>.\nFind BITCOIN LIGHTNING TIPS input (depends on the client; could be named differently)\nPaste the LNURL or lightning address into the input.\nTap save.\nThat's it!\nNow remember to test if it's working!\n-------------------------------\n#### Instructions for dropping a one time only lightning invoice.\nYou can drop these in a note or a DM.\nHere are examples for a custodial and a non-custodial wallets and Damus client.\n#### Wallet of Satoshi\nhttps://uselessshit.co/images/lightning-invoice-wos.png\n#### Phoenix Wallet\nhttps://uselessshit.co/images/lightning-invoice-phoenix.png\nThen simply paste the lightning invoice into the note.\nhttps://uselessshit.co/images/lightning-invoice-damus.png\nNow someone will be able to pay that invoice.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "7d7f4289142145061540968b534aa284c2f16dad6bee43fa71629c967135a2c6",
        "sig": "d862bba373c6a472239060d60593e0dd04c1c4e3497dad79b399f1cc0877d04b80dd62bbff3e2b4889dc5a3c13746522269ca9feea672be07530920ef4dd3378"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Dropping lightning invoices",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "b0cda0eadbc2648daac37f1bc27826f73187ce683dc2bfc0badd4fb4b094c365",
        "sig": "38360ef819a5531dcbcb20028eac75b03309d606bde9236719261ba9e357d8995a1f690baf99318c0d4672165f7fc7defa9b8d8ccd0d7a8d2478455e63e97b75"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "b0cda0eadbc2648daac37f1bc27826f73187ce683dc2bfc0badd4fb4b094c365"
            ]
        ],
        "content": "Open a Lightning Wallet of your choice, click Receive, edit the amount and copy the Lightning Invoice. \nInstructions for different wallets are pretty similar.\nHere's some examples\n#### Wallet of Satoshi\nhttps://uselessshit.co/images/lightning-invoice-wos.png\n#### Phoenix Wallet\nhttps://uselessshit.co/images/lightning-invoice-phoenix.png\nThen simply paste the lightning invoice into the note.\nhttps://uselessshit.co/images/lightning-invoice-damus.png\nNow someone will be able to pay that invoice.\n<i>Some clients support dropping multiple invoices in a single note. Simply copy & paste lnurls, separated by spaces, into a new note.</i>",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "93a0f410c08b976fde518cde7ea383defec8abb4bbf676a25d8423b837898783",
        "sig": "19744906d658c83beb71cf32dc3265af31cf7573fcd8c0679700c9517586c9782a397eb55c607d5458769b803d518a2aaa89870c1646d6ee27234d157a70da13"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "#100SatsTheStandard",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "fc98697991256046a4289ed097a48191705ea5343eb0323a4c0e1147fb3bc89e",
        "sig": "e9ebfc68c5915186acb5da476c233c09cb1d227c867b1f34639b0b76018b81406c7d6cae9dae16af539b179200ca8b582ae394eb699a0b3b35183b840b64af08"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "fc98697991256046a4289ed097a48191705ea5343eb0323a4c0e1147fb3bc89e"
            ]
        ],
        "content": "\n<i>Want to test out lightning on nostr and get free 100 sats?</i>\n\nPost a lightning invoice for 100 sats.\nTag @bitcoinbull\nnpub1gl23nnfmlewvvuz7xgrrauuexx2xj70whdf5yhd47tj0r8p68t6sww70gt:47d519cd3bfe5cc6705e32063ef39931946979eebb53425db5f2e4f19c3a3af5:bitcoinbull\nWatch the magic happen before your own eyes 🪄",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ddbc9c77a149aa01d397f1835f9049fa577b37a546608905b090b7cfad847673",
        "sig": "251b49fe014219de1da8dcc2a691e2347dc8144f205d315908bf9b39501a93133addf36a54275b0400c319dafd7f9f613036a5ce65c2b421656da5e74bf86cb4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "(NIP-57) Zaps compatible wallets",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "42b62ca567f92597959b3a992ca2ccb85807c04648053fce1fe6a6894934fa4a",
        "sig": "3346789b3096b75b8ed84272b93c69d47ef871ca513cebde0dcf71e811e5bf6b3ee458862c6852771531959efb90e3f8ddfa296f4a2a341f673f6c8fb4c1473e"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "42b62ca567f92597959b3a992ca2ccb85807c04648053fce1fe6a6894934fa4a"
            ]
        ],
        "content": "All Lightning wallets can send Lightning tips on Nostr. Only the ones listed below are aware that Nostr exists and can communicate with Nostr, allowing for the Zap count on posts and profiles to increment.\nstrike.army\nvida.page\nBitcoin Jungle\nln.tips (LightningTipBot)\nGeyser\nBitcoin Beach\nWallet of Satoshi\nstacker.news\nAlby\nZBD\nCurrent (Client+Wallet)\nfountain.fm\n\nCourtesy of\nnpub12262qa4uhw7u8gdwlgmntqtv7aye8vdcmvszkqwgs0zchel6mz7s6cgrkj:52b4a076bcbbbdc3a1aefa3735816cf74993b1b8db202b01c883c58be7fad8bd:DerekRoss",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e51ea45d81a83b63c37520d04d47d996c6b73de27a7bfe59faee726445c49163",
        "sig": "06a1386a402157273c75c71285bb3fa6c05e278b14c5049cf6f1632d55de07c7e7b6e92c63ac6e251d30ded287d2da66083072cb7e15b96acef071d49adb37c1"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to turn off 'Allow to paste' prompt on iOS?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "583383f0f589daee69a98c71aa6a8675283a5b751f040b5810af3ed7c3d5594e",
        "sig": "83b5b0ae2f68578285ccd1b5f431a34ac7e42fd589ef137c10f9e9c20cbddc22f408dd743d11c669fdc2146954b798a615bb9a9ad742a08ed649d6f48ea0075d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "583383f0f589daee69a98c71aa6a8675283a5b751f040b5810af3ed7c3d5594e"
            ]
        ],
        "content": "\nFor a smoother experience, when interacting with nostr & lightning, you might want to disable the <i>Don't Allow Paste  Allow Paste</i> prompt.\nhttps://uselessshit.co/images/deny-allow-prompt-01.jpeg\n#### Disabling the prompt on iOS\nYou need to go to the wallet's of your choice settings, in your phone settings app (eg. <i>Settings</i> -> <i>Wallet of Satoshi</i>) and change <i>Paste from Other Apps</i> from the default to either <i>Deny</i> or <i>Allow</i>.\nhttps://uselessshit.co/images/deny-allow-prompt-02.png\nhttps://uselessshit.co/images/deny-allow-prompt-03.png",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e291ea55e0849ffbfc0fb43a058ba192ae349c8509ca2fa8edc2ce9fb9145558",
        "sig": "c6bd172bb64fd007b8baf6ff924320494307ca78115c04c928d5f4e31a22d3ac59f0e180e859918ed6c873db52dc6023b6082e78aea0a4f4c59f67441a24466b"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Global Feed",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "a01f71135bdf15354703baf0d0762ce620873699648e84fe5240e2966502ebef",
        "sig": "748983ec098f1367f9fbe94eb5d23cc891011d932b22a73720efc4fbd9c9504d4bdb07cd54a80e49ffce3ee484aae4af97e0ea9fdbdb3866fcdd4740208834d0"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "a01f71135bdf15354703baf0d0762ce620873699648e84fe5240e2966502ebef"
            ]
        ],
        "content": "Nowadays, if you're using free relays, your global feed will likely be full of spam. With the raise of paid relays, came a solution to cut it out - the admission fee keeps the spammers at bay most of the times.\nIf you'd like to keep your global feed clean, you might want to add a bunch of paid relays to your relay list.\nPreviously it would mean that you'd have to drop some (or all) of the free relays.\nThis would also mean that you wouldn't be able to see any profiles or notes that are stored on those relays.\nWith the <i>Global Feed</i> filters you can take the advantage of subscribing to paid relays without losing any of your data.\n<i>Tip: The admission fee usually applies to write access, so you don't need to pay the fee if you only want your</i> <i>client to read the data from a paid relay.</i>\n#### Instructions for Global Feed filtering on Damus\nOnce you have some paid relays added to your relay list, you can change the filters on the Global Feed to only show data from paid relays\nGo to <i>Global Feed</i> view and tap on the funnel symbol in the top right corner.\nhttps://uselessshit.co/images/global-feed-01.png\nPick desired relays by them toggling on/off on the list that will show up.\nFor a clean feed you might want to select paid relays only or experiment with different setups.\nhttps://uselessshit.co/images/global-feed-02.png\nNow you can enjoy a clean Global Feed.\nhttps://uselessshit.co/images/global-feed-03.png\n\nIf you'd like to keep Global Feed clean and still be able to see data from free relays, \nyou might want to consider adding a paid filter relay.\nCheck out this link for more information.\nhttps://github.com/nostr-wine/filter-relay/blob/main/README.md",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "3a3ec0dc4f0fc9e89ba641f7e4cf6dfac9df90e5d433fc050f54d0c702ba0bda",
        "sig": "80fb40cca2b7d52ab4a51b32619c2bbecd696d43f6382dc10987bba59fec2a7b7f372060b0fbee059388278917f26e2d11517ca4e937164d53a300c2f165c026"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Nostr Starter Pack™️ 🔥",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "7b4b13a7d771c83ddb221f72a45adb404911b63b22636aceeac61aea434429eb",
        "sig": "d7ab1cc2f872c0c2a1df3616cf16d1a795c43f0d832ac0a97dad2097849362931f7504321733dfaa9ceceb088ec3c722d84f5ddf371c1dbb65bcc53893a5ba1d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "7b4b13a7d771c83ddb221f72a45adb404911b63b22636aceeac61aea434429eb"
            ]
        ],
        "content": "Nostr is unlike any other place you know. At the heart of it are passionate individuals, with a simple mission to make this world a bit better place for everyone. When you first join nostr, you quickly notice it's unique vibe full of love and care.\nTo get more familiar with the vibe on nostr, have a look at the <b>Starter Pack™️</b> by\nnpub1lrnvvs6z78s9yjqxxr38uyqkmn34lsaxznnqgd877j4z2qej3j5s09qnw5:f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9:corndalorian\nhttps://uselessshit.co/images/nostr-starter-pack.jpeg\nThese are a big part of the nostr history and its present.\nAs you spend more time on nostr, you'll get to experience its essence in many different forms and have the freedom and power to shape its future.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "bcb2453b935f9a4c2ded43a6c64e85c9a6db3072862614124ba8bd5c9d1e85b0",
        "sig": "53f4fea2b037e8ebe37fc32f36f0e6ef726bb58962f44c9586603ccad973b3eaa9eddcc4305b4b1676c12bf18994268af115bcdc29b9cb36a4045f6f4ad58579"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "WTF are badges?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "0a00554a6b6d734c60e1234f2797d0d2055964956d8e41cc04de297f6b7d7bb8",
        "sig": "ff00a71d1796ae5db69757973370ae52fc933de3f27bd6c13b4dcdd4ce397f9850c5d0417b5492d5d1a2040dd8ad8031cfcec47d7d6c54ff5864950ca6de101f"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "0a00554a6b6d734c60e1234f2797d0d2055964956d8e41cc04de297f6b7d7bb8"
            ]
        ],
        "content": "\n<i>Users MAY be awarded badges (but not limited to) in recognition, in gratitude, for participation, or in appreciation of a certain goal, task or cause.\n</i>\n<i> Users MAY choose to decorate their profiles with badges for fame, notoriety, recognition, support, etc., from badge issuers they deem reputable.</i>\nhttps://github.com/nostr-protocol/nips/blob/master/58.md#motivation\nhttps://uselessshit.co/images/badge-01.png\nVisit https://badges.page to create badges or to accept one you've been awarded.\n<b>When you log in on browser, be sure to use a browser extension for security reasons!</b>\nnostrich.love badge:\nhttps://badges.page/b/naddr1qqxxummnw3exjcmgd3hhvegzyqqqqqazeqrkggc53ls4u0l47xpwqvzvlak7fxdr74844hlrkq2wvqcyqqq82wglxtgyl",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "f43ffb0d53a3c230f218aa84d7013e1599885a5142c4007992c27ffb17a6be6f",
        "sig": "5882b7c14c000772dbb719c52982b2eff9ddd9426ab5d18df5cb79fa9f33b638717450392a25335d7f2472830bdc9b6f5745933c596641d21b6434912c5db026"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How do I select a default wallet?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "d9b4050047eee1d8394945ba90d373f7ff187adc9498e7c2277035ecdc0f0535",
        "sig": "355a0b39bfbd24c5d2c993ac62b153037f0bf5f265a3585176ed111d60987e1b1954d70bca4f8bd8eda35f184b51a4d04dacbd2ee04e0288548bd8af592ada77"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "d9b4050047eee1d8394945ba90d373f7ff187adc9498e7c2277035ecdc0f0535"
            ]
        ],
        "content": "Open Damus Settings, accessible through side panel, which can be opened through tapping on your profile picture in the left top corner.Scroll down to WALLET SELECTOR section. The default wallet can be chosen from the list under \"Select default wallet\".\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "31e902c2354040a797b22ff7fb1f066d48f3d73f0ddfce5c6faae712d9730716",
        "sig": "285c960962804507bf5dee9a5e44e35c1e278448e876cd97c58788e7d0fe8460db3daa1693eb24254b1c507b4d1c078b76db5e52326a31fe5aac1a8777501f55"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to switch to dark mode?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "110873861e329cd6bbe62ba7c844807f1a643789028fabbd466e023441d1a964",
        "sig": "2d6edca25360212f1c7d7b508d56fd8642f7432e41270c71d5c7dcd175d3a69d0d9a86a17df96e24495581f48fc02a5cd97564e05e22cb8bcaa374238e1873af"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "110873861e329cd6bbe62ba7c844807f1a643789028fabbd466e023441d1a964"
            ]
        ],
        "content": "Set you iOS theme to dark.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "be641384e63a96d2b6593a9fa98e4ea465d7c4feae3d66681d70dcd9a0aecba9",
        "sig": "acaf368d32338cd7f59612b8ccc15d77add279318bcfdbfd7681524a2cb40e34eab15ece0111bc060a99a680ffc261f52dfa357f85fd0d07bde3df4a30ccacf5"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How does one clear cache?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "05b5a64655f208dd99163881686ca5e9aca95671a5029a0c57b11fa85a2ead40",
        "sig": "d44d27da2f9e9ccdf7557d0df50bff24a0d272ceaa53f40cf2f0b98e5e58cdc82dfc1bca3e074e32a76e73a720d35fcd1ca40b622c8aab690794bdf6f67b2c20"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "05b5a64655f208dd99163881686ca5e9aca95671a5029a0c57b11fa85a2ead40"
            ]
        ],
        "content": "Clear cache option is located in Settings (side panel, accessible through tapping on your pfp) under CLEAR CACHE section.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "0df9ebbb18f0baca744288fa24ae1dacf80030b6aaecfc75645806716dc7c903",
        "sig": "30f8f80b56f0561b397fc028e2a02abea33f851af94979f5f604070430ca18083568f853a0256161aaae5f2f9395e3b4dfc606aa05b575d36712d04a90c2169d"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "How to save an image posted by someone to my Library?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "fa062e823ac748d16afa7242a70a59f1ba512063858e9f259c3722078ecdd870",
        "sig": "94f0e6d6f6008af8e24a7d946eaabf797a2f6f29899b8f220f57bda32234237a0e6ec51b8dae6771d8dc18e0947af8b422c4802c1b317a8043ea0041171f90ce"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "fa062e823ac748d16afa7242a70a59f1ba512063858e9f259c3722078ecdd870"
            ]
        ],
        "content": "Tap on the picture you want to save. In the newly opened window tap & hold on the image and select Save Image.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "3dc3bd8d29e910de492e7b093d97c76147c41e049f46657be89f606c2d857f3f",
        "sig": "7ba6da6dbc6dbeae175914de80a7ca0806ffed8dd23d66bbeb1b089ca156ba8ba50f9684fea92b886501efcf63ea956ec368e303595177b4db9d298e366896c6"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Who to follow?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "5f4add6e362a8cb60d9d1d9d9a50457b8c81370985dbfef7d3b0144aa50e25ca",
        "sig": "b56283ea756be78bc36f0c828b4a3bb65ab04ce607f78c6a31ea79da7f274fd7390d973cab2f6eb167c6e23679194df0b2f34bde10cfb94274562e34a41024eb"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "5f4add6e362a8cb60d9d1d9d9a50457b8c81370985dbfef7d3b0144aa50e25ca"
            ]
        ],
        "content": "Start with following yourself ⚡ (apparently you can't do than now in Astral). Next best step is to find a Bitcoiner and follow some plebs they're following. Also you can check under the hashtag #Plebchain or look at the profiles with the most followers at nostr.io\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "5dc62314b3f1611cbde0e9125b6907e993fcf3e20ec2d3c7b2c410ade974c316",
        "sig": "d498c03805ff7481b2e52a21a44d7194a26f69732a8679556d222912873e59de7686ef9206a2e18cd3549dd0e3206af92dfb10d6ce35ea8d70f732dc4f49a489"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Finding people on BitcoinNostr.com",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9074d1ba8b56f0c1d6df8c343d9f4da1938217084b83734d9daad0746910886c",
        "sig": "0caba3d5347d9949ac1d90dfbb16321ca053db84fd86dfc7e9bcc608de069f9f306b9133d6e648b29a791d6f7431787ae24e34dc1a1c51ca131a5dedfe96a958"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "9074d1ba8b56f0c1d6df8c343d9f4da1938217084b83734d9daad0746910886c"
            ]
        ],
        "content": "A list of prominent Bitcoiners that most plebs would want to follow when they get started on Nostr. This makes it very easy to do so, as you can just go down @BitcoinerInfo's \"Following\" list and add those Bitcoiners to your own list. The (identical) list on bitcoinnostr.com serves as a way to verify the authenticity of all the accounts (and as a backup)\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "64e185362bbf97465f6430bb0e42d1c955bf899e09370520a6ee3a5cee64e615",
        "sig": "19df105e3422101facac33db55df55d8cfcd63c5694dbea78729aac79230687ce7a434962090d0b635f5133495ce8cdbd597c190aa3ffeff66a8081a031fde6c"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Finding others.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "57bf8568d7b491c82fd4ce068834a44c620689f85a7139f30c18bcf9af91f287",
        "sig": "83108a181e932aa9a9d20acc8c7d4ad82cd22b64db0465cce2d7f82ab62f412d29e4bd243cf306497f7d04d527446298c81c810f598b41f1eb23f22ca0d64d39"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "57bf8568d7b491c82fd4ce068834a44c620689f85a7139f30c18bcf9af91f287"
            ]
        ],
        "content": "To find out if any of the people you follow on the bird app are on NOSTR as well, check out nostr.directory\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "984add703138f45a563af49bd0ea15d11370ce2f1d983b8966db926c0d4dd484",
        "sig": "18078b40fac05a768d3a47deb4b9472325d82273c1a0099b2b8de28eaae4032e3741d2aa43005badbb3386970eaeeaaf3dfd5bd7c48fc883a765443cfe8759f0"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Uploading to nostr.build",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e851e1caad285b74041fc3b7bfb5b31b09ab020ac4e51082e885cf4c884ede09",
        "sig": "9139e71ccecc55f6e1ec7c816c8c9de8ae01e95805cd3f1c78c532720310ac38bc1d029a5afd851832c9e9cd03f99f10278ebbc6189e6df3da3b6e6ae933dbb2"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "e851e1caad285b74041fc3b7bfb5b31b09ab020ac4e51082e885cf4c884ede09"
            ]
        ],
        "content": "nostr.build is a nice place to upload your images. Check nostr.build/profilepic.html for profile picture uploads.Be cautious when uploading images there as anyone can see them even without a direct link.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9c71433c866a701cf84cbfb4ced56ec663a765e82246f291ad2a6e09537c81c1",
        "sig": "5f27b8d3d5507bd1f0ec508ec62d34b3056e79a6145664b2f343153f5608dab595896da3171c7652540145989dbb091546c352c5b325b6527680dc89249c6459"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Using markdown in posts.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "787fbd7756850151f3951746fd2a2bdb08b09a108bafb777ba471297a91bfe81",
        "sig": "d3f841f1cd2aa32fd2260e555809af0f4e4374d1eb82f5b9d05016d5839d43fee4289c62d58c400f47004cf141363be52776cc375f1a0939fe691db46ae5cd5e"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "787fbd7756850151f3951746fd2a2bdb08b09a108bafb777ba471297a91bfe81"
            ]
        ],
        "content": "Some of the markdown tags are supported by clients. Try formatting your posts with a guide at markdownguide.org\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "cb3f11b22625ff3a9ccb8dfebbfc29480d9f910733ece92a67458a31897135c1",
        "sig": "38128c97cc602d3eeb5878ee5fdf2bcc9342a419073862aeee1242424a9de7662b330047c57a67a57dafcf5e4eed28504e87c4eaf85f50baba262951c82c5e11"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Paid relays",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "eadf7ce7840690a21d883341a5d797322a63f1bbdea10a1d7fe6b71a95bab86f",
        "sig": "ff6472566d83c0188017a3d6687054659870258f898b55e8847572b705d2556c43d57294015d6ff219d735ae98a0ad21fdf30516eb41a80970f438f77e887b65"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "eadf7ce7840690a21d883341a5d797322a63f1bbdea10a1d7fe6b71a95bab86f"
            ]
        ],
        "content": "One of the promises of paid relays is to cut spam and provide better reliability.\n#### Instructions for gaining write access to a paid relay\n1. Add the desired relay(s) to your relay list. \n2. You should receive a DM afterwards with a lightning invoice which you should pay to get admitted.\n3. If you didn't receive an invoice via DM, visit a given relay's website and take it from there (replace wss with https to get the url).\n<i>If you're using Damus, you can also find each relay's website url by tapping on it's name on the RELAYS view (after it's been added to your relay list).\n#### Fees are one time only (for now at least).\n<i>When using multiple nostr clients, it should be enough to update the relay list in a single client.</i>\n\n#### Paid relays\nwss://paid.spore.ws\n420 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://relay.nostriches.org\n421 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.milou.lol\n1,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://bitcoiner.social\n1,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://relay.nostrati.com\n2,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://relay.nostrich.land\n2,100 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.uselessshit.co\n2,169 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.ownscale.org\n4,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.naut.social\n4,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.rocketstyle.com.au\n4,242 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://relay.orangepill.dev\n4,500 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://eden.nostr.land\n5,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.inosta.cc\n5,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.howtobitcoin.shop\n5,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.bitcoinplebs.de\n5,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://relay.nostr.com.au\n6,969 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.plebchain.org\n6,969 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://bitcoiner.social\n7,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.decentony.com\n7,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.wine\n8,888 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://private.red.gb.net\n8,888 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://puravida.nostr.land\n10,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.gives.africa\n10,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr.bitcoinpuertori.co\n10,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://atlas.nostr.land\n15,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nwss://nostr-pub.semisol.dev\n15,000 <i class=\"fak fa-satoshisymbol-solidtilt\" />\nCourtesy of\nnpub10jnx6stxk9h4fgtgdqv3hgwx8p4fwe3y73357wykmxm8gz3c3j3sjlvcrd:7ca66d4166b16f54a16868191ba1c6386a976624f4634f3896d9b6740a388ca3:stacksatsio\nYou will find an up to date list of paid relays at\nhttps://relay.exchange",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "6a1ab90afae3ef2b76e4157158c14d5f07929280facf4af237db03f15f3dd1a3",
        "sig": "9fded92fb68c6289825d91ad710325d18abea2f7907c431c2f63b3932994ff3a488536f78e2e7f800b728b1c00b6805a299ff91748c47fa41480426ebe0bfd7b"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "Setting up a paid relay",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "b0761fae90ddcffd27a77e939adc63eea36fc6e0548415563d7fb05534bc4155",
        "sig": "0aa9a70a4857cfd03eea6bb8dad5ba1db5f4c75377f1c67c1e350b06bb11df64a4c23059a1d9252e7d5af68bada137944ce88d9340ad1b56e1c8dcfcc090e2a9"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "b0761fae90ddcffd27a77e939adc63eea36fc6e0548415563d7fb05534bc4155"
            ]
        ],
        "content": "Check out the link below for a guide on how to set up a paid nostr relay with Nostream and ZBD payment processor.\nhttps://andreneves.xyz/p/how-to-setup-a-paid-nostr-relay",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "5f059a8f28b87cbb9faaab75a7f996a47141dc3c2568e04fc8472260840d2512",
        "sig": "0b594b381e7fb4ec0eeabc5fc37ec771a94b8d2d6784a5ae9a6688d5c7929946cce55028b9c8f6f0fe5caa75ec07932cea42f38596e8b9af432866b2f792b676"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [],
        "content": "NOSTR stats",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "09112f63327c6d6f88c9911051040a3d7b59696b9db41cc569901a15ef8346ce",
        "sig": "66501c20ae5c9aa291c42eb0ec544b08e2df27bff1a887c61ef2595015b0a9dc5d140cf2fae464e338ef3e6d3f146c95344d0ff29abb1292a8f5a45cad2ce5c4"
    },
    {
        "kind": 1,
        "created_at": 1684167264,
        "tags": [
            [
                "e",
                "09112f63327c6d6f88c9911051040a3d7b59696b9db41cc569901a15ef8346ce"
            ]
        ],
        "content": "Checking network and relay stats:\n#### nostr.band\nhttps://nostr.band/stats.html\nby\nnpub1xdtducdnjerex88gkg2qk2atsdlqsyxqaag4h05jmcpyspqt30wscmntxy:3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd:brugeman\n#### nostr.io\nhttps://nostr.io\nby\nnpub1mkq63wkt4v94cvq869njlwpszwpmf62c84p3sdvc2ptjy04jnzjs20r4tx:dd81a8bacbab0b5c3007d1672fb8301383b4e9583d431835985057223eb298a5:plantimals\n#### nostr.watch\nhttps://nostr.watch\nby\nnpub1uac67zc9er54ln0kl6e4qp2y6ta3enfcg7ywnayshvlw9r5w6ehsqq99rx:e771af0b05c8e95fcdf6feb3500544d2fb1ccd384788e9f490bb3ee28e8ed66f:sandwich\nCourtesy of\nnpub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa:51c059f3cc1802997fe1c4e60d6315c22079a025823256160ac7bfc1bca7c2d7:BitcoinNostrich",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "e2840c399acd920eb97bea1bc8ef80f8ed9843307457bb1155b4f61525ed3d45",
        "sig": "f9da87402702505e0b2516061719636ad46e6a1e7e99ec83d33ab9d6373dba089cb7490866a8bc73ac4e8fe9c8e8b9953f61be129bea251926f719f119730b3a"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Twitter 👉 NOSTR migration",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "8f35c7d8aba259c0bfc579fec48c6bbe068daca7a0f34111072809aa8bf94807",
        "sig": "778c37ecd14e5cc63e31a11a51ac5f79e0de63db388371a24341e85673413ff3e0d6861ce6525ce2a28c5f3139ffb7a365338593adde5f60ec9a35cbc8b9b98b"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "8f35c7d8aba259c0bfc579fec48c6bbe068daca7a0f34111072809aa8bf94807"
            ]
        ],
        "content": "A quick guide on how to find out who from you twitter followers is already on nostr and how to add them to your list.\n1. Verify yourself in \nhttps://nostr.directory\n2. Use the Snort client and go to \nhttps://snort.social/new\n3. Insert your twitter handle and see a list of your twitter followers who are also on nostr.\n4. Follow with 1 button press or follow one by one.\n<i>If you used this successfully, spread wide to others so that we can find each other and make it easier to drop twitter altogether.</i>\nCourtesy of\nnpub1sqaxzwvh5fhgw9q3d7v658ucapvfeds3dcd2587fcwyesn7dnwuqt2r45v:803a613997a26e8714116f99aa1f98e8589cb6116e1aaa1fc9c389984fcd9bb8:Nakadai",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ea996481f9623763606e252b7ebdd7ba0d348b6be9d6cfaf714597c6449244b9",
        "sig": "361d57fae640074fcd24c962e325be934502474b23023631af28de9da3c3b12e4d1a5e4afc970f10d459d6ebef2c20d32f4fc81a5658c1d3bf8c7a86f068b844"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "The content won't load or loads extremely slow.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "bafa47f9972c97e58c1d2c878b1e52978d69bb95379a8dedac1e9ea2a5256ac8",
        "sig": "ed6480844063be222ed72ce5b96d15d303e70e1c40d61bbd3d91b6a7e655c001f63e6d98d454d259c165766572e3cca21f95fc5e3d5a8519f5bead1a315b426f"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "bafa47f9972c97e58c1d2c878b1e52978d69bb95379a8dedac1e9ea2a5256ac8"
            ]
        ],
        "content": "You can find a list of public relays at nostr.watch and add some more items to RELAYS section of your Settings. You might also want to check the RECOMMENDED RELAYS section and pick up some from there.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "6f06f990801d36b20219d466fcd1375b06b82911d351f38a6e304d359d9454fa",
        "sig": "28c173d2518821a1e77d811411b910709fa676b25c989e9f6bfbb822c684ea5007d560d14971820140d8bdb8651dd1e083deec1090d709429f3b1e2fece2ab98"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "The NOSTR client I'm using seems to use up a lot of bandwidth.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ad82291e7ef8ebddbcd8590c74e733adfa81bd84a05d6c766fca6a0a5cb48017",
        "sig": "b4e8cd5f1c1aea8911cef1a1a308a0300a42b886dad0df691163bc0407e91925777d3912da9d9fe562c3f009d1a29213851039a390447381b28ac94024d2e414"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "ad82291e7ef8ebddbcd8590c74e733adfa81bd84a05d6c766fca6a0a5cb48017"
            ]
        ],
        "content": "While having more relays added in your SETTINGS will make your client fetch the data faster, resulting in better experience, having too many relays could be an issue as well. Be cautious when using a mobile internet with limited bandwidth and try limiting the amount of relays to well under 10.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4ecad73f2d5a01309206fc9cf8078e2253427b13482fcb0128b2a8c7f15cae7c",
        "sig": "604e9a341bdf31ac2b02fea6971ea764fec9eac49cf58b7e080d618c7f3f844fa0df3442d1fa45d683c09a00a8c2a9532d1add96555bff073bdf746b76e2097e"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to remove a relay?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "fed2b9159de2cb44315805ee88ee7f6045f29f182db457231be781c3577b1066",
        "sig": "785a23f44a041fd27967dd934f22b14962854d6f1e459d0c8f1cac951e9046e49eb2067379560f42bda17cac3ddfc6788526af0c82b766930c882dc1066ae9c5"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "fed2b9159de2cb44315805ee88ee7f6045f29f182db457231be781c3577b1066"
            ]
        ],
        "content": "In your SETTINGS view (side panel - to open it tap on your pfp in the left top corner), swipe left on a relay you'd like to remove and click on the trash icon to confirm removal. You might want to restart the client for the changes to take place.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9049789ce5407eb05ef3e165cda2b812d0863037d6034e5531a9e963eec30dd5",
        "sig": "7a5a2d8fe73e1643134d1478681ed4a7e07e2f3b14d4e112dab65aa7f39a28aeb88c6c614ac5f077eef2e0389b4427f18921f6ceb422daa90447e7b9771d0f80"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to setup NIP-05 identifier (checkmark)?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "23a67e85b67a673469009aced26280e046a52ec6eb3b21e75adfc377ea1f023c",
        "sig": "ca496205ba718ea562921f185824692ee9c686ff96dbb87845c525717a80894db018a8ac6f84d328aac3024fc44895da26e56bd0c3b2589da1d42c90f1e31dd0"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "23a67e85b67a673469009aced26280e046a52ec6eb3b21e75adfc377ea1f023c"
            ]
        ],
        "content": "Check out these explainers on setting up a NIP-05 identifier below. If you don't own a domain you can ask someone to create an id for you at their domain (for free or a small fee). Check out <i>Free NIP-05 handles</i> and <i>Paid NIP-05 providers</i> sections for more info.\nnpub1pvuugp6fyj6t6yeq9ajzv28p54w07sg6jpxvzuu5yc7qmu9edpkqm2d7a5:0b39c4074924b4bd13202f642628e1a55cff411a904cc17394263c0df0b9686c:MainStreetChungs\nhttps://mainstreetchungus.com/nostr-nip-05-verification/\n#### metasikander\nhttps://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e\nnpub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8:e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411:NVK\nhttps://nvk.org/n00b-nip5\nOnce you got your handle, you need update your profile.\n\n#### Updating profile on Damus\n<i>Note NIP-05 VERIFICATION input</i>\nhttps://uselessshit.co/images/nip05-01.png",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "a37ce7453636b485cdbbd93df5bda9f4dbd67a3d1f0c7a35c10b797ea78def8b",
        "sig": "be8cfdb635f7d3fafaf9747fdf9bfb0e5c39cfb1981c64f995997737129b2f67f6cf3a691e513af68bcf7fca88a3561f1647fb9703fc153cb14aec25814e07e0"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Free NIP-05 handles.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "865013a6da83c0f5f9c5ae65d25900ee635da8fa2ad894d116d7b3aa57669a45",
        "sig": "05f4bf408ce1356ef0f1c4a9efa2cd3e837879d18f6138a786bb8fc8aa0607b318b49fc024f2d660e2dc579422bf201fe2e06e9c514c96f78f9de73d9c60d823"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "865013a6da83c0f5f9c5ae65d25900ee635da8fa2ad894d116d7b3aa57669a45"
            ]
        ],
        "content": "Looking for a free NIP-05 handle? Check out your options below 😎\n#### orangepill.dev\nnpub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:ezofox\n#### bitcoinnostr.com\nnpub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa:51c059f3cc1802997fe1c4e60d6315c22079a025823256160ac7bfc1bca7c2d7:BitcoinerInfo\n#### satoshivibes.com\nnpub138guayty78ch9k42n3uyz5ch3jcaa3u390647hwq0c83m2lypekq6wk36k:89d1ce9164f1f172daaa9c784153178cb1dec7912bf55f5dc07e0f1dabe40e6c:lukeonchain\n#### nostr.industries\nhttps://nostr.industries\n#### stacker.news\nhttps://stacker.news\n#### getalby.com\nhttps://getalby.com\n#### bitpaint.club\nnpub1t8makd5nzwt36nym6j4mrn9dkv4cn43m24tqy8rxv34v3gflxwjqkqlw4s:59f7db369313971d4c9bd4abb1ccadb32b89d63b5556021c66646ac8a13f33a4:bitpaint\n#### Nostr-Check.com\nnpub1mhamq6nj9egex0xn0e8vmvctrpj0ychehddadsketjlwl3eg7ztqrv9a4h:ddfbb06a722e51933cd37e4ecdb30b1864f262f9bb5bd6c2d95cbeefc728f096:\nhttps://nostr-check.com\n#### lnmarkets.com\nhttps://lnmarkets.com\n#### hitchhikersguidethroughthemetaverse.info\nnpub132vp7xhrl2enqz65338jqe2vkrcax5zf339kdpymw059gcqpmjsq6fm80g:8a981f1ae3fab3300b548c4f20654cb0f1d350498c4b66849b73e8546001dca0:WShakesp\n#### Verified-Nostr.com\nhttps://verified-nostr.com\n#### NostrCheck.me\nhttps://nostrcheck.me\n#### Iris.to\nhttps://iris.to\nhttps://user-images.githubusercontent.com/52623440/226199682-d32d345e-9d3f-424e-abd6-76d2897c740e.mp4\n#### uselessshit.co\nnpub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "2561c0290827ec6460968c7429714b8fd39d558b8a101805819c8577142a16f9",
        "sig": "2a90e6ac77e1dbe9620aed2433b81425bfb1f50c309f1a1ad466798d13988faac396b337be7361939610936f6794bb445e062873ffcc44dc2098b6c99e9b861b"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Paid NIP-05 providers.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9eb5fab4c87013c6a929ed5b0c5a2613307d5f441788f97e5454ebc1dc23ba07",
        "sig": "74b90d42d0a0e590008c0df9c466f319e5e5b91e6684cb8236c5e2974d9b0d5eda27e67e98bc338534cc011ebb2a23e9e5952f83d5ea5d3f3aa092118426375d"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "9eb5fab4c87013c6a929ed5b0c5a2613307d5f441788f97e5454ebc1dc23ba07"
            ]
        ],
        "content": "Here'a list of NIP-05 providers that charge for setting up handles with them.\n#### nostrplebs.com\nhttps://nostrplebs.com\n#### satoshis.lol\nhttps://satoshis.lol\n#### plebs.place\nhttps://plebs.place\n#### nostrverified.com\nhttps://nostrverified.com\n#### no.str.cr\nhttps://no.str.cr/verify.html\n#### Verified-Nostr.com\nhttps://verified-nostr.com\n#### nostrich.love\nhttps://uselessshit.co/nostr/nip-05/",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "afb8ee24e3a36b6f5919e10d5a41fa436694253d12b2bf0861e922676340bff5",
        "sig": "142c25e8df31d594f9dcccfc96025c7449b1306650e28bb2e5645345de0785efde61723bf97c12aeb6704bdfe09361c3fe860c288eec3b7e31b340e55cebfabd"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to turn my NIP-05 handle into lightning address? (Alby)",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "0b60ba669ee24bd44a8726977c5ddf01be4ae0accc3684651bbd1ab357fba5bf",
        "sig": "1171576e782dfdc2fecc3af730ed04fbd86bdaff2e4353d1dc1c8648799269f220a14b5c44c938654847beca3f6da452bcdced73973ea6e3f29e779442952604"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "0b60ba669ee24bd44a8726977c5ddf01be4ae0accc3684651bbd1ab357fba5bf"
            ]
        ],
        "content": "Navigate to the url below to make your NIP-05 handle a lightning address (Alby). If you'd like a lightning address @uselessshit.co let me know (see Contact)\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "72581018039140a3654fd5510e94620359e3181521069682c8dc3269d34d7d11",
        "sig": "cd30df1c401ba105e831a914c44508e242dbd8f5d3887b8051316640df420c5d9fb1e733d61c72449cfc76cb68488326db76b4492ac2d4d2473ce5e1eecb0a4f"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to turn NIP-05 handle into lightning address? (WoS)",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "c843e167ebda462d58c71736bb2ce04f5e35cead72494328bedebf816b62179c",
        "sig": "8e751db7801939e42b1bf5468e80a8090d5c7a274c252f547771d1a581cb61e787def0be835cb80db60f835276fad79fbdc86921da6a8702173ea2ac25969bf5"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "c843e167ebda462d58c71736bb2ce04f5e35cead72494328bedebf816b62179c"
            ]
        ],
        "content": "\nCreate an empty file accessible at https://yourdomain.tld/.well-known/lnurlp/your-username\nIf you're running Apache, in your .htaccess file add the following: \nRedirect /.well-known/lnurlp/your-username https://walletofsatoshi.com/.well-known/lnurlp/your-WoS-usernname \neg. Redirect /.well-known/lnurlp/pitiunited https://walletofsatoshi.com/.well-known/lnurlp/furiouschina21\nThere're other means of achieving the same result on Apache (like editing the conf file).\nIf you'd like to learn more or you're using Nginx,\nnpub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52:d4843f4c280abba3d43d84ed7924b2567d7c166f5e72985b9f06d355601b5d78:EzoFox\ngot you covered (link below).",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "a130fec842b65980cd643d4eba2ceba015661448a6a4e03807c0a05044e9fd63",
        "sig": "c98a65bd984ed452136c614cf0d39c845543737e2e83ccf9d12b550028592d7aae4fe24b6ad2ea889cc13dcdc7e6ad67767cc8ce9855d55b96c0dbc689c808aa"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "What's the difference between grey and purple checkmark?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4573ce5387dcba4285de5367f7a9c477de327829c1533d737e5a24f14e6d16c5",
        "sig": "2bf2d4ae8c6dee9f250054c48cb5ecd8258fd77d09e965ac8aaa0a54b49ced4ffec909359ae3379a9daf99bdb0370605a6a9310dcef5df24fc242972f584276f"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "4573ce5387dcba4285de5367f7a9c477de327829c1533d737e5a24f14e6d16c5"
            ]
        ],
        "content": "People you aren't following have grey checkmarks, whereas the ones you follow have purple checkmarks.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "c6baa971afad4a37ad6c8731876993f6cd6cf56a7881b06f4517cc9aaf73979a",
        "sig": "c05680a84bb29cf37250cb1a1a3de492b210294c0c01328b9f4936c87242432e265b567e58c20e4bc545c0e7d52be72e25451e94c500b8ecc67d3b266bfa7fdf"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to find someone by their npub?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "823d1ad9f6e0c50bca14b2d4651d836d233a9667ab0624efa4481819a27c2da0",
        "sig": "1fe6dc6b507b55bc95107f2ffede3461e9f9ba7f3a0fcca6f723621c24743a797f1624b76c1d39f551b94c864df89662830f4152fde11a9d09dacc8f8964e12b"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "823d1ad9f6e0c50bca14b2d4651d836d233a9667ab0624efa4481819a27c2da0"
            ]
        ],
        "content": "\n#### Damus\nOn Damus, simply copy the npub of the person you're looking for and paste it into the search bar (available on the search tab).\nYou should be able to visit the profile by tapping on <i>Goto profile npub...</i>\n#### snort.social\nOn Snort, simply go to https://snort.social/p/pubkey (replace pubkey with the npub of the person you're looking for).",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "be47c654592df5e7a1aa594257bce96527513f344404fd5baa53b6ee8c84585c",
        "sig": "3b4860eef390afcbbd86bd2bee15d7c975a9007c5e2e5022c2d383eaa58be362a6e64a30da003fcad1aeb28e77cadc8fba75b2bbd555e37a41f0abb2e2145d98"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How do I block users?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "6e43c58da37dc6f45f6dcedab69823f77efa4fe60e493243e7da06ccf482539b",
        "sig": "01623bf2bdd831394da885397c120145dc231c752640252b60d0c5779fa39af1773a341766ae29258234609c634b016e938f2e444fc5db4fc3ed2bdc7e0d24ae"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "6e43c58da37dc6f45f6dcedab69823f77efa4fe60e493243e7da06ccf482539b"
            ]
        ],
        "content": "Similarly to how your notes cannot be deleted on a protocol level (but rather flagged as deleted), blocking can be performed on the client level only.\n#### Blocking a user on Damus\nTo block a user, you can either tap & hold on a note of the user you want to block, until a menu shows up\nhttps://nostr.build/i/nostr.build_8fed7311c247547176e701d2621dd49f4395a24e50105e008546de93dd24bb45.png\nOR go to their profile and tap on the three dots next to the pfp.\nhttps://nostr.build/i/nostr.build_60863c8a9262c4dee988b650fe6acdd15e8fb179254e50d9c86fe32d4a525c48.png\nFrom the menu, select <i>Block</i>\nConfirm your choice.\nhttps://nostr.build/i/nostr.build_cca50d4af67b33130656cb7a6df37981124433a2b695337bcc888760584d3635.png\nIf that's your first time blocking someone, a prompt asking to create a new mutelist will pop up.\nhttps://nostr.build/i/nostr.build_012ad9815bb8b12293078b8781a8b6d940146a8bee4e9d135641e3a1ed32cfbd.png\n#### Unblocking\nOpen the side panel by clicking on your pfp in the top left corner.\nhttps://nostr.build/i/nostr.build_2527fd237c0c07d5983ffcc8d1266a33caf1662a2636a98d33e8e4b88b4ae35f.png\nTap on <i>Blocked</i>.\nhttps://nostr.build/i/nostr.build_ba5f222efa67659b6674b56a30d5a077ceb1f410d41bf6bd53b8149b36d889c9.png\nFind the user you'd like to unblock.\nSwipe left and tap the delete icon that will show up.\nhttps://nostr.build/i/nostr.build_41b6ee72193f5debf7d1a4e5731440b69a679778a1a75a9668c8163c9d363806.png",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "6220d35c60abc0b7b69019770f0927950dbffc22778ae024b7e319dcee626ab1",
        "sig": "e1873941756baa77a354fe1912a9676a3b1a697053aac772d1a6a91db6091fc0975e73391943c376d5c128354706ffba7bcf16c255bf04e78bba5880787d663d"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How do I setup my own NOSTR relay?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "50b81ea95de752158610c60f2a28344c6d1aae45ed3acc1359150f45cfb8aab1",
        "sig": "47e0bb2a667abc8603d30e7957a11995cb1fe2dc18e4e65df21ee7cd6b775a45760d81b50451bcb2d3dd33b7f74fef7a5afd88bd7a5209284ab45ad9d30d19c4"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "50b81ea95de752158610c60f2a28344c6d1aae45ed3acc1359150f45cfb8aab1"
            ]
        ],
        "content": "Check out the resources below to set up a Nostr relay in under 5 minutes.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "f9317d44b5f127e60e7f7631ea5a0bfbd6376c9a5198f331768f2918015e5071",
        "sig": "15d580ae6c3c877f8cbe49d9514cc34b82f924c8e381000accd226f4dfd07d28e1c11b3b7535251861b6f47f1008a5504f5d4101c0b6f00cbfed7d55f1010a49"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "How to convert my npub key to hex format (or hex back to npub)?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "58474ebf7a2b15b7515d5b4bbe431853e6fa8c5a80221432f0e80df5bd8d465d",
        "sig": "99eaa33453fca4c0f740ec1664c223d71bc234a523a971988715163c2578057bc8141bcf743caaf71a1c4fdb9b19f2961b23d5d0a9519ac3d5949378c1991135"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "58474ebf7a2b15b7515d5b4bbe431853e6fa8c5a80221432f0e80df5bd8d465d"
            ]
        ],
        "content": "\n#### (Beginner) Try this online tool to convert your npub key to hex format.\nhttps://damus.io/key/\n#### (Advanced) Command line users can try \"key-convertr\" tool instead (it also converts \"hex back to npub\" for other use cases).\nhttps://github.com/rot13maxi/key-convertr",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "d4ea38facec75b817f953e48139971daa8b0bf7f382da8c481ed428fbe0a76e0",
        "sig": "26813bd95c2c6d6c0ed2141881832a8e7ff66d0bcd11690e9db791111b97a2cbc3c4d29562783ba3b21a4a823900313d59b39e5c53cb6f9efa5b78db17e2cf97"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Security and Privacy tips.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "230eb0ea59b30d3e66e63c3fcf61d5551fa714197996a0f16196501d1f5b6c83",
        "sig": "88f9b878d1af48aa01ca659258f17680513227268f34656cbce70ae48eb7c45446683f06bcf9c5489275b9224741e8506a20656239b3683c749fa56bd0d81ff3"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "230eb0ea59b30d3e66e63c3fcf61d5551fa714197996a0f16196501d1f5b6c83"
            ]
        ],
        "content": "\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "2f9a6316e78d2aea0f267402ecac903dc45799707adbdc17b630e2164d031aa1",
        "sig": "30901b4d4c1a866a71ba9d3526702931bced79e628410f2ffd0397c2ccb0e3ce0153504f43055d5889273835856ff9454e4130193d2a3ddef62d92731ac5c924"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Some images are blurred. Need to click on the image to see it. What's up?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "369658af04efe0ec42b207f0a1ec4e95e03d71330998cc569769713d11c1192b",
        "sig": "49d113c20f1e35c31a516881de9a3cf7403a1d39bcd3b3a75b68bee0dd01dc0cab54ae7f03f255183b7fabc2e7e5486c1321579c3cee6619bb2c8c8c9312ae49"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "369658af04efe0ec42b207f0a1ec4e95e03d71330998cc569769713d11c1192b"
            ]
        ],
        "content": "You can only see images from the people you're following, the remaining ones come up blurred.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "8cb8ee4f3f7d1446f929aa9a14dd0401a40e3b8b22f821f3445d9d58677337a7",
        "sig": "81ee2563f0370159bed7ccdf9c380ccb3dc8010f82a3424b68dac0d7e9a492e2a7b1fbdea060f559a90e9510e3565cf2e342423256caac5a41492983398db390"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "I can't repost (previously boost).",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "9786554a5734bad579e30b033252e5fb4a41f5f32ea0dc834019371e4a5e2cd1",
        "sig": "709046f813b9c5fa576dde8358a7fa940d7a2208c312f640903333af0862545d2acde3b5a54a4079a3676357b477de198419c443b47a20c5155e0a5b2a082e5e"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "9786554a5734bad579e30b033252e5fb4a41f5f32ea0dc834019371e4a5e2cd1"
            ]
        ],
        "content": "Sometimes it's not possible to repost a note from a feed. The workaround is to open a given thread and repost the note from there.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "ecbd2d8f8ed66a442d01ff62edc20ad09b7b436566b4df78029245a67f2d0e36",
        "sig": "4fa43f4d614915cac5b248773c0d80d5fec9f187df41b66682476b75833af76fc7ed027782b1d52208101eb6b0e5e888ade5e790a637c112555ddb3b842365d9"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Bookmarks",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "030a63fd539997cdb53f48e3c252dc659bdc92c62f179794ca8b2c3dc756476c",
        "sig": "95d84c3d06b1eada9f01d1de4136991ae719167c3888b729bb16b4df4c8e6857c44666984f029ddee97b02470d2143613871a7a5055258bae1fd1e6e7d8f3fa0"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "030a63fd539997cdb53f48e3c252dc659bdc92c62f179794ca8b2c3dc756476c"
            ]
        ],
        "content": "Starting Damus 1.1.0 (9), you can bookmark notes.\nTo bookmark a given note, tap and hold on its content.\nFrom the menu that will show up, select <i>Add Bookmark</i>.\nhttps://uselessshit.co/images/bookmarks-01.png\nYou can see all bookmarked notes from the side menu (which you can open by clicking on your pfp) -> <i>Bookmarks</i>.\nhttps://uselessshit.co/images/bookmarks-02.png\nhttps://uselessshit.co/images/bookmarks-03.png",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "3aa9ed77492ad85b3d937643dfbed282e71bfbaf14d3c4d88528b739ed6c01ed",
        "sig": "909d663e5389ee881bb6ceddc38eb351e69130693b13f74253b6c33236ecefdb267891e91f382a93d3a0666b1294b09e3e63d8015fa442b30213c93c8c915791"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Additional NOSTR resources.",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "4b927de4d5fd34f416182d87ac93c28e39a2fcc141a5c020fd36f1024cc3e006",
        "sig": "80b827a577359e4b8157ffc707ea09d475de5f7da1e2e3465bc093b425d138ce6b12ed74f8065bc8fec15782798ffe3b16b71af51462beea21bbacdd848192c0"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "4b927de4d5fd34f416182d87ac93c28e39a2fcc141a5c020fd36f1024cc3e006"
            ]
        ],
        "content": "Check out the urls listed below for additional resources.\nundefined",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "f9fe99cbfc12286fa2f7290d1cb343b7b143e9c0ecfe21d62a3008a52150053b",
        "sig": "6f257e80209516847a700bf0afd1644e075c6ece01c5da67eec2b7c2adc0ff06bfda26946bb6bd9886ea2b29e766f1e81741a85a382aa5ac051b3ffcaa891db4"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [],
        "content": "Didn't find what you've been looking for?",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "336005295adec320b7dd52db52428ca101f55fcf5755ac9212fc525ae089dfa3",
        "sig": "39b8f50bcb429ec1b5ae2528118ebd030296001c76e0759d898d5804982891ac9e1720134dd571ba3f2efc04b7f2f018c4bb58f8a6ba8efea337efbc7d0099af"
    },
    {
        "kind": 1,
        "created_at": 1684167265,
        "tags": [
            [
                "e",
                "336005295adec320b7dd52db52428ca101f55fcf5755ac9212fc525ae089dfa3"
            ]
        ],
        "content": "I'm trying to keep this guide up to date. If you happen to find something missing or outdated, let me know. Also, since you're here, you may also want to check our bitcoin resources page for a list of Bitcoiners, bitcoin books, pods, apps & wallets.\nGo ahead and DM/tag me on nostr 🤙 \nnpub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4:f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8:pitiunited",
        "pubkey": "70d2a4b755f206e60ff483711ac5526f809c43e0c2fdf435050a3d2c8cb72a3b",
        "id": "b97101314cc8f317ba5deb6707c4c88b7c5311fb3f2e4b4a2d10d5cd95953f4c",
        "sig": "860077e9fe2df16943427f5a8abfc7dc848184a5fe227dbc35dd52c866dadd0ef14d3fa06080d805da0335ee67a1da2f2f2797721efb26a3dccfdfc73055ee2a"
    }
];