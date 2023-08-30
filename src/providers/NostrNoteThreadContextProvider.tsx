import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {NDKEvent, NDKFilter, NDKRelay, NDKRelaySet, NDKSubscription, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteThreadContext} from "../contexts/NostrNoteThreadContext";
import {useParams} from "react-router";
import {useNostrContext} from "./NostrContextProvider";
import {Backdrop} from "../components/Backdrop/Backdrop";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {containsTag} from "../utils/utils";
import {Config} from "../resources/Config";
import {uniqBy, chunk} from 'lodash';
import {request} from "../services/request";
import {nip19} from "nostr-tools";
import {useSearchParams} from "react-router-dom";

const subs = [];

export const NostrNoteThreadContextProvider = ({children, ...props}: any) => {
    const [events, _setEvents] = useState<NostrEvent[]>([]);
    const eventsRef = useRef<NostrEvent[]>(events);
    const setEvents = (events: NostrEvent[]) => {
        eventsRef.current = events;
        _setEvents(eventsRef.current);
    };
    const { ndk } = useNostrContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const { nevent } = (props.nevent && { nevent: props.nevent }) || useParams() || (searchParams.get('e') && { nevent: searchParams.get('e') });
    const { id } = nevent && nip19.decode(nevent).data;

    const [stats, setStats] = useState<any>({});

    const [cachedEvents, setCachedEvents] = useState<NostrEvent[]>();

    const [commentEvents, loaded] = useLiveQuery(async () => {
        const events = await db.notes
            .where({ referencedEventId: id })
            // filter spam notes
            .filter(({ content, tags }) =>
                !content.toLowerCase().includes('airdrop is live') &&
                !content.toLowerCase().includes('claim $') &&
                !content.toLowerCase().includes('claim your free $') &&
                !containsTag(tags, ['t', Config.HASHTAG]))
            .toArray();
        return [uniqBy([...events, ...cachedEvents || []], 'id'), true];
    }, [id, cachedEvents], [cachedEvents, false]);

    useEffect(() => {
        if (!id) return;
        request({ url: `${process.env.BASE_URL}/api/cache/${id}/1/e` })
            .then(response => {
                setCachedEvents(response.data);
                db.notes.bulkPut(response.data);
            })

    }, [id]);

    useEffect(() => {
        if (commentEvents && commentEvents.length > 0) {
            const ids = commentEvents!.map((e: NostrEvent) => e.id);
            ids && chunk(ids, 10)
            // @ts-ignore
                .forEach((_ids: string[]) => {
                    request({
                        url: `https://api.nostr.band/v0/stats/event/batch?objects=${_ids.join(',')}`,
                        method: 'GET'
                    }).then((response) => {
                        setStats({
                            ...stats,
                            ...response.data.stats
                        });
                    })
                });
        }
    }, [commentEvents]);

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
        return () => {
            console.log('stop all subs...');
            ndk.pool.relays
                .forEach((relay: NDKRelay) => relay
                    .activeSubscriptions
                    .forEach((subscription: NDKSubscription) => subscription.stop()));
        }
    }, []);

    return (
        <NostrNoteThreadContext.Provider value={{ events, subscribe, nevent: nevent || '', commentEvents, loaded, stats }}>
            {children}
        </NostrNoteThreadContext.Provider>
    );
};

export const useNostrNoteThreadContext = () => useContext(NostrNoteThreadContext);