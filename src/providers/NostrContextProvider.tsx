import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import NDK, {NDKEvent, NDKNip07Signer, NDKRelay, NDKUser, NostrEvent} from "@nostr-dev-kit/ndk";
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

    const events = useLiveQuery(
        () => db.events.toArray()
    );

    const setEvents = useCallback((events: NostrEvent[]) => {
        db.events.bulkAdd(events)
            .then(() => {
                console.log('events added to db');
            });
    }, []);

    useEffect(() => {
        if (events && !eventsFetched) {
            axios
                .get('../api/events')
                .then((response: { data: NostrEvent[] }) => {
                    // setLoading(false);
                    // const eventsToAdd: NostrEvent[] = response.data.filter((nostrEvent: NostrEvent) => events?.findIndex(({ id }) => ))
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
        const signIn = async () => {
            try {
                ndk.current.signer = new NDKNip07Signer();
                const user: NDKUser = await ndk.current.signer!.user();
                if (user) {
                    setUser(user);
                    user.ndk = ndk.current;
                    const profile = await user.fetchProfile();
                    // console.log({profile});
                }
                console.log(`logged in as ${user.npub}`, {user});
            } catch (error) {
                console.error('no browser extension available for signing in...', {error});
            }

        };

        signIn()
            .then(() => {
                console.log('sign in');
            })
    }, []);

    return (
        <NostrContext.Provider value={{ ndk: ndk.current, user, events }}>
            {children}
        </NostrContext.Provider>
    );
};

export const useNostrContext = () => useContext(NostrContext);