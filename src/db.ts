import Dexie, { Table } from 'dexie';
import {
    ContactListEvent,
    LabelEvent,
    ListEvent,
    NoteEvent,
    ReactionEvent,
    RepostEvent,
    UserEvent,
    ZapEvent
} from "./models/commons";

export class NostrStore extends Dexie {
    notes!: Table<NoteEvent>;
    // posts!: Table<PostEvent>;
    zaps!: Table<ZapEvent>;
    reactions!: Table<ReactionEvent>;
    users!: Table<UserEvent>;
    reposts!: Table<RepostEvent>;
    lists!: Table<ListEvent>;
    labels!: Table<LabelEvent>;
    contactLists!: Table<ContactListEvent>;

    constructor() {
        super('swarmstrDB');
        this.version(13).stores({
            notes: '++id, pubkey, title, content, type, referencedEventId, tags, created_at',
            // posts: '++id, pubkey, title, content, type, referencedEventId, tags',
            zaps: '++id, amount, zappedNote, zapper, zappee',
            reactions: '++id, reactedToEventId, content, pubkey',
            users: '++id, pubkey, content',
            reposts: '++id, pubkey, repostedEventId',
            lists: '++id, kind, tags, content, pubkey',
            labels: '++id, kind, tags, pubkey, created_at, referencedEventId',
            contactLists: '++id, kind, pubkey, created_at'
            // events: '++id, tags, pubkey, kind, content' // Primary key and indexed props
        });
    }
}

export const db = new NostrStore();

db.open().catch(function (err) {
    console.error (`db error`, err.stack || err);
});