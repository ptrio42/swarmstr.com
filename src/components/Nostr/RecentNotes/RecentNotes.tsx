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
import {Helmet} from "react-helmet";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";

const since =  Math.floor(Date.now() / 1000 - 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

const filter = { kinds: [1, 30023], "#t": [Config.HASHTAG], since };

export const RecentNotes = () => {
    const location = useLocation();
    const [events, loaded] = useLiveQuery(
        async () => {
            const events = await db.notes.where('created_at')
                .between(since, to, true, true)
                .and(({tags}) => containsTag(tags, ['t', Config.HASHTAG]))
                .reverse()
                .sortBy('created_at');
            return [events, true];
        }, [], [location?.state?.events, false]);

     const { subscribe, setNewNoteDialogOpen, user, setLoginDialogOpen } = useNostrContext();

     useEffect(() => {
         const relayUrls = Config.CLIENT_READ_RELAYS;
         subscribe(filter, { closeOnEose: false, groupable: false }, relayUrls);
     }, []);

    return <Box>
        <Helmet>
            <title>Recent notes - { Config.APP_TITLE }</title>
            <meta property="description" content={`Browse latest notes from #${Config.HASHTAG}`} />
            <meta property="keywords" content={ Config.APP_KEYWORDS } />

            <meta property="og:url" content={ `${process.env.BASE_URL}/recent` } />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`Recent notes - ${Config.APP_TITLE}`} />
            <meta property="og:image" content={ Config.APP_IMAGE } />
            <meta property="og:description" content={`Browse latest notes from #${Config.HASHTAG}`} />

            <meta itemProp="name" content={`Recent notes - ${Config.APP_TITLE}`} />
            <meta itemProp="image" content={ Config.APP_IMAGE }  />

            <meta name="twitter:title" content={`Recent notes - ${Config.APP_TITLE}`} />
            <meta name="twitter:description" content={`Browse latest notes from #${Config.HASHTAG}`} />
            <meta name="twitter:image" content={ Config.APP_IMAGE }  />

        </Helmet>
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
        <NostrEventListContextProvider events={events}>
            <EventListWrapper>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>
        <Backdrop open={!loaded} />
    </Box>
};