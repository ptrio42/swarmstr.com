import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";

interface NostrProps {
    guides?: any[]
}

interface Guide {
    id: string;
    issue: string;
    fix: string;
    urls?: string[];
}

const GUIDES = [
    {
        id: 'how-do-i-tag-a-person',
        issue: 'How do I tag a person?',
        fix: 'Use this person\'s public key instead of their handle. ' +
            'The public key can be obtained in a person\'s profile, under the key icon.',
        tags: ['Damus']
    },
    {
        id: 'adding-images',
        issue: 'How to add an image to a post?',
        fix: 'Image urls are processed and displayed as images. ' +
            'For now, it\'s not possible to upload images directly from your device. ' +
            'The image has to be hosted somewhere before it can be used. ' +
            'Several free public image hosting services are listed below.'
    },
    {
        id: 'image-hosting',
        issue: 'Image hosting services.',
        fix: 'A list of free image hosting services.',
        urls: ['https://nostr.build', 'https://imgbb.com', 'https://postimages.org']
    },
    {
        id: 'adding-avatar',
        issue: 'Adding avatar in Damus',
        fix: 'Upload desired image to a public server as described in the steps above. ' +
            'Copy the image url and paste it into PROFILE PICTURE input under Profile EDIT view.'
    },
    {
        id: 'gifs',
        issue: 'User avatars and post images can be GIFs.',
        fix: 'Animated user avatars and post images work just like any other images.',
        urls: ['https://tenor.com']
    },
    {
        id: 'dropping-an-invoice',
        issue: 'How do I drop an invoice?',
        fix: 'Open a Lightning Wallet, click Receive, edit the amount and copy the Lightning Invoice. ' +
            'Then simply paste it into the post.'
    },
    {
        id: 'how-to-quote-a-note',
        issue: 'How to refer to an existing post (note)?',
        fix: 'Click (press) and hold on the note you would like to quote. A menu should pop up. Select Copy Note ID. ' +
            'Then use that id prefixed by @ in your new post.'
    },
    {
        id: 'adding-lightning-button-to-profile',
        issue: 'How to add Lightning button to profile and start receiving tips? (Damus)',
        fix: 'Open a Lightning wallet, tap Receive, select Lightning Address and copy it. ' +
            'It should start with LNURL... Go to your profile, tap Edit add paste the address into BITCOIN LIGHTNING TIPS input. '
    },
    {
        id: 'the-like-emoji',
        issue: 'I see a lot of 🤙 emojis floating around everywhere. What does it mean?',
        fix: '🤙 is for Likes. Also ⚡ is for sats.'
    },
    {
        id: 'adding-more-relays',
        issue: 'The content won\'t load or loads extremely slow.',
        fix: 'You can find a list of public relays at nostr.watch and add some more items to RELAYS section of your Settings.',
        urls: ['https://nostr.watch']
    },
    {
        id: 'selecting-default-lightning-wallet',
        issue: 'Whenever I click the lightning icon it automatically opens X wallet. How do I switch to Y wallet? (Damus)',
        fix: 'For now, to able to use a specific wallet, ' +
            'you need to either reinstall the wallet or remove other wallets installed before the one you\'d like to use.'
    },
    {
        id: 'dark-mode',
        issue: 'How to switch to dark mode? (Damus)',
        fix: 'Set you iOS theme to dark.'
    },
    {
        id: 'who-to-follow',
        issue: 'Who to follow?',
        fix: 'Start with following yourself ⚡. Next best step is to find a Bitcoiner and follow some plebs they\'re following. ' +
            'Also you can check under the hashtag #Plebchain or look at the profiles with the most followers at nostr.io',
        urls: ['https://nostr.io/stats']
    }
];

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);

    useEffect(() => {
        setGuides(GUIDES);
    }, []);

    return (
        <React.Fragment>
            <List>
                <ListItem>
                    Useful tips for NOSTR newcomers
                </ListItem>
                {
                    guides.map((guide, index) => (
                        <ListItem>
                            <Link to={`/resources/nostr#${guide.id}`}>{guide.issue}</Link>
                        </ListItem>
                    ))
                }
            </List>
            <Box>
                {
                    guides.map(guide => (
                        <React.Fragment>
                            <Card id={guide.id} sx={{ minWidth: 275, marginBottom: '0.5em' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#000' }} color="text.secondary" gutterBottom>
                                        { guide.issue }
                                    </Typography>
                                    <Typography variant="body2">
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
                            </Card>
                        </React.Fragment>
                    ))
                }
            </Box>
        </React.Fragment>
    );
};