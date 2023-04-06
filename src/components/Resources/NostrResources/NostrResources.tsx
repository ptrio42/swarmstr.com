import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {useLocation, useSearchParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import Chip from "@mui/material/Chip";
import {ArrowDownward, ArrowUpward, Circle, Clear, ToggleOff} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import Snackbar from "@mui/material/Snackbar";
import Input from "@mui/material/Input";
import {matchString} from "../../../utils/utils";
import {GUIDES, GUIDES_LAST_UPDATE, NOTES, PUBKEYS} from "../../../stubs/nostrResources";
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
import {uniq, groupBy, forOwn} from "lodash";

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
    const [searchQuery, setSearchQuery] = useState<string|undefined>();
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
            setGuides([getTableOfContents(), ...getInitialGuides()]);
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
        const tableOfContents = getTableOfContents();
    }, [guides]);

    useEffect(() => {
        if (searchQuery || searchQuery === '') {
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
                                const sub = getMetadataSub(relay, pubkeys);
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
        if (relay && (relay.url === socketUrl || relay.status === 1)) {
            console.log(`[${socketUrl}] No need to connect! Already connecting/connected to ${relay.url}`);
            publishPendingEvents();
            return;
        }
        initRelayConnection();
    }, [socketUrl]);

    useEffect(() => {
        if (relay) {
            const { status } = getStream(streams, 'notes');
            if (status === StreamStatus.CLOSED && (!notes || notes.length === 0)) {
                const sub = getNotesWithRelatedNotesByIdsSub(relay, NOTES);
                openSub(sub, 'notes');
            } else {
                console.log(`[${relay.url}] notes stream already closed. Total of ${notes.length} notes`);
            }

            if (relay.status === 1) {
                console.log(`[${relay.url}] Will publish all pending events`);
                // setTimeout(() => {
                    publishPendingEvents();
                // });
            }
        }
    }, [relay]);

    useEffect(() => {
        const refreshNotes = streams
            .filter(s1 => s1.name !== 'metadata')
            .map(s => s.status === StreamStatus.EOSE)
            .reduce((prev, curr) => prev && curr);
        if (refreshNotes) {
            console.log(`Refreshing notes from total ${events.length} events`);
            const result = getNotesFromEvents(NOTES);
            setNotes(result);
        }
    }, [events]);

    useEffect(() => {
        console.log(`Total pending events: ${pendingEvents && pendingEvents.length}`);
    }, [pendingEvents]);

    const initRelayConnection = () => {
        console.log(`[${socketUrl}] Connecting...`);
        socketUrl && connectToRelay(socketUrl)
            .then((newRelay) => {
                console.log(`[${socketUrl}] Connected! Relay status: ${newRelay && newRelay.status}`);

                setRelay(newRelay);
                setGuides([getTableOfContents(), ...getInitialGuides()]);
            })
            .catch(error => {
                console.error(`[${socketUrl}] Cannot connect!`, error);
                console.log('Trying different relay...');
                setSocketUrl((previousSocketUrl) => RELAYS.filter(r => r !== previousSocketUrl)[0])
            });
    };

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

        console.log(`[${relay.url}] Opening ${streamName} stream...`);

        handleSub(sub, (event: NostrEvent) => {
                //update events
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            () => {
                console.log(`[${relay.url}] Closing ${streamName} stream...`);
                // update streams
                setStreams(([
                    ...streams.map(s => s.name === streamName ? ({
                        ...s,
                        status: StreamStatus.EOSE
                    }): { ...s })
                ]));
            }, streamName === 'reactions')
    };

    const getPubkeysFromGuidesBulletPoints = (): string[] => {
        const pubkeys = getInitialGuides()
            .map(guide => guide.bulletPoints && guide.bulletPoints
                .filter((point) => new RegExp(/(npub[^ ]{59,}$)/).test(point))
                .map(key => key && key.split(':')[1])
                .filter(key => key && key.length === 64)
            )
            .filter(entries => !!entries && entries.length > 0)
            .flat(2);
        // @ts-ignore
        console.log(`${pubkeys.length} total pubkeys in guide entries`);
        console.log(`${PUBKEYS.length} total pubkeys in guide entries`);
        console.log(`${(uniq([...pubkeys, PUBKEYS])).length} total unique pubkeys altogether`);
        return uniq([...pubkeys, ...PUBKEYS]) as string[];
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
            .filter(guide => !searchQuery || searchQuery === '' || (searchQuery && matchString(searchQuery, guide.issue)))
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
        console.log(`[${relay.url}] An attempt to publish event. Relay status: ${relay.status}`);
        if (relay.status === 3) {
            console.log(`[${relay.url}] Connection closing/closed. Attempting to reconnect.`);
            console.log(`Adding #${event.id} to pending events`);
            setPendingEvents([
                ...pendingEvents.filter(e => e.id !== event.id),
                event
            ]);
            initRelayConnection();
            return;
        }
        if (events && (events.findIndex(e => e.id === event.id) === -1)) {
            try {
                const pub = relay.publish(event);

                pub.on('ok', () => {
                    console.log('ok');
                });
                pub.on('seen', () => {
                    console.log(`[${relay.url}] Event #${event.id} seen!`);
                    setEvents([
                        ...events.filter(e => e.id !== event.id),
                        event
                    ]);
                });
                pub.on('failed', (reason: any) => {
                    console.log(`failed to publish to ${relay.url}: ${reason}`);
                    console.log(`[${relay.url}] Status: ${relay.status}`);
                    console.log(`Adding #${event.id} to pending events.`);
                    setPendingEvents([
                        ...pendingEvents.filter(e => e.id !== event.id),
                        event
                    ]);
                    setSocketUrl((previousSocketUrl) => {
                        return RELAYS.filter(r => r !== previousSocketUrl)[0]
                    });
                });
            } catch (error) {
                console.error(`[${relay.url}] Closed or closing state! Relay status: ${relay.status}`);
            }
        }
    };

    const publishPendingEvents = () => {
        console.log(`There are ${pendingEvents && pendingEvents.length} pending events`);
        pendingEvents && pendingEvents.forEach(event => {
            console.log(`[${relay.url}] Publishing pending event #${event.id}`);
           publishEvent(event);
        });
        setPendingEvents([]);
    };

    const goToGuide = (id: string) => {
        console.log('click');
        const anchor = document.createElement('a');
        anchor.href = `#${id}`;
        anchor.click();
    };

    const getTableOfContents = (): Guide => {
        const tableOfContents = groupBy(
            GUIDES
                .map(({ id, issue, tags }) => ({ id, issue, tags })),
            (guide) => guide.tags && guide.tags[0] || 'Other'
        );
        const bulletPoints: string[] = [];
        if (tableOfContents) {
            forOwn(tableOfContents, (entries, key) => {
                bulletPoints.push(`#### ${key}`, ...entries.map(entry => `<a href="#${entry.id}">${entry.issue}</a>`))
            });
        }

        return {
            id: 'table-of-contents',
            issue: 'Table of Contents',
            fix: '',
            updatedAt: '2023-03-08',
            bulletPoints
        };
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Your guide to the world of Nostr - UseLessShit.co</title>
                <meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />
                <meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

                <meta name="twitter:title" content="Your guide to the world of Nostr - UseLessShit.co" />
                <meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

            </Helmet>
            <List>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase', lineHeight: '1' }}
                        primary="Nostr Guide"
                        primaryTypographyProps={{
                            style: {
                                fontWeight: 'bold', fontSize: '48px', textAlign: 'center'
                            }
                        }}
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
                <ListItem
                    key="guide-menu"
                    className="guide-menu-container"
                    sx={{
                        paddingLeft: '0!important',
                        paddingRight: '0!important',
                        justifyContent: 'center'
                    }}
                >
                    <List>
                        <ListItem sx={{ paddingLeft: '0!important', paddingRight: '0!important' }}>
                            <Typography className="guide-info" component="div">
                                <Typography component="div">
                                    <Circle
                                        sx={{
                                            fontSize: 12,
                                            marginRight: '0.33em!important'
                                        }}
                                    />
                                    { getFilteredGuidesCount() === GUIDES.length + 1 ? 'Total' : getFilteredGuidesCount() } of { GUIDES.length } entries
                                </Typography>
                                <Typography component="div">
                                    <Circle
                                        sx={{
                                            fontSize: 12,
                                            marginLeft: '0.33em!important',
                                            marginRight: '0.33em!important'
                                        }}
                                    />
                                </Typography>
                                <Typography component="div">
                                    Last update: { GUIDES_LAST_UPDATE }
                                    <Circle
                                        sx={{
                                            fontSize: 12,
                                            marginLeft: '0.33em!important'
                                        }}
                                    />
                                </Typography>
                            </Typography>
                        </ListItem>
                        <ListItem className="guide-search">
                            <Input
                                id="searchQuery"
                                name="searchQuery"
                                placeholder={'Search for answers'}
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                }}
                            />
                        </ListItem>
                        <ListItem className="guide-sort">
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
                        </ListItem>
                        <ListItem>

                        </ListItem>
                    </List>
                </ListItem>
            </List>
            {
                guides
                    .filter(guide => !searchQuery || searchQuery === '' || (searchQuery && (matchString(searchQuery, guide.issue) || (guide.tags && guide.tags.map(t => t.toLowerCase()).includes(searchQuery.toLowerCase())))))
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
                        </React.Fragment>
                    ))
            }
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};