import React, {createContext} from "react";
import NDK, {NDKFilter, NDKRelaySet, NDKSubscription, NDKSubscriptionOptions, NostrEvent} from "@nostr-dev-kit/ndk";

type NostrNoteContextType = {
    subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => void,
    subs?: NDKSubscription[],
    connected: boolean
}

export const NostrNoteContext = createContext<NostrNoteContextType>({
    subscribe: () => {},
    connected: false
});