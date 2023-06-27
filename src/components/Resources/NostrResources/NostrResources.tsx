import React, {useEffect, useState} from "react";
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
import {uniq, groupBy, forOwn} from "lodash";
import {useSubscribe} from "nostr-hooks";
import {Config} from "nostr-hooks/dist/types";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import {matchString} from "../../../utils/utils";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";

export const NostrResources = () => {

    const [sort, setSort] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string|undefined>();

    const [queryParams, setQueryParams] = useSearchParams();

    const { events, eose } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [1],
            // ids: NOTES
            '#t': ['ask', 'nostr', 'asknostr']
        }],
        options: {
            batchingInterval: 500,
            closeAfterEose: false,
            enabled: true
        }
    } as Config);

    let loading = !eose;

    // temporary solution
    const [offlineEvents, setOfflineEvents] = useState([]);

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
        // fetch events stored in the json file (temporary solution)
        console.log('Fetching events.json')
        axios
            .get('../events.json')
            .then((response) => {
                setOfflineEvents(response.data);
            })

        // const guideEvents: NostrEvent[] = [];
        // const noteIds: string[] = [];
        // const [privkey, pubkey] = getNostrKeyPair();

        // getInitialGuides()
        //     .forEach(g => {
        //
        //         const issueEvent = createEvent(privkey, pubkey, 1, g.issue) as NostrEvent;
        //         noteIds.push(issueEvent.id);
        //         const fixEvent = createEvent(privkey, pubkey, 1, g.fix + '\n' + (g.bulletPoints && g.bulletPoints.join('\n')), [['e', issueEvent.id]]) as NostrEvent;
        //         guideEvents.push(issueEvent, fixEvent);
        //     });
        // console.log({guideEvents}, {noteIds})
        // subscribe();
    }, []);

    useEffect(() => () => {
        // unsubscribe?
    }, []);

    // const getPubkeysFromGuidesBulletPoints = (): string[] => {
        // const pubkeys = getInitialGuides()
        //     .map(guide => guide.bulletPoints && guide.bulletPoints
        //         .filter((point) => new RegExp(/(npub[^ ]{59,}$)/).test(point))
        //         .map(key => key && key.split(':')[1])
        //         .filter(key => key && key.length === 64)
        //     )
        //     .filter(entries => !!entries && entries.length > 0)
        //     .flat(2);
        // // @ts-ignore
        // console.log(`${pubkeys.length} total pubkeys in guide entries`);
        // console.log(`${PUBKEYS.length} total pubkeys in guide entries`);
        // console.log(`${(uniq([...pubkeys, PUBKEYS])).length} total unique pubkeys altogether`);
        // return uniq([...pubkeys, ...PUBKEYS]) as string[];
    // };

    const getReadGuides = () => {
        return (localStorage.getItem('readGuides') || '')
            .split(',');
    };

    const saveReadGuides = (readGuides: string[]) => {
        localStorage.setItem('readGuides', readGuides.join(','));
    };

    const markGuideAsRead = (guideId: string) => {
        // const readGuides = [
        //     ...guides
        //         .map(guide => guideId === guide.id ? ({ ...guide, isRead: true }) : ({ ...guide }))
        // ];
        // setGuides(readGuides);
    };

    const getEvents = () => {
        return [...offlineEvents.slice(0,4), ...events]
            .filter(({tags}) => {
                const hashtags = tags.filter((t: any) => t[0] === 't').map((t: any) => t[1]);
                return (hashtags.includes('ask') && hashtags.includes('nostr')) || hashtags.includes('asknostr');
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
                    .map((event) => (
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