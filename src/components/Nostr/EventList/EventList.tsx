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

interface EventListProps {
    floating?: boolean;
}

export const EventList = ({ floating = true }: EventListProps) => {

    const { pathname, hash, key } = useLocation();
    const { events, limit } = useNostrEventListContextProvider();

    const locationStateEventsMemo = useMemo(() => events, [!events, !limit]);

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

    return <React.Fragment>
        {
            (events?.slice(0, limit) || [])
                .filter(({id}: NostrEvent) => !!id)
                .map((nostrEvent: NostrEvent) => ({
                    event: nostrEvent,
                    nevent: nip19.neventEncode({
                        id: nostrEvent.id,
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
                        >
                            <NostrNoteContextProvider>
                                <Note key={`${nevent}-content`} event={event} nevent={nevent} floating={floating} state={{events}}/>
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