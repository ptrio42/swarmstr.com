import {Guide} from "../components/Resources/NostrResources/NostrResources";

export const GUIDES: Guide[] = [
    {
        id: 'what-is-nostr',
        issue: 'What\'s NOSTR?',
        fix: 'Notes and Other Stuff Transmitted by Relays, ' +
            'or NOSTR, is an open protocol, designed to create a censorship-resistant social network.',
        urls: [
            'https://github.com/nostr-protocol/nostr',
            'https://usenostr.org',
            'https://nostr-resources.com',
            'https://github.com/vishalxl/nostr_console/discussions/31',
            'https://wiki.wellorder.net/post/nostr-intro/',
            'https://audaciousdenizen.substack.com/p/my-quick-guide-to-nostr'
        ],
        updatedAt: '2023-01-09',
        imageUrls: ['https://uselessshit.co/images/explain-it-to-me-like-i-m-5.png']
    },
    {
        id: 'keys',
        issue: 'Getting the keys',
        fix: 'The keys are your identity. They consist of a public key (npub) and a private key (nsec). ' +
            'The public can be treated as a username, whereas the private key is more like a password. ' +
            'Be cautious when entering your private on different sites - if it gets leaked and falls into wrong hands,' +
            'you can think of your \'account\' as compromised. You can get your keys through any of the NOSTR clients.',
        urls: [
            'https://damus.io',
            'https://astral.ninja',
            'https://yousup.app',
            'https://iris.to',
            'https://snort.social'
        ],
        createdAt: '2023-01-05',
        updatedAt: '2023-01-10'
    },
    {
        id: 'mining-the-public-hex-key',
        issue: 'How to mine a public key?',
        fix: 'You can mine your public HEX key with a desired prefix. Check out nostr.rest to find out how.',
        urls: ['https://nostr.rest'],
        updatedAt: '2023-01-06'
    },
    {
        id: 'logging-in-with-someone-else-s-key',
        issue: 'Loggin in with someone else\'s key.',
        fix: 'One of the cool features of Nostr is that you can log in with someone else\'s public key ' +
            'and see the world through their lens.',
        updatedAt: '2023-01-09'
    },
    {
        id: 'how-do-i-tag-a-person',
        issue: 'How do I tag a person?',
        fix: 'Use this person\'s public key instead of their handle. ' +
            'The public key can be obtained in a person\'s profile, under the key icon. ' +
            'Then, to tag this person, you got to put the @ symbol in front of their pubkey ' +
            '(@<pubkey>) eg. @npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4',
        updatedAt: '2023-01-06'
    },
    {
        id: 'adding-images',
        issue: 'How to add an image to a post?',
        fix: 'Image urls are processed and displayed as images. ' +
            'For now, it\'s not possible to upload images directly from your device. ' +
            'The image has to be hosted somewhere before it can be used. ' +
            'Several free public image hosting services are listed below.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'image-hosting',
        issue: 'Image hosting services.',
        fix: 'A list of free image hosting services.',
        urls: ['https://nostr.build', 'https://imgbb.com', 'https://postimages.org'],
        updatedAt: '2022-12-26'
    },
    {
        id: 'adding-avatar',
        issue: 'Adding avatar in Damus.',
        fix: 'Upload desired image to a public server as described in the steps above. ' +
            'Copy the image url and paste it into PROFILE PICTURE input under Profile EDIT view.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'gifs',
        issue: 'User avatars and post images can be GIFs.',
        fix: 'Animated user avatars and post images work just like any other images.',
        urls: ['https://tenor.com'],
        updatedAt: '2022-12-26'
    },
    {
        id: 'gifs-will-not-display',
        issue: 'Changed my profile pic to GIF but it won\'t display',
        fix: 'Some clients prevent GIFs larger than 1MB from loading. ' +
            'Try an image-compressing tool to downsize.',
        updatedAt: '2023-01-05'
    },
    {
        id: 'turning-images-into-gifs',
        issue: 'I want to make my images come alive.',
        fix: 'Download MotionLeap (available on Android and iOS) to add animations to your image. ' +
            'With a free version you\'d also need ezgif.com to convert MotionLeap output to GIF.',
        urls: ['https://ezgif.com'],
        updatedAt: '2023-01-05'
    },
    {
        id: 'multiple-images',
        issue: 'Adding multiple images to a post.',
        fix: 'For multiple images to be displayed in a single post, simply add a direct image url for every image you\'d like to see. ' +
            'They\'ll appear in a carousel (swipe left/right to browse).',
        updatedAt: '2022-12-27'
    },
    {
        id: 'adding-videos',
        issue: 'How to make a post with a video? (Damus)',
        fix: 'Video urls are processed and displayed as videos. Simply copy the direct video link (it has to be hosted somewhere public) and paste it into a post 🔥 ' +
            'That\'s it!',
        updatedAt: '2022-12-29'
    },
    {
        id: 'dropping-an-invoice',
        issue: 'How do I drop an invoice?',
        fix: 'Open a Lightning Wallet, click Receive, edit the amount and copy the Lightning Invoice. ' +
            'Then simply paste it into the post.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'multiple-invoices',
        issue: 'Can I drop more than one invoice in a note?',
        fix: 'Yes, some clients support dropping multiple invoices in a single note. Simply copy & paste lnurls, ' +
            'separated by spaces, into a new note.',
        updatedAt: '2023-01-03'
    },
    {
        id: 'how-to-quote-a-note',
        issue: 'How to refer to an existing post (note)?',
        fix: 'Click (press) and hold on the note you would like to quote. A menu should pop up. Select Copy Note ID. ' +
            'Then use that id prefixed by @ in your new post.',
        updatedAt: '2023-01-03'
    },
    {
        id: 'deleting-notes',
        issue: 'Deleting posts on Nostr.',
        fix: 'There\'s a good chance, that the things you post on Nostr will stay there for eternity. ' +
            'Soon the clients will implement a so called soft-delete, ' +
            'which means that posts with a delete flag will be ignored and not displayed to users. ' +
            'This doesn\'t mean though that your "deleted" post is gone.',
        imageUrls: ['https://uselessshit.co/images/deleting-notes.jpeg'],
        createdAt: '2023-01-06',
        updatedAt: '2023-01-10'
    },
    {
        id: 'sharing-notes',
        issue: 'Sharing notes.',
        fix: 'In some clients it\'s now possible to share notes between. ' +
            'Simply tap on the Share icon under the post and choose a desired option.',
        updatedAt: '2023-01-07'
    },
    {
        id: 'adding-lightning-button-to-profile',
        issue: 'How to add Lightning button to profile and start receiving tips? (Damus)',
        fix: 'Open a Lightning wallet, tap Receive, select Lightning Address and copy it. ' +
            'It should start with LNURL... Go to your profile, tap Edit add paste the address into BITCOIN LIGHTNING TIPS input. ',
        updatedAt: '2022-12-26'
    },
    {
        id: 'the-like-emoji',
        issue: 'I see a lot of 🤙 emojis floating around everywhere. What does it mean?',
        fix: '🤙 (also called shaka) is for Likes. Also ⚡ is for sats.',
        createdAt: '2022-12-26',
        updatedAt: '2023-01-09'
    },
    {
        id: 'adding-more-relays',
        issue: 'The content won\'t load or loads extremely slow.',
        fix: 'You can find a list of public relays at nostr.watch and add some more items to RELAYS section of your Settings. ' +
            'You might also want to check the RECOMMENDED RELAYS section and pick up some from there.',
        urls: ['https://nostr.watch'],
        updatedAt: '2022-12-30'
    },
    {
        id: 'selecting-default-lightning-wallet',
        issue: 'How do I select a default wallet? (Damus)',
        fix: 'In Damus Settings (cog icon in top right) scroll down to WALLET SELECTOR section. ' +
            'The default wallet can be chosen from the list under "Select default wallet".',
        updatedAt: '2023-01-06'
    },
    {
        id: 'dark-mode',
        issue: 'How to switch to dark mode? (Damus)',
        fix: 'Set you iOS theme to dark.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'clearing-cache',
        issue: 'How does one clear cache in Damus?',
        fix: 'Clear cache option is located in Settings (cog icon in top right corner) under CLEAR CACHE section.',
        updatedAt: '2023-01-07'
    },
    {
        id: 'saving-images-to-library',
        issue: 'How to save an image posted by someone to my Library? (Damus)',
        fix: 'Tap on the picture you want to save. In the newly opened window tap & hold on the image and select Save Image.',
        updatedAt: '2023-01-07'
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
        updatedAt: '2023-01-05'
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
        issue: 'How to remove a relay? (Damus)',
        fix: 'In your SETTINGS view (cog icon in the right top), swipe left on a relay you\'d ' +
            'like to remove and click on the trash icon to confirm removal. ' +
            'You might want to restart the client for the changes to take place.',
        updatedAt: '2022-12-30'
    },
    {
        id: 'nip-05',
        issue: 'How to setup NIP-05 identifier (checkmark)?',
        fix: 'Head down to this basic guide (the gist below) on setting up a NIP-05 identifier. ' +
            'If you don\'t own a domain you can ask someone to create an id for you at their domain. ' +
            'DM me for yourname@uselessshit.co NIP-05 id 🤙 (see Contact)',
        urls: ['https://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e', 'https://nvk.org/n00b-nip5'],
        createdAt: '2023-01-04',
        updatedAt: '2023-01-10'
    },
    {
        id: 'lnurlp',
        issue: 'How to turn my NIP-05 handle into lightning address?',
        fix: 'Navigate to the url below to make your NIP-05 handle a lightning address (Alby).',
        urls: ['https://nvk.org/alby-lnurlp'],
        createdAt: '2023-01-10',
        updatedAt: '2023-01-10'
    },
    {
        id: 'blue-and-yellow-checkmarks',
        issue: 'What\'s the difference between blue and yellow checkmark?',
        fix: 'People you aren\'t following have yellow checkmarks, whereas the ones you follow have blue checkmarks.',
        updatedAt: '2023-01-04 15:32:00'
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
        id: 'converting-npub-to-hex',
        issue: 'How to convert my npub key (Damus) to hex format?',
        fix: 'Try this online tool to convert your npub key to hex format.',
        urls: ['https://damus.io/key'],
        updatedAt: '2022-12-30'
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
        id: 'boosting-issues',
        issue: 'I can\'t boost. (Damus)',
        fix: 'Sometimes it\'s not possible to boost a post from a feed. ' +
            'The workaround is to open a given thread and boost the post from there.',
        updatedAt: '2023-01-09'
    },
    {
        id: 'damus-is-crashing',
        issue: 'Damus keeps crashing.',
        fix: 'Damus is still in beta, so bugs are not uncommon. ' +
            'If your app keeps crashing, make sure you\'ve updated Damus and iOS to the latest versions.',
        updatedAt: '2023-01-09'
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
        fix: 'Go ahead and ask me on nostr @npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 🤙 ' +
            'Also, since you\'re here, ' +
            'you may also want to check our bitcoin resources page for a list of Bitcoiners, bitcoin books, pods, apps ' +
            '& wallets.',
        urls: ['https://uselessshit.co/resources/bitcoin'],
        updatedAt: '2022-12-29'
    }
];