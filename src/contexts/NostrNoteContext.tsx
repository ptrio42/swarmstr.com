import React, {createContext} from "react";
import NDK, {NDKFilter, NDKRelaySet, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";

type NostrNoteContextType = {
    subscribe: (filter: NDKFilter, relaySet?: NDKRelaySet) => void,
    addReaction: (id: string, content: string) => void,
    zap: (nostrEvent: NostrEvent, amount: number) => void,
    subs?: NDKSubscription[]
}

export const NostrNoteContext = createContext<NostrNoteContextType>({
    subscribe: () => {},
    addReaction: () => {},
    zap: () => {}
});