import {EventListWrapper} from "../../components/Nostr/EventListWrapper/EventListWrapper";
import {useNostrContext} from "../../providers/NostrContextProvider";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Config} from "../../resources/Config";
import {Box} from "@mui/material";
import EventList, {Sort} from "../../components/Nostr/EventList/EventList";
import {useManageSubs} from "../../utils/utils";
import {Backdrop} from "../../components/Backdrop/Backdrop";
import './RecentNotes.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {orderBy} from 'lodash';
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import {NDKRelay, NDKSubscription, NDKSubscriptionCacheUsage} from '@nostr-dev-kit/ndk';
import {HtmlHead} from "../../components/Html/HtmlHead";
import {subscribe} from "../../services/nostr/relays";
import {EventListSort} from "../../components/Nostr/EventListSort/EventListSort";
import {NostrEvent} from "nostr-tools";
import {EventStore} from "../../components/Nostr/EventStore/EventStore";
import {request} from "../../services/request";
import {btoa, Buffer} from "buffer";

const since =  Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

export const RecentNotes = () => {
    const location = useLocation();
    const { explicitTag } = useMemo(() => useParams() || { explicitTag: Config.HASHTAG }, []);
    const filter = { kinds: [1, 30023], "#t": [explicitTag!], since, limit: 50 };
    // const [events, loaded] = useLiveQuery(
    //     async () => {
    //         const events = await db.notes.where('created_at')
    //             .between(since, to, true, true)
    //             .and(({tags}: NoteEvent) => containsTag(tags, ['t', explicitTag || Config.HASHTAG]))
    //             .reverse()
    //             .sortBy('created_at');
    //         console.log('RecentNotes totalEvents: ', events.length)
    //         return [events, true];
    //     }, [explicitTag], [location?.state?.events, false]);

     const { readRelays, connected, loading, setLoading, ndk } = useNostrContext();

     const {addSub, addSubAndReturnAsPromise, stopAllSubs} = useManageSubs({ndk, subscribe});

     // const subIds = useRef<string[]>([]);

     const navigate = useNavigate();

     const [timesReachedScrollEnd, setTimesReachedScrollEnd] = useState<number>(0);

     // const [sort, setSort] = useState<Sort>(Sort.DEFAULT);

     // const eventsMemo = useMemo(() => cachedEvents || events, [loaded, sort, cachedEvents]);

     // const eventsIds = useMemo(() => loaded && events.map(({id}: NostrEvent) => id), [loaded, events]);

     const unsubscribe = () => {
        stopAllSubs();
    };

     // const [notes, setNotes] = useState<NostrEvent[]|undefined>();
     // const [newNotes, setNewNotes] = useState<NostrEvent[]|undefined>();

     const eventStore = EventStore({filter});
     // const notes = eventStore.getEvents(sort);

     const handleReachedListEnd = (attempt?: number) => {
         // const lastEvent = eventStore.getLastEvent();
         // let i = (attempt || timesReachedScrollEnd) + 1;
         //
         // const extendedFilter = {
         //     ...filter,
         //     ...(lastEvent && {
         //         before: lastEvent.created_at + 1,
         //         since: since - (7 * 24 * 60 * 60) * i,
         //         // limit: 3
         //     }),
         // };
         // console.log('onReachedListEnd', {notes, extendedFilter})
         // if (!notes) return;
         // // subscribe to event before last note
         // console.log('onReachedListEnd: lastEvent', {lastEvent})
         // addSubAndReturnAsPromise(extendedFilter)
         //     .then((events: NostrEvent[]) => {
         //         eventStore.addEvents(events);
         //         if (events.length === 0) {
         //             handleReachedListEnd(i);
         //         }
         //         console.log('onReachedListEnd: adding events', {events})
         //         setTimesReachedScrollEnd(i);
         //     });
     };

     // useEffect(() => {
     //     if ()
     // }, [timesReachedScrollEnd]);

     useEffect(() => {
         if (loading || !connected) return;
         console.log('RecentNotes: events loaded')
         // console.log('RecentNotes', { subIds: subIds.current });
         unsubscribe();
         eventStore.clear();
         setLoading(true);

         const now = Math.floor(Date.now() / 1000);

        // if (sort !== Sort.DEFAULT) {
        //     eventStore.getStats();
        //     const filterStr = Buffer.from(JSON.stringify({ '#t': explicitTag, since: now - 7 * 24 * 3600 })).toString('base64')
        //     request({
        //         url: `${process.env.BASE_URL}/api/stats?filter=${filterStr}`,
        //         method: 'GET'
        //     })
        //         .then((stats: any) => {
        //             switch (sort) {
        //                 case Sort.MOST_REACTIONS:
        //                 case Sort.MOST_COMMENTS:
        //                 case Sort.MOST_ZAPPED:
        //             }
        //
        //             const mostZapped = orderBy(stats.data.filter(({zaps}: any) => !!zaps), 'zaps.msats', ['desc']);
        //
        //
        //             const ids = mostZapped.map(({event_id}: any) => event_id);
        //             addSubAndReturnAsPromise({ids})
        //                 .then((events: NostrEvent[]) => {
        //                     console.log('RecentNotes: addSubAndReturnAsPromise: events: ', {events});
        //                     // setNotes(events);
        //                     eventStore.addEvents(events);
        //                 });
        //             console.log('RecentNotes.tsx: stats: ', {stats, mostZapped});
        //         });
        // } else {
            addSubAndReturnAsPromise({...filter, since})
                .then((events: NostrEvent[]) => {
                    console.log('RecentNotes: addSubAndReturnAsPromise: events: ', {events});
                    // setNotes(events);
                    eventStore.addEvents(events);
                    setTimeout(() => {
                        eventStore.getStats();
                    });
                });
        // }

         // addSub(
         //     {
         //         ...filter,
         //         ...(events[0] ? { since: events[0].created_at } : {since}),
         //     },
         //     { closeOnEose: true, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST },
         //     () => {
         //         console.log('RecentNotes: eose');
         //         setLoading(false);
         // }, undefined, undefined, eventsIds);

         // subscribe to events since now
         addSub(
             {
                 ...filter,
                 since: now
             },
             { closeOnEose: false, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST },
             () => {
                setLoading(false);
            });
     }, [readRelays, connected, explicitTag]);

     // useEffect(() => {
     //     if (loaded) {
     //         // setCachedEvents(eventsMemo);
     //         // console.log('setCachedEvents, events: ', {eventsMemo}, {events});
     //         const { pathname, hash, key } = location;
     //         console.log('RecentNotes: cached items loaded', {hash})
     //
     //         if (hash !== '') {
     //             setTimeout(() => {
     //                 const id = hash.replace('#', '');
     //                 const element = document.getElementById(id);
     //                 if (element) {
     //                     console.log('RecentNotes: scrolling into view');
     //                     element.scrollIntoView();
     //                 }
     //             }, 1000);
     //         }
     //     }
     // }, [loaded]);

     // useEffect(() => {
     //     console.log('RecentNotes: savedEvents', {savedEvents})
     //     if (notes && savedEvents && savedEvents!.length > 0) clearSavedEvents();
     // }, [notes])

     useEffect(() => {
         console.log('recent notes did mount');

         return () => {
             console.log('closing recent notes subscriptions...');
             unsubscribe();
             eventStore.clear();
         };
     }, []);

    return <Box>
        <HtmlHead
            title={`Recent from #${explicitTag} - Swarmstr`}
            description={`Browse latest notes from #${explicitTag}`}
            url={`${process.env.BASE_URL}/recent/${explicitTag}`}
        />

        <NostrEventListContextProvider eventStore={eventStore}>
            <EventListSort/>
            <EventListWrapper onReachedListEnd={handleReachedListEnd}>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>
        {
            !loading && (eventStore.getTotalCount() === 0) && <Box>No recent notes.</Box>
        }
        <Backdrop open={loading} />
    </Box>
};