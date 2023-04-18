const pages = {
    'card-generator': {
        title: 'Bitcoin Artwork Creator: Cards, Bookmarks, Stickers - UseLessShit.co',
        description: 'Spread bitcoin awareness with personalized business & greeting cards, bookmarks and stickers.',
        keywords: 'bitcoin artwork, bitcoin stickers, diy stickers, bookmarks, greeting cards, business cards',
        url: 'https://uselessshit.co/card-generator',
        image: ''
    },
    'resources/nostr': {
        title: 'Your guide to the world of Nostr - UseLessShit.co',
        description: 'Basic guides for Nostr newcomers. Find answers to the most common questions.',
        keywords: 'nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr, nostr how, nostr guides, nostr begginer guide',
        url: 'https://uselessshit.co/resources/nostr',
        image: 'https://uselessshit.co/images/new-nostr-guide-cover.png'
    },
    'nostr/nip-05': {
        title: 'Human readable identifier for your public key - UseLessShit.co',
        description: 'Get verified on Nostr @nostrich.love',
        keywords: 'nostr, nostr nip05, nip-05, getting verified, nip-05 handle, nostr checkmark',
        url: 'https://uselessshit.co/nostr/nip-05',
        image: ''
    },
    'nostr/zaps': {
        title: 'Zappers Scoreboard - UseLessShit.co',
        description: 'Today\'s zaps from Team 21, 69ers, 420 gang and Grand Zappers.',
        keywords: 'zaps, zap competition, nostr zaps, nostr badges',
        url: 'https://uselessshit.co/nostr/zaps',
        image: 'https://uselessshit.co/images/zaps-cover.png'
    }
};

module.exports.getPageById = id => pages[id-1];