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
import {NoteThread} from "../../Nostr/Thread/Thread";
import Box from "@mui/material/Box";
import {uniq, groupBy, forOwn, uniqBy, last, debounce} from "lodash";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import {matchString, useDebounce} from "../../../utils/utils";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import NDK, { NDKRelaySet } from '@nostr-dev-kit/ndk';
import {Note} from "../../Nostr/Note/Note";
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

    return (
        <React.Fragment>

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