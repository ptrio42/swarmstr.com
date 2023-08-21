import {useNostrContext} from "../../../providers/NostrContextProvider";
import React, {useEffect, useMemo, useState} from "react";
import {Config} from "../../../resources/Config";
import {useLocation, useParams} from "react-router";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {ListEvent, NOTE_TYPE} from "../../../models/commons";
import {containsTag} from "../../../utils/utils";
import {NDKTag, NostrEvent} from '@nostr-dev-kit/ndk'
import {EventList} from "../EventList/EventList";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {Box} from "@mui/material";
import {request} from "../../../services/request";
import {uniqBy, orderBy} from 'lodash';
import {Search} from "../../Search/Search";
import {SearchResults} from "../SearchResults/SearchResults";
import {useSearchParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Backdrop} from "../../Backdrop/Backdrop";
import {Helmet} from "react-helmet";

export const List = () => {

    const { subscribe } = useNostrContext();
    const { listName } = useParams();

    const [cachedEvents, setCachedEvents] = useState<NostrEvent[]>();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    const { pathname, hash, key, ...location } = useLocation();

    const events = useLiveQuery(async () => {
        if (!cachedEvents) return;
        const list = await db.lists.where({ kind: 30001 })
            .and((list: ListEvent) => !!listName && containsTag(list.tags, ['d', listName!] as NDKTag))
            .sortBy('created_at');
        const eventIds = list?.reverse()[0]?.tags?.filter((tag: NDKTag) => tag[0] === 'e')?.map((tag: NDKTag) => tag[1]) || [];
        console.log({eventIds})
        const filteredNotes = await db.notes
            .filter((nostrEvent: NostrEvent) => eventIds.includes(nostrEvent.id!))
            .toArray();
        if (cachedEvents) {
            filteredNotes.push(...cachedEvents?.map((event: NostrEvent) => ({...event, type: NOTE_TYPE.QUESTION})));
        }
        return orderBy(uniqBy(filteredNotes, 'id')
            .map((nostrEvent: NostrEvent) => ({...nostrEvent, position: eventIds.indexOf(nostrEvent.id!)})), 'position', 'desc')
    }, [listName, cachedEvents], cachedEvents);

    const filteredEvents = () => {
        return events?.filter(({content}: NostrEvent) => !searchString ||
            searchString === '' ||
            searchString.length < 3 ||
            new RegExp(searchString?.toLowerCase()).test(content?.toLowerCase())
        ) || [];
    };

    const eventsMemo = useMemo(() => events, [!events]);

    useEffect(() => {
        subscribe({
            kinds: [30001],
            authors: ['000003a2c8076423148fe15e3ff5f182e0304cff6de499a3f54f5adfe3b014e6'],
            '#d': [listName]
        }, { closeOnEose: false, groupable: false }, Config.SERVER_RELAYS);

        request({ url: `${process.env.BASE_URL}/api/cache/${listName}/30001/d` })
            .then(response => {
                setCachedEvents(response.data);
                db.notes.bulkPut(response.data.map((nostrEvent: NostrEvent) => ({...nostrEvent, type: NOTE_TYPE.QUESTION})));
            })
    }, []);

    useEffect(() => {
        console.log({pathname})
        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                // console.log({element})
                if (element) {
                    element.scrollIntoView();
                }
            });
        }
    }, [pathname, hash, key, eventsMemo]);

    return <Box>
        <Helmet>
            <title>{ listName?.replace('-', ' ')?.toUpperCase() } - { Config.APP_TITLE }</title>
            {/*<meta property="description" content={`Browse latest notes from #${Config.HASHTAG}`} />*/}
            <meta property="keywords" content={ Config.APP_KEYWORDS } />

            <meta property="og:url" content={ `${process.env.BASE_URL}/d/${listName}` } />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${listName?.replace('-', ' ')?.toUpperCase()} - ${Config.APP_TITLE}`} />
            <meta property="og:image" content={ Config.APP_IMAGE } />
            {/*<meta property="og:description" content={`Browse latest notes from #${Config.HASHTAG}`} />*/}

            <meta itemProp="name" content={`${listName?.replace('-', ' ')?.toUpperCase()} - ${Config.APP_TITLE}`} />
            <meta itemProp="image" content={ Config.APP_IMAGE }  />

            <meta name="twitter:title" content={`${listName?.replace('-', ' ')?.toUpperCase()} - ${Config.APP_TITLE}`} />
            {/*<meta name="twitter:description" content={`Browse latest notes from #${Config.HASHTAG}`} />*/}
            <meta name="twitter:image" content={ Config.APP_IMAGE }  />

        </Helmet>
        <Typography component="div" variant="h6">
            {   // @ts-ignore
                listName?.replace('-', ' ').toUpperCase()
            }
        </Typography>
        <SearchResults
            search={<Search
                query={searchString || ''}
                resultsCount={filteredEvents()?.length}
                onQueryChange={(event: any) => {
                    setSearchParams({ s: event.target.value});
                }}
                isQuerying={false}
            />}
            results={filteredEvents() || []}
            limit={filteredEvents()?.length || 10}
            handleSetLimit={(l: number) => { }}
        >
            <EventListWrapper results={filteredEvents() || []} limit={events?.length || 0} handleSetLimit={(limit: number) => { }}>
                <EventList events={filteredEvents() || []} floating={false}/>
            </EventListWrapper>
        </SearchResults>
        <Backdrop open={!events} />
    </Box>;
};