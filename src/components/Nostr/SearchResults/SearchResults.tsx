import React, {useState} from "react";
import {Box} from "@mui/material";
import './SearchResults.css';
import Snackbar from "@mui/material/Snackbar";
import {nip05, nip19} from 'nostr-tools';
import {NostrEvent} from "@nostr-dev-kit/ndk";
import InfiniteScroll from "react-infinite-scroll-component";

interface SearchResultsProps {
    children?: any;
    resultsCount?: number;
    search?: any;
    results: NostrEvent[];
    limit: number;
    handleSetLimit: (limit: number) => void;
}

export const SearchResults = ({ children, search, results, limit, handleSetLimit }: SearchResultsProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const onScrollEnd = () => {
        handleSetLimit(limit + 3);
    };

    return (
        <React.Fragment>
            <Box
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
            </Box>
            <InfiniteScroll
                dataLength={results.length} //This is important field to render the next data
                next={onScrollEnd}
                hasMore={true}
                loader={<Box sx={{ display: 'none' }}>Loading...</Box>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
            { children }
            </InfiniteScroll>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};