import React, {useCallback, useEffect, useState} from "react";
import {NDKFilter} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";
import {last, orderBy} from "lodash";

import {Sort} from "../EventList/EventList";
import {request} from "../../../services/request";
import {Buffer} from "buffer";

type EventStoreMap = Map<string, NostrEvent>;

interface EventStoreProps {
    filter: NDKFilter;
}

export const EventStore = ({ filter }: EventStoreProps) => {
    const [events, setEvents] = useState<Map<string, NostrEvent>>(new Map<string, NostrEvent>());
    const [stats, setStats] = useState<any>();

    // useEffect(() => {
    //     // getStats();
    // }, [events]);

    const getEvents = (sort: Sort = Sort.RECENT) => {
        console.log('EventStore.tsx:', {filter, sort, stats})
        let ordered: any[];
        switch (sort) {
            case Sort.MOST_ZAPPED: {

                ordered = orderBy(stats?.filter(({zaps}: any) => !!zaps), ['zaps.msats'], ['desc'])
                    .map(({event_id}: any) => event_id);
                console.log('EventStore.tsx most zapped', {ordered});
                const sorted = Array
                    .from(events.values())
                    .filter((event: NostrEvent) => ordered.includes(event.id))
                    .sort((a, b) => ordered.indexOf(a.id) - ordered.indexOf(b.id));
                    // .reverse();
                console.log('EventStore.tsx sorted', {sorted});
                return sorted;
            }
            case Sort.MOST_REACTIONS: {

                ordered = orderBy(stats?.filter(({reaction_count}: any) => !!reaction_count), ['reaction_count'], ['desc'])
                    .map(({event_id}: any) => event_id);
                console.log('EventStore.tsx most reactions', {ordered});
                const sorted = Array
                    .from(events.values())
                    .filter((event: NostrEvent) => ordered.includes(event.id))
                    .sort((a, b) => ordered.indexOf(a.id) - ordered.indexOf(b.id));
                    // .reverse();
                return sorted;
            }
            // return;
            case Sort.MOST_COMMENTS: {
                ordered = orderBy(stats?.filter(({reply_count}: any) => !!reply_count), ['reply_count'], ['desc'])
                    .map(({event_id}: any) => event_id);
                console.log('EventStore.tsx most comments', {ordered});
                const sorted = Array
                    .from(events.values())
                    .filter((event: NostrEvent) => ordered.includes(event.id))
                    .sort((a, b) => ordered.indexOf(a.id) - ordered.indexOf(b.id))
                    // .reverse();
                console.log('EventStore.tsx sorted', {sorted});
                return sorted;
            }
            case Sort.RECENT:
            default:
                console.log('EventStore.tsx default');
                // return;
                return orderBy(Array.from(events.values()), 'created_at', 'desc')
        }
        // return Array
        //     .from(events.values())
        //     .sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b))
        //     .reverse();
    };

    const addEvent = (event: NostrEvent) => {
        const { id } = event;
        const exists = events.get(id);
        if (!exists) {
            setEvents((events: Map<string, NostrEvent>) => events.set(id, event));
        }
    };

    const addEvents = (events: NostrEvent[]) => {
        const newEvents = events.reduce((acc, event) => acc.set(event.id, event), new Map());
        setEvents((events: Map<string, NostrEvent>) => new Map([...events, ...newEvents]));
    };

    const removeEvent = (id: string) => {

    };

    const getEvent = (id: string) => {
        return events.get(id);
    };

    const getLastEvent = () => {
        return last(getEvents());
    };

    const getFirstEvent = () => {
        return getEvents()[0];
    };

    const clear = () => {
        if (events.size > 0) {
            console.log(`EventStore: clearing ${events.size} events`);
            setEvents(new Map<string, NostrEvent>());
        }
    };

    const getTotalCount = () => {
        return events.size;
    };

    const getStats = async () => {
        const filterStr = Buffer.from(JSON.stringify(filter)).toString('base64');
        return new Promise<void>((resolve, reject) => {
            request({
                url: `${process.env.BASE_URL}/api/stats?filter=${filterStr}`,
                method: 'GET'
            })
                .then((stats: { data: any }) => {
                    console.log(`EventStats.tsx: getStats: `, {stats: stats.data});
                    setStats(stats.data);
                    resolve();
                });
        });
    };

    // const getEventsStats = (eventIds: string[]) => {
    //     request({
    //         url: `${process.env.BASE_URL}/api/stats/`
    //     })
    // }

    return {
        events,
        addEvent,
        getEvent,
        getEvents,
        addEvents,
        getFirstEvent,
        getLastEvent,
        getTotalCount,
        clear,
        getStats
    }
};