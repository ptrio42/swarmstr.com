import {NDKTag} from "@nostr-dev-kit/ndk";
import {nip19, NostrEvent} from "nostr-tools";
import NoteThread from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import Note from "../Note/Note";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import {useNostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import Box from "@mui/material/Box";
import NostrNoteThreadContextProvider from "../../../providers/NostrNoteThreadContextProvider";
import {EventSkeleton} from "../EventSkeleton/EventSkeleton";

const eventsFilter = (event: NostrEvent, depth: number, parentId?: string, grandparentId?: string) => {
    if (depth === -1) return true;
    const eTags = event.tags
        .filter((tag: NDKTag) => tag[0] === 'e')
        .map((tag: NDKTag) => tag[1]);
    console.log('EventList: event ' + event.content, {depth: event.tags.filter((tag: NDKTag) => tag[0] === 'e')})
    return eTags.length === depth ||
        (parentId && eTags.length === 1 && eTags[0] === parentId) ||
        (parentId && grandparentId && eTags.length === 2 && eTags.includes(parentId) && eTags.includes(grandparentId));
};

export enum Sort {
    MOST_ZAPPED = 'MOST_ZAPPED',
    MOST_REACTIONS = 'MOST_REACTIONS',
    RECENT = 'RECENT',
    MOST_COMMENTS = 'MOST_COMMENTS'
}

interface EventListProps {
    floating?: boolean;
    depth?: number;
    parentId?: string;
    grandparentId?: string;
    expanded?: boolean;
    showComments?: boolean;
    kinds?: number[];
}

const EventList = ({ floating = true, depth = -1, parentId, grandparentId, expanded = false, kinds = [1, 30023] }: EventListProps) => {

    const { pathname, hash, key } = useLocation();
    const { events, limit, sort, eventStore } = useNostrEventListContextProvider();

    const [notes, setNotes] = useState<NostrEvent[]>([]);

    if (!events) {
        return <Box>
            <EventSkeleton visible={!events}/>
        </Box>;
    }

    const locationStateEventsMemo = useMemo(() => events, [!events, !limit]);

    // const eventsFilter = (event: NostrEvent) => {
    //     if (depth === -1) return true;
    //     const eTags = event.tags.filter((tag: NDKTag) => tag[0] === 'e').map((tag: NDKTag) => tag[1]);
    //     // const length = event.tags.filter((tag: NDKTag) => tag[0] === 'e').length;
    //     console.log('EventList: event ' + event.content, {depth: event.tags.filter((tag: NDKTag) => tag[0] === 'e')})
    //     return eTags.length === depth ||
    //         (parentId && eTags.length === 1 && eTags[0] === parentId) ||
    //         (parentId && grandparentId && eTags.length === 2 && eTags.includes(parentId) && eTags.includes(grandparentId));
    // };

    const filteredEvents = useCallback(() => {
        console.log('EventList.tsx: filteredEvents', {notes});
        return (notes
            ?.filter(({kind}: NostrEvent) => kinds.includes(kind))
            ?.filter((event: NostrEvent) => eventsFilter(event, depth, parentId, grandparentId))
            .slice(0, limit) || [])
            .filter(({id}: NostrEvent) => !!id)
            .filter((event: NostrEvent) => !parentId || (parentId &&
                event.tags.findIndex((tag: NDKTag) => tag[0] === 'q' && tag[1] === parentId) === -1))
            // .map((nostrEvent: NostrEvent) => ({
            //     event: nostrEvent,
            //     nevent: nip19.neventEncode({
            //         id: nostrEvent.id as string,
            //         author: nostrEvent.pubkey,
            //         relays: ['wss://q.swarmstr.com']
            //     })
            // }));
    }, [notes, limit, sort, parentId]);

    // useEffect(() => {
        // if (hash === '') {
        //     window.scrollTo(0, 0);
        // }
        // else {
        //     setTimeout(() => {
        //         const id = hash.replace('#', '');
        //         const element = document.getElementById(id);
        //         if (element) {
        //             element.scrollIntoView();
        //         }
        //     });
        // }
    // }, [pathname, hash, key, locationStateEventsMemo]);

    // const eventListItemMemo = (nevent: string, event: NostrEvent) =>

    useEffect(() => {
        console.log('EventList: limit:', {limit})
        console.log('EventList: events:', {events, sort})
        setNotes(events);
    }, [events]);

    const noteThread = useMemo(() => (event: NostrEvent) => <NostrNoteThreadContextProvider
        nevent={nip19.neventEncode({id: event.id})}
        event={event}
    >
        <NoteThread
            // state={{events}}
            // expanded={expanded}
            showReplies={expanded}
            depth={depth+1}
        >
            {/*<NostrNoteContextProvider>*/}
                <Note floating={floating} /*state={{events, limit}}*//>
            {/*</NostrNoteContextProvider>*/}
        </NoteThread>
    </NostrNoteThreadContextProvider>, [depth, sort]);

    return <React.Fragment>
        {
            filteredEvents()
                .map((event: NostrEvent) => noteThread(event))
        }
    </React.Fragment>
};

export default EventList;