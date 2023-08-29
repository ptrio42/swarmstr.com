import React, {useState} from "react";
import {Box} from "@mui/material";
import './SearchResults.css';
import Snackbar from "@mui/material/Snackbar";
import {nip05, nip19} from 'nostr-tools';
import {NostrEvent} from "@nostr-dev-kit/ndk";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {EventList} from "../EventList/EventList";

interface SearchResultsProps {
    children?: any;
    resultsCount?: number;
    search?: any;
    results: NostrEvent[];
}

export const SearchResults = ({ children, search, results }: SearchResultsProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

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
            <NostrEventListContextProvider events={results}>
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