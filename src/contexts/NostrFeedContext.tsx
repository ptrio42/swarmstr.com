import React, {createContext} from "react";
import NDK, {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";

type NostrFeedContextType = {
    // subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => void,
    loading: boolean,
    clearEvents: () => void,
    events: NostrEvent[],
    query: string,
    setQuery: (query: string) => void,
    stopSubs: () => void,
    startSubs: (filter: NDKFilter, events?: NostrEvent[]) => void
}

export const NostrFeedContext = createContext<NostrFeedContextType>({
    // subscribe: () => {},
    loading: true,
    clearEvents: () => {},
    events: [],
    query: '',
    setQuery: () => {},
    startSubs: () => {},
    stopSubs: () => {}
});