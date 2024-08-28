import React, {createContext} from "react";
import {
    NDKFilter,
    NDKRelaySet,
    NDKSubscription,
    NDKSubscriptionOptions,
    NDKEvent
} from "@nostr-dev-kit/ndk";

type NostrNoteContextType = {
    // subscribe: (ndk: NDK, filter: NDKFilter, opts: NDKSubscriptionOptions, onEose?: () => void, onEvent?: (event: NDKEvent) => void, relayUrls?: string[]) => any,
    subs?: NDKSubscription[],
    connected: boolean
}

export const NostrNoteContext = createContext<NostrNoteContextType>({
    // subscribe: () => {},
    connected: false
});