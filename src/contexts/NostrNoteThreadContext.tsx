import NDK, {NDKFilter, NDKRelaySet, NostrEvent, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import React, {createContext} from "react";

type NostrNoteThreadContextType = {
    events: NostrEvent[],
    subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => any,
    unsubscribe: (subIds: string[]) => void,
    nevent: string,
    commentEvents: NostrEvent[],
    loaded: boolean,
    stats: any,
    connected: boolean
}

export const NostrNoteThreadContext = createContext<NostrNoteThreadContextType>({
    events: [],
    subscribe: () => {},
    unsubscribe: () => {},
    nevent: '',
    loaded: false,
    stats: {},
    connected: false,
    commentEvents: []
});