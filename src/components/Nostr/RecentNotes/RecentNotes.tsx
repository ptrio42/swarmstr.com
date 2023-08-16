import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useEffect, useState} from "react";
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

const since =  Math.floor(Date.now() / 1000 - 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

const filter = { kinds: [1, 30023], "#t": [Config.HASHTAG], since };

export const RecentNotes = () => {

    const [limit, setLimit] = useState<number>(10);

     const { subscribe, setNewNoteDialogOpen, user, setLoginDialogOpen } = useNostrContext();

     const events = useLiveQuery(
         async () => await db.notes.where('created_at')
             .between(since, to, true, true)
             .and(({tags}) => containsTag(tags, ['t', Config.HASHTAG]))
             .filter(({kind}) => kind === 1 || kind === 30023)
             .reverse()
             .sortBy('created_at')
             // .toArray()
     , [limit]);

     useEffect(() => {
         subscribe(filter, { closeOnEose: false, groupable: false }, Config.CLIENT_READ_RELAYS);
     }, []);

     useEffect(() => {
         console.log({limit})
     }, [limit]);

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