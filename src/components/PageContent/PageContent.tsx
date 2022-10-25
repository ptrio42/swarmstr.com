import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Bolt from '@mui/icons-material/Bolt';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import Receipt from '@mui/icons-material/Receipt';
import './PageContent.css';
import {Carousel, FiatToSatsCalculator, SpreadTheWord, Testimonials} from "../";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {Calculate, CurrencyBitcoin, DesignServices, School} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

export const PageContent = () => {
    const converterEmbeddableCode = `
    <div id="uselessshit-calculator"></div>
    <script src="https://uselessshit.co/tools/calculator.js" type="text/javascript"></script>
    <script type="text/javascript">
        calculator.init();
    </script>
    `;

    return (
        <React.Fragment>
            <Box sx={{ width: '80%', margin: '0px auto', marginTop: '1em' }}>
                <Typography variant="h3" component="div" gutterBottom>
                    Help Bitcoin adoption wherever you are!
                </Typography>

                <Typography sx={{ fontSize: '18px', marginBottom: '2em' }} variant="body1" component="div" gutterBottom>
                    Join the peaceful revolution and spread bitcoin awareness with UselessShit tools.
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ marginBottom: '2em' }}
                >
                    <Card sx={{ width: '33%' }}>
                        <CardContent>
                            <DesignServices sx={{ fontSize: '80px' }} />
                            <Typography variant="h4" component="div" gutterBottom>
                                Bitcoin Artwork
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Create beautiful bitcoin gift cards (loaded with sats), bookmarks & stickers with <Link color='secondary' to='card-generator'>a dedicated panel</Link>.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: '33%' }}>
                        <CardContent>
                            <Calculate sx={{ fontSize: '80px' }} />
                            <Typography variant="h4" component="div" gutterBottom>
                                Satoshi Calculator
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Quickly calculate how much bitcoin you'd get for your fiat currencies and generate price receipts.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: '33%' }}>
                        <CardContent>
                            <School sx={{ fontSize: '80px' }} />
                            <Typography variant="h4" component="div" gutterBottom>
                                Bitcoin Resources
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Learn for yourself how deep the Bitcoin Rabbit Hole goes.
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>

                <Box sx={{ marginBottom: '3em' }} component="div">
                    <img width="100%" src={process.env.PUBLIC_URL + '/images/uselessshit-splashscreen.jpeg'} />
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
                    <ListItem>
                        <Bolt />
                        <a className="link" href="https://www.theinvestorspodcast.com/bitcoin-fundamentals/bitcoin-common-misconceptions-w-robert-breedlove/" target="_blank">
                            Bitcoin Common Misconceptions with Robert Breedlove, hosted by Preston Pysh
                        </a>
                    </ListItem>
                </List>

                <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px' }}>
                    For more resources,
                    <Button
                        component={Link}
                        to="/bitcoin-resources"
                        color="secondary"
                        startIcon={<CurrencyBitcoin />}
                    >
                        Follow the white rabbit
                    </Button> & check our dedicated page, where you'll find a list of bitcoin related podcasts, books, apps & sites.


                </Typography>

                <SpreadTheWord />

                <Calculate sx={{ fontSize: '80px' }} />

                <Typography id="converter" sx={{ fontSize: '18px' }} variant="body1" component="div">
                    In case you're looking for a way to quickly convert the shitcoin amount to sats, you can use the calculator listed below.
                    Available fiat currencies are: USD, GBP, EUR and PLN.
                </Typography>
                <Grid sx={{ margin: '3em 0' }} container justifyContent="center">
                    <FiatToSatsCalculator />
                </Grid>

                <Typography variant="h4" component="div" gutterBottom>
                    Embed the converter on your site
                </Typography>

                <Typography id="converter" sx={{ fontSize: '18px' }} variant="body1" component="div" align="justify" gutterBottom>
                    The Fiat2SatsConverter is available as a embeddable widget. If you feel this is something you would like to have it on your site,
                    simply copy and paste the code below anywhere inside your document's body.

                    <Paper sx={{ marginTop: '1em', backgroundColor: '#1B3D2F', color: '#FFF', fontSize: '12px', overflowX: 'scroll' }} elevation={0}>
                        <pre>
                            <code>
                                {converterEmbeddableCode}
                            </code>
                        </pre>
                    </Paper>
                </Typography>

                <Receipt sx={{ fontSize: '80px' }} />
                <Typography id="credits" variant="h3" component="div" gutterBottom>
                    Credits
                </Typography>
                <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px', marginBottom: '3em' }}>
                    This project was inspired by <a className="link" href="https://dergigi.com" target="_blank">@gigi</a>'s <a className="link" href="https://www.fuckingshitcoins.com" target="_blank">fuckingshitcoins.com</a>, which is a VERY SERIOUS campaign to shame merchants into adopting bitcoin.
                    Since it feels like shaming merchants just wasn't enough, I decided to make it easier for plebs to shame on anyone who spends fiat on useless stuff :)
                </Typography>
            </Box>
            <Testimonials />
        </React.Fragment>
    );
};