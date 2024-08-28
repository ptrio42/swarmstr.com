import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    NDKEvent,
    NDKFilter,
    NDKRelay,
    NDKRelaySet,
    NDKSubscription,
    NDKSubscriptionCacheUsage,
    NDKSubscriptionOptions,
    NDKTag
} from "@nostr-dev-kit/ndk";
import {NostrNoteThreadContext} from "../contexts/NostrNoteThreadContext";
import {useParams} from "react-router";
import {useNostrContext} from "./NostrContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {containsTag, noteIsVisible, useManageSubs, valueFromTag} from "../utils/utils";
import {Config} from "../resources/Config";
import {chunk, orderBy} from 'lodash';
import {request} from "../services/request";
import {nip19, NostrEvent} from "nostr-tools";
import {useSearchParams} from "react-router-dom";
import {getEventsAsPromise, subscribe} from "../services/nostr/relays";
import {Sort} from "../components/Nostr/EventList/EventList";
import {EventListWrapper} from "../components/Nostr/EventListWrapper/EventListWrapper";
import EventList from "../components/Nostr/Thread/Thread";
import NostrEventListContextProvider from "./NostrEventListContextProvider";
import {EventStore} from "../components/Nostr/EventStore/EventStore";
import {Box} from "@mui/material";
import {isVisible} from "@testing-library/user-event/dist/utils";
import {validateSchema} from "webpack";

export const decodeEventPointer = (pointer: any) => {
    try {
        const decodeResult = pointer && nip19.decode(pointer);
        console.log('NostrNoteThreadContextProvider: decode: ', decodeResult);
        switch (decodeResult.type) {
            case 'note':
                return { id: decodeResult.data };
            case 'naddr':
                return {...decodeResult.data, id: decodeResult.data.identifier};
            case 'nevent':
            default:
                console.log('decodeResult', {decodeResult})
                return decodeResult.data
        }
    } catch (e) {
        return { id: '' }
    }
};

const DEFAULT_HEIGHT = 200;

