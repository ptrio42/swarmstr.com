import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import NDK, {NDKEvent, NDKNip07Signer, NDKRelay, NDKUser, NostrEvent} from "@nostr-dev-kit/ndk";
import {DEFAULT_RELAYS} from "../resources/Config";
import {NostrContext} from "../contexts/NostrContext";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import axios from "axios";
import {nip19} from "nostr-tools";

export const NostrContextProvider = ({ children }: any) => {
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: DEFAULT_RELAYS }));
    const [user, setUser] = useState<NDKUser>();

    const events = useLiveQuery(
        () => db.events.toArray()
    ) || [];

    const setEvents = useCallback((events: NostrEvent[]) => {
        db.events.bulkAdd(events)
            .then(() => {
                console.log('events added to db');
            });
    }, []);

    const fetchEvents = useCallback(() => {
        axios
            .get('../api/events')
            .then((response: { data: NostrEvent[] }) => {
                // setLoading(false);
                setEvents(response.data);
            })
            .catch((error) => {
                console.log('error fetching events...');
            });
    }, []);

    useEffect(() => {
        const signIn = async () => {
            try {
                ndk.current.signer = new NDKNip07Signer();
                const user: NDKUser = await ndk.current.signer!.user();
                if (user) {
                    setUser(user);
                }
                console.log(`logged in as ${user.npub}`, {user});
            } catch (error) {
                console.error('no browser extension available for signing in...');
            }

            fetchEvents();
        };

        setTimeout(() => {
            signIn();
        }, 500);
    }, []);

    return (
        <NostrContext.Provider value={{ ndk: ndk.current, user, events }}>
            {children}
        </NostrContext.Provider>
    );
};

export const useNostrContext = () => useContext(NostrContext);