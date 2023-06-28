import React, {useEffect, useRef, useState} from "react";
import {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {useSearchParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Search} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import Snackbar from "@mui/material/Snackbar";
import Input from "@mui/material/Input";
import {nip05, nip19} from 'nostr-tools';
import {NoteThread} from "../Thread/Thread";
import Box from "@mui/material/Box";
import {uniq, groupBy, forOwn, uniqBy} from "lodash";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import {matchString} from "../../../utils/utils";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import NDK, { NDKRelaySet } from '@nostr-dev-kit/ndk';


export const NostrResources = () => {

    const [sort, setSort] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string|undefined>();

    const [queryParams, setQueryParams] = useSearchParams();

    const ndk = useRef<any>(null);

    const [events, setEvents] = useState<any[]>([]);
    const serverEvents = useRef<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let searchQuery = queryParams.get('s');
        if (searchQuery && searchQuery.length > 0) {
            setSearchQuery(searchQuery);
        }
    }, [queryParams]);

    useEffect(() => {
        if (searchQuery || searchQuery === '') {
            setQueryParams({ s: searchQuery });
        }
    }, [searchQuery]);

    useEffect(() => {
        // fetch events from the server first
        axios
            .get('../api/events')
            .then((response) => {
                setLoading(false);
                serverEvents.current = response.data as any[];

                ndk.current = new NDK({ explicitRelayUrls: DEFAULT_RELAYS});
                const subscription = ndk.current.subscribe({
                        kinds: [1],
                        // ids: NOTES
                        '#t': ['ask', 'nostr', 'asknostr']
                    }, { closeOnEose: false }, NDKRelaySet.fromRelayUrls(DEFAULT_RELAYS, ndk.current))
                ;

                subscription.eventReceived = (e: any, r: any) => {
                    setEvents((prevState: any[]) => [
                        ...prevState.filter((e1: any) => e1.id !== e.id && !serverEvents.current.includes(e1)),
                        e
                    ])
                };
                subscription.eoseReceived = (r: any) => {
                    console.log('eose');
                };

                ndk.current.connect()
                    .then(() => {
                        subscription.start();
                    })
                ;
            })
            .catch((e) => {
                console.log('api', {e})
        });
    }, []);

    useEffect(() => () => {
        // unsubscribe?
    }, []);

    const getReadGuides = () => {
        return (localStorage.getItem('readGuides') || '')
            .split(',');
    };

    const saveReadGuides = (readGuides: string[]) => {
        localStorage.setItem('readGuides', readGuides.join(','));
    };

    const getEvents = () => {
        return uniqBy([...serverEvents.current, ...events], (e: any) => [e.id, e.content].join())
            .filter(({tags}: any) => {
                const hashtags = tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
                return (hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr');
            })
            .filter(({content}: any) => {
                return content !== '' && !content.includes('https://dev.uselessshit.co/resources/nostr');
            })
            .filter(({ content, tags }: any) =>
                !searchQuery ||
                searchQuery === '' ||
                (searchQuery && (matchString(searchQuery, content))) ||
                (searchQuery && tags && tags
                    .filter((t: any) => t[0] === 't')
                    .map((t1: any) => t1[1].toLowerCase())
                    .includes(searchQuery.toLowerCase())))
    };

    // const getTableOfContents = (): Guide => {
    //     const tableOfContents = groupBy(
    //         GUIDES
    //             .map(({ id, issue, tags }) => ({ id, issue, tags })),
    //         (guide) => guide.tags && guide.tags[0] || 'Other'
    //     );
    //     const bulletPoints: string[] = [];
    //     if (tableOfContents) {
    //         forOwn(tableOfContents, (entries, key) => {
    //             bulletPoints.push(`#### ${key}`, ...entries.map(entry => `<a href="#${entry.id}">${entry.issue}</a>`))
    //         });
    //     }
    //
    //     return {
    //         id: 'table-of-contents',
    //         issue: 'Table of Contents',
    //         fix: '',
    //         updatedAt: '2023-03-08',
    //         bulletPoints
    //     };
    // };

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
                    <List sx={{ width: '100%' }}>
                        <ListItem className="guide-search">
                            <Input
                                sx={{ width: '80%' }}
                                id="searchQuery"
                                name="searchQuery"
                                placeholder={'Search...'}
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            { getEvents()?.length } results
                        </ListItem>
                    </List>
                </ListItem>
            </List>
            {
                getEvents()
                    .map((event: any) => (
                        <React.Fragment>
                            <NoteThread
                                key={event.id}
                                data={{
                                    noteId: event.id,
                                    event
                                }}
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