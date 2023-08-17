import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import NDK, {
    NDKEvent,
    NDKFilter,
    NDKNip07Signer,
    NDKRelay,
    NDKRelaySet, NDKSubscription,
    NDKSubscriptionOptions,
    NDKTag,
    NostrEvent
} from "@nostr-dev-kit/ndk";
import {NostrFeedContext} from '../contexts/NostrFeedContext';
import {Config, CLIENT_RELAYS} from "../resources/Config";
import { nip19 } from 'nostr-tools';
import {db} from "../db";
import {NOTE_TYPE, NoteEvent} from "../models/commons";
import {sortBy} from 'lodash';

const subs: NDKSubscription[] = [];

export const NostrFeedContextProvider = ({ children }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY] }));
    const [events, setEvents] = useState<NostrEvent[]>([]);
    const [query, setQuery] = useState<string>('');

    const subscribe = useCallback((
        filter: NDKFilter,
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false}
    ) => {
        const sub = ndk.current.subscribe(filter, opts);
        sub.on('event', onEvent);
        sub.on('eose', () => {
            console.log('eose received');
            setLoading(false);
        });
        subs.push(sub);
    }, []);

    useEffect(() => {
        setLoading(true);
    }, [events]);

    const startSubs = useCallback((filter: NDKFilter, _events?: NostrEvent[]) => {
        const activeSubs = ndk.current.pool.relays.entries().next().value?.activeSubscriptions?.size() || 0;
        console.log({activeSubs, relay: ndk.current.pool.relays.entries().next().value})
        if (activeSubs === 0) {
            const { created_at } = _events && _events.length > 0 && sortBy(_events, 'created_at')?.[0] || { created_at: null };
            console.log({created_at}, {_events});
            subscribe({
                ...filter,
                ...(!!created_at && { until: created_at })
            });
        }
    }, []);

    const stopSubs = useCallback(() => {
        subs.forEach((sub: NDKSubscription) => {
            sub.stop();
        });
    }, []);

    const onEvent = (event: NDKEvent) => {
        const nostrEvent = event.rawEvent();
        // simple feed filtering based on specific text
        if (!nostrEvent.content.includes('nsfw') &&
            !nostrEvent.content.includes('Just deployed https://swarmstr.com build') &&
            !nostrEvent.content.includes('beta.uselessshit.co') &&
            !nostrEvent.content.includes('dev.uselessshit.co') &&
            !nostrEvent.content.includes('Let me introduce my good friend') &&
            !nostrEvent.content.includes('and unlock exciting privileges within the community') &&
            !nostrEvent.content.includes('Swarmstr is a simple Q&A #nostr client') &&
            !nostrEvent.content.includes('Swarmstr is a free and open source Q&A') &&
            !nostrEvent.content.includes('Swarmstr is a simple Q&A web-client') &&
            nostrEvent.id !== 'c923482fe63f362677b3d9ba3e9006e3feb4bff8fc73421793c36c56fc3178be' &&
            nostrEvent.id !== 'fdd786beca7debac7026aa6686077fae10d93888d6fb56220c8cacfdb46b9295' &&
            !nostrEvent.content.includes('an early release so expect some bugs')) {
            db.notes.put({
                ...nostrEvent,
                type: NOTE_TYPE.QUESTION
            });
            setEvents((prevState: NostrEvent[]) => ([
                ...prevState,
                nostrEvent
            ]));
        }
    };

    const clearEvents = () => {
        console.log(`clearing events...`);
        stopSubs();
        console.log(`stopped ${subs.length} subs...`);
        setEvents([]);
    };

    const memoValue = useMemo(() => ({ subscribe, loading, events, clearEvents, query, setQuery, startSubs, stopSubs }), [events, query, loading]);

    const connectToRelays = useCallback(async () => {
        try {
            ndk.current.pool.relays
                .forEach((relay: NDKRelay) => relay
                    .activeSubscriptions
                    .forEach((subscription: NDKSubscription) => subscription.stop()));

            const connected = await ndk.current.connect(5000);
            return connected;

        } catch (error) {
            console.error('cannot connect to relays')
        }
    }, []);

    useEffect(() => {
        connectToRelays().then(() => {
                console.log(`Connected to search relay...`);
            })
            .catch((error) => {
                console.error('unable to connect', {error});
            });

        ndk.current.pool.on('relay:disconnect', async (data) => {
            try {
                const reconnected = await connectToRelays();
                console.log(`reconnected`, {reconnected})
            } catch (error) {
                console.error(`reconnect error`);
            }
        });

        return () => {
            clearEvents();
        }
    }, []);

    return (
        <NostrFeedContext.Provider value={memoValue}>
            {children}
        </NostrFeedContext.Provider>
    );
};

export const useNostrFeedContext = () => useContext(NostrFeedContext);