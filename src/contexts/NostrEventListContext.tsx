import {NostrEvent} from "@nostr-dev-kit/ndk";
import {createContext} from "react";

type NostrEventListContextType = {
    events?: NostrEvent[];
    limit: number;
    setLimit: (limit: number) => void;
}

export const NostrEventListContext = createContext<NostrEventListContextType>({
    limit: 10,
    setLimit: () => {}
});