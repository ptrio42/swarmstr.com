import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import NDK, {
    NDKEvent,
    NDKFilter,
    NDKNip07Signer,
    NDKRelay,
    NDKRelaySet,
    NDKSubscription, NDKSubscriptionOptions, NDKTag,
    NDKUser,
    NostrEvent
} from "@nostr-dev-kit/ndk";
import {Config, CLIENT_RELAYS} from "../resources/Config";
import {NostrContext} from "../contexts/NostrContext";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import axios from "axios";
import {nip19} from "nostr-tools";
import {intersection, difference} from 'lodash';
import DexieAdapter from "../caches/dexie";
import {NOTE_TYPE, NoteEvent} from "../models/commons";
import {containsTag, valueFromTag} from "../utils/utils";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import {requestProvider, WebLNProvider} from "webln";

TimeAgo.addDefaultLocale(en);

const cacheAdapter = new DexieAdapter();

// const subs: NDKSubscription[] = [];

export const NostrContextProvider = ({ children }: any) => {
    // ndk instance with read relays
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: [...Config.CLIENT_READ_RELAYS], cacheAdapter }));

    const [user, setUser] = useState<NDKUser>();

    const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);
    const [newLabelDialogOpen, setNewLabelDialogOpen] = useState<boolean>(false);

    const subs = useRef<NDKSubscription[]>([]);

    // const [events, setEvents] = useState<NostrEvent[]>([]);


    const signIn = useCallback(async (delay: number = 0) => {
        if (user) {
            console.log({user});
            return user!.hexpubkey();
        }
        if (delay > 5000) {
            console.log('no nip-07 extension...');
            return;
        }
        if (window.nostr) {
            console.log(`trying to login...`)
            try {
                ndk.current.signer = new NDKNip07Signer();

                const signedInUser: NDKUser = await ndk.current.signer.user();
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
        } else {
            delay += 100;
            setTimeout(() => {
                signIn(delay);
            }, delay);
        }
    }, []);

    const subscribe = useCallback((
        filter: NDKFilter,
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
        relayUrls: string[]
    ) => {
        const notesReadRelays: NDKRelaySet = NDKRelaySet.fromRelayUrls(relayUrls, ndk.current);
        // notesReadRelays.values().forEach((relay: NDKRelay) => relay.connect())
        const sub = ndk.current.subscribe(filter, opts, notesReadRelays);
        // sub.on('event', onEvent);
        sub.on('event', (event: NDKEvent) => {
            if (event.kind === 1 || event.kind === 30023) db.notes.put({ ...event.rawEvent(), type: NOTE_TYPE.QUESTION });
            if (event.kind === 30000 || event.kind === 10000 || event.kind === 30001) db.lists.put(event.rawEvent());
            // console.log(`NostrContextProvider:subscribe ${event.kind}`, event);
            // setEvents((prevState: NostrEvent[]) => ([
            //     ...prevState,
            //     nostrEvent
            // ]));
        });
        sub.on('eose', () => {
           console.log('received eose')
        });
        sub.start()
            .then(() => {
                console.log(`started subscription ${sub.subId} with filter: ${JSON.stringify(filter)} and relaySet: ${relayUrls.join(',')}`)
            });
        subs.current.push(sub);
        // subscription.current = sub;
    }, []);

    const unsubscribe = useCallback(() => {
        subs.current.forEach((sub: NDKSubscription) => sub.stop());
    }, []);

    const post = useCallback(async (content: string, tags: NDKTag[], kind: number = 1) => {
        try {
            const pubkey = await signIn();
            const event = new NDKEvent(ndk.current);
            event.kind = kind;
            event.content = content;
            event.tags = tags;
            event.pubkey = pubkey!;
            // event.created_at
            event.created_at = Math.floor(Date.now() / 1000) + 5;
            console.log(`signing & publishing new event`, {event})
            // ndk.current.assertSigner()
            //     .then(() => {
            // event.sign(ndk.current.signer!)
            //     .then(() => {
            try {
                await event.publish(NDKRelaySet.fromRelayUrls(Config.CLIENT_WRITE_RELAYS, ndk.current));
                console.log('question published!');
            } catch (error) {

            }
        } catch (error) {}
    }, []);

    const addReaction = useCallback((id: string, content: string) => {
        const event = new NDKEvent(ndk.current);
        event.kind = 7;
        event.content = content;
        event.tags = [
            ['e', id]
        ];
        ndk.current.assertSigner()
            .then(() => {
                event.sign(ndk.current.signer!)
                    .then(() => {
                        event.publish(NDKRelaySet.fromRelayUrls(Config.CLIENT_WRITE_RELAYS, ndk.current))
                            .then(() => {
                                console.log('reaction added!');
                            })
                    })
                    .catch((e) => {})
            })
            .catch((e) => {})
    }, []);

    const zap = useCallback((nostrEvent: NostrEvent, amount: number, callback?: () => void) => {
        const event = new NDKEvent(ndk.current, nostrEvent);

        ndk.current.assertSigner()
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
                                        console.error(`unable to zap`);
                                        const a = document.createElement('a');
                                        a.href = `lightning:${paymentRequest}`;
                                        a.click();
                                    })
                            })
                            .catch((error) => {
                                console.error(`unable to request ln provider`)
                                const a = document.createElement('a');
                                a.href = `lightning:${paymentRequest}`;
                                a.click();
                            })
                    })
                    .catch((error) => {
                        console.error(`problem getting zap request`)
                    })
            })
            .catch((error) => {
                console.error('unable to assert signer...');
            })
    }, []);

    const boost = useCallback((nostrEvent: NostrEvent) => {
        const event = new NDKEvent(ndk.current);
        event.kind = 6;
        event.content = JSON.stringify(nostrEvent);
        event.tags = [
            ['e', nostrEvent.id!, 'wss://relay.damus.io'],
            ['p', nostrEvent.pubkey]
        ];
        event.created_at = Math.floor(Date.now() / 1000) + 5;
        ndk.current.assertSigner()
            .then(() => {
                event.sign(ndk.current.signer!)
                    .then(() => {
                        event.publish()
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

    const payInvoice = useCallback((paymentRequest: string) => {
        ndk
            .current
            .assertSigner()
            .then(() => {
                requestProvider()
                    .then((webln: WebLNProvider) => {
                        webln.sendPayment(paymentRequest)
                            .then(() => {
                                console.log('zapped');
                                // callback && callback();
                                const a = document.createElement('a');
                                a.href = `lightning:${paymentRequest}`;
                                a.click();
                            })
                            .catch((error) => {
                                console.error(`unable to zap`)
                            })
                    })
                    .catch((error) => {
                        console.error(`unable to request ln provider`)
                        const a = document.createElement('a');
                        a.href = `lightning:${paymentRequest}`;
                        a.click();
                    })
            })
            .catch()
    }, []);

    const label = useCallback((reaction: string, nostrEvent?: NostrEvent, pubkey?: string, content?: string, tag?: string) => {
        try {
            const event = new NDKEvent(ndk.current);
            event.kind = 1985;
            event.tags = [];
            event.content = content || reaction;
            event.pubkey = pubkey || '';

            switch (reaction) {
                // DUPLICATE
                // label question as a duplicate and reference the previous question
                case 'expressionless':
                case 'unamused':
                case 'garlic': {
                    const review = {
                        quality: 0.5
                    };
                    event.tags.push(['L', '#e']);
                    event.tags.push(['l', 'question/review', '#e', JSON.stringify(review)]);
                    const id = nostrEvent?.id;
                    if (id) event.tags.push(['e', id]);
                }
                break;
                // WORTH CHECKING
                case 'eyes': {
                    const review = {
                        quality: 1
                    };
                    event.tags.push(['L', '#e']);
                    event.tags.push(['l', 'question/review', '#e', JSON.stringify(review)]);
                    const id = nostrEvent?.id;
                    if (id) event.tags.push(['e', id]);
                }
                break;
                // SUGGEST TAG
                // suggest category eg. relays, clients etc.
                case 'hash': {
                    if (tag) {
                        event.tags.push(['L', '#t']);
                        event.tags.push((['l', tag, '#t']))
                    }
                    const id = nostrEvent?.id;
                    if (id) event.tags.push(['e', id]);
                }
                break;
                // HELPFUL ANSWER
                // mark answer as helpful
                case 'people_hugging':
                case 'shaka': {
                    const id = nostrEvent?.id;
                    const review = {
                        quality: 1
                    };
                    if (id) {
                        event.tags.push(['L', '#e']);
                        // event.tags.push(['l', id, '#e']);
                        event.tags.push(['l', 'answer/review', '#e', JSON.stringify(review)])
                        event.tags.push(['e', id]);
                    }
                }
                break;
                // SUGGEST EXPERT
                case 'brain': {
                    const id = nostrEvent?.id;
                    if (id) {
                        event.tags.push(['L', '#e']);
                        if (pubkey) {
                            event.tags.push(['l', id, '#e']);
                            event.tags.push(['p', pubkey, ''])
                        }
                    }
                }
                break;
                // SPAM
                // mark entry as spam
                case 'triangular_flag_on_post': {
                    const id = nostrEvent?.id;
                    const review = {
                        quality: 0
                    };
                    if (id) {
                        event.tags.push(['L', '#e']);
                        event.tags.push(['l', 'question/review', '#e', JSON.stringify(review)]);
                        event.tags.push(['e', id]);
                    }
                }
            }
            console.log({event});

        } catch (error) {
            console.error({error});
        }
    }, []);

    useEffect(() => {

        // connect to read relays
        ndk.current.connect(5000)
            .then(() => {
                console.log(`Connected to read relays...`);
            })
            .catch(error => {
                console.error('unable to connect', {error})
            });

        setTimeout(() => {
            signIn()
                .then(() => {
                    console.log('sign in');
                })
        });

        return () => {
            console.log(`unsubscribing...`);
            // subscription.current?.stop();
            unsubscribe();
        }
    }, []);

    return (
        <React.Fragment>
            {
                // @ts-ignore
                <NostrContext.Provider
                    value={{
                        ndk: ndk.current, user, subscribe, signIn, post, loginDialogOpen,
                        setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen, label, newLabelDialogOpen,
                        setNewLabelDialogOpen, boost, payInvoice, addReaction, zap, unsubscribe
                    }}>
                    {children}
                </NostrContext.Provider>
            }
        </React.Fragment>
    );
};

export const useNostrContext = () => useContext(NostrContext);