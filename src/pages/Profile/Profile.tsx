import { nip19, NostrEvent } from 'nostr-tools';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Metadata } from '../../components/Nostr/Metadata/Metadata';
import {useParams} from "react-router";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {Config} from "../../resources/Config";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {Box} from "@mui/material";
import EventList from "../../components/Nostr/EventList/EventList";
import {EventListWrapper} from "../../components/Nostr/EventListWrapper/EventListWrapper";
import {containsTag, useManageSubs} from "../../utils/utils";
import {Backdrop} from "../../components/Backdrop/Backdrop";
import {sortBy} from 'lodash';
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import {NDKFilter, NDKSubscriptionCacheUsage} from "@nostr-dev-kit/ndk";
import {HtmlHead} from "../../components/Html/HtmlHead";
import {subscribe} from "../../services/nostr/relays";
import {EventListSort} from "../../components/Nostr/EventListSort/EventListSort";
import {EventStore} from "../../components/Nostr/EventStore/EventStore";

interface ProfileProps {
    npub?: string
}

export const Profile = () => {
    const { npub } = useParams();

    if (!npub || !npub.includes('npub1')) return;

    const pubkey = npub && nip19.decode(npub!)?.data || '';
    const [limit, setLimit] = useState<number>(10);

    const { ndk, readRelays, connected } = useNostrContext();
    const manageSubs = useManageSubs({ndk, subscribe});

    // const events = useLiveQuery(async () => {
    //     return db.notes
    //         .where({ pubkey })
    //         // .and(({ tags }) => containsTag(tags, ['t', Config.HASHTAG]))
    //         .reverse()
    //         .sortBy('created_at');
    // }, [pubkey]);

    // const [events, setEvents] = useState<NostrEvent[]>();
    // const [events, setEvents] = useState<NostrEvent[]>();
    const filter: NDKFilter = {
        kinds: [1, 30023],
        // @ts-ignore
        authors: [pubkey],
    };

    const eventStore = EventStore({filter});

    useEffect(() => {
        console.log('Profile: pubkey change', {pubkey})

        // if (!connected) return;

        if (connected && pubkey) {
            // stop all subs when pubkey changes
            manageSubs.stopAllSubs();

            const now = Math.floor(Date.now() / 1000);

            manageSubs
                .addSubAndReturnAsPromise({...filter, since: now - 7 * 24 * 60 * 60 } as NDKFilter)
                .then((events: NostrEvent[]) => {
                    eventStore.addEvents(events);
                    eventStore.getStats();
                });

            // const opts = {closeOnEose: false, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST};
            //
            // manageSubs
            //     .addSub({ ...filter, since: now - 3 * 24 * 60 * 60, before: now} as NDKFilter, opts);
            //
            // manageSubs
            //     .addSub({ ...filter, since: now } as NDKFilter, opts);
        }

    }, [pubkey, readRelays, connected]);

    useEffect(() => {
        return () => {
            manageSubs.stopAllSubs();
        }
    }, []);


    return <Box>
        <HtmlHead
            title={`Profile ${npub} - Swarmstr`}
            description={`Viewing profile of Nostr user: ${npub}`}
            url={`${process.env.BASE_URL}/p/${npub}`}
        />
        <Metadata pubkey={pubkey as string} />

        <NostrEventListContextProvider eventStore={eventStore}>
            <EventListSort/>
            <EventListWrapper>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>

        {/*<Backdrop open={!eventStore.e} />*/}
    </Box>;
};