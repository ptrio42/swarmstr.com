import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import NDK, {
    NDKEvent,
    NDKFilter,
    NDKNip07Signer,
    NDKRelay,
    NDKRelaySet,
    NDKSubscription,
    NDKSubscriptionCacheUsage,
    NDKSubscriptionOptions,
    NDKTag,
    NDKUser,
    NostrEvent,
    zapInvoiceFromEvent
} from "@nostr-dev-kit/ndk";
import {Config} from "../resources/Config";
import {NostrContext} from "../contexts/NostrContext";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {nip19} from "nostr-tools";
import {groupBy, uniq} from 'lodash';
import {ContactListEvent, NOTE_TYPE} from "../models/commons";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import {GetInfoResponse, requestProvider, WebLNProvider} from "webln";
import {NoteLabel, Thumb, thumbsDownTags, thumbsUpTags} from "../dialog/NewLabelDialog";
import {signAndPublishEvent} from "../services/nostr";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import {handleNDKEvent, valueFromTag} from "../utils/utils";

TimeAgo.addDefaultLocale(en);

const cacheAdapter = new NDKCacheAdapterDexie({ dbName: 'swarmstrDB_cache_1' });
const signer = new NDKNip07Signer();

const DEFAULT_RELAYS = { readRelays: Config.CLIENT_READ_RELAYS, writeRelays: Config.CLIENT_WRITE_RELAYS };

type SnackbarMessageType = 'error' | 'success';

export interface SnackbarMessage {
    type?: SnackbarMessageType,
    message: string
}

