import React, {useEffect, useMemo, useState} from "react";
import {NostrResources} from "../../Resources/NostrResources/NostrResources";
import {NoteThread} from "../../Resources/Thread/Thread";
import {Note} from "../../Resources/Note/Note";
import {Box} from "@mui/material";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";
import {LoadingAnimation} from "../../LoadingAnimation/LoadingAnimation";
import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {nip19} from "nostr-tools";
import {useSearchParams} from "react-router-dom";
import {containsTag, matchString} from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";

const filter: NDKFilter = {
    kinds: [1],
    '#t': ['asknostr']
};

export const Feed = () => {
    const { ndk, user } = useNostrContext();
    const { nevents, loading, subscribe } = useNostrFeedContext();
    const [filteredNevents, setFilteredNevents] = useState<string[]>([]);

    const [searchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    const events = useLiveQuery(async () => {
        const events = await db.events.where('kind').equals(1)
            .and(({tags}) => containsTag(tags, ['t', 'asknostr']))
            .toArray();
        return events;
    }, []);

    useEffect(() => {
        subscribe(filter);
    }, []);

    const handleSearchQueryChange = (nevent: string, display: boolean) => {
        if (!display) {
            setFilteredNevents([
                ...filteredNevents,
                nevent
            ])
        } else {
            setFilteredNevents(filteredNevents.filter((_nevent: string) => _nevent !== nevent))
        }
    };

    const eventsMemo = useMemo(() => events && events
            .filter(({content, tags}) => !searchString || searchString === '' || (matchString(searchString, content) ||
        (tags
            .filter((t: any) => t[0] === 't')
            .map((t1: any) => t1[1].toLowerCase())
            .includes(searchString.toLowerCase()))))
        , [events, searchString]);

    return (
        <React.Fragment>
            {
                ndk && <Box>
                    Relays: {ndk.pool.stats().connected}/{ndk.pool.stats().total}<br/>
                    Events: {nevents.length}<br/>
                    User: {user?.npub}
                </Box>
            }
            <NostrResources resultsCount={eventsMemo?.length}>
                {
                    (eventsMemo || [])
                        .map((nostrEvent: NostrEvent) => nip19.neventEncode({
                    id: nostrEvent.id,
                    author: nostrEvent.pubkey,
                    relays: []
                }))
                        .map((nevent: string) => (
                            <NoteThread
                                key={`${nevent}-thread`}
                                nevent={nevent}
                            >
                                <NostrNoteContextProvider>
                                    <Note key={`${nevent}-content`} nevent={nevent}/>
                                </NostrNoteContextProvider>
                            </NoteThread>
                        ))
                }
            </NostrResources>
            <LoadingAnimation isLoading={!events}/>
        </React.Fragment>
    )
};