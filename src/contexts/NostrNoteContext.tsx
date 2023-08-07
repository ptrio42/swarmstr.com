import React, {createContext} from "react";
import NDK, {NDKFilter, NDKRelaySet, NDKSubscription, NDKSubscriptionOptions, NostrEvent} from "@nostr-dev-kit/ndk";

type NostrNoteContextType = {
    subscribe: (filter: NDKFilter, opts?: NDKSubscriptionOptions) => void,
    addReaction: (id: string, content: string) => void,
    zap: (nostrEvent: NostrEvent, amount: number, callback?: () => void) => void,
    subs?: NDKSubscription[],
    boost: (nostrEvent: NostrEvent) => void,
    payInvoice: (paymentRequest: string) => void
}

export const NostrNoteContext = createContext<NostrNoteContextType>({
    subscribe: () => {},
    addReaction: () => {},
    zap: () => {},
    boost: () => {},
    payInvoice: () => {}
});