import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import NDK, {NDKEvent, NDKFilter, NDKNip07Signer, NDKRelay, NDKRelaySet, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrFeedContext} from '../contexts/NostrFeedContext';
import axios from "axios";
import {DEFAULT_RELAYS} from "../resources/Config";
import { nip19 } from 'nostr-tools';
import {useNostrContext} from "./NostrContextProvider";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {containsTag, valueFromTag} from "../utils/utils";
import {NOTE_TYPE, NoteEvent} from "../models/commons";

const subs = [];

export const NostrFeedContextProvider = ({ children }: any) => {
    const [nevents, _setNevents] = useState<string[]>([]);
    const neventsRef = useRef<string[]>(nevents);
    const setNevents = (nevents: string[]) => {
        neventsRef.current = nevents;
        _setNevents(neventsRef.current);
    };

    const { ndk, events } = useNostrContext();
    const [loading, setLoading] = useState<boolean>(true);

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

    const subscribe = useCallback((filter: NDKFilter, relaySet?: NDKRelaySet) => {
        const sub = ndk.subscribe(filter, {closeOnEose: false, groupable: false}, relaySet);
        sub.on('event', onEvent);
        subs.push(sub);
    }, []);

    const onEvent = async (event: NDKEvent) => {
        await new Promise(async (resolve: any, reject: any) => {
            const nostrEvent = await event.toNostrEvent();
            const { tags } = nostrEvent;
            const referencedEventId = valueFromTag(nostrEvent, 'e');
            if (containsTag(tags, ['t', 'asknostr'])) {
                const noteEvent: NoteEvent = {
                    ...nostrEvent,
                    type: undefined,
                    ...(!!referencedEventId && { referencedEventId })
                };
                // if event contains referenced event tag, it serves at question hint
                // thus gotta fetch the referenced event
                if (tags.map((tag: NDKTag) => tag[0]).includes('e')) {
                    noteEvent.type = NOTE_TYPE.HINT;
                } else {
                    // event is a question
                    noteEvent.type = NOTE_TYPE.QUESTION;
                }
                await db.notes.put(noteEvent);
                resolve();
            }
        });
        // if (!events!
        //     .map((event: NostrEvent) => event.id)
        //     .includes(id)) {
        //     event.toNostrEvent()
        //         .then((nostrEvent: NostrEvent) => {
        //             console.log(`adding sub event to db ${event.id}`);
        //             db.events.add(nostrEvent);
        //         });
        //     // console.log('new event...', {event});
        //     const nevent = nip19.neventEncode({
        //         id,
        //         author: pubkey,
        //         relays: [relay]
        //     });
        // }
    };

    const memoValue = useMemo(() => ({ nevents, subscribe, loading, events }), [events, nevents, loading]);

    const connectToRelays = useCallback(async () => {
        try {
            const connected = await ndk.connect(1500);
            return connected;

        } catch (error) {
            console.error('cannot connect to relays')
        }
    }, []);

    useEffect(() => {
        connectToRelays().then(() => {
                console.log(`connected to relays`);
            })
            .catch((error) => {
                console.error('unable to connect', {error});
            });

        ndk.pool.on('relay:disconnect', async (data) => {
            // console.log('relay has disconnected', {data})
            console.log({data});
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
        }
    }, []);

    return (
        <NostrFeedContext.Provider value={memoValue}>
            {children}
        </NostrFeedContext.Provider>
    );
};

export const useNostrFeedContext = () => useContext(NostrFeedContext);