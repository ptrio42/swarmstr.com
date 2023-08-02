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
import {getRelayInformationDocument} from "../services/nostr";
import DexieAdapter from "../caches/dexie";
import {NOTE_TYPE, NoteEvent} from "../models/commons";
import {containsTag, valueFromTag} from "../utils/utils";

const cacheAdapter = new DexieAdapter();

export const NostrContextProvider = ({ children }: any) => {
    const ndk = useRef<NDK>(new NDK({ explicitRelayUrls: [...CLIENT_RELAYS, 'wss://blastr.f7z.xyz'], cacheAdapter }));
    
    const [user, setUser] = useState<NDKUser>();
    const [eventsFetched, addEventsFetched] = useState<boolean>(false);

    const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

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
                    const event: NDKEvent|null = await ndk.current
                        .fetchEvent({ kinds: [3], authors: [signedInUser.hexpubkey()] }, { skipCache: true });
                    if (event) {
                        const nostrEvent = await event.toNostrEvent();
                        try {
                            const relayUrls = Object.keys(JSON.parse(nostrEvent.content));
                            // console.log({relayUrls});
                            // ndk.current = new NDK({ explicitRelayUrls: relayUrls })
                            // ndk.current.pool.relays =
                            // await ndk.current.connect();
                        } catch (error) {
                            console.error(`unable to parse relay list`);
                        }
                    }
                    return signedInUser.hexpubkey();
                }
            } catch (error) {
                console.error('no browser extension available for signing in...', {error});
            }
        } else {
            delay += 100;
            console.log(`incrementing delay ${delay}...`);
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
                db.notes.put(noteEvent)
                    .then(() => {
                        subscribe({ ids: [referencedEventId] }, { closeOnEose: true, groupable: true, groupableDelay: 5000 });
                    });
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
        opts: NDKSubscriptionOptions = {closeOnEose: false, groupable: false}
    ) => {
        const sub = ndk.current.subscribe(filter, opts);
        sub.on('event', onEvent);
        subscription.current = sub;
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

    const fetchRelaysInformation = async () => {
        // return await Promise.all(DEFAULT_RELAYS.map(async (url): Promise<any> => {
        //     const relayInformationDocument = await getRelayInformationDocument(url.replace(/wss/, 'https'));
        //     // console.log({relayInformationDocument});
        //     return relayInformationDocument;
        // }));
    }

    useEffect(() => {
        if (events && !eventsFetched) {
            axios
                .get('../api/events')
                .then((response: { data: NostrEvent[] }) => {
                    const eventsToAdd = difference(intersection(events, response.data), events);
                    addEvents(eventsToAdd);
                    addEventsFetched(true);
                })
                .catch((error) => {
                    console.log('error fetching events...');
                });
        }


    }, [events]);

    useEffect(() => {
        ndk.current.connect(2100)
            .then(() => {
                console.log(`Connected to relays...`);
            });

        // subscribe({
        //     kinds: [1, 30023],
        //     '#t': [Config.HASHTAG]
        // });

        // fetchRelaysInformation()
        //     .then(() => {
        //         console.log('information fetched')
        //     });

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
        <NostrContext.Provider value={{ ndk: ndk.current, user, events, subscribe, signIn, post, loginDialogOpen, setLoginDialogOpen }}>
            {children}
        </NostrContext.Provider>
    );
};

export const useNostrContext = () => useContext(NostrContext);