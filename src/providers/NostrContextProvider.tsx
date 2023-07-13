import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import NDK, {
    NDKEvent,
    NDKFilter,
    NDKNip07Signer,
    NDKRelay,
    NDKRelaySet,
    NDKSubscription, NDKTag,
    NDKUser,
    NostrEvent
} from "@nostr-dev-kit/ndk";
import {DEFAULT_RELAYS} from "../resources/Config";
import {NostrContext} from "../contexts/NostrContext";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import axios from "axios";
import {nip19} from "nostr-tools";
import {intersection, difference} from 'lodash';
import {getRelayInformationDocument} from "../services/nostr";
import DexieAdapter from "../caches/dexie";

const cacheAdapter = new DexieAdapter();

export const NostrContextProvider = ({ children }: any) => {
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: DEFAULT_RELAYS, cacheAdapter }));
    
    const [user, setUser] = useState<NDKUser>();
    const [eventsFetched, addEventsFetched] = useState<boolean>(false);

    const subs = useRef<NDKSubscription[]>([]);

    const events = useLiveQuery(
        () => db.events.toArray()
    );

    // buld add events to indexedDB
    const addEvents = useCallback((events: NostrEvent[]) => {
        db.events.bulkAdd(events)
            .then(() => {
                // console.log('events added to db');
            });
    }, []);

    const signIn = useCallback(async () => {
        if (user) {
            return user!.hexpubkey();
        }
        try {
            ndk.current.signer = new NDKNip07Signer();
            await ndk.current.assertSigner();

            const signedInUser: NDKUser = await ndk.current.signer!.user();
            if (signedInUser) {
                !user && setUser(signedInUser);
                signedInUser.ndk = ndk.current;
                const profile = await signedInUser.fetchProfile();
                console.log(`logged in as ${signedInUser.npub}`, {signedInUser});
                console.log({profile});
                const event: NDKEvent|null = await ndk.current
                    .fetchEvent({ kinds: [3], authors: [signedInUser.hexpubkey()] }, { skipCache: true });
                if (event) {
                    const nostrEvent = await event.toNostrEvent();
                    try {
                        const relayUrls = Object.keys(JSON.parse(nostrEvent.content));
                        // console.log({relayUrls});
                        // ndk.current = new NDK({ explicitRelayUrls: relayUrls })
                        // ndk.current.pool.relays =
                        // await ndk.current.connect();
                    } catch (error) {
                        console.error(`unable to parse relay list`);
                    }
                }
                return signedInUser.hexpubkey();
            }
        } catch (error) {
            console.error('no browser extension available for signing in...', {error});
        }

    }, []);

    const onEvent = async (event: NDKEvent) => {
        const exists = await db.events.get({ id: event.id });
        if (!exists) {
            try {
                const nostrEvent = await event.toNostrEvent();
                const added = await db.events.add(nostrEvent);
                // console.log(`new event added`, {added});
            } catch (error) {
                console.error(`error adding new event`)
            }
        }

    }

    const subscribe = useCallback((filter: NDKFilter) => {
        const sub = ndk.current.subscribe(filter, {closeOnEose: false, groupableDelay: 3000});
        sub.on('event', onEvent);
        subs.current.push(sub);
    }, []);

    const subscribeToRelaySet = useCallback((filter: NDKFilter, relayUrls: string[]) => {
        const localNdk = new NDK({ explicitRelayUrls: relayUrls });
        const relaySet = NDKRelaySet.fromRelayUrls(relayUrls, localNdk);
        const sub = localNdk.subscribe(filter, { closeOnEose: true, groupableDelay: 1500 });
        sub.on('event', async (event: NDKEvent) => {
            await onEvent(event);
            console.log('search result', {event});
        });
        localNdk
            .connect()
            .then(() => {
                sub.start()
                    .then(() => {
                        console.log(`relaySet sub started...`);
                    });
            });
    }, []);

    const post = useCallback(async (content: string, tags: NDKTag[]) => {
        try {
            const pubkey = await signIn();
            const event = new NDKEvent(ndk.current);
            event.kind = 1;
            event.content = content;
            event.tags = tags;
            event.pubkey = pubkey!;
            // event.created_at = Date.now();
            console.log(`signing & publishing new event`, {event})
            // ndk.current.assertSigner()
            //     .then(() => {
            // event.sign(ndk.current.signer!)
            //     .then(() => {
            try {
                return await event.publish();
                console.log('question published!');
                // return new Promise.resolve();
            } catch (error) {

            }
        } catch (error) {

        }
    }, []);

    const fetchRelaysInformation = async () => {
        return await Promise.all(DEFAULT_RELAYS.map(async (url): Promise<any> => {
            const relayInformationDocument = await getRelayInformationDocument(url.replace(/wss/, 'https'));
            // console.log({relayInformationDocument});
            return relayInformationDocument;
        }));
    }

    useEffect(() => {
        if (events && !eventsFetched) {
            axios
                .get('../api/events')
                .then((response: { data: NostrEvent[] }) => {
                    const eventsToAdd = difference(intersection(events, response.data), events);
                    addEvents(eventsToAdd);
                    addEventsFetched(true);
                })
                .catch((error) => {
                    console.log('error fetching events...');
                });
        }


    }, [events]);

    useEffect(() => {

        fetchRelaysInformation()
            .then(() => {
                console.log('information fetched')
            });

        signIn()
            .then(() => {
                console.log('sign in');
            })
    }, []);

    return (
        <NostrContext.Provider value={{ ndk: ndk.current, user, events, subscribe, subscribeToRelaySet, signIn, post }}>
            {children}
        </NostrContext.Provider>
    );
};

export const useNostrContext = () => useContext(NostrContext);