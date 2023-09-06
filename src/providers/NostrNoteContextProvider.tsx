import React, {useCallback, useContext, useRef} from "react";
import {
    NDKEvent,
    NDKFilter,
    NDKRelaySet,
    NDKSubscription,
    NDKSubscriptionOptions,
    NDKTag,
    NostrEvent
} from "@nostr-dev-kit/ndk";
import {NostrNoteContext} from "../contexts/NostrNoteContext";
import {useNostrContext} from "./NostrContextProvider";
import {requestProvider, WebLNProvider} from "webln";
import {db} from "../db";
import {valueFromTag} from "../utils/utils";
import {nip19} from "nostr-tools";
import lightBolt11Decoder from 'light-bolt11-decoder';

interface NostrNoteContextProviderProps {
    children: any;
    thread?: boolean;
}

export const NostrNoteContextProvider = ({ children }: NostrNoteContextProviderProps) => {
    const subs = useRef<NDKSubscription[]>([]);

    const { ndk } = useNostrContext();

    const subscribe = useCallback((filter: NDKFilter, opts?: NDKSubscriptionOptions) => {
        const sub = ndk.subscribe(filter, opts);
        sub
            .on('event',  (event: NDKEvent) => {
                try {
                    const nostrEvent = {
                        ...event.rawEvent(),
                        kind: event.kind,
                        ...(filter?.ids?.length === 1 && { id: filter.ids[0] })
                    };
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
                    if (nostrEvent.kind === 9735) {
                        // console.log('kind 9735', {nostrEvent})
                        db.zaps.put({
                            ...nostrEvent,
                            // @ts-ignore
                            zappedNote: valueFromTag(nostrEvent, 'e'),
                            // @ts-ignore
                            zapper: JSON.parse(valueFromTag(nostrEvent, 'description'))?.pubkey,
                            amount: lightBolt11Decoder.decode(valueFromTag(nostrEvent, 'bolt11')).sections
                                .find((section: any) => section.name === 'amount').value
                        });
                    }

                    // handle label
                    if (nostrEvent.kind === 1985) {
                        // console.log('kind 1985 event', {event});
                        db.labels.put({
                            ...nostrEvent,
                            // @ts-ignore
                            referencedEventId: valueFromTag(nostrEvent, 'e')
                        });
                    }
                } catch (error) {
                }
        });
            sub.start()
            .then(() => {
                // console.log(`${sub.subId} started with filter: ${JSON.stringify(filter)}...`);
            });

        subs.current.push(sub);
    }, []);

    return (
        <NostrNoteContext.Provider value={{ subscribe, subs: subs.current }}>
            {children}
        </NostrNoteContext.Provider>
    );
};

export const useNostrNoteContext = () => useContext(NostrNoteContext);