import {NDKFilter, NDKRelaySet, NDKSubscriptionOptions, NDKEvent} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";
import React, {createContext} from "react";

type NostrNoteThreadContextType = {
    eventStore: any,
    events?: NostrEvent[],
    // subscribe: (ndk: NDK, filter: NDKFilter, opts: NDKSubscriptionOptions, onEose?: () => void, onEvent?: (event: NDKEvent) => void, relayUrls?: string[]) => any,
    // unsubscribe: (subIds: string[]) => void,
    nevent: string,
    // commentEvents: NostrEvent[],
    // loaded: boolean,
    // stats: any,
    // connected: boolean
    id: string;
    pubkey?: string;
    kind?: number;
    event?: NostrEvent;
    visible?: boolean;
}

export const NostrNoteThreadContext = createContext<NostrNoteThreadContextType>({
    // events: [],
    // subscribe: () => {},
    // unsubscribe: () => {},
    nevent: '',
    // loaded: false,
    // stats: {},
    // connected: false,
    // commentEvents: [],
    id: '',
    eventStore: () => {}
});