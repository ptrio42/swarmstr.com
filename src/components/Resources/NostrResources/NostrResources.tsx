import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import {useLocation} from "react-router-dom";
import {Helmet} from "react-helmet";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {
    ArrowDownward,
    ArrowUpward,
    Bolt,
    Circle,
    Clear,
    CopyAll,
    Expand,
    IosShare,
    ToggleOff,
    UnfoldLess
} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import ListItemButton from "@mui/material/ListItemButton";
import Snackbar from "@mui/material/Snackbar";
import CardMedia from "@mui/material/CardMedia";
import Input from "@mui/material/Input";
import {matchString} from "../../../utils/utils";
import {GUIDES} from "../../../stubs/nostrResources";
import Button from "@mui/material/Button";
import ReactHtmlParser from 'react-html-parser';
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import pink from "@mui/material/colors/pink";
import {nip05, nip19, relayInit} from 'nostr-tools';
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import {Note} from "../Note/Note";
import {Metadata} from "../Metadata/Metadata";

export interface Profile {
    nip05: string;
    lud06: string;
    lud16: string;
    about: string;
    picture: string;
    pubkey: string;
    name: string;
}

export interface Reaction {
    id: string;
    content: string;
}

export interface Guide {
    id: string;
    issue: string;
    fix: string;
    urls?: string[];
    createdAt?: string;
    updatedAt: string;
    imageUrls?: string[];
    tags?: string[];
    bulletPoints?: string[];
    isRead?: boolean;
}

