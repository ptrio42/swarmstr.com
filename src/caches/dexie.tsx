import {NDKCacheAdapter, NDKEvent, NDKFilter, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";
import {db} from "../db";
import {containsTag, valueFromTag} from "../utils/utils";
import {NOTE_TYPE, NoteEvent} from "../models/commons";

export default class DexieAdapter implements NDKCacheAdapter {
    public readonly locking = true;

    public async query(subscription: NDKSubscription): Promise<void> {
        if (subscription.filter?.kinds?.length === 1 && subscription.filter.kinds[0] === 0) {
            for (const pubkey of (subscription.filter?.authors || [])) {
                const event = await db.users
                    .where({ pubkey })
                    .first();
                if (!event) continue;

                const ndkEvent = new NDKEvent(undefined, event);
                subscription.eventReceived(ndkEvent, undefined, true);
            }
        }
        if (subscription.filter?.kinds?.length === 1 && subscription.filter.kinds[0] === 1) {
            for (const id of (subscription.filter?.ids || [])) {
                const event = await db.notes
                    .get({ id });
                if (!event) continue;

                const ndkEvent = new NDKEvent(undefined, event);
                subscription.eventReceived(ndkEvent, undefined, true);
            }
        }
    }

    public async setEvent(event: NDKEvent, filter: NDKFilter): Promise<void> {
        const nostrEvent = await event.toNostrEvent();
        // const nostrEvent = {
        //     ...event.rawEvent(),
        //     kind: event.kind,
        //     ...(filter?.ids?.length === 1 && { id: filter.ids[0] })
        // };
        // console.log(`got event kind ${event.kind}`, {event});
        if (event.kind === 0) {
            db.users.put(nostrEvent);
        }
        if (nostrEvent.kind === 1 || nostrEvent.kind === 30023) {
            const referencedEventId = valueFromTag(nostrEvent, 'e');
            const title = valueFromTag(nostrEvent, 'title');
            const noteEvent: NoteEvent = {
                ...nostrEvent,
                type: undefined,
                ...(!!referencedEventId && { referencedEventId }),
                ...(!!title && { title })
            }

            if (!referencedEventId) {
                noteEvent.type = NOTE_TYPE.QUESTION;
                // console.log(`classifed as question`);
            } else {
                if (!containsTag(noteEvent.tags, ['t', 'asknostr'])) {
                    noteEvent.type = NOTE_TYPE.ANSWER;
                    // console.log(`classifed as answer`);
                } else {
                    noteEvent.type = NOTE_TYPE.HINT;
                    // console.log(`classifed as hint`);
                }
            }
            db.notes.put(noteEvent)
                .then(() => {
                    // console.log(`added to db...`)
                });

        }
    }
}