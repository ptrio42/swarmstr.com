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
import axios from "axios";
import {Config, CLIENT_RELAYS} from "../resources/Config";
import { nip19 } from 'nostr-tools';
import {useNostrContext} from "./NostrContextProvider";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {containsTag, valueFromTag} from "../utils/utils";
import {NOTE_TYPE, NoteEvent} from "../models/commons";

const subs: NDKSubscription[] = [];

export const NostrFeedContextProvider = ({ children }: any) => {
    const [nevents, _setNevents] = useState<string[]>([]);
    const neventsRef = useRef<string[]>(nevents);
    const setNevents = (nevents: string[]) => {
        neventsRef.current = nevents;
        _setNevents(neventsRef.current);
    };

    // const { events } = useNostrContext();
    const [loading, setLoading] = useState<boolean>(false);

    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: [Config.SEARCH_RELAY] }));
    const [events, setEvents] = useState<NostrEvent[]>([]);
    const [query, setQuery] = useState<string>('');

    const fetchNevents = useCallback(() => {
        axios
            .get('../api/nevents')
            .then((response: { data: string[] }) => {
                setLoading(false);
                setNevents(response.data);
            })
            .catch((error) => {
                console.log('error fetching events...');
            });
    }, []);

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
        console.log(`events change ${events?.length}`)
    }, [events]);

    const onEvent = (event: NDKEvent) => {
        const nostrEvent = event.rawEvent();
        // console.log(`new event`, {event});
        // events.current.push(nostrEvent);
        setEvents((prevState: NostrEvent[]) => ([
            ...prevState,
            nostrEvent
        ]));
        // console.log({events})
    };

    const clearEvents = () => {
        console.log(`clearing events...`);
        subs.forEach((sub: NDKSubscription) => {
            sub.stop();
        });
        setEvents([]);
    };

    const memoValue = useMemo(() => ({ nevents, subscribe, loading, events, clearEvents, query, setQuery }), [events, query, loading]);

    const connectToRelays = useCallback(async () => {
        try {
            const connected = await ndk.current.connect(1500);
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

        // fetch nevents
        fetchNevents();

        return () => {
            // do something on unmount
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