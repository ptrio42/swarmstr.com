import React, {useEffect, useState, useRef} from "react";
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
import {nip05, nip19} from 'nostr-tools';
import {NoteThread} from "../Thread/Thread";
import {
    createEvent,
    findAllMetadata,
    findNotesByIds,
    findReactionsByNoteId,
    findRelatedNotesByNoteId, getEventById,
    getNostrKeyPair, getRelatedEventsByEventId,
    getStream, getSubscriptionOptions,
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
import {
    Filter,
    Mux,
    Relay,
    SubscriptionOptions,
} from 'nostr-mux';

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

export const DEFAULT_RELAYS = [
    'wss://relay.damus.io',
    // 'wss://nostr.fmt.wiz.biz',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.snort.social',
    'wss://eden.nostr.land',
    // 'wss://relay.nostr.info',
    // 'wss://offchain.pub',
    // 'wss://nos.lol',
    // 'wss://brb.io',
    // 'wss://relay.current.fyi',
    // 'wss://nostr.relayer.se',
    'wss://nostr.uselessshit.co',
    // 'wss://nostr.bitcoiner.social',
    'wss://nostr.milou.lol',
    'wss://nostr.zebedee.cloud',
    // 'wss://relay.nostr.bg',
    'wss://nostr.wine',
    // 'wss://purplepag.es',
    // 'wss://nostr.mutinywallet.com',
    // 'wss://blastr.f7z.xyz',
    // 'wss://relay.nostr.band'
];

const mux = new Mux();

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);
    const [sort, setSort] = useState<string>('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string|undefined>();
    const [profiles, setProfiles] = useState<any[]>([]);

    const [notes, setNotes] = useState<any[]>([]);

    const { hash } = useLocation();

    const [events, setEvents] = useState<NostrEvent[]>([]);
    const previousEventsCountRef = useRef();
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
    }, [guides]);

    useEffect(() => {
        if (searchQuery || searchQuery === '') {
            setQueryParams({ s: searchQuery });
        }
    }, [searchQuery]);

    useEffect(() => {
        // Set guides
        setGuides([getTableOfContents(), ...getInitialGuides()]);

        // Multiplexe relays
        DEFAULT_RELAYS.forEach((url: string) => {
            mux.addRelay(new Relay(url));
        });

        // Subscription filters
        const filters = [
            {
                kinds: [1],
                ids: NOTES
            }
        ] as Filter[];

        // Get subscription options
        const options: SubscriptionOptions = getSubscriptionOptions(
            mux,
            filters,
            (event: any) => {
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            (subId: string) => {
                console.log(`Closing ${subId} stream...`);
            },
            true
        );

        // Subscribe
        mux
            .waitRelayBecomesHealthy(1, 5000)
            .then(ok => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }
                mux.subscribe(options);
            });
    }, []);

    useEffect(() => () => {
        DEFAULT_RELAYS.forEach(relay => {
            mux.removeRelay(relay);
        });
    }, []);

    useEffect(() => {
        console.log(`Total pending events: ${pendingEvents && pendingEvents.length}`);
    }, [pendingEvents]);

    const openSub = (filters: Filter[], streamName: string) => {
        // update streams
        setStreams(([
            ...streams.map(s => s.name === streamName ? ({
                ...s,
                status: StreamStatus.OPEN
            }): { ...s })
        ]));

        console.log(`Opening ${streamName} stream...`);

        // get subscription options
        const options: SubscriptionOptions = getSubscriptionOptions(
            mux,
            filters,
            (event: any) => {
                console.log('received an event');
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            () => {
                console.log(`Closing ${streamName} subscription...`);
                // update streams
                setStreams(([
                    ...streams.map(s => s.name === streamName ? ({
                        ...s,
                        status: StreamStatus.EOSE
                    }): { ...s })
                ]));
            },
            streamName === 'reactions' || streamName === 'notes'
        );

        mux.waitRelayBecomesHealthy(1, 5000)
            .then(ok => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }
                mux.subscribe(options);
            });
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
            <Box sx={{ width: '100%', height: '69px', backgroundColor: '#00001b' }}>
                {
                    loading && <img height="69" src="https://nostr.build/p/nb3103.gif" />
                }
            </Box>
            <List className="list-container">
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase', lineHeight: '1' }}
                        primary="Nostr Guide"
                        primaryTypographyProps={{
                            style: {
                                fontWeight: 'bold', fontSize: '48px', textAlign: 'center', textShadow: '1px 1px #000', marginTop: '-10px'
                            }
                        }}
                    />
                </ListItem>
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
                                data={{
                                    note: {
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
                                    },
                                    parentEvent: guide.attachedNoteId && getEventById(events, guide.attachedNoteId) || {}
                                }}
                                metadata={profiles}
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