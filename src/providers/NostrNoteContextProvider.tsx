import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContext} from "../contexts/NostrNoteContext";
import {useNostrFeedContext} from "./NostrFeedContextProvider";
import {useNostrNoteThreadContext} from "./NostrNoteThreadContextProvider";
import {useNostrContext} from "./NostrContextProvider";
import {requestProvider, WebLNProvider} from "webln";
import {db} from "../db";

interface NostrNoteContextProviderProps {
    children: any;
    thread?: boolean;
}

export const NostrNoteContextProvider = ({ children, thread }: NostrNoteContextProviderProps) => {
    // const [events, _setEvents] = useState<NostrEvent[]>([]);
    // const eventsRef = useRef<NostrEvent[]>(events);
    // const setEvents = (events: NostrEvent[]) => {
    //     eventsRef.current = events;
    //     _setEvents(eventsRef.current);
    // };

    const subs = useRef<NDKSubscription[]>([]);

    const { ndk, events } = useNostrContext();

    const connectToRelays = useCallback(async () => {
        try {
            const connected = await ndk.connect(1500);
            return connected;

        } catch (error) {
            console.error('cannot connect to relays')
        }
    }, []);

    useEffect(() => {
        ndk.pool.on('relay:disconnect', async (data) => {
            // console.log('relay has disconnected', {data})
            setTimeout(async () => {
                const reconnected = await connectToRelays();
            }, 5000)
        });
    }, []);

    const subscribe = useCallback((filter: NDKFilter, relaySet?: NDKRelaySet) => {
        // if (relaySet) {
        //     console.log(filter.ids, relaySet);
        // }
        const sub = ndk.subscribe(filter, {closeOnEose: false, groupableDelay: 3000}, relaySet);
        sub.on('event', async (event: NDKEvent) => {
            // const exists = await db.events.get({ id: event.id });
            // if (!exists) {
                // console.log({event});
                try {
                    const nostrEvent = await event.toNostrEvent();
                    // console.log({nostrEvent});
                    // const newEvent = { ...nostrEvent, id: (filter.ids && filter.ids[0]) || event.id };
                    const added = await db.events.put(nostrEvent);
                    // console.log(`new event added`, {added});
                    // setEvents([
                    //     ...eventsRef.current,
                    //     newEvent
                    // ]);
                } catch (error) {

                }
            // }

        });
        subs.current.push(sub);
    }, []);

    const addReaction = useCallback((id: string, content: string) => {
        const event = new NDKEvent(ndk);
        event.kind = 7;
        event.content = content;
        event.tags = [
            ['e', id]
        ];
        ndk.assertSigner()
            .then(() => {
                console.log('reaction', {event})
                event.sign(ndk.signer!)
                    .then(() => {
                        ndk.publish(event)
                            .then(() => {
                                console.log('reaction added!');
                            })
                    })
                    .catch((e) => {})
            })
            .catch((e) => {})
    }, []);

    const zap = useCallback((nostrEvent: NostrEvent, amount: number, callback?: () => void) => {
        const event = new NDKEvent(ndk, nostrEvent);

        ndk.assertSigner()
            .then(() => {
                event.zap(amount * 1000)
                    .then((paymentRequest: string|null) => {
                        console.log('zap request...', {paymentRequest});
                        if (!paymentRequest) {
                            return;
                        }

                        requestProvider()
                            .then((webln: WebLNProvider) => {
                                webln.sendPayment(paymentRequest)
                                    .then(() => {
                                        console.log('zapped');
                                        callback && callback();
                                    })
                                    .catch((error) => {
                                        console.error(`unable to zap`)
                                    })
                            })
                            .catch((error) => {
                                console.error(`unable to request ln provider`)
                            })
                    })
                    .catch((error) => {
                        console.error(`problem getting zap request`)
                    })
                // event.sign(ndk.signer!)
                //     .then(() => {
                //         ndk.publish(event)
                //             .then(() => {
                //                 console.log('reaction added!');
                //             })
                //     })
                //     .catch((e) => {})
            })
            .catch((error) => {
                console.error('unable to assert signer...')
            })
    }, []);

    return (
        <NostrNoteContext.Provider value={{ subscribe, addReaction, zap, subs: subs.current }}>
            {children}
        </NostrNoteContext.Provider>
    );
};

export const useNostrNoteContext = () => useContext(NostrNoteContext);