import {Box} from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useNostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";

interface EventListWrapperProps {
    children?: any;
    onReachedListEnd?: () => void
}

export const EventListWrapper = ({ children, onReachedListEnd = () => {} }: EventListWrapperProps) => {
    const { events, limit, setLimit } = useNostrEventListContextProvider();

    const onScrollEnd = () => {
        setLimit(limit + 3);

        if (events && events.length < limit) {
            console.log('reached scroll end', limit);
            onReachedListEnd();
        }
    };

    return <InfiniteScroll
        dataLength={events?.slice(0, limit).length || 0}
        next={onScrollEnd}
        initialScrollY={5000}
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