const RELAYS = [
    'wss://brb.io',
    'wss://nostr.v0l.io',
    'wss://relay.damus.io',
];

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);
    const [sort, setSort] = useState<string>('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [profiles, setProfiles] = useState<{ [key: string]: Metadata }>({});

    const [socketUrl, setSocketUrl] = useState<string>(RELAYS[0]);
    const [relay, setRelay] = useState<any>();

    const [stickyNote, setStickyNote] = useState();
    const [stickyNoteReactions, setStickyNoteReactions] = useState<{ [key: string]: Reaction }>({});

    const { hash } = useLocation();

    const getInitialGuides = () => {
        const readGuides = getReadGuides();
        return [ ...GUIDES.map(guide => ({
            ...guide,
            isRead: readGuides.includes(guide.id)
        }))];
    };

    useEffect(() => {
        setTimeout(() => {
            initRelay();
        });
    }, []);

    useEffect(() => {
        if (sort === '') {
            setGuides(getInitialGuides());
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

    useEffect(() => {
        saveReadGuides([
            ...guides
                .filter(g2 => g2.isRead)
                .map(g3 => g3.id)
        ]);
    }, [guides]);

    useEffect(() => {
        relay &&
        relay.connect().then(() => {
            getStickyNote();
            getReactions();

            setGuides(getInitialGuides());
            const pubkeys = getInitialGuides()
                .map(guide => guide.bulletPoints && guide.bulletPoints
                    .filter((point) => new RegExp(/(npub[^ ]{59,}$)/).test(point))
                    .map(key => key && key.split(':')[1])
                    .filter(key => key && key.length === 64)
                )
                .filter(entries => !!entries && entries.length > 0);

            // @ts-ignore
            const pks = [].concat.apply([], pubkeys);
            for (let i = 0; i < pks.length; i++) {
                queryProfile(pks[i])

            }
        }).catch((error: any) => {
            const nextRelay = RELAYS.filter(relay => relay !== socketUrl)[0];
            setSocketUrl(nextRelay);
        });
    }, [relay]);

    useEffect(() => {
        initRelay();
    }, [socketUrl]);

    const initRelay = () => {
        const relay = relayInit(socketUrl);
        setRelay(relay);
    };

    const rejectDelay = async (reason: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(reject.bind(null, reason), 1000);
        });
    };

    const getStickyNote = async () => {
        const sub = relay && relay.sub([
            {
                kinds: [1],
                ids: ['62fa89e3ed6e50ebaeae7f688a5229760262e6ccf015ab7accb46d1e944ef030']
            }
        ]);
        sub.on('event', (event: any) => {
            if (event.content) {
                setStickyNote(event.content);
            }
        });
        sub.on('eose', () => {
            sub.unsub();
        });
    };

    const getReactions = async () => {
        const sub = relay && relay.sub([
            {
                kinds: [7],
                '#e': ['62fa89e3ed6e50ebaeae7f688a5229760262e6ccf015ab7accb46d1e944ef030']
            }
        ]);
        sub.on('event', (event: any) => {
            const { id, content }: Reaction = event;
            setStickyNoteReactions((prev: { [key: string]: Reaction }) => ({
                    ...prev,
                    [id]: {
                        id,
                        content
                    }
                }
            ));
        });
        sub.on('eose', () => {
            sub.unsub();
        });
    };

    const queryProfile = async (pubkey: string) => {
        if (!profiles[pubkey]) {
            const sub = relay && relay.sub([
                {
                    kinds: [0],
                    authors: [pubkey]
                }
            ]);
            sub.on('event', (event: any) => {
                const profile = JSON.parse(event.content);
                if (event.pubkey) {
                    setProfiles((prev) => ({
                        ...prev,
                        [event.pubkey]: {
                            ...profile,
                            pubkey: event.pubkey
                        }
                    }));
                }
            });
            sub.on('eose', () => {
                sub.unsub();
            });
        }
    };

    const handleExpanded = (guide: Guide) => {
        if (!guide.isRead) {
            markGuideAsRead(guide.id);
        }
        let newExpanded;
        if (expanded.includes(guide.id)) {
            newExpanded = expanded.filter(expanded => expanded !== guide.id);
        } else {
            newExpanded = [ ...expanded ];
            newExpanded.push(guide.id);
        }
        setExpanded(newExpanded);
    };

    const handleShareAnswer = (event: any, guide: Guide) => {
        event.stopPropagation();
        navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${guide.id}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    };

    const getReadGuides = () => {
        return (localStorage.getItem('readGuides') || '')
            .split(',');
    };

    const saveReadGuides = (readGuides: string[]) => {
        localStorage.setItem('readGuides', readGuides.join(','));
    };

    const markGuideAsRead = (guideId: string) => {
        const readGuides = [
            ...guides
                .map(guide => guideId === guide.id ? ({ ...guide, isRead: true }) : ({ ...guide }))
        ];
        setGuides(readGuides);
    };

    const getFilteredGuidesCount = () => {
        return guides
            .filter(guide => searchQuery === '' || matchString(searchQuery, guide.issue))
            .length;
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Nostr newcomers most common questions and answers - UseLessShit.co</title>
                <meta property="description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Nostr Newcomers Most Common Questions and Answers - UseLessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/guide-cover-v2.png" />
                <meta property="og:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content="Nostr newcomers most common questions and answers - UseLessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/guide-cover-v2.png" />

                <meta name="twitter:title" content="Nostr newcomers most common questions and answers - UseLessShit.co" />
                <meta name="twitter:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/guide-cover-v2.png" />

            </Helmet>
            <List>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase', lineHeight: '1' }}
                        primary="Nostr Guide"
                        primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '48px', textAlign: 'center' } }}
                    />
                </ListItem>
                <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', fontSize: '12px' }}>
                        <Circle sx={{ fontSize: 12, marginRight: '0.33em!important'  }} />
                        { getFilteredGuidesCount() === GUIDES.length ? 'Total' : getFilteredGuidesCount() } of { GUIDES.length } entries
                        <Circle sx={{ fontSize: 12, marginLeft: '0.33em!important', marginRight: '0.33em!important'  }} />
                        Last update: 2023-01-19
                        <Circle sx={{ fontSize: 12, marginLeft: '0.33em!important'  }} />
                    </Stack>
                    <Stack sx={{ marginLeft: '1em', marginTop: '1em' }} direction="row" spacing={1}>
                        <Input
                            id="searchQuery"
                            name="searchQuery"
                            placeholder={'Search for answers'}
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.target.value);
                            }}
                        />
                    </Stack>
                    <Stack sx={{ marginTop: '1em', marginLeft: '1em' }} direction="row" spacing={1}>
                        <Chip
                            icon={<Clear />}
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
                </ListItem>
                <ListItem>
                    { stickyNote && <Note
                        id={'pinned'}
                        title={'Pinned note'}
                        content={stickyNote}
                        updatedAt={'2023-01-19'}
                        reactions={stickyNoteReactions && Object.values(stickyNoteReactions)}
                    />
                    }
                    {/*{ stickyNoteReactions && Object.values(stickyNoteReactions).length } reactions*/}
                </ListItem>
                {
                    guides
                        .filter(guide => searchQuery === '' || matchString(searchQuery, guide.issue))
                        .map((guide, index) => (
                        <React.Fragment>
                            <ListItemButton
                                sx={{ flexWrap: 'wrap' }}
                                key={guide.id}
                                id={guide.id}
                                onClick={() => {
                                    handleExpanded(guide)
                                }}>
                                <ListItemText
                                    primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            { guide.isRead ?
                                                <React.Fragment>
                                                    { guide.issue }
                                                </React.Fragment> :
                                                <Badge sx={{
                                                    maxWidth: '100%',
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: pink[300],
                                                    }}} badgeContent="" variant="dot">
                                                    {guide.issue}
                                                </Badge>
                                            }
                                        </Typography>
                                    </React.Fragment>
                                }
                                    secondary={
                                    <React.Fragment>
                                        <Stack direction="row" spacing={1}>
                                            { guide.tags &&
                                            guide.tags.map(tag => (
                                                <Chip sx={{ marginLeft: '0.33em' }} label={tag} variant="outlined" />
                                            ))
                                            }
                                        </Stack>
                                        <Typography
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {guide.updatedAt}
                                            <Typography sx={{ width: '72px', display: 'flex', justifyContent: 'space-between' }} component="span" variant="body2">
                                                {expanded.includes(guide.id) ? <UnfoldLess /> : <Expand />}
                                                <IosShare sx={{ marginLeft: '0.3em' }} onClick={(event) => {
                                                    handleShareAnswer(event, guide);
                                                }} />
                                            </Typography>
                                        </Typography>
                                    </React.Fragment>
                                } />
                                <Collapse
                                    sx={{ width: '100%'}}
                                    in={expanded.includes(guide.id)}
                                    timeout="auto"
                                    unmountOnExit
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                >
                                    <List component="div" disablePadding>
                                        <ListItem sx={{ width: '100%' }}>
                                            <Note
                                                id={guide.id}
                                                title={guide.issue}
                                                content={guide.fix}
                                                bulletPoints={guide.bulletPoints}
                                                metadata={Object.values(profiles)}
                                                imageUrls={guide.imageUrls}
                                                tags={guide.tags}
                                                urls={guide.urls}
                                                updatedAt={guide.updatedAt}/>
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </ListItemButton>
                            <Divider sx={{ margin: '0 1.1em' }} variant="inset" component="li" />
                        </React.Fragment>
                    ))
                }
            </List>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};