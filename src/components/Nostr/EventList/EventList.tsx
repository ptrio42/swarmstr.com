import {NostrEvent} from "@nostr-dev-kit/ndk";
import {nip19} from "nostr-tools";
import {NoteThread} from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {Note} from "../Note/Note";
import React from "react";

interface EventListProps {
    events: NostrEvent[];
    floating?: boolean;
}

export const EventList = ({ events, floating = true }: EventListProps) => {
    return <React.Fragment>
        {
            (events || [])
                .filter(({id}) => !!id)
                .map((nostrEvent: NostrEvent) => ({
                    event: nostrEvent,
                    nevent: nip19.neventEncode({
                        id: nostrEvent.id,
                        author: nostrEvent.pubkey,
                        relays: ['wss://q.swarmstr.com']
                    })
                }))
                .map(({event, nevent}) => (
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
                ))
        }
    </React.Fragment>
};