import {NDKTag} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";
import React, {memo, useContext, useEffect, useState} from "react";
import {useManageSubs} from "../utils/utils";
import {useNostrContext} from "./NostrContextProvider";
import {NostrEventListContext} from "../contexts/NostrEventListContext";
import {orderBy} from 'lodash';
import {useLocation} from "react-router";
import {Sort} from "../components/Nostr/EventList/EventList";
import {subscribe} from "../services/nostr/relays";
import {request} from "../services/request";
import {EventStore} from "../components/Nostr/EventStore/EventStore";

interface NostrEventListContextProviderProps {
    children?: any;
    events?: NostrEvent[];
    limit?: number;
    sort?: Sort;
    tag?: NDKTag;
    eventStore: any;
}

const calculateScore = (id: string, stats: any) => {
    if (!stats) return 0;

    const { zaps , reaction_count, repost_count, report_count } = stats[id] || { zaps: { count: 0 }, reaction_count: 0, repost_count: 0, report_count: 0 };
    return ((+zaps?.msats/10000 || 0) + ((reaction_count || 0) * 0.5) + ((repost_count || 0) * 0.25)) - (report_count || 0);
};

const NostrEventListContextProvider = ({ children, ...props }: NostrEventListContextProviderProps) => {

    const location = useLocation();

    const [limit, setLimit] = useState<number>(props?.limit || location?.state?.limit || 10);
    const { ndk } = useNostrContext();
    const manageSubs = useManageSubs({ndk, subscribe});

    const [sort, setSort] = useState<Sort>(props.sort || Sort.RECENT);

    const [events, setEvents] = useState<NostrEvent[]>([]);

    useEffect(() => {
        setEvents(props.eventStore.getEvents(sort));
    }, [sort, props.eventStore.getTotalCount()]);

    // const eventStore = EventStore();

    // const mutedEventsByTagName = async (kind: number, tagName: string) => {
    //     const muteLists = await db.lists.where({ kind }).toArray();
    //     return uniq(muteLists
    //         .map((listEvent: ListEvent) => listEvent.tags
    //             .filter((tag: NDKTag) => tag[0] === tagName)
    //             .map(([key, value]) => value)
    //         ).flat(2));
    // };

    // const mutedEvents = useLiveQuery(
    //     async () => await mutedEventsByTagName(10000, 'e')
    //     , []);
    //
    // const mutedPubkeys = useLiveQuery(async () => {
    //     if (!mutedEvents) return;
    //     const muteLists = await db.lists.where({ kind: 30000 }).toArray();
    //     return uniq(muteLists
    //         .map((listEvent: ListEvent) => listEvent.tags
    //             .filter((tag: NDKTag) => tag[0] === 'p')
    //             .map(([key, value]) => value)
    //         ).flat(2));
    // }, [mutedEvents]);

    useEffect(() => {
        // console.log(`current limit: ${limit}`)
        console.log('NostrEventListContextProvider: sort', {sort});

        // if (sort !== Sort.DEFAULT && props.tag) {
        //     request({
        //         url: `${process.env.BASE_URL}/api/stats/${props.tag[0]}/${props.tag[1]}`,
        //         method: 'GET'
        //     })
        //         .then((stats: {data: any}) => {
        //             console.log('NostrEventListContextProvider: stats', {stats: stats.data});
        //
        //             const mostZapped = orderBy(stats.data, 'zaps.msats', ['desc']);
        //
        //         })
        // }
        //
        //     switch (sort) {
        //         case Sort.MOST_ZAPPED:
        //             return mostZappedMemo?.map(({totalZaps, ...event}) => event) || [];
        //         case Sort.MOST_REACTIONS:
        //             return mostReactions?.map(({totalReactions, ...event}) => event) || [];
        //         case Sort.RECENT:
        //             return orderBy(events, ['created_at'], ['desc'])
        //         case Sort.DEFAULT:
        //         default:
        //             return events;
        //     }
    }, [sort]);

    //
    // const reactions = useLiveQuery();

    // const events = useMemo(() => {
    //     if (!mutedPubkeys || !mutedEvents || !props.events) return;
    //     // console.log({propsEvents: props.events});
    //     const events = props?.events
    //         .filter(({id, kind, pubkey, tags, content}) =>
    //             !mutedPubkeys.includes(pubkey) &&
    //             !mutedEvents.includes(id!) &&
    //             !containsTag(tags, ['t', 'nsfw']) &&
    //             !content.toLowerCase().includes('airdrop is live') &&
    //             !content.toLowerCase().includes('claim $') &&
    //             !content.toLowerCase().includes('claim your free $')
    //         );
    //     return events;
    // }, [mutedEvents, mutedPubkeys, props.events]);

    // const allZaps = useLiveQuery(() => {
    //      if (!events) return [];
    //      return db.zaps
    //         .filter(({ zappedNote }: ZapEvent) => events!.map(({ id }) => id).includes(zappedNote))
    //         .toArray()
    //
    // }, [events], []);
    //
    // const mostZapped = useLiveQuery(
    //     async () => {
    //         if (!allZaps) return;
    //         const grouped = groupBy(allZaps, (event: any) => valueFromTag(event, 'e'));
    //         console.log('mostZapped', {grouped});
    //         const eventsWithMostZaps = Object.values(grouped).map((evs: any[], index: number) => ({
    //             //@ts-ignore
    //             ...(events && events.find(({id}) => id === Object.keys(grouped)[index])),
    //             // id: grouped[index],
    //             totalZaps: evs.map((zapEvent: ZapEvent) => zapEvent.amount)
    //                 .reduce((total: number, current: number) => total + current / 1000, 0)
    //         }));
    //         console.log('mostZapped', {eventsWithMostZaps});
    //         const sorted = orderBy(eventsWithMostZaps, ['totalZaps'], ['desc']);
    //         console.log('mostZapped', {sorted});
    //         return sorted;
    //     }, [events, allZaps]);
    //
    // const mostZappedMemo = useMemo(() => {
    //     console.log('mostZappedMemo', {mostZapped});
    //     return mostZapped;
    // }, [events, allZaps, mostZapped?.length]);
    //
    // const allReactions = useLiveQuery(() => {
    //     if (!events) return [];
    //
    //     return db.reactions
    //             .filter(({ reactedToEventId, content }: ReactionEvent) => events!.map(({ id }) => id).includes(reactedToEventId)
    //                 && !REACTIONS.filter(({type}) => type === ReactionType.DOWN).map(({content}) => content).includes(content))
    //             .toArray()
    //     }
    // , [events], []);
    //
    // const mostReactions = useLiveQuery(
    //     async () => {
    //         if (!allReactions) return;
    //         const grouped = groupBy(allReactions, (event: any) => valueFromTag(event, 'e'));
    //         const eventsWithMostReactions = Object.values(grouped).map((evs: any[], index: number) => ({
    //             //@ts-ignore
    //             ...(events && events.find(({id}) => id === Object.keys(grouped)[index])),
    //             totalReactions: evs.length
    //         }));
    //         const sorted = orderBy(eventsWithMostReactions, ['totalReactions'], ['desc']);
    //         return sorted;
    //     },
    //     [allReactions]
    // );
    //
    // const mostReactionsMemo = useMemo(() => {
    //     console.log('mostReactionsMemo', {mostReactions});
    //     return mostReactions;
    // }, [mostReactions?.length])

    // const getSortedEvents = useCallback(() => {
    //     switch (sort) {
    //         case Sort.MOST_ZAPPED:
    //             return mostZappedMemo?.map(({totalZaps, ...event}) => event) || [];
    //         case Sort.MOST_REACTIONS:
    //             return mostReactions?.map(({totalReactions, ...event}) => event) || [];
    //         case Sort.RECENT:
    //             return orderBy(events, ['created_at'], ['desc'])
    //         case Sort.DEFAULT:
    //         default:
    //             return events;
    //     }
    // }, [sort, events, mostZappedMemo, mostReactionsMemo]);

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

    // useEffect(() => {
    //     if (events) {
    //         manageSubs.addSub({
    //             kinds: [9735],
    //             '#e': events!.map(({id}) => id!),
    //             since: Math.floor(Date.now() / 1000 -  7 * 24 * 60 * 60)
    //         }, {closeOnEose: true}, undefined, undefined, undefined, allZaps?.map(({id}: NostrEvent) => id!));
    //
    //         manageSubs.addSub({
    //             kinds: [7],
    //             '#e': events!.map(({id}) => id!),
    //             since: Math.floor(Date.now() / 1000 -  7 * 24 * 60 * 60)
    //         }, {closeOnEose: true}, undefined, undefined, undefined, allReactions?.map(({id}: NostrEvent) => id!))
    //     }
    // }, [events]);

    // @ts-ignore
    return <NostrEventListContext.Provider value={{ events, limit, setLimit, sort, setSort, eventStore: props.eventStore }}>
        { children }
    </NostrEventListContext.Provider>;
};

export const useNostrEventListContextProvider = () => useContext(NostrEventListContext);
export default NostrEventListContextProvider;