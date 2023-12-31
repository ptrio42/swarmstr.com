import NDK, {NDKFilter, NDKRelaySet, NostrEvent} from "@nostr-dev-kit/ndk";
import React, {createContext} from "react";

type NostrNoteThreadContextType = {
    events: NostrEvent[],
    subscribe: (filter: NDKFilter, relaySet?: NDKRelaySet) => void,
    nevent: string,
    commentEvents?: NostrEvent[],
    loaded: boolean,
    stats: any
}

export const NostrNoteThreadContext = createContext<NostrNoteThreadContextType>({
    events: [],
    subscribe: () => {},
    nevent: '',
    loaded: false,
    stats: {}
});