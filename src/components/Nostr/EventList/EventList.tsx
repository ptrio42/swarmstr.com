import {NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {nip19} from "nostr-tools";
import {NoteThread} from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {Note} from "../Note/Note";
import React, {useEffect, useMemo} from "react";
import {useLocation} from "react-router-dom";
import {useNostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import Box from "@mui/material/Box";
import {NostrNoteThreadContextProvider} from "../../../providers/NostrNoteThreadContextProvider";
import {EventSkeleton} from "../EventSkeleton/EventSkeleton";
import {valueFromTag} from "../../../utils/utils";

interface EventListProps {
    floating?: boolean;
    depth?: number;
    parentId?: string;
    grandparentId?: string;
}

export const EventList = ({ floating = true, depth = -1, parentId, grandparentId }: EventListProps) => {

    const { pathname, hash, key } = useLocation();
    const { events, limit } = useNostrEventListContextProvider();

    const locationStateEventsMemo = useMemo(() => events, [!events, !limit]);

    const eventsFilter = (event: NostrEvent) => {
        if (depth === -1) return true;
        const eTags = event.tags.filter((tag: NDKTag) => tag[0] === 'e').map((tag: NDKTag) => tag[1]);
        // const length = event.tags.filter((tag: NDKTag) => tag[0] === 'e').length;
        console.log('EventList: event ' + event.content, {depth: event.tags.filter((tag: NDKTag) => tag[0] === 'e')})
        return eTags.length === depth ||
            (parentId && eTags.length === 1 && eTags[0] === parentId) ||
            (parentId && grandparentId && eTags.length === 2 && eTags.includes(parentId) && eTags.includes(grandparentId));
    };

    useEffect(() => {
        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            });
        }
    }, [pathname, hash, key, locationStateEventsMemo]);

    useEffect(() => {
        console.log('EventList: limit:', {limit})
        console.log('EventList: events:', {events})
    }, [limit, events]);

    return <React.Fragment>
        {
            (events
                ?.filter(eventsFilter)
                .slice(0, limit) || [])
                .filter(({id}: NostrEvent) => !!id)
                .map((nostrEvent: NostrEvent) => ({
                    event: nostrEvent,
                    nevent: nip19.neventEncode({
                        id: nostrEvent.id as string,
                        author: nostrEvent.pubkey,
                        relays: ['wss://q.swarmstr.com']
                    })
                }))
                .map(({event, nevent}) => (
                    <NostrNoteThreadContextProvider nevent={nevent}>
                        <NoteThread
                            key={`${nevent}-thread`}
                            nevent={nevent}
                            state={{events}}
                            expanded={false}
                            depth={depth+1}
                        >
                            <NostrNoteContextProvider>
                                <Note key={`${nevent}-content`} event={event} nevent={nevent} floating={floating} state={{events, limit}}/>
                            </NostrNoteContextProvider>
                        </NoteThread>
                    </NostrNoteThreadContextProvider>
                ))
        }
        {
            !events && <Box>
                <EventSkeleton visible={!events}/>
            </Box>
        }
    </React.Fragment>
};