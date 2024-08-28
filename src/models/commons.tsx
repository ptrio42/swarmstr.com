import {NostrEvent} from "nostr-tools";

export type NoteType = 'question' | 'answer' | 'question_quote' | 'note' | undefined;

export const NOTE_TYPE: { [key: string]: NoteType } = {
    QUESTION: 'question',
    ANSWER: 'answer',
    HINT: 'question_quote',
    NOTE: 'note'
};

export interface NoteEvent extends NostrEvent {
    type: NoteType;
    referencedEventId?: string;
    referencedEventsIds?: string[];
    replaceableEventId?: string;
    title?: string;
}

export interface ZapEvent extends NostrEvent {
    amount: number;
    zappedNote: string;
    zapper: string;
    zappee?: string;
}

export interface ReactionEvent extends NostrEvent {
    reactedToEventId: string;
}

export interface UserEvent extends NostrEvent {
}

export interface PostEvent extends NoteEvent {
    title: string;
}

export interface RepostEvent extends NostrEvent {
    repostedEventId: string;
}

export interface ListEvent extends NostrEvent {
}

export interface LabelEvent extends NostrEvent {
    referencedEventId?: string;
    labelName?: string;
}

export interface ContactListEvent extends NostrEvent {
}

export interface Interface {
    
}

