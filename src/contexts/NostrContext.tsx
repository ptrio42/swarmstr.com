import NDK, {NDKUser, NostrEvent} from '@nostr-dev-kit/ndk';
import React, {createContext} from "react";

type NostrContextType = {
    ndk: NDK,
    user?: NDKUser,
    events?: NostrEvent[],
}

export const NostrContext = createContext<NostrContextType>({
    ndk: new NDK()
});