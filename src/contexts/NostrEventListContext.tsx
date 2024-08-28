import {createContext} from "react";
import {NostrEvent} from "nostr-tools";

import {Sort} from "../components/Nostr/EventList/EventList";

type NostrEventListContextType = {
    events?: NostrEvent[];
    limit: number;
    setLimit: (limit: number) => void;
    sort?: Sort;
    setSort: (sort: Sort) => void;
    eventStore: any;
}

export const NostrEventListContext = createContext<NostrEventListContextType>({
    limit: 10,
    setLimit: () => {},
    setSort: () => {},
    eventStore: {}
});