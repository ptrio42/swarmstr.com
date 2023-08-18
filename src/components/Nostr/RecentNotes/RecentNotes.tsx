import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useEffect, useMemo, useState} from "react";
import {Config} from "../../../resources/Config";
import * as React from "react";
import {Box} from "@mui/material";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";
import children = ReactMarkdown.propTypes.children;
import {EventList} from "../EventList/EventList";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {Backdrop} from "../../Backdrop/Backdrop";
import Chip from "@mui/material/Chip";
import './RecentNotes.css';
import {PsychologyAlt, Search} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {useLocation} from "react-router-dom";
import {ListEvent} from "../../../models/commons";
import {NDKTag} from "@nostr-dev-kit/ndk";
import {uniq} from 'lodash';

const since =  Math.floor(Date.now() / 1000 - 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

const filter = { kinds: [1, 30023], "#t": [Config.HASHTAG], since };

export const RecentNotes = () => {

    const { pathname, hash, key, ...location } = useLocation();
    const [limit, setLimit] = useState<number>(location?.state?.limit || 10);


     const { subscribe, setNewNoteDialogOpen, user, setLoginDialogOpen } = useNostrContext();

     const mutedPubkeys = useLiveQuery(async () => {
         const muteLists = await db.lists.where({ kind: 30000 }).toArray();
         const mutedPubkeys = uniq(muteLists
             .map((listEvent: ListEvent) => listEvent.tags
                 .filter((tag: NDKTag) => tag[0] === 'p')
                 .map(([key, value]) => value)
             ).flat(2));
         console.log({mutedPubkeys});
         return mutedPubkeys;
     }, []);

     const events = useLiveQuery(
         async () => {
             if (!mutedPubkeys) return;
             return await db.notes.where('created_at')
                 .between(since, to, true, true)
                 .and(({tags}) => containsTag(tags, ['t', Config.HASHTAG]))
                 .filter(({id, kind, pubkey, tags}) => (kind === 1 || kind === 30023) &&
                     !mutedPubkeys.includes(pubkey) &&
                     !containsTag(tags, ['t', 'nsfw']))
                 .reverse()
                 .sortBy('created_at')
         }
             // .toArray()
     , [limit, mutedPubkeys], location?.state?.events);

     useEffect(() => {
         const relayUrls = Config.CLIENT_READ_RELAYS;
         subscribe(filter, { closeOnEose: false, groupable: false }, relayUrls);
         subscribe({
             kinds: [30000],
             authors: ['f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8'],
             '#d': ['mute']
         }, { closeOnEose: false, groupable: false }, Config.SERVER_RELAYS);
     }, []);

     useEffect(() => {
         // console.log({limit})
     }, [limit]);

     useEffect(() => {
        // console.log({state: location?.state})
     }, [location]);

     const locationStateEventsMemo = useMemo(() => events, [!events]);

    useEffect(() => {
        console.log({pathname})
        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                // console.log({element})
                if (element) {
                    element.scrollIntoView();
                }
            });
        }
    }, [pathname, hash, key, locationStateEventsMemo]);

    return <Box>
        <Box className="addNewNote-box">
            <Chip
                icon={<PsychologyAlt/>}
                variant="outlined"
                label={`What's your question?`}
                size="medium"
                onClick={() => {
                    if (user) {
                        setNewNoteDialogOpen(true);
                    } else {
                        setLoginDialogOpen(true);
                    }}
                }
            />
        </Box>
        <Typography sx={{ marginBottom: '1em', marginTop: '1em' }} component="div" variant="h6">
            Recent questions
        </Typography>
        <EventListWrapper results={events?.slice(0, limit) || []} limit={limit} handleSetLimit={(limit: number) => { setLimit(limit) }}>
            <EventList events={events?.slice(0, limit) || []} floating={false}/>
        </EventListWrapper>
        <Backdrop open={!events} />
    </Box>
};