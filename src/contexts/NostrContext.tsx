import NDK, {NDKEvent, NDKFilter, NDKSubscriptionOptions, NDKSubscription, NDKTag, NDKUser, NostrEvent} from '@nostr-dev-kit/ndk';
import React, {createContext} from "react";
import {NoteLabel, Thumb} from "../dialog/NewLabelDialog";
import {SnackbarMessage} from "../providers/NostrContextProvider";

type NostrContextType = {
    ndk: NDK,
    user?: NDKUser,
    events?: NostrEvent[],
    subscribe: (filter: NDKFilter, opts: NDKSubscriptionOptions, onEose?: () => void, onEvent?: (event: NDKEvent) => void, relayUrls?: string[]) => any,
    unsubscribe: () => void,
    signIn: () => Promise<string|undefined>
    post: (content: string, tags: NDKTag[], kind?: number) => Promise<void>,
    loginDialogOpen: boolean,
    setLoginDialogOpen: (open: boolean) => void,
    newNoteDialogOpen: boolean,
    setNewNoteDialogOpen: (open: boolean) => void,
    label: (thumb: Thumb, label: NoteLabel, nostrEvent: NostrEvent, pubkey: string, content: string, additionalLabels?: string[], callback?: () => void, onError?: (error: any) => void) => void,
    newLabelDialogOpen: boolean,
    setNewLabelDialogOpen: (open: boolean) => void,
    addReaction: (id: string, content: string) => void,
    zap: (nostrEvent: NostrEvent, amount: number, callback?: () => void, onError?: (error: any) => void, comment?: string) => void,
    boost: (nostrEvent: NostrEvent) => void,
    payInvoice: (paymentRequest: string) => void,
    writeRelays: string[],
    readRelays: string[],
    query: string,
    setQuery: (query: string) => void,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    zapDialogOpen: boolean,
    setZapDialogOpen: (open: boolean) => void,
    newReplyDialogOpen: boolean,
    setNewReplyDialogOpen: (open: boolean) => void,
    event?: NostrEvent,
    setEvent: (event?: NostrEvent) => void,
    selectedLabelName?: string,
    setSelectedLabelName: (labelName: string) => void,
    tags: string[],
    addTag: (tag: string) => void,
    removeTag: (tag: string) => void,
    connected: boolean,
    relayListDialogOpen: boolean,
    setRelayListDialogOpen: (open: boolean) => void,
    imageCreatorDialogOpen: boolean,
    setImageCreatorDialogOpen: (open: boolean) => void,
    setTags: (tags: string[]) => void,
    snackbarMessage?: SnackbarMessage,
    setSnackbarMessage: (message?: SnackbarMessage) => void,
    subs: NDKSubscription[]
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
    payInvoice: () => {},
    writeRelays: [],
    readRelays: [],
    query: '',
    setQuery: () => {},
    loading: false,
    setLoading: () => {},
    zapDialogOpen: false,
    setZapDialogOpen: () => {},
    newReplyDialogOpen: false,
    setNewReplyDialogOpen: () => {},
    setEvent: () => {},
    setSelectedLabelName: () => {},
    tags: [],
    addTag: () => {},
    removeTag: () => {},
    connected: false,
    relayListDialogOpen: false,
    setRelayListDialogOpen: () => {},
    imageCreatorDialogOpen: false,
    setImageCreatorDialogOpen: () => {},
    setTags: () => {},
    setSnackbarMessage: () => {},
    subs: []
});