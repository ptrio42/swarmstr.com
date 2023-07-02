import React, {createContext} from "react";
import NDK, {NDKFilter, NDKRelaySet, NostrEvent} from "@nostr-dev-kit/ndk";
import Dexie from "dexie";

type NostrFeedContextType = {
    nevents: string[],
    subscribe: (filter: NDKFilter, relaySet?: NDKRelaySet) => void,
    loading: boolean
}

export const NostrFeedContext = createContext<NostrFeedContextType>({
    nevents: [],
    subscribe: () => {},
    loading: true
});