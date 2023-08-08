import NDK, {NDKEvent, NDKFilter, NDKSubscriptionOptions, NDKTag, NDKUser, NostrEvent} from '@nostr-dev-kit/ndk';
import React, {createContext} from "react";

type NostrContextType = {
    ndk: NDK,
    user?: NDKUser,
    events?: NostrEvent[],
    subscribe: (filter: NDKFilter, opts: NDKSubscriptionOptions, relayUrls: string[]) => any,
    signIn: () => Promise<string|undefined>
    post: (content: string, tags: NDKTag[], kind?: number) => Promise<void>,
    loginDialogOpen: boolean,
    setLoginDialogOpen: (open: boolean) => void,
    newNoteDialogOpen: boolean,
    setNewNoteDialogOpen: (open: boolean) => void,
    label: (reaction: string, nostrEvent?: NostrEvent, pubkey?: string, content?: string, tag?: string) => void,
    newLabelDialogOpen: boolean,
    setNewLabelDialogOpen: (open: boolean) => void
}

export const NostrContext = createContext<NostrContextType>({
    ndk: new NDK(),
    subscribe: () => {},
    signIn: async () => '',
    post: async () => undefined,
    loginDialogOpen: false,
    setLoginDialogOpen: () => {},
    newNoteDialogOpen: false,
    setNewNoteDialogOpen: () => {},
    label: () => {},
    newLabelDialogOpen: false,
    setNewLabelDialogOpen: () => {}
});