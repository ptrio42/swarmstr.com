import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelaySet, NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrFeedContext} from "./NostrFeedContextProvider";
import {NostrNoteThreadContext} from "../contexts/NostrNoteThreadContext";
import NDK from "@nostr-dev-kit/ndk";
import {CLIENT_RELAYS} from "../resources/Config";
import {useParams} from "react-router";
import {useNostrContext} from "./NostrContextProvider";
import {Backdrop} from "../components/Backdrop/Backdrop";

const subs = [];

export const NostrNoteThreadContextProvider = ({children}: any) => {
    const [events, _setEvents] = useState<NostrEvent[]>([]);
    const eventsRef = useRef<NostrEvent[]>(events);
    const setEvents = (events: NostrEvent[]) => {
        eventsRef.current = events;
        _setEvents(eventsRef.current);
    };
    const { ndk } = useNostrContext();
    const { nevent } = useParams();

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const subscribe = useCallback((filter: NDKFilter, relaySet?: NDKRelaySet) => {
        // if (relaySet) {
        //     console.log(filter.ids, relaySet);
        // }
        const sub = ndk.subscribe(filter, {closeOnEose: false, groupableDelay: 1000}, relaySet);
        sub.on('event', async (event: NDKEvent) => {
            // console.log({event});
            try {
                const nostrEvent = await event.toNostrEvent();
                // console.log({nostrEvent});
                const newEvent = { ...nostrEvent, id: event.id };
                setEvents([
                    ...eventsRef.current,
                    newEvent
                ]);
            } catch (error) {

            }
        });
        subs.push(sub);
    }, []);

    useEffect(() => {
        setShowPreloader(false);
        ndk.connect()
            .then(() => {
                console.log(`connected to relays`);
            })
            .catch((error) => {
                console.error('unable to connect', {error});
            });

        ndk.pool.on('relay:disconnect', async (data) => {
            // console.log('relay has disconnected', {data})
        });

        return () => {
            // do something on unmount
        }
    }, []);

    return (
        <NostrNoteThreadContext.Provider value={{ events, subscribe, nevent: nevent || '' }}>
            {children}
            <Backdrop open={showPreloader} />
        </NostrNoteThreadContext.Provider>
    );
};

export const useNostrNoteThreadContext = () => useContext(NostrNoteThreadContext);