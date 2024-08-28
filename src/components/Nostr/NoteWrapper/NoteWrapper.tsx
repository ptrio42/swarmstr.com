import React, {memo, useEffect, useRef, useState} from "react";
import {NostrEvent} from "nostr-tools";
import {NDKFilter, NDKSubscription, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import {Card} from "@mui/material";

import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import {subscribe} from "../../../services/nostr/relays";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {noteIsVisible, useManageSubs} from "../../../utils/utils";


interface NoteWrapperProps {
    children: any;
    event?: NostrEvent;
    loaded?: boolean;
    id?: string;
    pubkey?: string;
    kind?: number;
}

const NoteWrapper = ({ id, children, event, loaded, pubkey, kind }: NoteWrapperProps) => {

    if (!id) return;

    const noteRef = useRef(null);
    // const noteVisible = noteIsVisible(noteRef);

    // const { connected } = useNostrNoteContext();
    const {ndk} = useNostrContext();
    const {addSub, stopAllSubs} = useManageSubs({ndk, subscribe});

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const filter: NDKFilter = { ids: [id]};

    useEffect(() => {
        return () => {
            // stopAllSubs();
        }
    }, []);

    // useEffect(() => {
    //     if (noteVisible && loaded && !event) {
    //         console.log(`event ${id} was not found in db`);
    //
    //         if (!(pubkey && kind === 30023)) {
    //             addSub(filter, { closeOnEose: true, groupableDelay: 500 });
    //         } else {
    //             addSub({ '#d': [`${id}`], kinds: [kind], authors: [pubkey] }, { closeOnEose: false, groupable: false });
    //         }
    //     }
    // }, [noteVisible, connected, loaded]);

    // useEffect(() => {
    //     // note was displayed on screen
    //     // 1. wait for note event from cache
    //     // 2. if event isn't in cache, subscribe
    //     // 3. once event was received from a relay, stop subscription
    //     // run subs for reactions, zaps & comments in parallel
    //
    //     console.log('NoteWrapper', {noteVisible, subscribed, connected, loaded});
    //     if (noteVisible && !subscribed && loaded) {
    //         // console.log('NoteWrapper subscribing to events...')
    //         // // only subscribe if the event does not exist in the db
    //         // // if (!event) {
    //         // //     subscribe(filter);
    //         // // }
    //         // const opts: NDKSubscriptionOptions = { groupableDelay: 500, closeOnEose: false };
    //         // const kinds = [1, 7, 9735, 30023, 6, 1985];
    //         // // subscribe(filter1);
    //         // for (let i = 0; i < kinds.length; i++) {
    //         //     console.log(`NoteWrapper: subscribing to kind ${kinds[i]} events for note ${id}`)
    //         //     subscribe({ kinds: [kinds[i]], '#e': [id]}, opts);
    //         // }
    //
    //         setSubscribed(true);
    //     }
    //     if (!noteVisible && subscribed) {
    //         console.log(`will stop subs for note ${id} in 3 seconds...`);
    //         setTimeout(() => {
    //             stopAllSubs();
    //             setSubscribed(false);
    //         }, 3000);
    //     }
    // }, [noteVisible, subscribed, loaded, event, connected]);

  return <Card
      id={id}
      ref={noteRef}
      sx={{
          minWidth: 275,
          marginBottom: '0.5em',
          position: 'relative',
          width: '100%',
          // ...(pinned && { backgroundColor: '#f1f1f1' }),
          // ...(containsTag(event?.tags || [], ['t', Config.REPLIES_HASHTAG]) && { backgroundColor: 'rgba(0,0,0,.01)' })
      }}
      className="note"
    >
      {children}
  </Card>
};

export default memo(NoteWrapper);