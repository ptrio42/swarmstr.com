import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelay, NDKRelaySet, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";
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
    const { ndk, setNdk } = useNostrContext();
    const { nevent } = useParams();

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const subscribe = useCallback((filter: NDKFilter, relaySet?: NDKRelaySet) => {
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
        // setNdk(CLIENT_RELAYS);

        return () => {
            console.log('stop all subs...');
            ndk.pool.relays
                .forEach((relay: NDKRelay) => relay
                    .activeSubscriptions
                    .forEach((subscription: NDKSubscription) => subscription.stop()));
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