import React, {useEffect, useState} from "react";
import {
    Mux,
    Relay,
    Personalizer,
    AutoProfileSubscriber,
    GenericProfile,
    parseGenericProfile, SubscriptionOptions,
} from 'nostr-mux';
import { nip19 } from 'nostr-tools';
import { uniq, uniqBy, last } from 'lodash';
import {Card, Paper} from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {Helmet} from "react-helmet";
import './Zaps.css';
import Snackbar from "@mui/material/Snackbar";

const getPubkeysFromEventTags = (event: any): string[] => {
    return event.tags
        .filter((t: string[]) => t[0] === 'p')
        .map((t1: string[]) => t1[1]);
};

const DATE = new Date();
DATE.setUTCHours(0, 0, 0, 0);

const FILTER_1 = {
    authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
    '#a': ['30009:000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6:team-21']
};

const FILTER_2 = {
    authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
    '#a': ['30009:000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6:69ers']
};

const FILTER_3 = (pubkeys: string[]) => ({
    kinds: [0],
    authors: [...pubkeys]
});

const FILTER_4 = {
    kinds: [9735],
    since: Math.floor(DATE.getTime() / 1000)
};


const DEFAULT_RELAYS = [
    'wss://eden.nostr.land',
    'wss://nostr.fmt.wiz.biz',
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.nostr.info',
    'wss://offchain.pub',
    'wss://nos.lol',
    'wss://brb.io',
    'wss://relay.snort.social',
    'wss://relay.current.fyi',
    'wss://nostr.relayer.se',
    'wss://nostr.uselessshit.co',
    'wss://nostr.bitcoiner.social',
    'wss://nostr.milou.lol',
    'wss://nostr.zebedee.cloud',
    'wss://relay.nostr.bg',
    'wss://nostr.wine'
];

const mux = new Mux();

// Multiplexe them.
DEFAULT_RELAYS.forEach((url: string) => {
    mux.addRelay(new Relay(url));
});

