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
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import './BitcoinResources.css';
import ListItemText from "@mui/material/ListItemText";

export const BitcoinResources = () => {
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    const text = {
        color: '#1B3D2F'
    };

    const peopleToFollow = [
        {
            name: 'Jeff Booth'
        },
        {
            name: 'Robert Breedlove'
        },
        {
            name: 'Knut Svanholm'
        },
        {
            name: 'Saifedean Ammous'
        },
        {
            name: 'Michael Saylor'
        },
        {
            name: 'Der Gigi'
        },
        {
            name: 'Andreas Antonopoulos'
        },
        {
            name: 'Max Keiser & Stacy Herbert'
        },
        {
            name: 'Daniel Prince'
        },
        {
            name: 'John Vallis'
        },
        {
            name: 'Brandon Quittem'
        },
        {
            name: 'Alex Gladstein'
        },
        {
            name: 'Guy Swann'
        },
        {
            name: 'Eric Cason'
        },
        {
            name: 'Preston Pysh'
        },
        {
            name: 'Adam Curry'
        },
        {
            name: 'Jack Mallers'
        },
        {
            name: 'Matt Odell'
        },
        {
            name: 'Kevin Rooke'
        },
        {
            name: 'Lyn Alden'
        },
        {
            name: 'Adam Back'
        },
        {
            name: 'Nayib Bukele'
        },
        {
            name: 'Peter McCormack'
        },
        {
            name: 'James Lavish'
        },
        {
            name: 'Greg Foss'
        }
    ];

    const apps = [
        {

        }
    ];

    const lightningWallets = [
        {
            name: 'Muun',
            url: 'https://muun.com/',
            description: 'Muun is a self-custodial wallet for bitcoin and lightning.'
        },
        {
            name: 'Breez',
            url: 'https://breez.technology/',
            description: 'Breez is the simplest, fastest and safest way to spend your bitcoins. Breez aims to drive bitcoin adoption in everyday commerce by providing a seamless Bitcoin usage. All powered by Lightning Network.'
        },
        {
            name: 'Wallet of Satoshi',
            url: 'https://www.walletofsatoshi.com/',
            description: 'Wallet of Satoshi is a mobile app for iOS and Android that lets you send and receive Bitcoin and Lightning payments.'
        },
        {
            name: 'Blue Wallet',
            url: 'https://bluewallet.io/',
            description: 'Bitcoin wallet and Lightning wallet for iOS and Android focus on security and UX.'
        },
        {
            name: 'Phoenix',
            url: 'https://phoenix.acinq.co/',
            description: 'It is a Bitcoin wallet. It allows you to send and receive bitcoins.'
        },
        {
            name: 'LN Bits',
            url: 'https://lnbits.com/',
            description: 'Use instantly and directly in browser on desktop or phone, no need to download any apps.'
        }
    ];

    const signingDevices = [
        {
            name: 'COLDCARD',
            url: 'https://coldcard.com/',
            description: 'COLDCARD is the world’s most trusted and secure Bitcoin Signing Device (a.k.a Bitcoin hardware wallet)'
        },
        {
            name: 'BitBox02',
            url: 'https://shiftcrypto.ch/bitbox02/',
            description: 'Protect your coins with the latest Swiss made hardware wallet'
        },
        {
            name: 'Ledger',
            url: 'https://www.ledger.com/',
            description: 'At Ledger we are developing hardware wallet technology that provides the highest level of security for crypto assets.'
        },
        {
            name: 'Passport',
            url: 'https://foundationdevices.com/passport/',
            description: 'The next generation hardware wallet. Airgapped security, fully open source, assembled in the USA.'
        }
    ];

    return (
        <Box className="bitcoin-resources" sx={{ width: '80%', margin: '0px auto', marginTop: '1em', minHeight: '500px'  }}>
            <img height="128" src={process.env.PUBLIC_URL + '/images/white-rabbit.png'} />
            <Typography id="were-handed-a-card" variant="h3" component="div" gutterBottom>
                Bitcoin Resources
            </Typography>
            <Typography sx={{ marginBottom: '3em' }} align="justify" gutterBottom>
                As the Bitcoin network keeps evolving, becoming more wide spread and more secure, our understanding of bitcoin becomes broader.
                In a sense, bitcoin is a new element, as prior to it's invention (or arguably discovery) in 2009, we haven't had anything like it.
                <br/><br/>
                For this very reason, it’s usually hard to wrap your head around bitcoin when you first encounter it.
                <br/><br/>
                It takes a bit of time to build adequate mental models to be able to conceive the true value proposition of bitcoin.
                These can be built by studying the history, which gives us some insights as to why our money is broken,
                and why it's the root of most struggle/evil in the world.
                <br/><br/>
                Through bitcoin lens we're able to see the truth, and no longer be the fish in the water, which is completely unaware
                of it's existence, as it was born in it.
                <br/><br/>
                Below, you’ll find a list of bitcoin podcasts & books that will help you get a wider understanding of bitcoin.
                <br/><br/>
                Check apps & sites tab to find out what is being built on top of the Bitcoin Lightning network.
                <br/><br/>
                Follow the white rabbit...
            </Typography>
            <Tabs
                className="tabs"
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
                            {
                                peopleToFollow.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(person => (
                                    <ListItem>{ person.name }</ListItem>
                                ))
                            }
                        </List>
                        <Stack sx={{ alignItems: 'center' }} spacing={2}>
                            <Pagination className="pagination" count={Math.ceil(peopleToFollow.length / itemsPerPage)} page={page} onChange={handlePageChange} />
                        </Stack>
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
                            <ListItem>The Investor's Podcast</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={2} value={tab}>
                        <List>
                            <ListItem>Bitcoin Standard by Saifedean Ammous</ListItem>
                            <ListItem>21 lessons by Der Gigi</ListItem>
                            <ListItem>Everything divided by 21 million by Knut Svanholm</ListItem>
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
                            <ListItem>ln.cash</ListItem>
                            <ListItem>Strike</ListItem>
                            <ListItem>swanbitcoin.com</ListItem>
                            <ListItem>Relai</ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel index={4} value={tab}>
                        <List>
                            {
                                lightningWallets.map(wallet => (
                                    <ListItem className="link" component="a" href={wallet.url} target="_blank">
                                        <ListItemText secondaryTypographyProps={{ style: text }} primary={wallet.name} secondary={wallet.url} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </TabPanel>
                    <TabPanel index={5} value={tab}>
                        <List>
                            {
                                signingDevices.map(device => (
                                    <ListItem className="link" component="a" href={device.url} target="_blank">
                                        <ListItemText secondaryTypographyProps={{ style: text }} primary={device.name} secondary={device.url} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    );
};