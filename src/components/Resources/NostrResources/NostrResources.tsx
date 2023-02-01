import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {useLocation, useSearchParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {ArrowDownward, ArrowUpward, Circle, Clear, ToggleOff} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import Snackbar from "@mui/material/Snackbar";
import Input from "@mui/material/Input";
import {matchString} from "../../../utils/utils";
import {GUIDES, NOTES, PUBKEYS} from "../../../stubs/nostrResources";
import Divider from "@mui/material/Divider";
import {nip05, nip19} from 'nostr-tools';
import {NoteThread} from "../Thread/Thread";
import {
    connectToRelay,
    createEvent,
    findAllMetadata,
    findNotesByIds,
    findReactionsByNoteId,
    findRelatedNotesByNoteId,
    getMetadataSub,
    getNostrKeyPair,
    getNotesReactionsSub,
    getNotesWithRelatedNotesByIdsSub,
    getStream,
    handleSub,
    NostrEvent,
    RELAYS,
    Stream,
    STREAMS,
    StreamStatus
} from "../../../services/nostr";
import {REACTIONS} from "../Reactions/Reactions";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
    attachedNoteId?: string;
}

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);
    const [sort, setSort] = useState<string>('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [profiles, setProfiles] = useState<any[]>([]);

    const [socketUrl, setSocketUrl] = useState<string>(RELAYS[0]);
    const [relay, setRelay] = useState<any>();

    const [notes, setNotes] = useState<any[]>([]);

    const { hash } = useLocation();

    const [events, setEvents] = useState<NostrEvent[]>([]);
    const [pendingEvents, setPendingEvents] = useState<NostrEvent[]>([]);
    const [streams, setStreams] = useState<Stream[]>(STREAMS);

    const [loading, setLoading] = useState<boolean>(false);

    const [queryParams, setQueryParams] = useSearchParams();

    const getInitialGuides = () => {
        const readGuides = getReadGuides();
        return [ ...GUIDES.map(guide => ({
            ...guide,
            isRead: readGuides.includes(guide.id)
        }))];
    };

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

        const searchQueryParams = queryParams.get('s');
        if (searchQueryParams && searchQueryParams !== '') {
            setSearchQuery(searchQueryParams);
        }
    }, [guides]);

    useEffect(() => {
        if (searchQuery !== '') {
            setQueryParams({ s: searchQuery });
        }
    }, [searchQuery]);

    useEffect(() => {
        streams.forEach(s => {
            switch (s.status) {
                case StreamStatus.OPEN: {
                    setLoading(true);
                    return;
                }
                case StreamStatus.EOSE: {
                    setLoading(false);
                    switch (s.name) {
                        case 'notes': {
                            const isReactionsStreamClosed = streams &&
                                (streams.find(s => s.name === 'reactions') || { status: StreamStatus.CLOSED })
                                    .status === StreamStatus.CLOSED;
                            if (isReactionsStreamClosed) {
                                const ids = events
                                    .filter(n => n.kind === 1)
                                    .map(n => n.id);
                                const sub = getNotesReactionsSub(relay, ids);
                                openSub(sub, 'reactions');
                            }
                            return;
                        }
                        case 'reactions': {
                            if (events && events.length > 0) {
                                const result = getNotesFromEvents(NOTES);
                                setNotes(result);
                            }
                            const isMetadataStreamClosed = streams &&
                                (streams.find(s => s.name === 'metadata') || { status: StreamStatus.CLOSED })
                                    .status === StreamStatus.CLOSED;
                            if (isMetadataStreamClosed) {
                                const pubkeys = getPubkeysFromGuidesBulletPoints();
                                const sub = getMetadataSub(relay, [...pubkeys, ...PUBKEYS]);
                                openSub(sub, 'metadata');
                            }
                            return;
                        }
                        case 'metadata': {
                            const metadata = findAllMetadata(events);
                            setProfiles(metadata.map(m => ({
                                ...m,
                                ...(JSON.parse(m.content || ''))
                            })));
                            publishPendingEvents();
                            return;
                        }
                    }
                    return;
                }
                case StreamStatus.CLOSED: {
                    return;
                }
            }
        });
    }, [streams]);

    useEffect(() => {
        connectToRelay()
            .then((newRelay) => {
                const { status } = getStream(streams, 'notes');
                    if (status === StreamStatus.CLOSED && (!notes || notes.length === 0)) {
                        const sub = getNotesWithRelatedNotesByIdsSub(newRelay, NOTES);
                        openSub(sub, 'notes');
                    }

                setRelay(newRelay);
                setGuides(getInitialGuides());
            })
            .catch(error => {
                setSocketUrl((previousSocketUrl) => RELAYS.filter(r => r !== previousSocketUrl)[0])
            });
    }, [socketUrl]);

    useEffect(() => {
        if (relay && relay.status === 1) {
            publishPendingEvents();
        }
    }, [relay]);

    useEffect(() => {
        const refreshNotes = streams
            .map(s => s.status === StreamStatus.EOSE)
            .reduce((prev, curr) => prev && curr);
        if (refreshNotes) {
            const result = getNotesFromEvents(NOTES);
            setNotes(result);
        }
    }, [events]);

    const getNotesFromEvents = (ids: string[]) => {
        return findNotesByIds(events, ids).map(n => ({
            ...n,
            comments: findRelatedNotesByNoteId(events, n.id).map(n1 => ({
                ...n1,
                reactions: findReactionsByNoteId(events, n1.id)
            })),
            reactions: findReactionsByNoteId(events, n.id)
        }));
    };

    const openSub = (sub: any, streamName: string) => {
        // update streams
        setStreams(([
            ...streams.map(s => s.name === streamName ? ({
                ...s,
                status: StreamStatus.OPEN
            }): { ...s })
        ]));

        handleSub(sub, (event: NostrEvent) => {
                //update events
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            () => {
                // update streams
                setStreams(([
                    ...streams.map(s => s.name === streamName ? ({
                        ...s,
                        status: StreamStatus.EOSE
                    }): { ...s })
                ]));
            }, streamName === 'reactions')
    };

    const getPubkeysFromGuidesBulletPoints = () => {
        const pubkeys = getInitialGuides()
            .map(guide => guide.bulletPoints && guide.bulletPoints
                .filter((point) => new RegExp(/(npub[^ ]{59,}$)/).test(point))
                .map(key => key && key.split(':')[1])
                .filter(key => key && key.length === 64)
            )
            .filter(entries => !!entries && entries.length > 0);
        // @ts-ignore
        return [].concat.apply([], pubkeys);
    };

    const getContentWithTags = (event: any) => {
        const regex = new RegExp(/(#\[[0-9]\]*)/, 'g');
        return {
            ...event,
            content: event.content.replace(regex, event.tags[+'$1'.slice(2, -1)])
        }
    };

    const rejectDelay = async (reason: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(reject.bind(null, reason), 1000);
        });
    };

    const handleExpanded = (guide: Guide) => {
        // if (!guide.isRead) {
        //     markGuideAsRead(guide.id);
        // }
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

    const getKeyPair = () => {
        return getNostrKeyPair();
    };

    const addEvent = (kind: number, content: string, tags?: string[][]) => {
        const [privkey, pubkey] = getKeyPair();
        const event = createEvent(relay, privkey, pubkey, kind, content, tags);
        publishEvent(event);
    };

    const publishEvent = (event: NostrEvent) => {
        const pub = relay.publish(event);
        // @ts-ignore
        setPendingEvents([
            ...pendingEvents.filter(e => e.id !== event.id),
            event
        ]);

        pub.on('ok', () => {
            // @ts-ignore
            setEvents([
                ...events,
                event
            ]);
            setPendingEvents(([
                ...pendingEvents.filter(e => e.id !== event.id)
            ]));
        });
        pub.on('seen', () => {
            console.log(`we saw the event on ${relay.url}`)
        });
        pub.on('failed', (reason: any) => {
            console.log(`failed to publish to ${relay.url}: ${reason}`)
            setSocketUrl((previousSocketUrl) => RELAYS.filter(r => r !== previousSocketUrl)[0]);
        });
    };

    const publishPendingEvents = () => {
        pendingEvents && pendingEvents.forEach(event => {
           publishEvent(event);
        });
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Nostr newcomers most common questions and answers - UseLessShit.co</title>
                <meta property="description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/guide-cover-v3.png" />
                <meta property="og:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/guide-cover-v3.png" />

                <meta name="twitter:title" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta name="twitter:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/guide-cover-v3.png" />

            </Helmet>
            <List>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase', lineHeight: '1' }}
                        primary="Nostr Guide"
                        primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '48px', textAlign: 'center' } }}
                    />
                </ListItem>
                {
                    loading &&
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        </ListItem>
                }
                <ListItem sx={{ display: 'flex', flexDirection: 'column!important' }}>
                    <Typography
                        component="div"
                        sx={{
                            alignItems: 'center',
                            fontSize: '14px!important',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                    }}>
                        <Circle sx={{ fontSize: 12, marginRight: '0.33em!important'  }} />
                        { getFilteredGuidesCount() === GUIDES.length ? 'Total' : getFilteredGuidesCount() } of { GUIDES.length } entries
                        <Circle sx={{ fontSize: 12, marginLeft: '0.33em!important', marginRight: '0.33em!important'  }} />
                        Last update: 2023-02-01
                        <Circle sx={{ fontSize: 12, marginLeft: '0.33em!important'  }} />
                    </Typography>
                    <Typography
                        component="div"
                        sx={{
                            marginLeft: '1em',
                            marginTop: '1em',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                    }}>
                        <Input
                            id="searchQuery"
                            name="searchQuery"
                            placeholder={'Search for answers'}
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.target.value);
                            }}
                        />
                    </Typography>
                    <Typography
                        component="div"
                        sx={{
                            marginTop: '1em',
                            marginLeft: '1em',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                        <Chip
                            icon={<Clear />}
                            label="No sort"
                            variant={sort === '' ? 'filled' : 'outlined'}
                            onClick={() => {
                                setSort('')
                            }}
                        />
                        <Chip
                            sx={{ marginLeft: '0.5em' }}
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
                    </Typography>
                </ListItem>
                {
                    guides
                        .filter(guide => searchQuery === '' || matchString(searchQuery, guide.issue))
                        .map((guide, index) => (
                        <React.Fragment>
                            <NoteThread
                                key={guide.id}
                                note={{
                                    id: guide.attachedNoteId,
                                    guideId: guide.id,
                                    title: guide.issue,
                                    content: guide.fix,
                                    bulletPoints: guide.bulletPoints,
                                    imageUrls: guide.imageUrls,
                                    urls: guide.urls,
                                    updatedAt: guide.updatedAt,
                                    guideTags: guide.tags,
                                    isRead: guide.isRead
                                }}
                                reactions={guide.attachedNoteId && (notes.find(n => n.id === guide.attachedNoteId) || { reactions: [] }).reactions}
                                comments={guide.attachedNoteId && (notes.find(n => n.id === guide.attachedNoteId) || { comments: [] }).comments}
                                metadata={profiles}
                                handleUpReaction={(noteId: string, reaction?: string) => {
                                    addEvent(7, reaction || REACTIONS[1].content, [['e', noteId]]);
                                }}
                                handleDownReaction={(noteId: string, reaction?: string) => {
                                    addEvent(7, reaction || REACTIONS[4].content, [['e', noteId]]);
                                }}
                                handleNoteToggle={(exp: boolean, guideId?: string) => {
                                    if (!guide.isRead) {
                                        markGuideAsRead(guide.id);
                                    }
                                }}
                                noteExpandedOnInit={expanded.includes(guide.id)}
                            />
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