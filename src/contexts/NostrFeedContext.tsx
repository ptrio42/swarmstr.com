import React, {createContext} from "react";
import NDK, {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscriptionOptions, NostrEvent} from "@nostr-dev-kit/ndk";
import Dexie from "dexie";

type NostrFeedContextType = {
    nevents: string[],
    subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => void,
    loading: boolean,
    clearEvents: () => void,
    events: NostrEvent[],
    query: string,
    setQuery: (query: string) => void,
    stopSubs: () => void,
    startSubs: (filter: NDKFilter, events?: NostrEvent[]) => void
}

export const NostrFeedContext = createContext<NostrFeedContextType>({
    nevents: [],
    subscribe: () => {},
    loading: true,
    clearEvents: () => {},
    events: [],
    query: '',
    setQuery: () => {},
    startSubs: () => {},
    stopSubs: () => {}
});