const NostrNoteThreadContextProvider = ({children, sort = Sort.RECENT, ...props}: { children: any, event?: NostrEvent, nevent?: string, sort?: Sort }) => {
    const { nevent } = useMemo(() => (props.nevent && { nevent: props.nevent }) || useParams() || (searchParams.get('e') && { nevent: searchParams.get('e') }), []);
    const { id, pubkey, kind } = useMemo(() => decodeEventPointer(nevent), [nevent]);

    const filter = { kinds: [1, 7, 9735, 30023, 6, /*1985*/], '#e': [id] };
    const eventStore = EventStore({filter});
    const [event, setEvent] = useState<NostrEvent>();
    const events = eventStore.getEvents(sort);

    const { ndk, connected } = useNostrContext();
    const manageSubs = useManageSubs({ ndk, subscribe });

    // const [event, setEvent] = useState<NostrEvent|undefined>(props.event);
    // const [events, setEvents] = useState<NostrEvent[]|undefined>();

    const [searchParams, setSearchParams] = useSearchParams();

    const threadRef = useRef<any>(null);
    const visible = noteIsVisible(threadRef);

    const [threadHeight, setThreadHeight] = useState<number|undefined>();

    useEffect(() => {
        if (!connected) return;
        if (visible) {
            console.log('NostrNoteThreadContextProvider: visible', {visible});
            if (!event) {
                getEventsAsPromise(ndk, { ids: [id] })
                    .then((events: NostrEvent[]) => {
                        console.log('Thread: event: ', {events});
                        if (events[0]) {
                            setEvent(events[0]);
                        }
                    });
            }
            getEventsAsPromise(ndk, filter)
                .then((events: NostrEvent[]) => {
                    console.log('Thread: event: ', {events});
                    if (events) {
                        eventStore.addEvents(events!);
                        eventStore.getStats();
                    }
                });
        } else {
            eventStore.clear();
        }
    }, [connected, visible]);
    // const [stats, setStats] = useState<any>({});

    // const [cachedEvents, setCachedEvents] = useState<NostrEvent[]>();

    // const [commentEvents, loaded] = useLiveQuery(async () => {
    //     console.log('NostrNoteThreadContextProvider: comments: ', {id});
    //     const _events = await db.notes
    //         .where('referencedEventsIds').equals(id)
    //         // .where({ referencedEventId: id })
    //         // .filter(({tags}: NostrEvent) => containsTag(tags, ['e', id]))
    //         // .filter(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 'e').length === 1)
    //         // filter spam notes
    //         .filter(({ content, tags }) =>
    //             !content.toLowerCase().includes('airdrop is live') &&
    //             !content.toLowerCase().includes('claim $') &&
    //             !content.toLowerCase().includes('claim your free $') &&
    //             !containsTag(tags, ['t', Config.HASHTAG]))
    //         .toArray();
    //     return [_events, true];
    // }, [], [[], false]);

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

    // useEffect(() => {
    //     console.log(`NostrNoteThreadContextProvider: comments: ${commentEvents?.length}`, {commentEvents})
    //     if (commentEvents && commentEvents.length > 0) {
    //         const ids = commentEvents!.filter(e => !!e).map((e: NostrEvent) => e.id);
    //         ids && chunk(ids, 10)
    //         // @ts-ignore
    //             .forEach((_ids: string[]) => {
    //                 request({
    //                     url: `https://api.nostr.band/v0/stats/event/batch?objects=${_ids.join(',')}`,
    //                     method: 'GET'
    //                 }).then((response) => {
    //                     setStats({
    //                         ...stats,
    //                         ...response.data.stats
    //                     });
    //                 })
    //             });
    //     }
    // }, [commentEvents]);

    // const subscribe = useCallback((
    //     filter: NDKFilter,
    //     opts: NDKSubscriptionOptions = {closeOnEose: false, groupableDelay: 200}
    // ) => {
    //     console.log(`NostrNoteThreadContextProvider: filter:`, {filter});
    //     const sub = ndk.subscribe(filter, { ...opts, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY}, NDKRelaySet.fromRelayUrls(readRelays, ndk));
    //     sub.on('event', async (event: NDKEvent) => {
    //         console.log('NostrNoteThreadContextProvider: event: ', {event});
    //         try {
    //             const nostrEvent = await event.toNostrEvent();
    //             // console.log({nostrEvent});
    //             const newEvent = { ...nostrEvent, id: event.id };
    //             setEvents([
    //                 ...eventsRef.current,
    //                 newEvent
    //             ]);
    //             handleNDKEvent(event, filter);
    //         } catch (error) {
    //
    //         }
    //     });
    //     subs.push(sub);
    //     return sub.internalId;
    // }, [connected, readRelays]);

    // const subscribeFn = useCallback((
    //     filter: NDKFilter,
    //     opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
    //     onEose?: () => void,
    //     onEvent?: (event: NDKEvent) => void,
    //     relayUrls?: string[]
    // ) => manageSubs.addSub(filter, opts, onEose, onEvent, relayUrls), [readRelays]);
    //
    // const unsubscribe = (subIds: string[]) => {
    //     ndk.pool.connectedRelays().forEach((relay: NDKRelay) => {
    //         relay.activeSubscriptions().forEach((subs: NDKSubscription[]) => {
    //             subs.forEach((sub: NDKSubscription) => {
    //                 if (subIds.includes(sub.internalId)) {
    //                     sub.stop();
    //                     console.log(`Stopping sub ${sub.internalId}`);
    //                 }
    //             })
    //         })
    //     });
    // };

    useEffect(() => {
        if (visible && !threadHeight) {
            console.log('NostrNoteThreadContextProvider', {threadRef})
            const { clientHeight } = threadRef.current;
            // @ts-ignore
            if (clientHeight) {
                console.log('NostrNoteThreadContextProvider', {clientHeight})
                // setThreadHeight(clientHeight);
            }
        }
    }, [visible]);

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
            manageSubs.stopAllSubs();
            // event && saveEvent(event!);
            // ndk.pool.relays
            //     .forEach((relay: NDKRelay) => relay
            //         .activeSubscriptions
            //         .forEach((subscription: NDKSubscription) => subscription.stop()));
        }
    }, []);

    return <Box sx={{ width: '100%' }} ref={threadRef}>
        <NostrNoteThreadContext.Provider
            value={{ nevent: nevent || '', id, pubkey, kind, event, events, eventStore, visible }}
        >
            {children}
        </NostrNoteThreadContext.Provider>
    </Box>
};

export const useNostrNoteThreadContext = () => useContext(NostrNoteThreadContext);

export default memo(NostrNoteThreadContextProvider);