import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Bolt from '@mui/icons-material/Bolt';
import Campaign from '@mui/icons-material/Campaign';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import Receipt from '@mui/icons-material/Receipt';
import './PageContent.css';
import {Carousel, FiatToSatsCalculator, Testimonials} from "../";

export const PageContent = () => {
    const carouselSlides = [
        {
            title: 'Useless Shit card front',
            image: `${process.env.PUBLIC_URL}/images/uselessshit-card-1.png`
        },
        {
            title: 'Useless Shit card back',
            image: `${process.env.PUBLIC_URL}/images/uselessshit-card-2.png`
        }
    ];

    return (
        <React.Fragment>
            <Box sx={{ width: '80%', margin: '0px auto', marginTop: '1em' }}>
                <Box sx={{ marginBottom: '3em' }} component="div">
                    <Carousel slides={carouselSlides} />
                </Box>

                <CardGiftcard sx={{ fontSize: '80px' }} />
                <Typography id="were-handed-a-card" variant="h3" component="div" gutterBottom>
                    Were you handed a card?
                </Typography>
                <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px' }}>
                    Congratulations! Someone you know is a Bitcoiner.
                    This might come as a surprise, but he/she cares about you. A lot.
                    They followed the white rabbit, went down the hole and discovered bitcoin - the best money the world has ever had.
                    It changed their lives, and teleported them to the future. Now they’d like the same for you.
                    <br/><br/>

                    While some of the jargon (if not all) sounds confusing, fear not!
                    If you commit just a little bit of your time out of your busy life, rest assured,
                    there will come a moment when something clicks and things will start to make sense.
                    Here’s some content, available for free, which might help you in the beginning of your journey. See you in the future!
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
                <Typography id="spread-the-word" variant="h3" component="div" gutterBottom>
                    Spread the word!
                </Typography>
                <Typography
                    variant="body1"
                    component="div"
                    align="justify"
                    gutterBottom
                    sx={{ lineHeight: '2', fontSize: '18px' }}
                >
                    Information can proliferate just like a virus.
                    Thanks to communications technologies, all it takes is one tweet or a post and boom!
                    - someone (or even thousands of people) on the other side of the globe now knows a bit more about something.
                    However, with so much stuff being communicated each and every single day,
                    there’s always a possibility that the information that was shared will  never be seen anyone (especially if your account on Twitter has like 10 followers).
                    On the other hand, in the physical realm, when information is exchanged,
                    you can be almost certain that the person in front of you is receiving the content you’re transmitting
                    - unless of course they aren’t paying attention.
                    <br/><br/>
                    Spread the good vibes and encourage people into learning about bitcoin and the importance of sats stacking.
                    If you're a Bitcoiner you're most likely doing so anyways! But here's another tool for ya.
                    <br/><br/>
                    Onboard people into the future by handing them these cards (links below) and let the peaceful revolution continue.
                    <br/><br/>
                    The cards are 3.5 inches by 2 inches (business card size), so you can easily carry a bunch of them in your wallet
                    and hand them out to peeps when needed.
                    <br/><br/>

                    All linked cards are in print-friendly PDF files. Translations and other variations are most welcomed!
                </Typography>
                <List sx={{ marginBottom: '3em' }}>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/new-uselessshit-card-front.pdf'} target="_blank">
                            <ListItemText primary="[ENG] Card Front" />
                        </a>
                    </ListItem>
                    <ListItem>
                        <Bolt />
                        <a className="link" href={ process.env.PUBLIC_URL + '/pdfs/new-uselessshit-card-back.pdf'} target="_blank">
                            <ListItemText primary="[ENG] Card Back" />
                        </a>
                    </ListItem>
                </List>
                <Typography variant="h4" component="div" gutterBottom>
                    Spicing things up a bit
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
                    Handing them the regular cards didn’t work as expected?
                    Try shaming your buddies with the Useless Shit Shame cards!
                    Perhaps this way, they'll put some effort into understanding the importance of saving in bitcoin!
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
                <Typography id="converter" sx={{ fontSize: '18px' }} variant="body1" component="div">
                    In case you're looking for a way to quickly convert the USD shitcoin amount to sats, you can use the calculator listed below.
                </Typography>
                <Grid sx={{ margin: '3em 0' }} container justifyContent="center">
                    <FiatToSatsCalculator />
                </Grid>

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