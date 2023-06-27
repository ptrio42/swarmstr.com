import React, {createContext, useContext, useState} from "react";
import {Filter, Mux, Relay, SubscriptionOptions, Event as NostrEvent} from "nostr-mux";
import {Config, DEFAULT_RELAYS} from "../resources/Config";
import {NostrClientContext} from "../contexts/NostrClientContext";
import {getSubscriptionOptions} from "./nostr";

const mux = new Mux();

export const NostrClientProvider = (props: any) => {
    const [events, setEvents] = useState<NostrEvent[]>([]);

    const subscribe = (filters: Filter[]) => {
        console.log('NostrClientProvider:subscribe');
        // Multiplexe relays
        DEFAULT_RELAYS.forEach((url: string) => {
            mux.addRelay(new Relay(url));
        });

        if (filters && filters[0] && filters[0].ids && filters[0].ids.length > 1) {
            console.log('Ids', {ids: filters[0]?.ids})
        }

        // Get subscription options
        const options: SubscriptionOptions = getSubscriptionOptions(
            mux,
            filters,
            (event: any) => {
                console.log(`received kind ${event.kind} event`);
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            (subId: string) => {
                console.log(`closing ${subId} sub`);
            },
            false
        );

        // Subscribe
        console.log(`opening sub`);
        mux
            .waitRelayBecomesHealthy(Config.NOSTR_CLIENT.MIN_RELAYS, Config.NOSTR_CLIENT.RELAY_TIMEOUT)
            .then(ok => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }
                mux.subscribe(options);
            });
    };

    const unsubscribe = () => {
        DEFAULT_RELAYS.forEach(relay => {
            mux.removeRelay(relay);
        });
    };

    const publish = (event: NostrEvent) => {
        mux.publish(event, {
            onResult: (results) => {
                // const accepted = results && results.filter((r: any) => r.received.accepted)?.length;
                // console.log(`event published and accepted on ${accepted}/${results.length} relays`);
            }
        });
    };

    const value = {
        filters: props.filters,
        events,
        subscribe,
        unsubscribe
        // subscribe: props.subscribe || subscribe,
        // unsubscribe: props.unsubscribe || unsubscribe
    };

    return (
        <NostrClientContext.Provider value={{filters: props.filters, events, subscribe, unsubscribe, publish}}>
            { props.children }
        </NostrClientContext.Provider>
    );
};

export const useNostrClient = () => {
    return useContext(NostrClientContext);
};

