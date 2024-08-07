import {db} from "../db";
import {ListEvent, ZapEvent} from "../models/commons";
import {NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {useLiveQuery} from "dexie-react-hooks";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {containsTag, useManageSubs, valueFromTag} from "../utils/utils";
import {useNostrContext} from "./NostrContextProvider";
import {NostrEventListContext} from "../contexts/NostrEventListContext";
import {groupBy, orderBy, uniq} from 'lodash';
import {useLocation} from "react-router";
import {Sort} from "../components/Nostr/EventList/EventList";

interface NostrEventListContextProviderProps {
    children?: any;
    events: NostrEvent[];
    limit?: number;
    sort?: Sort;
}

export const NostrEventListContextProvider = ({ children, sort = Sort.DEFAULT, ...props }: NostrEventListContextProviderProps) => {

    const location = useLocation();

    const [limit, setLimit] = useState<number>(props?.limit || location?.state?.limit || 10);
    const { ndk, subscribe } = useNostrContext();
    const manageSubs = useManageSubs({ndk, subscribe});

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
        // console.log(`current limit: ${limit}`)
    }, [limit]);

    //
    // const reactions = useLiveQuery();

    const events = useMemo(() => {
        if (!mutedPubkeys || !mutedEvents || !props.events) return;
        // console.log({propsEvents: props.events});
        const events = props?.events
            .filter(({id, kind, pubkey, tags}) =>
                !mutedPubkeys.includes(pubkey) &&
                !mutedEvents.includes(id!) &&
                !containsTag(tags, ['t', 'nsfw'])
            );
        // switch (sort) {
        //     case Sort.MOST_ZAPPED:
        //     case Sort.MOST_REACTIONS:
        //     default:
        // }
        return events;
    }, [mutedEvents, mutedPubkeys, props.events]);

    const mostZapped = useLiveQuery(
        async () => {
            const allEvents = events && await db.zaps
                .filter(({ zappedNote }: ZapEvent) => events.map(({ id }) => id).includes(zappedNote))
                .toArray();
            const grouped = groupBy(allEvents, (event: any) => valueFromTag(event, 'e'));
            console.log('mostZapped', {grouped});
            const eventsWithTotalZaps = Object.values(grouped).map((evs: any[], index: number) => ({
                //@ts-ignore
                ...(events && events.find(({id}) => id === Object.keys(grouped)[index])),
                // id: grouped[index],
                totalZaps: evs.map((zapEvent: ZapEvent) => zapEvent.amount)
                    .reduce((total: number, current: number) => total + current / 1000, 0)
            }));
            console.log('mostZapped', {eventsWithTotalZaps});
            const sorted = orderBy(eventsWithTotalZaps, ['totalZaps'], ['desc']);
            console.log('mostZapped', {sorted});
            return sorted;
        }, [events]);

    useEffect(() => {
        // subscribe to mute lists
        // muted events or events from muted pubkeys will not be displayed throughout the app
        manageSubs.addSub({
            kinds: [30000],
            authors: ['f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8'],
            '#d': ['mute']
        }, { closeOnEose: false, groupable: false })
        manageSubs.addSub({
            kinds: [10000],
            authors: [
                '000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6',
                '8387b34f1af0e114062552303c3f7bcab7c0acbc35232253e22706b0ae2b234f'
            ]
        }, { closeOnEose: false, groupable: false });

        return () => {
            manageSubs.stopAllSubs();
        }
    }, []);

    useEffect(() => {
        events && manageSubs.addSub({
            kinds: [9735],
            '#e': events!.map(({id}) => id!)
        }, {closeOnEose: true});
    }, [events]);

    // @ts-ignore
    return <NostrEventListContext.Provider value={{ events: sort === Sort.MOST_ZAPPED ? mostZapped?.map(({totalZaps, ...event}) => event) : events, limit, setLimit }}>
        { children }
    </NostrEventListContext.Provider>;
};

export const useNostrEventListContextProvider = () => useContext(NostrEventListContext);