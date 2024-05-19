import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelay, NDKRelaySet, NDKSubscription, NostrEvent, NDKSubscriptionOptions, NDKSubscriptionCacheUsage, NDKTag} from "@nostr-dev-kit/ndk";
import {NostrNoteThreadContext} from "../contexts/NostrNoteThreadContext";
import {useParams} from "react-router";
import {useNostrContext} from "./NostrContextProvider";
import {Backdrop} from "../components/Backdrop/Backdrop";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {containsTag, handleNDKEvent} from "../utils/utils";
import {Config} from "../resources/Config";
import {uniqBy, chunk} from 'lodash';
import {request} from "../services/request";
import {nip19} from "nostr-tools";
import {useSearchParams} from "react-router-dom";
import {NOTE_TYPE, NoteType} from "../models/commons";

export const decodeEventPointer = (pointer: any) => {
    try {
        const decodeResult = pointer && nip19.decode(pointer);
        console.log('NostrNoteThreadContextProvider: decode: ', decodeResult);
        switch (decodeResult.type) {
            case 'note':
                return { id: decodeResult.data };
            case 'nevent':
            default:
                return decodeResult.data
        }
    } catch (e) {
        return { id: '' }
    }
};


const subs = [];

export const NostrNoteThreadContextProvider = ({children, ...props}: any) => {
    const [events, _setEvents] = useState<NostrEvent[]>([]);
    const eventsRef = useRef<NostrEvent[]>(events);
    const setEvents = (events: NostrEvent[]) => {
        eventsRef.current = events;
        _setEvents(eventsRef.current);
    };
    const { ndk, readRelays, connected } = useNostrContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const { nevent } = (props.nevent && { nevent: props.nevent }) || useParams() || (searchParams.get('e') && { nevent: searchParams.get('e') });
    const { id } = useMemo(() => decodeEventPointer(nevent), [nevent]);

    const [stats, setStats] = useState<any>({});

    const [cachedEvents, setCachedEvents] = useState<NostrEvent[]>();

    const [commentEvents, loaded] = useLiveQuery(async () => {
        console.log('NostrNoteThreadContextProvider: ', {id});
        const _events = await db.notes
            .where('referencedEventsIds').equals(id)
            // .where({ referencedEventId: id })
            // .filter(({tags}: NostrEvent) => containsTag(tags, ['e', id]))
            // .filter(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 'e').length === 1)
            // filter spam notes
            .filter(({ content, tags }) =>
                !content.toLowerCase().includes('airdrop is live') &&
                !content.toLowerCase().includes('claim $') &&
                !content.toLowerCase().includes('claim your free $') &&
                !containsTag(tags, ['t', Config.HASHTAG]))
            .toArray();
        return [_events, true];
    }, [id], [[], false]);

    // useEffect(() => {
    //     if (!id || loaded) return;
    //     request({ url: `${process.env.BASE_URL}/api/cache/${id}/1/e` })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 // console.log({response})
    //                 setCachedEvents(response.data);
    //                 db.notes.bulkPut(response.data);
    //             }
    //         })
    //
    // }, [id]);

    useEffect(() => {
        console.log(`NostrNoteThreadContextProvider: comments: ${commentEvents?.length}`, {commentEvents})
        if (commentEvents && commentEvents.length > 0) {
            const ids = commentEvents!.filter(e => !!e).map((e: NostrEvent) => e.id);
            ids && chunk(ids, 10)
            // @ts-ignore
                .forEach((_ids: string[]) => {
                    request({
                        url: `https://api.nostr.band/v0/stats/event/batch?objects=${_ids.join(',')}`,
                        method: 'GET'
                    }).then((response) => {
                        setStats({
                            ...stats,
                            ...response.data.stats
                        });
                    })
                });
        }
    }, [commentEvents]);

    const subscribe = useCallback((
        filter: NDKFilter,
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupableDelay: 200}
    ) => {
        console.log(`NostrNoteThreadContextProvider: filter:`, {filter});
        const sub = ndk.subscribe(filter, { ...opts, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY}, NDKRelaySet.fromRelayUrls(readRelays, ndk));
        sub.on('event', async (event: NDKEvent) => {
            console.log('NostrNoteThreadContextProvider: event: ', {event});
            try {
                const nostrEvent = await event.toNostrEvent();
                // console.log({nostrEvent});
                const newEvent = { ...nostrEvent, id: event.id };
                setEvents([
                    ...eventsRef.current,
                    newEvent
                ]);
                handleNDKEvent(event, filter);
            } catch (error) {

            }
        });
        subs.push(sub);
        return sub.internalId;
    }, [connected, readRelays]);

    const unsubscribe = (subIds: string[]) => {
        ndk.pool.connectedRelays().forEach((relay: NDKRelay) => {
            relay.activeSubscriptions().forEach((subs: NDKSubscription[]) => {
                subs.forEach((sub: NDKSubscription) => {
                    if (subIds.includes(sub.internalId)) {
                        sub.stop();
                        console.log(`Stopping sub ${sub.internalId}`);
                    }
                })
            })
        });
    };

    useEffect(() => {
        // ndk.pool.on('connect', (connection) => {
        //     console.log('NostrNoteThreadContextProvider: connected to relays', {connection});
        //     // setConnected(true);
        // });
        // ndk.pool.on('relay:connect', (connection) => {
        //     console.log('NostrNoteThreadContextProvider: connected to relay', {connection})
        // });
        return () => {
            console.log('stop all subs...');
            // ndk.pool.relays
            //     .forEach((relay: NDKRelay) => relay
            //         .activeSubscriptions
            //         .forEach((subscription: NDKSubscription) => subscription.stop()));
        }
    }, []);

    return (
        <NostrNoteThreadContext.Provider value={{ events, subscribe, unsubscribe, nevent: nevent || '', commentEvents, loaded, stats, connected }}>
            {children}
        </NostrNoteThreadContext.Provider>
    );
};

export const useNostrNoteThreadContext = () => useContext(NostrNoteThreadContext);