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

export const NostrContextProvider = ({ children }: any) => {
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: DEFAULT_RELAYS }));
    const [user, setUser] = useState<NDKUser>();
    const [eventsFetched, setEventsFetched] = useState<boolean>(false);

    const subs = useRef<NDKSubscription[]>([]);

    const events = useLiveQuery(
        () => db.events.toArray()
    );

    const setEvents = useCallback((events: NostrEvent[]) => {
        db.events.bulkAdd(events)
            .then(() => {
                console.log('events added to db');
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
                return signedInUser.hexpubkey();
            }
        } catch (error) {
            console.error('no browser extension available for signing in...', {error});
        }

    }, []);

    const subscribe = useCallback((filter: NDKFilter) => {
        const sub = ndk.current.subscribe(filter, {closeOnEose: false, groupableDelay: 3000});
        sub.on('event', async (event: NDKEvent) => {
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

        });
        subs.current.push(sub);
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
        //     console.log({event})
        //
        //         .then(() => {
        //
        //         })
        //         .catch((e) => console.error(`error publishing`, {e}))
        // } catch (err) {
        //
        // }
                            // })
                            // .catch((e) => console.error(`error signing`, {e}))

            //         .catch((e) => console.error(`error assigning signer`, {e}))
            // });


    }, []);

    useEffect(() => {
        if (events && !eventsFetched) {
            axios
                .get('../api/events')
                .then((response: { data: NostrEvent[] }) => {
                    const eventsToAdd = difference(intersection(events, response.data), events);
                    setEvents(eventsToAdd);
                    setEventsFetched(true);
                })
                .catch((error) => {
                    console.log('error fetching events...');
                });
        }
    }, [events]);

    useEffect(() => {

        signIn()
            .then(() => {
                console.log('sign in');
            })
    }, []);

    return (
        <NostrContext.Provider value={{ ndk: ndk.current, user, events, subscribe, signIn, post }}>
            {children}
        </NostrContext.Provider>
    );
};

export const useNostrContext = () => useContext(NostrContext);