import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import './NostrResources.css';
import Snackbar from "@mui/material/Snackbar";
import {nip05, nip19} from 'nostr-tools';

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