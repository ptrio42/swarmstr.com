import React from 'react';
import {NDKFilter} from '@nostr-dev-kit/ndk';

enum FeedType {
    MostZapped, BestRated, Latest
}

enum Sort {
    ASC, DESC
}

interface FeedProps {
    filter?: NDKFilter;
    type?: FeedType;
    sort?: Sort;
    since?: string;
}

const SINCE_DEFAULT = 24 * 3600;

export const Feed = ({
    type = FeedType.Latest,
    sort = Sort.DESC,
    // since = SINCE_DEFAULT
}) => {
    // get all note events since given time

    switch (type) {
        case FeedType.MostZapped:
            // get all zaps for given notes
        case FeedType.BestRated:
            // get all scores for given notes
        case FeedType.Latest:
            // just sort by created_at
        default:
    }
};