import {containsTag, noteIsVisible} from "../../../utils/utils";
import {Config} from "../../../resources/Config";

import React, {useEffect, useRef, useState} from "react";
import {Card} from "@mui/material";
import {NDKFilter, NDKSubscription, NDKSubscriptionOptions, NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";


interface NoteWrapperProps {
    children: any;
    event: NostrEvent;
    loaded: boolean;
    id: string;
}

export const NoteWrapper = ({ id, children, event, loaded }: NoteWrapperProps) => {
    const noteRef = useRef(null);
    const noteVisible = noteIsVisible(noteRef);

    const { subscribe, subs, connected } = useNostrNoteContext();

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const filter: NDKFilter = { ids: [id]};

    useEffect(() => {
        return () => {
            subs && subs
                .forEach((sub: NDKSubscription) => {
                    // console.log('stopping sub...', {sub})
                    sub.stop();
                })
        }
    }, []);

    useEffect(() => {
        if (noteVisible && loaded && !event) {
            console.log(`event ${id} was not found in db`);
            subscribe(filter, { closeOnEose: true, groupableDelay: 500 });
        }
    }, [noteVisible, connected, loaded]);

    useEffect(() => {
        // note was displayed on screen
        // 1. wait for note event from cache
        // 2. if event isn't in cache, subscribe
        // 3. once event was received from a relay, stop subscription
        // run subs for reactions, zaps & comments in parallel

        console.log('NoteWrapper', {noteVisible, subscribed, connected, loaded});
        if (noteVisible && !subscribed && loaded) {
            // console.log('NoteWrapper subscribing to events...')
            // // only subscribe if the event does not exist in the db
            // // if (!event) {
            // //     subscribe(filter);
            // // }
            // const opts: NDKSubscriptionOptions = { groupableDelay: 500, closeOnEose: false };
            // const kinds = [1, 7, 9735, 30023, 6, 1985];
            // // subscribe(filter1);
            // for (let i = 0; i < kinds.length; i++) {
            //     console.log(`NoteWrapper: subscribing to kind ${kinds[i]} events for note ${id}`)
            //     subscribe({ kinds: [kinds[i]], '#e': [id]}, opts);
            // }

            setSubscribed(true);
        }
        if (!noteVisible && subscribed) {
            console.log(`will stop subs for note ${id} in 3 seconds...`);
            setTimeout(() => {
                subs && subs
                    .forEach((sub: NDKSubscription) => {
                        sub.stop();
                    });
                setSubscribed(false);
            }, 3000);
        }
    }, [noteVisible, subscribed, loaded, event, connected]);

  return <Card
      id={id}
      ref={noteRef}
      sx={{
          minWidth: 275,
          marginBottom: '0.5em',
          position: 'relative',
          width: '100%',
          // ...(pinned && { backgroundColor: '#f1f1f1' }),
          ...(containsTag(event?.tags || [], ['t', Config.REPLIES_HASHTAG]) && { backgroundColor: 'rgba(0,0,0,.01)' })
      }}
      className="note"
    >
      {children}
  </Card>
};