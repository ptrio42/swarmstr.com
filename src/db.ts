import Dexie, { Table } from 'dexie';
import {NDKEvent, NostrEvent} from "@nostr-dev-kit/ndk";
import {NoteEvent, ReactionEvent, UserEvent, ZapEvent} from "./models/commons";

export class NostrStore extends Dexie {
    notes!: Table<NoteEvent>;
    zaps!: Table<ZapEvent>;
    reactions!: Table<ReactionEvent>;
    users!: Table<UserEvent>;

    constructor() {
        super('swarmstrDB');
        this.version(1).stores({
            notes: '++id, pubkey, content, type, referencedEventId, tags',
            zaps: '++id, amount, zappedNote, zapper, zappee',
            reactions: '++id, reactedToEventId, content',
            users: '++id, pubkey, content',
            // events: '++id, tags, pubkey, kind, content' // Primary key and indexed props
        });
    }
}

export const db = new NostrStore();

db.open().catch(function (err) {
    console.error (`db error`, err.stack || err);
});