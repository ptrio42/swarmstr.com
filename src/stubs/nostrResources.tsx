import {Guide} from "../components/Resources/NostrResources/NostrResources";

export const GUIDES: Guide[] = [
    {
        id: 'what-is-nostr',
        issue: 'What\'s NOSTR?',
        fix: 'Notes and Other Stuff Transmitted by Relays, ' +
            'or NOSTR, is an open protocol, designed to create a censorship-resistant social network. ' +
            'Image credits: @coderjourney1',
        urls: [
            'https://github.com/nostr-protocol/nostr',
            'https://usenostr.org',
            'https://nostr-resources.com',
            'https://github.com/vishalxl/nostr_console/discussions/31',
            'https://wiki.wellorder.net/post/nostr-intro/',
            'https://audaciousdenizen.substack.com/p/my-quick-guide-to-nostr'
        ],
        createdAt: '2023-01-09',
        updatedAt: '2023-01-11',
        imageUrls: ['https://uselessshit.co/images/explain-it-to-me-like-i-m-5.png'],
        tags: ['Basics']
    },
    {
        id: 'keys',
        issue: 'Getting the keys',
        fix: 'The keys are your identity. They consist of a public key (npub) and a private key (nsec). ' +
            'The public can be treated as a username, whereas the private key is more like a password. ' +
            'Be cautious when entering your private on different sites - if it gets leaked and falls into wrong hands,' +
            'you can think of your \'account\' as compromised. You can get your keys through any of the NOSTR clients.',
        createdAt: '2023-01-05',
        updatedAt: '2023-01-10',
        tags: ['Basics', 'Keys']
    },
    {
        id: 'nostr-clients',
        issue: 'List of Nostr clients.',
        fix: '',
        bulletPoints: [
            '#### iOS/MacOS',
            'https://damus.io',
            '#### Web',
            'https://astral.ninja',
            'https://yousup.app',
            'https://iris.to',
            'https://snort.social',
            'https://hamstr.to',
            '#### Android',
            'https://github.com/KoalaSat/nostros',
            'https://www.neb.lo/nostr'
        ],
        updatedAt: '2023-01-17',
        tags: ['Basics', 'Clients']
    },
    {
        id: 'what-is-damus',
        issue: 'What is Damus?',
        fix: 'Watch this simple explainer video to find out about Damus.',
        urls: ['https://youtu.be/I_A7NLIyX1o'],
        createdAt: '2023-01-10',
        updatedAt: '2023-01-10',
        tags: ['Damus', 'Clients']
    },
    {
        id: 'running-damus',
        issue: 'Damus TestFlight is full. Can I still try it?',
        fix: 'To be able to test Damus without participating in the TestFlight beta you\'ll need a Mac and optionally an ' +
            'iOS device (iPhone or iPad).',
        bulletPoints: [
            '1. Download Xcode from the AppStore on your Mac OS.',
            '2. Clone the official Damus repository from GitHub. (link attached below)',
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
            'Thanks to @realmuster npub1fmd02wwyjrs3yagacdrhzar75vgu9wu0utzf6trvumdrz3l3mzrsm7vmml for contributing to this particular guide.'

        ],
        urls: ['https://github.com/damus-io/damus'],
        tags: ['Damus'],
        updatedAt: '2023-01-17'
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
        issue: 'How do I tag a person?',
        fix: 'Use this person\'s public key instead of their handle. ' +
            'The public key can be obtained in a person\'s profile, under the key icon. ' +
            'Then, to tag this person, you got to put the @ symbol in front of their pubkey ' +
            '(@<pubkey>) eg. @npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4',
        updatedAt: '2023-01-06',
        tags: ['Basics', 'Keys']
    },
    {
        id: 'adding-images',
        issue: 'How to add an image to a post?',
        fix: 'Image urls are processed and displayed as images. ' +
            'For now, it\'s not possible to upload images directly from your device. ' +
            'The image has to be hosted somewhere before it can be used. ' +
            'Several free public image hosting services are listed below.',
        updatedAt: '2022-12-26',
        tags: ['Basics', 'Media']
    },
    {
        id: 'image-hosting',
        issue: 'Image hosting services.',
        fix: 'A list of free image hosting services.',
        urls: ['https://nostr.build', 'https://imgbb.com', 'https://postimages.org'],
        updatedAt: '2022-12-26',
        tags: ['Basics', 'Media']
    },
    {
        id: 'adding-avatar',
        issue: 'Adding an avatar.',
        fix: 'Upload desired image to a public server as described in the steps above. ' +
            'Copy the image url and paste it into PROFILE PICTURE input under Profile EDIT view.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-11',
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
        issue: 'I want to make my images come alive.',
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
        issue: 'How do I drop an invoice?',
        fix: 'Open a Lightning Wallet, click Receive, edit the amount and copy the Lightning Invoice. ' +
            'Then simply paste it into the post.',
        updatedAt: '2022-12-26',
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
        issue: 'Deleting posts on Nostr.',
        fix: 'You cannot delete on protocol level, you can just tag a note as deleted. ' +
            'How relays and clients deal with this information is their choice. ' +
            'Eg. clients can choose to not show deleted-tagged notes; relays can actually delete it. ' +
            'However you can never be sure all relays to which your note got propagated do this. ' +
            'Pretty impossible to actually delete your note through the whole network.',
        bulletPoints: [
            'Courtesy of @StackSats npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3'
        ],
        createdAt: '2023-01-06',
        updatedAt: '2023-01-17',
        tags: ['Basics']
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
        issue: 'Are DMs (direct messages) on Nostr private?',
        fix: 'Consider your DMs as public, not private! Never ever share any sensible data via DMs! ' +
            'All DMs are publicly visible. However, since they are all encrypted, they can only be read with your or your ' +
            'chat partners private key. If one of the two keys gets leaked, the full chat history is visible to the public. ' +
            'Since you do not have any control over the key management of your chat partner, you should be very cautious what information ' +
            'you share via DMs!',
        bulletPoints: [
            'Courtesy of @StackSats npub1hycynfhz23ardfmf9kgwfw4gpyqj2fsh24r2zuehg4x7lx4kn5cqsqv4y3'
        ],
        updatedAt: '2023-01-15',
        tags: ['Basics']
    },
    {
        id: 'adding-lightning-button-to-profile',
        issue: 'How to add Lightning button to profile and start receiving tips?',
        fix: 'Open a Lightning wallet, tap Receive, select Lightning Address and copy it. ' +
            'It should start with LNURL... Go to your profile, tap Edit add paste the address into BITCOIN LIGHTNING TIPS input. ',
        createdAt: '2022-12-26',
        updatedAt: '2022-01-11',
        tags: ['⚡️ Lightning', 'Damus']
    },
    {
        id: 'the-like-emoji',
        issue: 'I see a lot of 🤙 emojis floating around everywhere. What does it mean?',
        fix: '🤙 (also called shaka) is for Likes. Also ⚡ is for sats.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-09'
    },
    {
        id: 'using-nostr-with-alby-or-nos2x',
        issue: 'How to use Nostr with the Alby or nos2x extension.',
        fix: 'As a rule of thumb, you should never paste your private key into websites. ' +
            'To generate your keys and handle your keys, use Alby or nos2x extension.',
        bulletPoints: [
            'https://blog.getalby.com/how-to-use-nostr-with-the-alby-extension/ - How to use Nostr with the Alby extension',
            'https://youtu.be/IoLw-3ok3_M - The nos2x browser extension'
        ],
        updatedAt: '2023-01-17',
        tags: ['Basics']
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
        fix: 'Head down to this basic guide (the gist below) on setting up a NIP-05 identifier. ' +
            'If you don\'t own a domain you can ask someone to create an id for you at their domain.',
        urls: ['https://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e', 'https://nvk.org/n00b-nip5'],
        createdAt: '2023-01-04',
        updatedAt: '2023-01-11'
    },
    {
        id: 'free-nip-05-handles',
        issue: 'List of free NIP-05 handle providers.',
        fix: '',
        bulletPoints: [
            'orangepill.dev - message EzoFox npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52',
            'bitcoinnostr.com - message BitcoinerInfo npub128q9nu7vrqpfjllpcnnq6cc4cgs8ngp9sge9v9s2c7lur098ctts99gupa',
            'satoshivibes.com - message lukeonchain npub138guayty78ch9k42n3uyz5ch3jcaa3u390647hwq0c83m2lypekq6wk36k',
            'nostr.industries - head down to https://nostr.industries',
            'stacker.news',
            'bitpaint.club - message bitpaint npub1t8makd5nzwt36nym6j4mrn9dkv4cn43m24tqy8rxv34v3gflxwjqkqlw4s',
            'uselessshit.co - message pitiunited npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4'
        ],
        updatedAt: '2023-01-16'
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
            'EzoFox npub16jzr7npgp2a684pasnkhjf9j2e7hc9n0teefskulqmf42cqmt4uqwszk52 got you covered (link below).'
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
            'Tag @bitcoinbull npub1gl23nnfmlewvvuz7xgrrauuexx2xj70whdf5yhd47tj0r8p68t6sww70gt',
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
            'Go ahead and DM/tag me on nostr npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 🤙 '
        ],
        urls: ['https://uselessshit.co/resources/bitcoin'],
        createdAt: '2022-12-29',
        updatedAt: '2023-01-16'
    }
];