export const Zaps = () => {

    const [pubkeysTeam21, setPubkeysTeam21] = useState<string[]>([]);
    const [zapsTeam21, setZapsTeam21] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [pubkeys69ers, setPubkeys69ers] = useState<string[]>([]);
    const [zaps69ers, setZaps69ers] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [displayTeam21Lightning, setDisplayTeam21Lightning] = useState<boolean>(false);
    const [display69ersLightning, setDisplay69ersLightning] = useState<boolean>(false);
    const [names21, setNames21] = useState<{name: string, pubkey: string}[]>([]);
    const [names69, setNames69] = useState<{name: string, pubkey: string}[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    useEffect(() => {
        // Subscribe
        mux.waitRelayBecomesHealthy(1, 5000)
            .then(ok => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }

                mux.subscribe({
                    filters: [FILTER_4],
                    onEvent: (e: any) => {
                        // console.log(`received zap receipt event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                        const bolt11: string = e[0].received.event.tags.find((t: string[]) => t[0] === 'bolt11')[1];
                        const description = JSON.parse(e[0].received.event.tags.find((t: string) => t[0] === 'description')[1]);
                        if (bolt11.indexOf('210') >= 0) {
                            setZapsTeam21((zaps) => uniqBy([
                                ...zaps,
                                {bolt11, pubkey: description.pubkey}
                            ], 'bolt11'));
                        }
                        if (bolt11.indexOf('690') >= 0) {
                            setZaps69ers((zaps) => uniqBy([
                                ...zaps,
                                {bolt11, pubkey: description.pubkey}
                            ], 'bolt11'));
                        }

                    },
                    onEose: (subID) => {
                        console.log(`subscription(id: ${subID}) EOSE`);
                    },
                    onRecovered: (relay) => {
                        console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
                        return [FILTER_4]
                    },
                } as SubscriptionOptions);

                    mux.subscribe({
                        filters: [FILTER_1],
                        onEvent: (e: any) => {
                            console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                            const pks = getPubkeysFromEventTags(e[0].received.event);
                            setPubkeysTeam21((pubkeys) => uniq([
                                ...pubkeys,
                                ...pks
                            ]));

                            if (pks.some(pk => pubkeysTeam21.includes(pk))) {
                                return;
                            }

                            mux.subscribe({
                                filters: [FILTER_3(pks)],
                                onEvent: (e: any) => {
                                    console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                    const data = JSON.parse(e[0].received.event.content);
                                    setNames21((names) => uniqBy([
                                        ...names,
                                        { name: data.name, pubkey: e[0].received.event.pubkey }
                                    ], 'pubkey'));

                                },
                                onEose: (subID) => {
                                    console.log(`subscription(id: ${subID}) EOSE`);
                                    mux.unSubscribe(subID);
                                },
                                onRecovered: (relay) => {
                                    console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
                                    return [FILTER_3(pks)]
                                },
                            } as SubscriptionOptions);

                        },
                        onEose: (subID) => {
                            console.log(`subscription(id: ${subID}) EOSE`);
                        },
                        onRecovered: (relay) => {
                            console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
                            return [FILTER_1]
                        },
                    } as SubscriptionOptions);


                    mux.subscribe({
                        filters: [FILTER_2],
                        onEvent: (e: any) => {
                            console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                            const pks = getPubkeysFromEventTags(e[0].received.event);
                            setPubkeys69ers((pubkeys) => uniq([
                                ...pubkeys,
                                ...pks
                            ]));
                            if (pks.some(pk => pubkeys69ers.includes(pk))) {
                                return;
                            }
                            mux.subscribe({
                                filters: [FILTER_3(pks)],
                                onEvent: (e: any) => {
                                    console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                    const data = JSON.parse(e[0].received.event.content);
                                    setNames69((names) => uniqBy([
                                        ...names,
                                        { name: data.name !== '' ? data.name : data.displayed_name, pubkey: e[0].received.event.pubkey }
                                    ], 'pubkey'));
                                },
                                onEose: (subID) => {
                                    mux.unSubscribe(subID);
                                },
                                onRecovered: (relay) => {
                                    console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
                                    return [FILTER_3(pks)]
                                },
                            } as SubscriptionOptions);

                        },
                        onEose: (subID) => {
                            console.log(`subscription(id: ${subID}) EOSE`);
                        },
                        onRecovered: (relay) => {
                            console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
                            return [FILTER_2]
                        },
                    } as SubscriptionOptions)
            });
    }, []);

    useEffect(() => {
        const latestZap = last(zapsTeam21);
        if (latestZap && !latestZap.counted && pubkeysTeam21.includes(latestZap.pubkey)) {
            const zapper = names21.find((n: any) => n.pubkey === latestZap.pubkey);
            if (zapper) {
                setZapsTeam21([
                    ...zapsTeam21.filter((z: any) => z.bolt11 !== latestZap.bolt11),
                    {
                        ...latestZap,
                        counted: true
                    }
                ]);
                setDisplayTeam21Lightning(true);
                setSnackbarMessage(`Team 21: Zap ⚡️ from ${zapper.name}`);
                setSnackbarOpen(true);
                setTimeout(() => {
                    setDisplayTeam21Lightning(false);
                }, 1000);
            }
        }
    }, [zapsTeam21]);

    useEffect(() => {
        const latestZap = last(zaps69ers);
        if (latestZap && !latestZap.counted && pubkeys69ers.includes(latestZap.pubkey)) {
            const zapper = names69.find((n: any) => n.pubkey === latestZap.pubkey);
            if (zapper) {
                setZaps69ers([
                    ...zaps69ers.filter((z: any) => z.bolt11 !== latestZap.bolt11),
                    {
                        ...latestZap,
                        counted: true
                    }
                ]);
                setDisplay69ersLightning(true);
                setSnackbarMessage(`69ers: Zap ⚡️ from ${zapper.name}`);
                setSnackbarOpen(true);
                setTimeout(() => {
                    setDisplay69ersLightning(false);
                }, 1000);
            }
        }
    }, [zaps69ers]);

    return (
        <React.Fragment>

            <title>Team 21 vs 69ers Scoreboard - UseLessShit.co</title>
            <meta property="description" content="Today's zaps from Team 21 and 69ers." />
            <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

            <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Team 21 vs 69ers Scoreboard - UseLessShit.co" />
            <meta property="og:image" content="https://uselessshit.co/images/team21-vs-69ers.png" />
            <meta property="og:description" content="Today's zaps from Team 21 and 69ers." />

            <meta itemProp="name" content="Team 21 vs 69ers Scoreboard - UseLessShit.co" />
            <meta itemProp="image" content="https://uselessshit.co/images/team21-vs-69ers.png" />

            <meta name="twitter:title" content="Team 21 vs 69ers Scoreboard - UseLessShit.co" />
            <meta name="twitter:description" content="Today's zaps from Team 21 and 69ers." />
            <meta name="twitter:image" content="https://uselessshit.co/images/team21-vs-69ers.png" />

            <Typography component="div" variant="h4" gutterBottom sx={{ background: 'transparent!important',fontSize: '28px', height: 'auto!important'  }}>
                Today's stats
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'center', display: 'flex' }}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="180"
                            image="https://uselessshit.co/images/team-21-logo.png"
                            alt="team 21"
                        />
                        {
                            displayTeam21Lightning && <CardMedia
                                sx={{ position: 'absolute', top: 0 }}
                                component="img"
                                height="180"
                                image="http://localhost:3000/images/lightning-left.png"
                                alt="team 21 lightning"
                                className="lightning"
                            />
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Team 21
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                🫂 Members: {pubkeysTeam21.length}<br/>
                                ⚡️ Zaps: {zapsTeam21.filter((z: any) => pubkeysTeam21.includes(z.pubkey)).length}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Typography component="div" sx={{ padding: '0 5px', alignItems: 'center', display: 'flex' }}>
                    vs
                </Typography>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="180"
                            image="https://uselessshit.co/images/69ers-team-logo.png"
                            alt="69ers"
                        />
                        {
                            display69ersLightning && <CardMedia
                                sx={{ position: 'absolute', top: 0 }}
                                component="img"
                                height="180"
                                image="http://localhost:3000/images/lightning-right.png"
                                alt="69ers lightning"
                                className="lightning"
                            />
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                69ers
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                🫂 Members: {pubkeys69ers.length}<br/>
                                ⚡️ Zaps: {zaps69ers.filter((z: any) => pubkeys69ers.includes(z.pubkey)).length}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Stack>
            <Typography component="div" sx={{ padding: '16px', marginBottom: '230px' }}>
                Want to join a team? Check <a href="https://snort.social/e/note16r4p7hvuvjv2uag2lg4v779vywu3kc5a4ugex5j7vspeusdrj4sqynfmav" target="_blank">this note</a>.
            </Typography>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};