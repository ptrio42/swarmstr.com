import {Config} from "../../resources/Config";
import NDK, {NDKFilter, NDKSubscriptionOptions, NDKEvent, NDKRelaySet, NDKSubscription, NDKSubscriptionCacheUsage} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";
import {handleNostrEvents} from "./event";

export const DEFAULT_USER_RELAYS = { readRelays: Config.CLIENT_READ_RELAYS, writeRelays: Config.CLIENT_WRITE_RELAYS };

const filterEvents = (events: NostrEvent[], excludedEventIds: string[]) => events
    .filter(({id}) => !excludedEventIds.includes(id));

export const subscribe = (
    ndk: NDK,
    filter: NDKFilter,
    opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
    onEose?: () => void,
    onEvent?: (event: NDKEvent) => void,
    relayUrls?: string[],
    excludedEventsIds?: string[]
) => {
    const notesReadRelays: NDKRelaySet = NDKRelaySet.fromRelayUrls(relayUrls || DEFAULT_USER_RELAYS.readRelays, ndk);
    const events: NDKEvent[] = [];
    const sub: NDKSubscription = ndk
        .subscribe(filter, {...opts, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST}, notesReadRelays);

    sub
        .on('event', (event: NDKEvent) => {

            // console.log(`handling: excluded events: ${excludedEventsIds?.join(',')}`);

            if (!opts.closeOnEose) {
                // if (!excludedEventsIds || excludedEventsIds.length === 0 || !excludedEventsIds.includes(event.id)) {
                    // handleNDKEvent(event, filter);
                    onEvent && onEvent(event);
                // } else {
                //     console.log(`event ${event.id} excluded from handling...`);
                // }
            } else {
                events.push(event);
                console.log('nostr:relays service', {events});
            }
        })
        .on('eose', () => {
            console.log('NostrContextPRovider: received eose');

            onEose && onEose();

                console.log('nostr:relays service eose', {events});
            if (opts.closeOnEose) {
                // handleNostrEvents(events.map((event: NDKEvent) => event.rawEvent() as NostrEvent));
                // sub.stop();
            }
        })
        .on('closed', () => {
            console.log('nostr:relays service closed', {events});
        })
        .start();
    return sub.internalId;
};

export const getEventsAsPromise = (ndk: NDK, filter: NDKFilter, relayUrls?: string[]) => {
    console.log(`getEventsAsPromise filter kinds ${filter.kinds}: ${JSON.stringify(filter)}`, {ndk})
    return new Promise((resolve: (events: NostrEvent[]) => void, reject: any) => {
        const relays: NDKRelaySet = NDKRelaySet.fromRelayUrls(relayUrls || DEFAULT_USER_RELAYS.readRelays, ndk);
        const events: NostrEvent[] = [];
        const sub: NDKSubscription = ndk
            .subscribe(filter, { closeOnEose: true, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST}, relays);

        console.log('getEventsAsPromise', {sub})

        sub
            .on('event', (event: NDKEvent) => {
                console.log(`getEventsAsPromise event ${event.id}`)
                events.push(event.rawEvent() as NostrEvent);
            })
            .on('eose', () => {
                console.log('getEventsAsPromise eose:', {events})
                resolve(events);
                // sub.stop();
            })
            .on('close', () => {
                console.log(`getEventsAsPromise filter kinds ${filter.kinds} close:`, {events})
            })
            .start();
    })
};
