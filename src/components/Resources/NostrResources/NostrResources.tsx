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
    search?: any;
    // onSearchQueryChange: (searchQuery: string) => void
}

export const NostrResources = ({ children, search }: NostrResourcesProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const { loading } = useNostrFeedContext();

    useEffect(() => () => {
        // unsubscribe?
    }, []);




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
                <title>Swarmstr - Your knowledge hub for curious minds</title>
                {/*<meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}
                {/*<meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />*/}

                {/*<meta property="og:url" content="https://uselessshit.co/resources/nostr" />*/}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Swarmstr - Your knowledge hub for curious minds" />
                <meta property="og:image" content="https://swarmstr.com/images/swarmstr-cover-2.jpeg" />
                {/*<meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}

                <meta itemProp="name" content="Swarmstr - Your knowledge hub for curious minds" />
                <meta itemProp="image" content="https://swarmstr.com/images/swarmstr-cover-2.jpeg" />

                <meta name="twitter:title" content="Swarmstr - Your knowledge hub for curious minds" />
                {/*<meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}
                <meta name="twitter:image" content="https://swarmstr.com/images/swarmstr-cover-2.jpeg" />

            </Helmet>
            {/*<Box sx={{ width: '100%', height: '69px', backgroundColor: '#00001b' }}>*/}
                {/*{*/}
                    {/*loading && <img height="69" src="https://nostr.build/p/nb3103.gif" />*/}
                {/*}*/}
            {/*</Box>*/}
            <List className="list-container">
                <ListItem key="nostr-resources">
                </ListItem>
                <ListItem
                    key="guide-menu"
                    className="guide-menu-container"
                    sx={{
                        paddingLeft: '0!important',
                        paddingRight: '0!important',
                        justifyContent: 'center',
                        paddingBottom: 0
                    }}
                >
                    { search }
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