import React, {memo} from "react";
import {NDKFilter, NDKRelaySet, NDKSubscription, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import {nip19, NostrEvent} from 'nostr-tools';
import {useParams} from "react-router-dom";

import './Note.css';
import NoteActions from "../NoteActions/NoteActions";
import NoteContent from "../NoteContent/NoteContent";
import NoteWrapper from "../NoteWrapper/NoteWrapper";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";

interface NoteProps {
    pinned?: boolean;
    isRead?: boolean;
    nevent?: string;
    context?: 'feed' | 'thread';
    expanded?: boolean;
    event?: NostrEvent
    floating?: boolean;
    state?: {
        events?: NostrEvent[],
        limit?: number
    };
    children?: any;
}

const Note = ({ nevent, context, pinned, isRead, expanded, floating = false, children, ...props }: NoteProps
) => {
    const { event } = useNostrNoteThreadContext();
    const { searchString } = useParams();
    // const location = useLocation();

    // const [event, loaded] = useLiveQuery(async () => {
    //     const res = !(pubkey && kind === 30023) ? await db.notes.get({ id }) : await db.notes.where({ replaceableEventId: id }).toArray();
    //     return [Array.isArray(res) ? res[0] : res || props?.event, true];
    // }, [id], [props?.event || (!!id && location?.state?.event?.id === id && location?.state?.event), false]);
    //
    // const eventMemo = useMemo(() => event, [loaded]);

    if (!event) return;

    return <NoteWrapper id={event?.id} pubkey={event?.pubkey} kind={event?.kind}>
        {/*<NoteScoreBox id={id} event={eventMemo}/>*/}
        <NoteContent
            // nevent={nevent}
            event={event}
            expanded={expanded}
            floating={floating}
            searchString={searchString}
            props={props}
        />
        {/*<NoteTags styles={{ paddingLeft: '50px', display: 'block' }} tags={uniqBy(event?.tags?.filter((t: string[]) => Config.NOSTR_TAGS.includes(t[1])).map((t: string[]) => [t[0], t[1].toLowerCase()]), (t: string[]) => t[1])}/>*/}
        {
            [1, 30023].includes(event.kind) && <NoteActions
                event={event}
            />
        }
    </NoteWrapper>;
};

export default memo(Note);
