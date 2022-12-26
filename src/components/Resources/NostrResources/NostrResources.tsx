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
            'For now, it\'s not possible to upload images directly from your client. ' +
            'Free image hosting services like https://imgbb.com could be helpful.'
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
        issue: 'How to add Lightning button to profile and start receiving tips?',
        fix: 'Open a Lightning wallet, tap Receive, select Lightning Address and copy it. ' +
            'It should start with LNURL... Go to your profile, tap Edit add paste the address into BITCOIN LIGHTNING TIPS input. '
    },
    {
        id: 'the-like-emoji',
        issue: 'I see a lot of 🤙 emojis floating around everywhere. What does it mean?',
        fix: '🤙 is for Likes. Also ⚡ is for sats.'
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
                                </CardContent>
                            </Card>
                        </React.Fragment>
                    ))
                }
            </Box>
        </React.Fragment>
    );
};