import {db} from "../db";
import {ListEvent} from "../models/commons";
import {NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {useLiveQuery} from "dexie-react-hooks";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {containsTag} from "../utils/utils";
import {Config} from "../resources/Config";
import {useNostrContext} from "./NostrContextProvider";
import {NostrEventListContext} from "../contexts/NostrEventListContext";
import {uniq} from 'lodash';
import {useLocation} from "react-router";

interface NostrEventListContextProviderProps {
    children?: any;
    events: NostrEvent[];
    limit?: number;
}

export const NostrEventListContextProvider = ({ children, ...props }: NostrEventListContextProviderProps) => {

    const location = useLocation();

    const [limit, setLimit] = useState<number>(props?.limit || location?.state?.events?.length || 10);
    const { subscribe } = useNostrContext();

    const mutedEventsByTagName = async (kind: number, tagName: string) => {
        const muteLists = await db.lists.where({ kind }).toArray();
        return uniq(muteLists
            .map((listEvent: ListEvent) => listEvent.tags
                .filter((tag: NDKTag) => tag[0] === tagName)
                .map(([key, value]) => value)
            ).flat(2));
    };

    const mutedEvents = useLiveQuery(
        async () => await mutedEventsByTagName(10000, 'e')
        , []);

    const mutedPubkeys = useLiveQuery(async () => {
        if (!mutedEvents) return;
        const muteLists = await db.lists.where({ kind: 30000 }).toArray();
        return uniq(muteLists
            .map((listEvent: ListEvent) => listEvent.tags
                .filter((tag: NDKTag) => tag[0] === 'p')
                .map(([key, value]) => value)
            ).flat(2));
    }, [mutedEvents]);

    useEffect(() => {
        console.log(`current limit: ${limit}`)
    }, [limit]);

    const events = useMemo(() => {
        if (!mutedPubkeys || !mutedEvents || !props.events) return;
        // console.log({propsEvents: props.events});
        return props?.events
            .filter(({id, kind, pubkey, tags}) =>
                !mutedPubkeys.includes(pubkey) &&
                !mutedEvents.includes(id!) &&
                !containsTag(tags, ['t', 'nsfw'])
            );
    }, [mutedEvents, mutedPubkeys, props.events]);

    useEffect(() => {
        // subscribe to mute lists
        // muted events or events from muted pubkeys will not be displayed throughout the app
        subscribe({
            kinds: [30000],
            authors: ['f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8'],
            '#d': ['mute']
        }, { closeOnEose: false, groupable: false }, Config.SERVER_RELAYS);
        subscribe({
            kinds: [10000],
            authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6']
        }, { closeOnEose: false, groupable: false }, Config.SERVER_RELAYS);
    }, []);

    return <NostrEventListContext.Provider value={{ events, limit, setLimit }}>
        { children }
    </NostrEventListContext.Provider>;
};

export const useNostrEventListContextProvider = () => useContext(NostrEventListContext);