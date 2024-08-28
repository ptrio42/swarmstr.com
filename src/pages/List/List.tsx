import {useNostrContext} from "../../providers/NostrContextProvider";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {ListEvent, NOTE_TYPE} from "../../models/commons";
import {containsTag, useManageSubs} from "../../utils/utils";
import {NDKTag, NDKEvent} from '@nostr-dev-kit/ndk';
import {NostrEvent} from "nostr-tools";
import EventList, {Sort} from "../../components/Nostr/EventList/EventList";
import {EventListWrapper} from "../../components/Nostr/EventListWrapper/EventListWrapper";
import {Box} from "@mui/material";
import {request} from "../../services/request";
import {uniqBy, orderBy} from 'lodash';
import {SearchBar} from "../../components/SearchBar/SearchBar";
import {SearchResults} from "../../components/Nostr/SearchResults/SearchResults";
import {useSearchParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Backdrop} from "../../components/Backdrop/Backdrop";
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import {HtmlHead} from "../../components/Html/HtmlHead";
import {getEventsAsPromise, subscribe} from "../../services/nostr/relays";
import {EventStore} from "../../components/Nostr/EventStore/EventStore";
import {getTagValuesFromEvent} from "../../utils/nostr";
import {EventListSort} from "../../components/Nostr/EventListSort/EventListSort";

export const List = () => {

    const { listName } = useParams();
    const {ndk} = useNostrContext();
    const {addSub, stopAllSubs} = useManageSubs({ndk, subscribe});

    const filter = {
        kinds: [30001],
        // authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
        '#d': [listName!]
    };

    // const [cachedEvents, setCachedEvents] = useState<NostrEvent[]>();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    // const events = useLiveQuery(async () => {
    //     const list = await db.lists.where({ kind: 30001 })
    //         .and((list: ListEvent) => !!listName && containsTag(list.tags, ['d', listName!] as NDKTag))
    //         .sortBy('created_at');
    //     const eventIds = list?.reverse()[0]?.tags?.filter((tag: NDKTag) => tag[0] === 'e')?.map((tag: NDKTag) => tag[1]) || [];
    //     const filteredNotes = await db.notes
    //         .filter((nostrEvent: NostrEvent) => eventIds.includes(nostrEvent.id!))
    //         .toArray();
    //     return orderBy(uniqBy(filteredNotes, 'id')
    //         .map((nostrEvent: NostrEvent) => ({...nostrEvent, position: eventIds.indexOf(nostrEvent.id!)})), 'position', 'desc')
    // }, [listName, cachedEvents], cachedEvents);

    const eventStore = EventStore({filter});
    const events = eventStore.getEvents().reverse();

    const [sort, setSort] = useState<Sort>(Sort.RECENT);


    const listNameFormatted = listName?.replace('-', ' ')?.toUpperCase();

    const filteredEvents = () => {
        return events?.filter(({content}: NostrEvent) => !searchString ||
            searchString === '' ||
            searchString.length < 3 ||
            new RegExp(searchString?.toLowerCase()).test(content?.toLowerCase())
        ) || [];
    };

    useEffect(() => {

        getEventsAsPromise(ndk, filter).then((events: NostrEvent[]) => {
            const ordered = orderBy(events, 'tags.length', 'desc');
            const ids = getTagValuesFromEvent(ordered[0], 'e');
            console.log('List.tsx: events: ', {events, ordered, ids});
            getEventsAsPromise(ndk, {
                kinds: [1, 30023], ids
            }).then((events: NostrEvent[]) => {
                console.log('List.tsx: kind 1/30023 events: ', {events});
                eventStore.addEvents(events);
            })
        });

        // addSub({
        //     kinds: [30001],
        //     authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
        //     '#d': [listName!]
        // }, { closeOnEose: false, groupable: false }, () => {
        //     console.log(`List: total events: ${events?.length}`)
        // }, (event: NDKEvent) => {
        //     console.log('List: adding event to list: ', {event});
        // });
        //
        // request({ url: `${process.env.BASE_URL}/api/cache/${listName}/30001/d` })
        //     .then(response => {
        //         setCachedEvents(response.data);
        //         db.notes.bulkPut(response.data.map((nostrEvent: NostrEvent) => ({...nostrEvent, type: NOTE_TYPE.QUESTION})));
        //     });

        return () => {
            stopAllSubs();
        }
    }, []);

    return <Box>
        <HtmlHead
            title={`${listNameFormatted} - Swarmstr`}
            description={`${listNameFormatted} - browsing a list of ${filteredEvents()?.length}`}
            url={`${process.env.BASE_URL}/d/${listName}`}
        />

        <Typography component="div" variant="h6">
            {   // @ts-ignore
                listName?.replace('-', ' ').toUpperCase()
            }
        </Typography>
        {/*<SearchResults*/}
            {/*search={<SearchBar*/}
                {/*placeholder={'Filter list...'}*/}
                {/*query={searchString || ''}*/}
                {/*resultsCount={filteredEvents()?.length}*/}
                {/*onQueryChange={(event: any) => {*/}
                    {/*setSearchParams({ s: event.target.value});*/}
                {/*}}*/}
                {/*isQuerying={false}*/}
            {/*/>}*/}
            {/*results={filteredEvents() || []}*/}
        {/*>*/}
            <NostrEventListContextProvider eventStore={eventStore} sort={sort}>
                <EventListSort/>
                <EventListWrapper>
                    <EventList expanded={false} floating={false}/>
                </EventListWrapper>
            </NostrEventListContextProvider>
        {/*</SearchResults>*/}
        <Backdrop open={!events} />
    </Box>;
};