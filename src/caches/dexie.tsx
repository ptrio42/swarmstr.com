import {NDKCacheAdapter, NDKEvent, NDKFilter, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";
import {db} from "../db";

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
        if (event.kind === 0) {
            db.users.put(nostrEvent);
        }
    }
}