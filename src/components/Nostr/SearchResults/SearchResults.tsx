import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import './SearchResults.css';
import Snackbar from "@mui/material/Snackbar";
import {nip05, nip19, NostrEvent} from 'nostr-tools';
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import NostrEventListContextProvider from "../../../providers/NostrEventListContextProvider";
import {EventStore} from "../EventStore/EventStore";
import {NDKFilter} from "@nostr-dev-kit/ndk/dist";

interface SearchResultsProps {
    filter: NDKFilter;
    children?: any;
    resultsCount?: number;
    search?: any;
    results: NostrEvent[];
}

export const SearchResults = ({ children, search, results, filter }: SearchResultsProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const eventStore = EventStore({filter});

    useEffect(() => {
        eventStore.addEvents(results);
    }, [results]);

    return (
        <React.Fragment>
            <Box
                key="guide-menu"
                className="guide-menu-container"
                sx={{
                    paddingLeft: '0!important',
                    paddingRight: '0!important',
                    justifyContent: 'center',
                    paddingBottom: 0,
                    width: '100%'
                }}
            >
                { search }
            </Box>
            <NostrEventListContextProvider eventStore={eventStore}>
                <EventListWrapper>
                    { children }
                </EventListWrapper>
            </NostrEventListContextProvider>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};