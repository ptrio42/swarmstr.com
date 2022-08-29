import {Box} from "@mui/material";
import {useState} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import {TabPanel} from "../TabPanel/TabPanel";

export const BitcoinResources = () => {
    const [tab, setTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    return (
        <Box sx={{ width: '80%', margin: '0px auto', marginTop: '1em', minHeight: '500px'  }}>
            <img height="128" src={process.env.PUBLIC_URL + '/images/white-rabbit.png'} />
            <Typography id="were-handed-a-card" variant="h3" component="div" gutterBottom>
                Bitcoin Resources
            </Typography>
            <Typography sx={{ marginBottom: '3em' }} align="justify" gutterBottom>
                As the Bitcoin network keeps evolving, becoming more wide spread and more secure, our understanding of bitcoin becomes broader. Seems like the deeper you go into the rabbit hole, the better you understand how little you know. There isn’t such a thing as owning enough bitcoin , and so there isn’t such a thing as definite understanding of bitcoin.
                <br/><br/>
                It’s usually hard to wrap your head around bitcoin when you first encounter it. It takes a bit of time to build adequate mental models to be able to conceive the true value proposition of bitcoin. But rest assured, once you see bitcoin, as it is, you cannot unsee it.
                <br/><br/>
                Below, you’ll find a list of bitcoin podcasts & books that will help you get a wider understanding of bitcoin.
                <br/><br/>
                Check apps & sites tab to find out what is being built on top of the Bitcoin Lightning network.
                <br/><br/>
                Follow the white rabbit...
            </Typography>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="Bitcoin resources"
                textColor="secondary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                <Tab label="People to follow" />
                <Tab label="Podcasts" />
                <Tab label="Books" />
                <Tab label="Apps & sites" />
                <Tab label="Wallets" />
                <Tab label="Hardware Wallets" />
            </Tabs>
            <Grid container>
                <Grid item xs={12}>
                    <TabPanel index={0} value={tab}>
                        <List>
                            <ListItem>Jeff Booth</ListItem>
                            <ListItem>Robert Breedlove</ListItem>
                            <ListItem>Knut Svanholm</ListItem>
                            <ListItem>Saifedean Ammous</ListItem>
                            <ListItem>Michael Saylor</ListItem>
                            <ListItem>Der Gigi</ListItem>
                            <ListItem>Andreas Antonopoulos</ListItem>
                            <ListItem>Max Keiser & Stacy Herbert</ListItem>
                            <ListItem>Preston Pysh</ListItem>
                            <ListItem>Eric Cason</ListItem>
                            <ListItem>Guy Swann</ListItem>
                            <ListItem>Alex Gladstein</ListItem>
                            <ListItem>Brandon Quittem</ListItem>
                            <ListItem>John Vallis</ListItem>
                            <ListItem>Daniel Prince</ListItem>
                            <ListItem>Lyn Alden</ListItem>
                            <ListItem>Kevin Rooke</ListItem>
                            <ListItem>Matt Odell</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <List>
                            <ListItem>
                                <a className="link" href="https://whatismoneypodcast.com/" target="_blank">What is Money? Show</a>
                            </ListItem>
                            <ListItem>
                                What Bitcoin Did
                            </ListItem>
                            <ListItem>
                                A Path to Bitcoin
                            </ListItem>
                            <ListItem>
                                Bitcoin Audible
                            </ListItem>
                            <ListItem>
                                Once Bitten! A Bitcoin Podcast
                            </ListItem>
                            <ListItem>
                                Orange Pill Podcast
                            </ListItem>
                            <ListItem>
                                The Bitcoin Standard Podcast
                            </ListItem>
                            <ListItem>
                                Kevin Rooke Show
                            </ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={2} value={tab}>
                        <List>
                            <ListItem>21 lessons by Der Gigi</ListItem>
                            <ListItem>Everything divided by 21 million by Knut Svanholm</ListItem>
                            <ListItem>Bitcoin Standard by Saifedean Ammous</ListItem>
                            <ListItem>Fiat Standard by Saifedean Ammous</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={3} value={tab}>
                        <List>
                            <ListItem>Fountain</ListItem>
                            <ListItem>Breez</ListItem>
                            <ListItem>stacker.news</ListItem>
                            <ListItem>satsback.com</ListItem>
                            <ListItem>lightning.gifts</ListItem>
                            <ListItem>microlancer.io</ListItem>
                            <ListItem>sMiles</ListItem>
                            <ListItem>Tweetoshi</ListItem>
                            <ListItem>konsensus.network</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={4} value={tab}>
                        <List>
                            <ListItem>Muun</ListItem>
                            <ListItem>Breez</ListItem>
                            <ListItem>Wallet of Satoshi</ListItem>
                            <ListItem>Blue Wallet</ListItem>
                            <ListItem>Phoenix</ListItem>
                            <ListItem>LN Bits</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={5} value={tab}>
                        <List>
                            <ListItem>COLDCARD</ListItem>
                            <ListItem>BitBox02</ListItem>
                            <ListItem>Ledger</ListItem>
                            <ListItem>Passport</ListItem>
                        </List>
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    );
};