import NDK, {NDKFilter, NDKTag, NDKUser, NostrEvent} from '@nostr-dev-kit/ndk';
import React, {createContext} from "react";

type NostrContextType = {
    ndk: NDK,
    user?: NDKUser,
    events?: NostrEvent[],
    subscribe: (filter: NDKFilter) => void,
    signIn: () => Promise<string|undefined>
    post: (content: string, tags: NDKTag[]) => Promise<void>
}

export const NostrContext = createContext<NostrContextType>({
    ndk: new NDK(),
    subscribe: () => {},
    signIn: async () => '',
    post: async () => undefined
});