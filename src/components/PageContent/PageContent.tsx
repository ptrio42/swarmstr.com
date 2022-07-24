import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Bolt from '@mui/icons-material/Bolt';
import Campaign from '@mui/icons-material/Campaign';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import Receipt from '@mui/icons-material/Receipt';
import './PageContent.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormatQuote from '@mui/icons-material/FormatQuote';
import {Testimonials} from "../Testimonials/Testimonials";

export const PageContent = () => {
    return (
        <React.Fragment>
            <Box sx={{ width: '80%', margin: '0px auto', marginTop: '2em' }}>
                <Box component="img" alt="Useless Shit" sx={{ width: '100%' }} src={process.env.PUBLIC_URL + '/images/uselessshit-card.png'}>
                </Box>

                <CardGiftcard sx={{ fontSize: '80px' }} />
                <Typography id="were-handed-a-card" variant="h3" component="div" gutterBottom>
                    Were you handed a card?
                </Typography>
                <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px' }}>
                    Well, congratulations! You now own more useless shit!
                    But fear not! While this card was meant to make you feel bad about the purchase,
                    the fact that it was given to you also means that someone cares about you and your financial freedom.
                    However if you're feeling confused and don't really want to talk about it to anyone right now,
                    here's some stuff that is available online for FREE that might clear out some things for you and make you
                    more aware of your finances. Who knows, maybe next time you'll be the one handing out these useless-shit cards to your peers.
                </Typography>
                <List sx={{ marginBottom: '3em' }}>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://bitcoin-resources.com/" target="_blank">
                            <ListItemText primary="Learn what Bitcoin is and why you should be stacking sats" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://wtfhappenedin1971.com/" target="_blank">
                            <ListItemText primary="Find out why the currency you're using is broken" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://whatismoneypodcast.com/" target="_blank">
                            <ListItemText primary="Dive deeper into the rabbit hole with Robert Breedlove's What is Money? show" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://www.youtube.com/watch?v=FXvQcuIb5rU" target="_blank">
                            <ListItemText primary="Learn about the difference between Bitcoin and fiat standard with Jordan Peterson & Saifedean Ammous" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://www.youtube.com/watch?v=mC43pZkpTec">
                            <ListItemText primary="Listen to Lex Fridman's podcast episode with Michael Saylor for more mind-bending knowledge" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://www.knutsvanholm.com" target="_blank">
                            <ListItemText primary="Find out about a world where prices of goods go down indefinitely with Knut Svanholm" />
                        </a>
                    </ListItem>
                </List>

                <Campaign sx={{ fontSize: '80px' }} />
                <Typography id="let-s-shame-someone" variant="h3" component="div" gutterBottom>
                    Let's shame someone!
                </Typography>
                <Typography
                    variant="body1"
                    component="div"
                    align="justify"
                    gutterBottom
                    sx={{ lineHeight: '2', fontSize: '18px' }}
                >
                    Do you get irritated whenever someone close to you buys a bunch of shit they don't need?
                    Are you immediately converting the amount of fiat they spent to precious sats which they would've gotten?
                    Now you have a chance to shame them!
                    Simply print the PDF files linked below and let your friends know that you've noticed their behavior.
                    Perhaps one day, they'll understand the importance of saving in bitcoin!
                    Anyhow, these cards are 3.5 inch by 2 inch (business card size), so you can make someone feel bad,
                    while being professional about it.
                </Typography>
                <List sx={{ marginBottom: '3em' }}>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/en-uselessshit-card-front.pdf'} target="_blank">
                            <ListItemText primary="[ENG] Useless Shit Card Front" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/en-uselessshit-card-back.pdf'} target="_blank">
                            <ListItemText primary="[ENG] Useless Shit Card Back" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/pl-uselessshit-card-front.pdf'} target="_blank">
                            <ListItemText primary="[PL] Useless Shit Card Front" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/pl-uselessshit-card-back.pdf'} target="_blank">
                            <ListItemText primary="[PL] Useless Shit Card Back" />
                        </a>
                    </ListItem>
                </List>

                <Receipt sx={{ fontSize: '80px' }} />
                <Typography id="credits" variant="h3" component="div" gutterBottom>
                    Credits
                </Typography>
                <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px', marginBottom: '3em' }}>
                    This project was VERY HEAVILY inspired by <a className="link" href="https://dergigi.com" target="_blank">@gigi</a>'s <a className="link" href="https://www.fuckingshitcoins.com" target="_blank">fuckingshitcoins.com</a>, which is a VERY SERIOUS campaign to shame merchants into adopting bitcoin.
                    Since it feels like shaming merchants just wasn't enough, I decided to make it easier for plebs to shame on anyone who spends fiat on useless stuff :)
                </Typography>
            </Box>
            <Testimonials />
        </React.Fragment>
    );
};