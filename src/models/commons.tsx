import {NostrEvent} from "@nostr-dev-kit/ndk";

type NoteType = 'question' | 'answer' | 'question_quote' | undefined;

export const NOTE_TYPE: { [key: string]: NoteType } = {
    QUESTION: 'question',
    ANSWER: 'answer',
    HINT: 'question_quote'
};

export interface NoteEvent extends NostrEvent {
    type: NoteType;
    referencedEventId?: string;
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

