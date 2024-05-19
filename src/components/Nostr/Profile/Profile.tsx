import { nip19 } from 'nostr-tools';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Metadata } from '../Metadata/Metadata';
import {useParams} from "react-router";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Config} from "../../../resources/Config";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {Box} from "@mui/material";
import {EventList} from "../EventList/EventList";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {containsTag, useManageSubs} from "../../../utils/utils";
import {Backdrop} from "../../Backdrop/Backdrop";
import {sortBy} from 'lodash';
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {NDKFilter, NDKSubscriptionCacheUsage} from "@nostr-dev-kit/ndk";

interface ProfileProps {
    npub?: string
}

export const Profile = (props: ProfileProps) => {
    // @ts-ignore
    const { npub } = props.npub ? ({ props: { npub: props.npub } }) : useParams();
    const pubkey = useMemo(() => nip19.decode(npub)?.data || '', [npub]);
    const [limit, setLimit] = useState<number>(10);

    const { ndk, subscribe, readRelays, connected } = useNostrContext();
    const manageSubs = useManageSubs({ndk, subscribe});

    const events = useLiveQuery(async () => {
        return await db.notes
            .where({ pubkey })
            // .and(({ tags }) => containsTag(tags, ['t', Config.HASHTAG]))
            .reverse()
            .sortBy('created_at');
    }, [pubkey]);

    useEffect(() => {
        console.log('Profile: pubkey change', {pubkey})

        if (!connected) return;

        // stop all subs when pubkey changes
        manageSubs.stopAllSubs();

        const now = Math.floor(Date.now() / 1000);

        const filter = {
            kinds: [1, 30023],
            authors: [pubkey],
        };
        const opts = {closeOnEose: false, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST};

        manageSubs
            .addSub({ ...filter, since: now - 3 * 24 * 60 * 60, before: now} as NDKFilter, opts);

        manageSubs
            .addSub({ ...filter, since: now } as NDKFilter, opts);

    }, [pubkey, readRelays, connected]);

    useEffect(() => {
        return () => {
            manageSubs.stopAllSubs();
        }
    }, []);


    return <Box>
        <Metadata pubkey={pubkey as string} />

        <NostrEventListContextProvider events={events || []}>
            <EventListWrapper>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>

        <Backdrop open={!events} />
    </Box>;
};