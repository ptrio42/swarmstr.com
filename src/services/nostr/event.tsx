import {NDKEvent, NDKSubscription, NDKSubscriptionOptions, NDKTag} from "@nostr-dev-kit/ndk";
import {db} from "../../db";
import {NostrEvent} from "nostr-tools";
import {NOTE_TYPE, NoteEvent} from "../../models/commons";
import {valueFromTag} from "../../utils/utils";
import lightBolt11Decoder from "light-bolt11-decoder";
import {groupBy, forOwn} from "lodash";

const handleEventsByKind = (events: NostrEvent[], kind: number) => {
    console.log('handleEventsByKind', {events});
    switch (true) {
        case kind === 0:
            db.users.bulkPut(events);
            return;
        case kind === 1 || kind === 30023:
            const noteEvents: NoteEvent[] = events
                .map((event: NostrEvent) => {
                    const eTags = (event.tags && event.tags
                        .filter((tag: NDKTag) => tag[0] === 'e'))
                        .map((tag: NDKTag) => tag[1]);
                    return {
                        ...event,
                        type: NOTE_TYPE.Note,
                        ...(eTags.length > 0 && {
                            referencedEventId: eTags[0],
                            referencedEventsIds: eTags
                        })
                    }
                });

            db.notes.bulkPut(noteEvents);
            return;
        case kind === 3:
            db.contactLists.bulkPut(events);
            return;
        case kind === 7:
            // @ts-ignore
            db.reactions.bulkPut(events.map((event: NostrEvent) => ({
                ...event,
                // @ts-ignore
                reactedToEventId: valueFromTag(event, 'e')
            })));
            return;
        case kind === 6:
            // @ts-ignore
            db.reposts.bulkPut(events.map((event: NostrEvent) => ({
                ...event,
                // @ts-ignore
                repostedEventId: valueFromTag(event, 'e')
            })));
            return;
        case kind === 1985:
            db.labels.bulkPut(events.map((event: NostrEvent) => {
                const label = event.tags.find((t: NDKTag) => t[0] === 'l');
                return {
                    ...event,
                    // @ts-ignore
                    referencedEventId: valueFromTag(event, 'e'),
                    ...(label && label!.length > 1 && { labelName: label![1] })
                }
            }));
            return;
        case kind === 30000 || kind === 10000 || kind === 30001:
            db.lists.bulkPut(events);
            return;
        case kind === 9735:
            // @ts-ignore
            db.zaps.bulkPut(events.map((event: NostrEvent) => ({
                ...event,
                // @ts-ignore
                zappedNote: valueFromTag(event, 'e'),
                // @ts-ignore
                zapper: JSON.parse(valueFromTag(event, 'description'))?.pubkey,
                amount: lightBolt11Decoder.decode(valueFromTag(event, 'bolt11')).sections
                    .find((section: any) => section.name === 'amount').value
            })));
            return;
    }
};

export const handleNostrEvents = (event: NostrEvent | NostrEvent[]) => {
    //@ts-ignore
    const events: NostrEvent[] = [].concat(event);
    const grouped = groupBy(events, 'kind');
    forOwn(grouped, (events, kind) => {
        console.log('nostr:event service', { event, kind });
        handleEventsByKind(events, +kind);
    });
};

// export const filterEventsByKind = (events: NDKEvent, kind: number) => events.filter(({kind}) => kind === 1 || kind === 30023)

export const getEventById = (id: string) => {

}