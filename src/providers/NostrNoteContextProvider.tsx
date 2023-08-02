import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscription, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContext} from "../contexts/NostrNoteContext";
import {useNostrFeedContext} from "./NostrFeedContextProvider";
import {useNostrNoteThreadContext} from "./NostrNoteThreadContextProvider";
import {useNostrContext} from "./NostrContextProvider";
import {requestProvider, WebLNProvider} from "webln";
import {db} from "../db";
import {containsTag, valueFromTag} from "../utils/utils";
import {NOTE_TYPE, NoteEvent} from "../models/commons";
import {nip19} from "nostr-tools";
import lightBolt11Decoder from 'light-bolt11-decoder';

interface NostrNoteContextProviderProps {
    children: any;
    thread?: boolean;
}

export const NostrNoteContextProvider = ({ children, thread }: NostrNoteContextProviderProps) => {
    const subs = useRef<NDKSubscription[]>([]);

    const { ndk } = useNostrContext();

    const connectToRelays = useCallback(async () => {
        try {
            const connected = await ndk.connect(1500);
            return connected;

        } catch (error) {
            console.error('cannot connect to relays')
        }
    }, []);

    useEffect(() => {
        // ndk.pool.on('relay:disconnect', async (data) => {
        //     // console.log('relay has disconnected', {data})
        //     setTimeout(async () => {
        //         const reconnected = await connectToRelays();
        //     }, 5000)
        // });
    }, []);

    const subscribe = useCallback((filter: NDKFilter, relaySet?: NDKRelaySet) => {
        const sub = ndk.subscribe(filter, {closeOnEose: false, groupable: true, groupableDelay: 3000}, relaySet);
        sub.on('event',  (event: NDKEvent) => {
            // const exists = await db.events.get({ id: event.id });
            // if (!exists) {
                // console.log({event});
                try {
                    const nostrEvent = {
                        ...event.rawEvent(),
                        kind: event.kind,
                        ...(filter?.ids?.length === 1 && { id: filter.ids[0] })
                    };
                    // console.log(`received event`, {nostrEvent}, {event});
                    // handle note
                    // if (nostrEvent.kind === 1 || nostrEvent.kind === 30023) {
                    //     const referencedEventId = valueFromTag(nostrEvent, 'e');
                    //     const title = valueFromTag(nostrEvent, 'title');
                    //     const noteEvent: NoteEvent = {
                    //         ...nostrEvent,
                    //         type: undefined,
                    //         ...(!!referencedEventId && { referencedEventId }),
                    //         ...(!!title && { title })
                    //     }
                    //
                    //     if (!referencedEventId) {
                    //         noteEvent.type = NOTE_TYPE.QUESTION;
                    //         // console.log(`classifed as question`);
                    //     } else {
                    //         if (!containsTag(noteEvent.tags, ['t', 'asknostr'])) {
                    //             noteEvent.type = NOTE_TYPE.ANSWER;
                    //             // console.log(`classifed as answer`);
                    //         } else {
                    //             noteEvent.type = NOTE_TYPE.HINT;
                    //             // console.log(`classifed as hint`);
                    //         }
                    //     }
                    //     db.notes.put(noteEvent)
                    //         .then(() => {
                    //             // console.log(`added to db...`)
                    //         });
                    //
                    // }
                    // handle reaction
                    if (nostrEvent.kind === 7) {
                        db.reactions.put({
                            ...nostrEvent,
                            // @ts-ignore
                            reactedToEventId: valueFromTag(nostrEvent, 'e')
                        });
                    }

                    // handle repost
                    if (nostrEvent.kind === 6) {
                        db.reposts.put({
                            ...nostrEvent,
                            // @ts-ignore
                            repostedEventId: valueFromTag(nostrEvent, 'e')
                        });
                    }
                    // handle zap
                    if (nostrEvent.kind = 9375) {
                        db.zaps.put({
                            ...nostrEvent,
                            // @ts-ignore
                            zappedNote: valueFromTag(nostrEvent, 'e'),
                            // @ts-ignore
                            zapper: JSON.parse(valueFromTag(nostrEvent, 'description'))?.pubkey,
                            amount: lightBolt11Decoder.decode(valueFromTag(nostrEvent, 'bolt11')).sections
                                .find((section: any) => section.name === 'amount').value
                        })
                    }
                    // if (nostrEvent.kind === 0) {
                    //     db.users.put(nostrEvent);
                    // }
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
                console.error('unable to assert signer...');
            })
    }, []);

    const boost = useCallback((nostrEvent: NostrEvent) => {
        const event = new NDKEvent(ndk);
        event.kind = 6;
        event.content = JSON.stringify(nostrEvent);
        event.tags = [
            ['e', nostrEvent.id!, 'wss://relay.damus.io'],
            ['p', nostrEvent.pubkey]
        ];
        ndk.assertSigner()
            .then(() => {
                event.sign(ndk.signer!)
                    .then(() => {
                        ndk.publish(event)
                            .then(() => {
                                console.log('repost event published!');
                            })
                            .catch((error) => {
                                console.error('unable to publish repost event...')
                            })
                    })
                    .catch((error) => {
                        console.error('unable to sign repost event...');
                    })
            })
            .catch((error) => {
                console.error('unable to assert signer...')
            });
    }, []);

    return (
        <NostrNoteContext.Provider value={{ subscribe, addReaction, zap, subs: subs.current, boost }}>
            {children}
        </NostrNoteContext.Provider>
    );
};

export const useNostrNoteContext = () => useContext(NostrNoteContext);