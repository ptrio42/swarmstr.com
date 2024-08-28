import React, {useEffect} from "react";
import {NostrEvent} from "nostr-tools";
import {NDKEvent} from "@nostr-dev-kit/ndk";

import {EventStore} from "../Nostr/EventStore/EventStore";
import {getEventsAsPromise, subscribe} from "../../services/nostr/relays";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {useManageSubs, valueFromTag} from "../../utils/utils";
import {Box} from "@mui/material";
import {EventListWrapper} from "../Nostr/EventListWrapper/EventListWrapper";
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import EventList from "../Nostr/EventList/EventList";
import Typography from "@mui/material/Typography";

const KINDS = [1, 6, 7, 30023, 9735];

export const Notifications = ({ pubkey }: { pubkey: string }) => {

    const { ndk } = useNostrContext();
    const { addSub, stopAllSubs } = useManageSubs({ndk, subscribe});

    const filter = { '#p': [pubkey], kinds: KINDS };
    const eventStore = EventStore({filter});
    const lastTimeViewed = localStorage.getItem('notifications_lastTimeViewed');

    const setLastTimeViewed = (timestamp: number) => {
        localStorage.setItem('notifications_lastTimeViewed', timestamp.toString());
    };

    useEffect(() => {
        // save lastTimeViewed timestamp to localStorage on component mount
        // setLastTimeViewed(Date.now());

        // fetch last X notifications
        getEventsAsPromise(ndk, {...filter, limit: 100})
            .then((events: NostrEvent[]) => {
                eventStore.addEvents(events.filter((event: NostrEvent) => event.pubkey !== pubkey));
                addSub({...filter, since: Math.floor(Date.now() / 1000)}, { closeOnEose: false, groupable: false }, () => {}, (event: NDKEvent) => {
                    if (event.pubkey !== pubkey) {
                        // @ts-ignore
                        eventStore.addEvent(event.rawEvent());
                    }
                });
            });

        return () => {
            // save lastTimeViewed timestamp to localStorage on component unmount
            setLastTimeViewed(Date.now());
        }
    }, []);

    return <Box sx={{ marginTop: '8px', padding: '0 3px' }}>
        <Typography component="div" variant="h6">Notifications</Typography>
        <NostrEventListContextProvider limit={50} eventStore={eventStore}>
            <EventListWrapper>
                <EventList kinds={KINDS} expanded={false} />
            </EventListWrapper>
        </NostrEventListContextProvider>
    </Box>
};