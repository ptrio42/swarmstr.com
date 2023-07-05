import Dexie, { Table } from 'dexie';
import {NDKEvent, NostrEvent} from "@nostr-dev-kit/ndk";

export class NostrStore extends Dexie {
    events!: Table<NostrEvent>;

    constructor() {
        super('eventsDB');
        this.version(5).stores({
            events: '++id, tags, pubkey, kind, content' // Primary key and indexed props
        });
    }
}

export const db = new NostrStore();

db.open().catch(function (err) {
    console.error (`db error`, err.stack || err);
});