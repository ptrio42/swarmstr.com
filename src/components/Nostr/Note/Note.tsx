import React, {useEffect, useRef, useState} from "react";
import {nip19} from 'nostr-tools';
import './Note.css';
import {useLocation} from "react-router-dom";
import {NDKFilter, NDKRelaySet, NDKSubscription, NostrEvent, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import {uniqBy} from 'lodash';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {Config} from "../../../resources/Config";
import {useParams} from "react-router-dom";
import {NoteActions} from "../NoteActions/NoteActions";
import {NoteContent} from "../NoteContent/NoteContent";
import {NoteScoreBox} from "../NoteScoreBox/NoteScoreBox";
import {NoteWrapper} from "../NoteWrapper/NoteWrapper";
import {NoteTags} from "../NoteTags/NoteTags";
import {decodeEventPointer} from "../../../providers/NostrNoteThreadContextProvider";

interface NoteProps {
    pinned?: boolean;
    isRead?: boolean;
    nevent: string;
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

export const Note = ({ nevent, context, pinned, isRead, expanded, floating, children, ...props }: NoteProps
) => {
        // @ts-ignore
    const { id } = decodeEventPointer(nevent);
    const { searchString } = useParams();
    const location = useLocation();

    const [event, loaded] = useLiveQuery(async () => {
        const event = await db.notes.get({ id });
        return [event || props?.event, true];
    }, [id], [props?.event || (!!id && location?.state?.event?.id === id && location?.state?.event), false]);

    return <NoteWrapper id={id} event={event} loaded={loaded}>
        <NoteScoreBox id={id} event={event}/>
        <NoteContent
            nevent={nevent}
            event={event}
            expanded={expanded}
            floating={floating}
            searchString={searchString}
            props={props}
        />
        <NoteTags styles={{ paddingLeft: '50px', display: 'block' }} tags={uniqBy(event?.tags?.filter((t: string[]) => Config.NOSTR_TAGS.includes(t[1])).map((t: string[]) => [t[0], t[1].toLowerCase()]), (t: string[]) => t[1])}/>
        <NoteActions
            nevent={nevent}
            event={event}
        />
    </NoteWrapper>;
};