export const NostrContextProvider = ({ children }: any) => {

    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: uniq(Object.values(DEFAULT_RELAYS).flat(2)) }));

    const [user, setUser] = useState<NDKUser>();

    const { readRelays, writeRelays } = useLiveQuery(
        async () => {
            if (!user) return DEFAULT_RELAYS;
            const lists = await db.contactLists
                .where({ pubkey: user.pubkey })
                .reverse()
                .sortBy('created_at');
            return getUserRelays(lists[0]);
        }
    , [user?.pubkey], DEFAULT_RELAYS);

    const contacts = useLiveQuery(
        async () => await db.contactLists.toArray()
    , []);

    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);
    const [newLabelDialogOpen, setNewLabelDialogOpen] = useState<boolean>(false);
    const [newReplyDialogOpen, setNewReplyDialogOpen] = useState<boolean>(false);
    const [zapDialogOpen, setZapDialogOpen] = useState<boolean>(false);
    const [relayListDialogOpen, setRelayListDialogOpen] = useState<boolean>(false);

    const [imageCreatorDialogOpen, setImageCreatorDialogOpen] = useState(false);

    const [currentEvent, setCurrentEvent] = useState<NostrEvent|undefined>();
    const [selectedLabelName, setSelectedLabelName] = useState<string|undefined>();

    const [ tags, setTags ] = useState(Config.NOSTR_TAGS);

    const subs = useRef<NDKSubscription[]>([]);

    const [connected, setConnected] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage|undefined>();

    useEffect(() => {
        console.log('NostrContextProvider: relayUrls changed', {writeRelays, readRelays});
        if (writeRelays.length > 0 && readRelays.length > 0) {
            // console.log({relayUrls})
            // const { signer } = ndk.current;
            const explicitRelayUrls = uniq([...writeRelays, ...readRelays]);
            ndk.current = new NDK({
                explicitRelayUrls,
                cacheAdapter,
                ...(user?.pubkey && { signer })
            });
            ndk.current.connect(5000)
                .then(() => {
                    console.log(`Connected to user relays...`);
                    setConnected(true);
                    // navigate(0);
                })
                .catch(error => {
                    console.error('unable to connect', {error})
                });
        }
    }, [readRelays, writeRelays]);

    useEffect(() => {
        console.log('user contacts: ', {contacts})
    }, [contacts]);

    useEffect(() => {
    //     console.log('NostrContextProvider: connecting to relays');
    //     // connect to read relays
    //     ndk.current.connect(5000)
    //         .then(() => {
    //             console.log(`Connected to read relays...`);
    //         })
    //         .catch(error => {
    //             console.error('unable to connect', {error})
    //         });
    //
        return () => {
            console.log(`unsubscribing...`);
            // subscription.current?.stop();
            unsubscribe();
        }
    }, []);

    const addTag = (tag: string) => {
        setTags([
            ...(tags || []).filter((t) => t !== tag),
            tag
        ]);
    };

    const removeTag = (tag: string) => {
        setTags([
            ...tags.filter((t) => t !== tag)
        ])
    };


    const getUserRelays = useCallback((contactList: ContactListEvent) => {
        console.log({contactList})
        try {
            const relayList = JSON.parse(contactList.content);
            let relays: any = groupBy(Object.keys(relayList)
                .map((url: string) => ([
                    {
                        url,
                        permission: {
                            key: 'read',
                            value: relayList[url]?.read
                        },
                    },
                    {
                        url,
                        permission: {
                            key: 'write',
                            value: relayList[url]?.write
                        },
                    }
                ]))
                .flat(2)
                .filter((relay: any) => relay.permission.value), 'permission.key');
            const { read, write } = relays;
            relays = {
                readRelays: read.map((relay: any) => relay.url),
                writeRelays: write.map((relay: any) => `${relay.url}${relay.url[relay.url.length - 1] !== '/' ? '/' : ''}`)
            };
            return relays;
        } catch (error) {
            return DEFAULT_RELAYS;
        }
    }, []);

    const subscribe = useCallback((
        filter: NDKFilter,
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
        onEose?: () => void,
        onEvent?: (event: NDKEvent) => void,
        relayUrls?: string[]
    ) => {
        const notesReadRelays: NDKRelaySet = NDKRelaySet.fromRelayUrls(relayUrls || readRelays, ndk.current);
        // notesReadRelays.values().forEach((relay: NDKRelay) => relay.connect()
        const sub: NDKSubscription = ndk.current
            .subscribe(filter, {...opts, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY}, notesReadRelays);
        // sub.on('event', onEvent);
        sub.on('event', (event: NDKEvent) => {
            // console.log('NostrContextProvider: event', {event})
            // if (event.kind === 0) console.log('NostrContextProvider: kind 0')
            // if (event.kind === 0) db.users.put(event.rawEvent());

            handleNDKEvent(event, filter);

            onEvent && onEvent(event);
            // handle user
            // if (event.kind === 0) db.users.put(event.rawEvent());
            // if (event.kind === 1 || event.kind === 30023) db.notes.put({ ...event.rawEvent(), type: NOTE_TYPE.QUESTION });
            // if (event.kind === 30000 || event.kind === 10000 || event.kind === 30001) db.lists.put(event.rawEvent());
            //
            // if (event.kind === 3) db.contactLists.put(event.rawEvent());
            //
            // if (event.kind === 1985) {
            //     db.labels.put({ ...event.rawEvent(), referencedEventId: valueFromTag(event.rawEvent(), 'e') });
            //     console.log('similar question: ', {event})
            // }
        });
        sub.on('eose', () => {
           console.log('NostrContextPRovider: received eose');
           onEose && onEose();
        });
        sub.start()
            .then(() => {
                // console.log(`NostrContextProvider: subscribe: started subscription ${sub.subId} with filter: ${JSON.stringify(filter)} and relaySet: ${relayUrls.join(',')}`)
            });
        subs.current.push(sub);
        return sub.internalId;
        // subscription.current = sub;
    }, [readRelays]);

    const unsubscribe = useCallback(() => {
        subs.current.forEach((sub: NDKSubscription) => sub.stop());


    }, []);

    const signIn = useCallback(async (delay: number = 0) => {
        if (user) {
            console.log({user});
            return user!.pubkey;
        }
        if (delay >= 100) {
            console.log('no nip-07 extension...');
            return;
        }
        if (window.nostr) {
            console.log(`trying to login...`)
            try {
                // ndk.current.signer = new NDKNip07Signer();

                // ndk.current.signer = signer;
                const signedInUser: NDKUser = await signer.user();
                if (signedInUser) {
                    !user && setUser(signedInUser);
                    signedInUser.ndk = ndk.current;
                    const profile = await signedInUser.fetchProfile();
                    console.log(`NostrContextProvider: logged in as ${signedInUser.npub}`, {signedInUser});
                    console.log({profile});

                    subscribe({
                        kinds: [3],
                        authors: [signedInUser.pubkey]
                    }, { closeOnEose: true });

                    subscribe({
                        kinds: [10002],
                        authors: [signedInUser.pubkey]
                    }, { closeOnEose: true });

                    return signedInUser.pubkey;
                }
            } catch (error) {
                console.error('no browser extension available for signing in...', {error});
            }
        } else {
            delay = 100;
            return;
            // delay += 100;
            // setTimeout(() => {
            //     signIn(delay);
            // }, delay);
        }
    }, []);

    const post = useCallback(async (content: string, tags: NDKTag[], kind: number = 1) => {

        await signAndPublishEvent({
            content,
            tags,
            kind,
            created_at: 0,
            pubkey: ''
        }, writeRelays, ndk.current, 0, () => {
            setSnackbarMessage({ message: 'Note posted!' });
        }, (error: any) => {
            setSnackbarMessage({ message: error.message });
        });

        console.log('done!')

        // try {
        // const event = new NDKEvent(ndk.current);
        // event.kind = kind;
        // event.content = content;
        // event.tags = tags;
        // event.created_at = Math.floor(Date.now() / 1000) + 5;
        // console.log(`signing & publishing new event`, {event})
        // // console.log({writeRelays: relayUrls.write})
        // ndk.current.assertSigner()
        //     .then(() => {
        //         event.sign(ndk.current.signer!)
        //             .then(() => {
        //                 event.publish(NDKRelaySet.fromRelayUrls(relayUrls.write, ndk.current))
        //                     .then(() => {
        //                         console.log('question published!');
        //                     })
        //             })
        //             .catch((e) => {})
        //     })
        //     .catch((e) => {});
    }, [writeRelays]);

    const addReaction = useCallback((id: string, content: string) => {
        const event = new NDKEvent(ndk.current);
        event.kind = 7;
        event.content = content;
        event.tags = [
            ['e', id]
        ];
        console.log('NostrContextProvider: addReaction: ', {writeRelays}, {connectedrelays: ndk.current.pool.connectedRelays().map(({url}) => url)})
        // ndk.current.assertSigner()
        //     .then(() => {
        //         event.sign(ndk.current.signer!)
        //             .then(() => {
                        event.publish(NDKRelaySet.fromRelayUrls(writeRelays, ndk.current))
                            .then(() => {
                                console.log('reaction added!');
                            })
                            .catch((error: any) => {
                                console.error({error})
                            })
            //         })
            //         .catch((e) => {})
            // })
            // .catch((e) => {})
    }, [writeRelays]);

    const zap = useCallback(
        (
            nostrEvent: NostrEvent,
            amount: number,
            callback?: () => void,
            onError?: (error: any) => void,
            comment?: string
        ) => {
        const event = new NDKEvent(ndk.current, nostrEvent);

        // ndk.current.assertSigner()
        //     .then(() => {
                event.zap(amount * 1000, comment)
                    .then((paymentRequest: string|null) => {
                        console.log('zap request...', {paymentRequest});
                        if (!paymentRequest) {
                            onError && onError({ message: 'No payment request received.' });
                            return;
                        }

                        requestProvider()
                            .then((webln: WebLNProvider) => {
                                webln.sendPayment(paymentRequest)
                                    .then(() => {
                                        console.log('zapped');
                                        setCurrentEvent(undefined);
                                        callback && callback();
                                    })
                                    .catch((error) => {
                                        onError && onError(error);
                                        console.error(`unable to zap`);
                                        const a = document.createElement('a');
                                        a.href = `lightning:${paymentRequest}`;
                                        a.click();
                                    })
                            })
                            .catch((error: any) => {
                                onError && onError(error);
                                console.error(`unable to request ln provider`)
                                const a = document.createElement('a');
                                a.href = `lightning:${paymentRequest}`;
                                a.click();
                            })
                    })
                    .catch((error: any) => {
                        onError && onError(error);
                        console.error(`problem getting zap request`, {error});

                        const zapInvoice = zapInvoiceFromEvent(event);
                        console.log('zapInvoice', {zapInvoice})

                        // if (window.webln) {
                        //     (async () => {
                        //         await window.webln.enable();
                        //         const info: GetInfoResponse = await window.webln.getInfo();
                        //         console.log("Your node pubkey is", info.node.pubkey);
                        //         // await window.webln.sendPayment(pay)
                        //     })();
                        // } else {
                        //     console.warn("WebLN not enabled");
                        // }
                    })
            // })
            // .catch((error) => {
            //     console.error('unable to assert signer...');
            // })
    }, []);

    const boost = useCallback((nostrEvent: NostrEvent) => {
        const event = new NDKEvent(ndk.current);
        event.kind = 6;
        event.content = JSON.stringify(nostrEvent);
        event.tags = [
            ['e', nostrEvent.id!, 'wss://relay.damus.io'],
            ['p', nostrEvent.pubkey]
        ];
        // event.created_at = Math.floor(Date.now() / 1000) + 5;
        // ndk.current.assertSigner()
        //     .then(() => {
        //         event.sign(ndk.current.signer!)
        //             .then(() => {
                        event.publish(NDKRelaySet.fromRelayUrls(writeRelays, ndk.current))
                            .then(() => {
                                console.log('repost event published!');
                            })
                            .catch((error: any) => {
                                console.error('unable to publish repost event...')
                            })
                    // })
                    // .catch((error) => {
                    //     console.error('unable to sign repost event...');
                    // })
            // })
            // .catch((error: any) => {
            //     console.error('unable to assert signer...')
            // });
    }, [writeRelays]);

    const payInvoice = useCallback((paymentRequest: string) => {
        // ndk
        //     .current
        //     .assertSigner()
        //     .then(() => {
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
                            .catch((error: any) => {
                                console.error(`unable to zap`)
                            })
                    })
                    .catch((error: any) => {
                        console.error(`unable to request ln provider`)
                        const a = document.createElement('a');
                        a.href = `lightning:${paymentRequest}`;
                        a.click();
                    })
            // })
            // .catch()
    }, []);

    const label = useCallback((
        thumb: Thumb,
        label: NoteLabel,
        nostrEvent: NostrEvent,
        pubkey: string,
        content: string,
        additionalLabels?: string[],
        callback?: () => void,
        onError?: (error: any) => void
    ) => {
        try {
            const { reaction, name } = label;
            const event = new NDKEvent(ndk.current);
            event.kind = 1985;
            event.tags = [];
            event.content = content;
            event.pubkey = pubkey || '';
            event.created_at = Math.ceil(Date.now() / 1000);

            switch (reaction) {
                case 'brain':
                case 'shrug':
                case 'fire':
                case 'eyes':
                case 'triangular_flag_on_post':
                case 'garlic': {
                    event.tags.push(['L', '#e']);
                    event.tags.push(['l', name, '#e']);

                    if (thumb === Thumb.Up) {
                        event.tags.push(...thumbsUpTags(additionalLabels))
                    } else {
                        event.tags.push(...thumbsDownTags());
                    }
                }
                break;
                case 'hash': {
                    if (content) {
                        const tags = content.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/g);
                        if (tags && tags.length > 0) {
                            event.tags.push(['L', '#t']);
                            event.tags.push(
                                ...tags!
                                    .map((tag: string) => tag.replace('#', ''))
                                    .map((tag: string) => (['l', tag, '#t']))
                            );
                        }
                    }
                }
                break;
            }
            const id = nostrEvent?.id;
            if (id) event.tags.push(['e', id]);

            console.log('NostrContextProvider: label: ', {event});

            // ndk.current.assertSigner()
            //     .then(() => {
            //         event.sign(ndk.current.signer!)
            //             .then(() => {
                            event.publish(NDKRelaySet.fromRelayUrls(writeRelays, ndk.current))
                                .then(() => {
                                    console.log('label event published!');
                                    // db.labels.put({
                                    //     ...nostrEvent,
                                    //     // @ts-ignore
                                    //     referencedEventId: valueFromTag(nostrEvent, 'e')
                                    // });
                                    setSnackbarMessage({ message: 'Voted!' });
                                    callback && callback();
                                })
                                .catch((error: any) => {
                                    console.error('unable to publish label event...');
                                    onError && onError(error);
                                    setSnackbarMessage({ message: error.message });
                                })
                //         })
                //         .catch((error) => {
                //             console.error('unable to sign label event...');
                //         })
                // })
                // .catch((error) => {
                //     console.error('unable to assert signer...')
                // });

        } catch (error: any) {
            console.error({error});
            onError && onError(error);
            setSnackbarMessage({ message: error.message });
        }
    }, [writeRelays]);

    return (
        <React.Fragment>
            {
                // @ts-ignore
                <NostrContext.Provider
                    value={{
                        ndk: ndk.current, user, subscribe, signIn, post, loginDialogOpen,
                        setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen, label, newLabelDialogOpen,
                        setNewLabelDialogOpen, boost, payInvoice, addReaction, zap, unsubscribe,
                        writeRelays, readRelays, query, setQuery,
                        loading, setLoading, zapDialogOpen, setZapDialogOpen, newReplyDialogOpen, setNewReplyDialogOpen,
                        event: currentEvent, setEvent: setCurrentEvent, selectedLabelName, setSelectedLabelName,
                        addTag, removeTag, tags, connected, relayListDialogOpen, setRelayListDialogOpen, setImageCreatorDialogOpen,
                        imageCreatorDialogOpen, setTags, snackbarMessage, setSnackbarMessage, subs: subs.current
                    }}>
                    {children}
                </NostrContext.Provider>
            }
        </React.Fragment>
    );
};

export const useNostrContext = () => useContext(NostrContext);