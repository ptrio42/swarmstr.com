import { nip19 } from 'nostr-tools';
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { Metadata } from '../Metadata/Metadata';
import {useParams} from "react-router";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Config} from "../../../resources/Config";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {Box} from "@mui/material";
import {EventList} from "../EventList/EventList";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {containsTag} from "../../../utils/utils";
import {Backdrop} from "../../Backdrop/Backdrop";
import {sortBy} from 'lodash';
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";

interface ProfileProps {
    npub?: string
}

export const Profile = (props: ProfileProps) => {
    // @ts-ignore
    const { npub } = useMemo(() => props.npub && ({ props: { npub: props.npub } }) || useParams(), []);
    const pubkey = useMemo(() => nip19.decode(npub)?.data || '', [npub]);
    const [limit, setLimit] = useState<number>(10);

    const { subscribe } = useNostrContext();

    const events = useLiveQuery(async () => {
        const events = await db.notes
            .where({ pubkey })
            .and(({ tags }) => containsTag(tags, ['t', Config.HASHTAG]))
            .toArray();

        return sortBy(events, 'created_at').reverse();
    });

    useEffect(() => {
        subscribe({
            kinds: [1, 30023],
            authors: [pubkey],
            '#t': [Config.HASHTAG]
        }, {closeOnEose: false, groupable: false});
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