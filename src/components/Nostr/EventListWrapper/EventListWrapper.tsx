import {Box} from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {NostrEvent} from "@nostr-dev-kit/ndk";

interface EventListWrapperProps {
    children?: any;
    results: NostrEvent[];
    limit: number;
    handleSetLimit: (limit: number) => void;
}

export const EventListWrapper = ({ children, results, limit, handleSetLimit }: EventListWrapperProps) => {
    const onScrollEnd = () => {
        handleSetLimit(limit + 3);
    };

    return <InfiniteScroll
        dataLength={results.length} //This is important field to render the next data
        next={onScrollEnd}
        hasMore={true}
        loader={<Box sx={{ display: 'none' }}>Loading...</Box>}
        endMessage={
            <p style={{ textAlign: 'center' }}>
                <b>No more results.</b>
            </p>
        }
    >
        { children }
    </InfiniteScroll>
};