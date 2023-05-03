// @ts-nocheck
import React, {useEffect, useState} from "react";
import {
    Mux,
    Relay,
    SubscriptionOptions,
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
import Box from "@mui/material/Box";
import {getRelays} from "../../../services/nostr";
import {Team} from "./Team/Team";

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

const FILTER_5 = {
    authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
    '#a': ['30009:000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6:420-gang']
};

const FILTER_6 = {
    authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
    '#a': ['30009:000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6:grand-zappers']
};

// const DEFAULT_RELAYS = [
//     'wss://eden.nostr.land',
//     'wss://nostr.fmt.wiz.biz',
//     'wss://relay.damus.io',
//     'wss://nostr-pub.wellorder.net',
//     'wss://relay.nostr.info',
//     'wss://offchain.pub',
//     'wss://nos.lol',
//     'wss://brb.io',
//     'wss://relay.snort.social',
//     'wss://relay.current.fyi',
//     'wss://nostr.relayer.se',
//     'wss://nostr.uselessshit.co',
//     'wss://nostr.bitcoiner.social',
//     'wss://nostr.milou.lol',
//     'wss://nostr.zebedee.cloud',
//     'wss://relay.nostr.bg',
//     'wss://nostr.wine',
//     'wss://purplepag.es',
//     'wss://nostr.mutinywallet.com',
//     'wss://blastr.f7z.xyz',
//     'wss://relay.nostr.band'
// ];

const mux = new Mux();

const BADGES = [
    {
        id: 'team-21',
        name: 'Team 21',
        image: 'https://uselessshit.co/images/team-21-logo.png',
        lightningImage: 'https://uselessshit.co/images/lightning-left.png',
        zapAmount: 21
    },
    {
        id: '69ers',
        name: 'Team 21',
        image: 'https://uselessshit.co/images/69ers-team-logo.png',
        lightningImage: 'https://uselessshit.co/images/lightning-right.png',
        zapAmount: 69
    },
    {
        id: '420-gang',
        name: '420 gang',
        image: 'https://uselessshit.co/images/420-gang-team-logo.png',
        lightningImage: 'https://uselessshit.co/images/lightning-right.png',
        zapAmount: 420
    },
    {
        id: '420-gang',
        name: '420 gang',
        image: 'https://uselessshit.co/images/grand-zappers-team-logo.png',
        lightningImage: 'https://uselessshit.co/images/lightning-left.png',
        zapAmount: 1000
    }
];

export const Zaps = () => {

    const [pubkeysTeam21, setPubkeysTeam21] = useState<string[]>([]);
    const [zapsTeam21, setZapsTeam21] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [pubkeys69ers, setPubkeys69ers] = useState<string[]>([]);
    const [zaps69ers, setZaps69ers] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [pubkeys420Gang, setPubkeys420Gang] = useState<string[]>([]);
    const [zaps420Gang, setZaps420Gang] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [pubkeysGrandZappers, setPubkeysGrandZappers] = useState<string[]>([]);
    const [zapsGrandZappers, setZapsGrandZappers] = useState<{bolt11: string, pubkey: string, counted?: boolean}[]>([]);
    const [names21, setNames21] = useState<{name: string, pubkey: string}[]>([]);
    const [names69, setNames69] = useState<{name: string, pubkey: string}[]>([]);
    const [names420, setNames420] = useState<{name: string, pubkey: string}[]>([]);
    const [names1000, setNames1000] = useState<{name: string, pubkey: string}[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');


    useEffect(() => {
        getRelays()
            .then((relays: string[]) => {
                // Multiplexe relays.
                relays.forEach((url: string) => {
                    mux.addRelay(new Relay(url));
                });
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
                                try {
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
                                    if (bolt11.indexOf('4200') >= 0) {
                                        setZaps420Gang((zaps) => uniqBy([
                                            ...zaps,
                                            {bolt11, pubkey: description.pubkey}
                                        ], 'bolt11'));
                                    }
                                    if (bolt11.indexOf('10u') >= 0|| bolt11.indexOf('20u') >= 0) {
                                        setZapsGrandZappers((zaps) => uniqBy([
                                            ...zaps,
                                            {bolt11, pubkey: description.pubkey}
                                        ], 'bolt11'));
                                    }
                                } catch (error) {
                                    console.error('Unable to parse zap receipt description.');
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

                        // Team 21 badge owners
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
                                        try {
                                            const data = JSON.parse(e[0].received.event.content);
                                            setNames21((names) => uniqBy([
                                                ...names,
                                                { name: data.name, pubkey: e[0].received.event.pubkey }
                                            ], 'pubkey'));
                                        } catch (error) {
                                            console.error('Unable to parse profile content.');
                                        }

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

                        // 69ers badge owners
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
                                        try {
                                            const data = JSON.parse(e[0].received.event.content);
                                            setNames69((names) => uniqBy([
                                                ...names,
                                                { name: data.name !== '' ? data.name : data.displayed_name, pubkey: e[0].received.event.pubkey }
                                            ], 'pubkey'));
                                        } catch (error) {
                                            console.error('Unable to parse profile content.');
                                        }
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
                        } as SubscriptionOptions);

                        // 420 gang badge owners
                        mux.subscribe({
                            filters: [FILTER_5],
                            onEvent: (e: any) => {
                                console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                const pks = getPubkeysFromEventTags(e[0].received.event);
                                setPubkeys420Gang((pubkeys) => uniq([
                                    ...pubkeys,
                                    ...pks
                                ]));
                                if (pks.some(pk => pubkeys420Gang.includes(pk))) {
                                    return;
                                }
                                mux.subscribe({
                                    filters: [FILTER_3(pks)],
                                    onEvent: (e: any) => {
                                        console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                        try {
                                            const data = JSON.parse(e[0].received.event.content);
                                            setNames420((names) => uniqBy([
                                                ...names,
                                                { name: data.name !== '' ? data.name : data.displayed_name, pubkey: e[0].received.event.pubkey }
                                            ], 'pubkey'));
                                        } catch (error) {
                                            console.error('Unable to parse profile content.');
                                        }
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
                                return [FILTER_5]
                            },
                        } as SubscriptionOptions);

                        // grand zappers badge owners
                        mux.subscribe({
                            filters: [FILTER_6],
                            onEvent: (e: any) => {
                                console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                const pks = getPubkeysFromEventTags(e[0].received.event);
                                setPubkeysGrandZappers((pubkeys) => uniq([
                                    ...pubkeys,
                                    ...pks
                                ]));
                                if (pks.some(pk => pubkeysGrandZappers.includes(pk))) {
                                    return;
                                }
                                mux.subscribe({
                                    filters: [FILTER_3(pks)],
                                    onEvent: (e: any) => {
                                        console.log(`received event(from: ${e[0].relay.url})`, e[0].received.event.kind);
                                        try {
                                            const data = JSON.parse(e[0].received.event.content);
                                            setNames1000((names) => uniqBy([
                                                ...names,
                                                { name: data.name !== '' ? data.name : data.displayed_name, pubkey: e[0].received.event.pubkey }
                                            ], 'pubkey'));
                                        } catch (error) {
                                            console.error('Unable to parse profile content.');
                                        }
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
                                return [FILTER_6]
                            },
                        } as SubscriptionOptions);
                    });
        })
    }, []);

    useEffect(() => () => {
        console.log('unmount');
        getRelays()
            .then(relays => {
                relays.forEach(relay => {
                    mux.removeRelay(relay);
                    console.log(`removed relay ${relay}`);
                });

            })
    }, []);

    const handleNewZap = (zap: any, team: string, member: string) => {

    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Zappers Scoreboard - UseLessShit.co</title>
                <meta property="description" content="Today's zaps from Team 21, 69ers, 420 gang and Grand Zappers." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr, zaps, zap competition" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Zappers Scoreboard - UseLessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/zaps-cover.png" />
                <meta property="og:description" content="Today's zaps from Team 21, 69ers, 420 gang and Grand Zappers." />

                <meta itemProp="name" content="Zappers Scoreboard - UseLessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/zaps-cover.png" />

                <meta name="twitter:title" content="Zappers Scoreboard - UseLessShit.co" />
                <meta name="twitter:description" content="Today's zaps from Team 21, 69ers, 420 gang and Grand Zappers." />
                <meta name="twitter:image" content="https://uselessshit.co/images/zaps-cover.png" />
            </Helmet>

            <Box>
                <Typography component="div" variant="h4" gutterBottom sx={{ background: 'transparent!important',fontSize: '28px', height: 'auto!important'  }}>
                    Today's stats
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'center', display: 'flex', marginBottom: '1em' }}>
                    <Team
                        name="Team 21"
                        signatureZap={21}
                        badgeUrl="https://uselessshit.co/images/team-21-logo.png"
                        pubkeys={pubkeysTeam21}
                        members={names21}
                        zaps={zapsTeam21}
                        onZap={(zap: any, team: string, member: string) => {
                            setZapsTeam21([
                                ...zapsTeam21.filter((z: any) => z.bolt11 !== zap.bolt11),
                                zap
                            ]);
                            setSnackbarMessage(`${team}: Zap ⚡️ from ${member}`);
                            setSnackbarOpen(true);
                        }}
                    />
                    <Typography component="div" sx={{ padding: '0 5px', alignItems: 'center', display: 'flex' }}>
                        &nbsp;&nbsp;
                    </Typography>
                    <Team
                        name="69ers"
                        signatureZap={69}
                        badgeUrl="https://uselessshit.co/images/69ers-team-logo.png"
                        pubkeys={pubkeys69ers}
                        members={names69}
                        zaps={zaps69ers}
                        onZap={(zap: any, team: string, member: string) => {
                            setZaps69ers([
                                ...zaps69ers.filter((z: any) => z.bolt11 !== zap.bolt11),
                                zap
                            ]);
                            setSnackbarMessage(`${team}: Zap ⚡️ from ${member}`);
                            setSnackbarOpen(true);
                        }}
                    />
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'center', display: 'flex' }}>
                    <Team
                        name="420 gang"
                        signatureZap={420}
                        badgeUrl="https://uselessshit.co/images/420-gang-team-logo.png"
                        pubkeys={pubkeys420Gang}
                        members={names420}
                        zaps={zaps420Gang}
                        onZap={(zap: any, team: string, member: string) => {
                            setZaps420Gang([
                                ...zaps420Gang.filter((z: any) => z.bolt11 !== zap.bolt11),
                                zap
                            ]);
                            setSnackbarMessage(`${team}: Zap ⚡️ from ${member}`);
                            setSnackbarOpen(true);
                        }}
                    />
                    <Typography component="div" sx={{ padding: '0 5px', alignItems: 'center', display: 'flex' }}>
                        &nbsp;&nbsp;
                    </Typography>
                    <Team
                        name="Grand Zappers"
                        signatureZap={1000}
                        badgeUrl="https://uselessshit.co/images/grand-zappers-team-logo.png"
                        pubkeys={pubkeysGrandZappers}
                        members={names1000}
                        zaps={zapsGrandZappers}
                        onZap={(zap: any, team: string, member: string) => {
                            setZapsGrandZappers([
                                ...zapsGrandZappers.filter((z: any) => z.bolt11 !== zap.bolt11),
                                zap
                            ]);
                            setSnackbarMessage(`${team}: Zap ⚡️ from ${member}`);
                            setSnackbarOpen(true);
                        }}
                    />
                </Stack>
                <Typography component="div" sx={{ width: '100%' }}>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        message={snackbarMessage}
                    />
                </Typography>
                <Typography component="div" sx={{ padding: '16px', marginBottom: '230px' }}>
                    Want to join a team? Check <a href="https://snort.social/e/note16r4p7hvuvjv2uag2lg4v779vywu3kc5a4ugex5j7vspeusdrj4sqynfmav" target="_blank">this note</a>.
                </Typography>
            </Box>
        </React.Fragment>
    );
};