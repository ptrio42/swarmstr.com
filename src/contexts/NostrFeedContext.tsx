import React, {createContext} from "react";
import NDK, {NDKFilter, NDKRelaySet, NDKSubscriptionOptions, NostrEvent} from "@nostr-dev-kit/ndk";
import Dexie from "dexie";

type NostrFeedContextType = {
    nevents: string[],
    subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => void,
    loading: boolean
}

export const NostrFeedContext = createContext<NostrFeedContextType>({
    nevents: [],
    subscribe: () => {},
    loading: true
});