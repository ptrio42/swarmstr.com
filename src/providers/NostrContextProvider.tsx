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

TimeAgo.addDefaultLocale(en);

const cacheAdapter = new DexieAdapter();

export const NostrContextProvider = ({ children }: any) => {
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: [...CLIENT_RELAYS], cacheAdapter }));

    const setNdk = useCallback((relayUrls: string[]) => {
        console.log(`resetting ndk instance...`);
        // ndk.current = new NDK({ explicitRelayUrls: [...relayUrls, 'wss://blastr.f7z.xyz'], cacheAdapter });
    }, []);
    
    const [user, setUser] = useState<NDKUser>();
    const [eventsFetched, addEventsFetched] = useState<boolean>(false);

    const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);
    const [newLabelDialogOpen, setNewLabelDialogOpen] = useState<boolean>(false);

    const subscription = useRef<NDKSubscription>();

    const events = useLiveQuery(
        () => db.notes.toArray()
    );

    // buld add events to indexedDB
    const addEvents = useCallback((events: NostrEvent[]) => {
        // db.events.bulkAdd(events)
        //     .then(() => {
        //         // console.log('events added to db');
        //     });
    }, []);

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
                // await ndk.current.assertSigner();

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

    const onEvent = (event: NDKEvent) => {
        // this is purely for stats
        const nostrEvent = event.rawEvent();
        const { tags } = nostrEvent;
        const referencedEventId = valueFromTag(nostrEvent, 'e');
        const title = valueFromTag(nostrEvent, 'title');
        if (containsTag(tags, ['t', 'asknostr'])) {
            const noteEvent: NoteEvent = {
                ...nostrEvent,
                type: undefined,
                ...(!!referencedEventId && { referencedEventId }),
                ...(!!title && { title })
            };
            // if event contains referenced event tag, it serves at question hint
            // thus gotta fetch the referenced event
            if (!!referencedEventId) {
                noteEvent.type = NOTE_TYPE.HINT;
                // console.log(`got hint event from ${nostrEvent.pubkey}`);
                // db.notes.put(noteEvent)
                //     .then(() => {
                //         subscribe({ ids: [referencedEventId] }, { closeOnEose: true, groupable: true, groupableDelay: 5000 });
                //     });
            } else {
                // event is a question
                noteEvent.type = NOTE_TYPE.QUESTION;
                db.notes.put(noteEvent);
            }

        } else {
            // event doesn't contain the asknostr tag
            // check if we have a question hint for this event already in the db
            // if so, the received event is a question as well
            db.notes.get({ referencedEventId: nostrEvent.id })
                .then((hintEvent: NoteEvent|undefined) => {
                    if (hintEvent && hintEvent.type === NOTE_TYPE.HINT) {
                        db.notes.put({
                            ...nostrEvent,
                            type: NOTE_TYPE.QUESTION
                        })
                    }
                });
        }
    };

    const subscribe = useCallback((
        filter: NDKFilter,
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false},
        relayUrls: string[]
    ) => {
        const notesReadRelays = NDKRelaySet.fromRelayUrls(relayUrls, ndk.current);
        const sub = new NDKSubscription(ndk.current, filter, opts);
        // sub.on('event', onEvent);
        notesReadRelays.subscribe(sub).start()
            .then(() => {
                console.log(`started subscription ${sub.subId} with filter: ${JSON.stringify(filter)} and relaySet: ${relayUrls.join(',')}`)
            });
        // subscription.current = sub;
    }, []);

    const post = useCallback(async (content: string, tags: NDKTag[], kind: number = 1) => {
        try {
            const pubkey = await signIn();
            const event = new NDKEvent(ndk.current);
            event.kind = kind;
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
                // MISSING TAG
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

    const fetchRelaysInformation = async () => {
        // return await Promise.all(DEFAULT_RELAYS.map(async (url): Promise<any> => {
        //     const relayInformationDocument = await getRelayInformationDocument(url.replace(/wss/, 'https'));
        //     // console.log({relayInformationDocument});
        //     return relayInformationDocument;
        // }));
    }

    useEffect(() => {

        ndk.current.connect(5000)
            .then(() => {
                console.log(`Connected to relays...`);
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
            subscription.current?.stop();
        }
    }, []);

    return (
        <React.Fragment>
            {
                // @ts-ignore
                <NostrContext.Provider value={{ ndk: ndk.current, user, events, subscribe, signIn, post, loginDialogOpen, setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen, label, newLabelDialogOpen, setNewLabelDialogOpen }}>
                    {children}
                </NostrContext.Provider>
            }
        </React.Fragment>
    );
};

export const useNostrContext = () => useContext(NostrContext);