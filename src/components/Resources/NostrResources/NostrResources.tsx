import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import {Link, useLocation} from "react-router-dom";
import {Helmet} from "react-helmet";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {ArrowDownward, ArrowUpward, ExpandLess, ExpandMore, Reply, ToggleOff} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import ListItemButton from "@mui/material/ListItemButton";
import Snackbar from "@mui/material/Snackbar";

interface NostrResourcesProps {
    guides?: Guide[]
}

interface Guide {
    id: string;
    issue: string;
    fix: string;
    urls?: string[];
    updatedAt: string;
}

const GUIDES: Guide[] = [
    {
        id: 'what-is-nostr',
        issue: 'What\'s NOSTR?',
        fix: 'Notes and Other Stuff Transmitted by Relays, ' +
            'or NOSTR, is an open protocol, designed to create a censorship-resistant social network.',
        urls: [
            'https://github.com/nostr-protocol/nostr',
            'https://usenostr.org',
            'https://nostr-resources.com'
        ],
        updatedAt: '2022-12-30'
    },
    {
        id: 'keys',
        issue: 'Getting the keys',
        fix: 'The keys are your identity. They consist of a public key (npub) and a private key (nsec). ' +
            'The public can be treated as a username, whereas the private key is more like a password. ' +
            'Be cautious when entering your private on different sites - if it gets leaked and falls into wrong hands,' +
            'you can think of your \'account\' as compromised. You can get your keys through any of the NOSTR clients.',
        urls: ['https://damus.io', 'https://astral.ninja'],
        updatedAt: '2023-01-02'
    },
    {
        id: 'mining-the-public-key',
        issue: 'How to mine a public key?',
        fix: 'You can mine your public key with a desired prefix. Check out nostr.rest to find out how.',
        urls: ['https://nostr.rest'],
        updatedAt: '2023-01-02'
    },
    {
        id: 'how-do-i-tag-a-person',
        issue: 'How do I tag a person?',
        fix: 'Use this person\'s public key instead of their handle. ' +
            'The public key can be obtained in a person\'s profile, under the key icon. ' +
            'Then, to tag this person, you got to put the @ symbol in front of their pubkey.',
        updatedAt: '2023-01-01'
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
        id: 'adding-lightning-button-to-profile',
        issue: 'How to add Lightning button to profile and start receiving tips? (Damus)',
        fix: 'Open a Lightning wallet, tap Receive, select Lightning Address and copy it. ' +
            'It should start with LNURL... Go to your profile, tap Edit add paste the address into BITCOIN LIGHTNING TIPS input. ',
        updatedAt: '2022-12-26'
    },
    {
        id: 'the-like-emoji',
        issue: 'I see a lot of 🤙 emojis floating around everywhere. What does it mean?',
        fix: '🤙 is for Likes. Also ⚡ is for sats.',
        updatedAt: '2022-12-26'
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
        issue: 'Whenever I click the lightning icon it automatically opens X wallet. How do I switch to Y wallet? (Damus)',
        fix: 'For now, to able to use a specific wallet, ' +
            'you need to either reinstall the wallet or remove other wallets installed before the one you\'d like to use.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'dark-mode',
        issue: 'How to switch to dark mode? (Damus)',
        fix: 'Set you iOS theme to dark.',
        updatedAt: '2022-12-26'
    },
    {
        id: 'who-to-follow',
        issue: 'Who to follow?',
        fix: 'Start with following yourself ⚡. Next best step is to find a Bitcoiner and follow some plebs they\'re following. ' +
            'Also you can check under the hashtag #Plebchain or look at the profiles with the most followers at nostr.io',
        urls: ['https://nostr.io/stats', 'https://bitcoinnostr.com/lfg'],
        updatedAt: '2023-01-02'
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
        fix: 'Be cautious when uploading images to nostr.build as anyone can see them without a direct link.',
        urls: ['https://nostr.build/i/'],
        updatedAt: '2022-12-27'
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
        issue: 'How to setup NIP-05 identifier?',
        fix: 'Head down to this basic guide on setting up NIP-05 identifier. ' +
            'DM me your public hex key and desired name for a NIP-05 identifier at uselessshit.co',
        urls: ['https://gist.github.com/metasikander/609a538e6a03b2f67e5c8de625baed3e'],
        updatedAt: '2023-01-04'
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
        fix: 'Check out nostream, a production-ready nostr relay written in TypeScript.',
        urls: ['https://github.com/Cameri/nostream'],
        updatedAt: '2022-12-30'
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

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);
    const [sort, setSort] = useState<string>('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

    const { hash } = useLocation();

    useEffect(() => {
        setGuides(GUIDES);
    }, []);

    useEffect(() => {
        if (sort === '') {
            setGuides(GUIDES);
        } else {
            const guidesSorted = [ ... guides ];

            guidesSorted.sort((current, next) =>
                new Date(next.updatedAt).getTime() - new Date(current.updatedAt).getTime());
            if (sort === 'asc') {
                guidesSorted.reverse();
            }
            setGuides(guidesSorted);
        }
    }, [sort]);

    useEffect(() => {
        setExpanded((state) => [
            ...state,
            hash.slice(1)
        ]);

        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 3000);
        }
    }, [hash]);

    const handleExpanded = (guideId: string) => {
        let newExpanded;
        if (expanded.includes(guideId)) {
            newExpanded = expanded.filter(expanded => expanded !== guideId);
        } else {
            newExpanded = [ ...expanded ];
            newExpanded.push(guideId);
        }
        setExpanded(newExpanded)
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>NOSTR newcomers most common questions and answers - UselessShit.co</title>
                <meta property="description" content="Basic guide for NOSTR newcomers." />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="NOSTR Newcomers Most Common Questions and Answers - UselessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/guide-cover.png" />
                <meta property="og:description" content="Basic guide for NOSTR newcomers." />

                <meta itemProp="name" content="NOSTR newcomers most common questions and answers - UselessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/guide-cover.png" />

                <meta name="twitter:title" content="NOSTR newcomers most common questions and answers - UselessShit.co" />
                <meta name="twitter:description" content="Basic guide for NOSTR newcomers." />
                <meta name="twitter:image" content="https://uselessshit.co/images/guide-cover.png" />

            </Helmet>
            <Stack sx={{ marginTop: '1em' }} direction="row" spacing={1}>
                <Chip
                    label="No sort"
                    variant={sort === '' ? 'filled' : 'outlined'}
                    onClick={() => {
                        setSort('')
                    }}
                />
                <Chip
                    icon={sort === 'asc' ?
                        <ArrowUpward /> : sort === 'desc' ? <ArrowDownward /> : <ToggleOff />
                    }
                    variant={sort !== '' ? 'filled' : 'outlined'}
                    label="Last updated"
                    onClick={() => {
                        setSort(
                            sort === 'asc' ? 'desc' : 'asc'
                        )
                    }}
                />
            </Stack>
            <List>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase' }}
                        primary="Useful tips for NOSTR newcomers"
                        primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '16px' } }}
                    />
                </ListItem>
                {
                    guides.map((guide, index) => (
                        <ListItemButton key={guide.id} id={guide.id} sx={{ flexWrap: 'wrap' }} onClick={() => {
                            handleExpanded(guide.id)
                        }}>
                            <ListItemText primary={guide.issue} />
                            {expanded.includes(guide.id) ? <ExpandLess /> : <ExpandMore />}
                            <Reply sx={{ marginLeft: '0.3em' }} onClick={(event) => {
                                event.stopPropagation();
                                navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${guide.id}`);
                                setSnackbarOpen(true);
                            }} />
                            <Collapse sx={{ width: '100%'}} in={expanded.includes(guide.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem>
                                        <Card sx={{ minWidth: 275, marginBottom: '0.5em' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#000' }} color="text.secondary" gutterBottom>
                                                    { guide.issue }
                                                </Typography>
                                                <Typography gutterBottom variant="body2">
                                                    { guide.fix }
                                                </Typography>
                                                { guide.urls && guide.urls.length > 0 &&
                                                guide.urls.map(url =>
                                                    <React.Fragment>
                                                        <a href={url} target="_blank">{ url }</a><br />
                                                    </React.Fragment>
                                                )

                                                }
                                            </CardContent>
                                            <CardActions>
                                                Last update: { guide.updatedAt }
                                            </CardActions>
                                        </Card>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </ListItemButton>
                    ))
                }
            </List>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Direct link to answer was copied to clipboard!"
            />
        </React.Fragment>
    );
};