import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {uniq, groupBy, forOwn, uniqBy, last, debounce} from "lodash";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import {matchString, useDebounce} from "../../../utils/utils";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import NDK, { NDKRelaySet } from '@nostr-dev-kit/ndk';
import {Note} from "../Note/Note";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";

interface NostrResourcesProps {
    children?: any;
    resultsCount?: number;
    // onSearchQueryChange: (searchQuery: string) => void
}

export const NostrResources = ({ children, resultsCount }: NostrResourcesProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [queryParams, setQueryParams] = useSearchParams();
    const queryParamsMemo = useMemo(() => ({ queryParams }), []);

    const { loading, nevents } = useNostrFeedContext();

    useEffect(() => {
        const _searchQuery = queryParams.get('s');
        if (_searchQuery || _searchQuery === '') {
            setSearchQuery(_searchQuery);
            // @ts-ignore
            debouncedSearchQueryChangeHandler();
        }
    }, [queryParamsMemo]);

    useEffect(() => {
        if (searchQuery || searchQuery === '') {
            setQueryParams({ s: searchQuery });
        }
    }, [searchQuery]);

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

    const debouncedSearchQueryChangeHandler = useDebounce(() => {
        // onSearchQueryChange(searchQuery);
    });

    const searchQueryChangeHandler = (event: any) => {
        setSearchQuery(event.target.value);
        // @ts-ignore
        debouncedSearchQueryChangeHandler();
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
            <List className="list-container" sx={{ minHeight: '322px' }}>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase', lineHeight: '1' }}
                        primary="#ASKNOSTR"
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
                        <ListItem key={'search-box'} className="guide-search">
                            <Input
                                sx={{ width: '80%' }}
                                id="searchQuery"
                                name="searchQuery"
                                placeholder={'Search...'}
                                value={searchQuery}
                                onChange={searchQueryChangeHandler}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                            />
                        </ListItem>
                        {
                            searchQuery && <ListItem key={'results-count'}>
                                { resultsCount || 0 } results
                            </ListItem>
                        }
                    </List>
                </ListItem>
            </List>
            { children }
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};