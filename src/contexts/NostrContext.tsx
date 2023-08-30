import NDK, {NDKEvent, NDKFilter, NDKSubscriptionOptions, NDKTag, NDKUser, NostrEvent} from '@nostr-dev-kit/ndk';
import React, {createContext} from "react";
import {NoteLabel} from "../dialog/NewLabelDialog";

type NostrContextType = {
    ndk: NDK,
    user?: NDKUser,
    events?: NostrEvent[],
    subscribe: (filter: NDKFilter, opts: NDKSubscriptionOptions, relayUrls: string[]) => any,
    unsubscribe: () => void,
    signIn: () => Promise<string|undefined>
    post: (content: string, tags: NDKTag[], kind?: number) => Promise<void>,
    loginDialogOpen: boolean,
    setLoginDialogOpen: (open: boolean) => void,
    newNoteDialogOpen: boolean,
    setNewNoteDialogOpen: (open: boolean) => void,
    label: (label: NoteLabel, nostrEvent: NostrEvent, pubkey: string, content: string, callback?: () => void) => void,
    newLabelDialogOpen: boolean,
    setNewLabelDialogOpen: (open: boolean) => void,
    addReaction: (id: string, content: string) => void,
    zap: (nostrEvent: NostrEvent, amount: number, callback?: () => void) => void,
    boost: (nostrEvent: NostrEvent) => void,
    payInvoice: (paymentRequest: string) => void
}

export const NostrContext = createContext<NostrContextType>({
    ndk: new NDK(),
    events: [],
    subscribe: () => {},
    unsubscribe: () => {},
    signIn: async () => '',
    post: async () => undefined,
    loginDialogOpen: false,
    setLoginDialogOpen: () => {},
    newNoteDialogOpen: false,
    setNewNoteDialogOpen: () => {},
    label: () => {},
    newLabelDialogOpen: false,
    setNewLabelDialogOpen: () => {},
    addReaction: () => {},
    zap: () => {},
    boost: () => {},
    payInvoice: () => {}
});