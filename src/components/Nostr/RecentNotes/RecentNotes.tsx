import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useEffect, useState} from "react";
import {Config} from "../../../resources/Config";
import * as React from "react";
import {Box, SelectChangeEvent} from "@mui/material";
import {EventList} from "../EventList/EventList";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {Backdrop} from "../../Backdrop/Backdrop";
import './RecentNotes.css';
import {useLocation, useParams, useNavigate} from "react-router-dom";
import {uniq} from 'lodash';
import {Helmet} from "react-helmet";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {NDKSubscriptionCacheUsage, NostrEvent} from '@nostr-dev-kit/ndk';
import {NoteEvent} from "../../../models/commons";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import {LoadingAnimation} from "../../LoadingAnimation/LoadingAnimation";

const since =  Math.floor(Date.now() / 1000 - 2 * 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

export const RecentNotes = () => {
    const location = useLocation();
    const { explicitTag } = useParams();
    const filter = { kinds: [1, 30023], "#t": [explicitTag || Config.HASHTAG], since };
    const [events, loaded] = useLiveQuery(
        async () => {
            const events = await db.notes.where('created_at')
                .between(since, to, true, true)
                .and(({tags}: NoteEvent) => containsTag(tags, ['t', explicitTag || Config.HASHTAG]))
                .reverse()
                .sortBy('created_at');
            console.log('events', events)
            return [events, true];
        }, [explicitTag], [location?.state?.events, false]);

     const { subscribe, readRelays } = useNostrContext();

     const navigate = useNavigate();

     const [loading, setLoading] = useState(false);

     useEffect(() => {
         if (!loaded) return;
         console.log('RecentNotes: events loaded')
         setLoading(true);
         subscribe(
             filter,
             { closeOnEose: false, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL },
             () => {
                 setLoading(false);
             });
     }, [loaded, readRelays]);

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
        <Typography sx={{ display: 'flex', marginBottom: '0.5em', marginTop: '0.5em', textAlign: 'left', marginLeft: '15px' }} component="div" variant="body1">
            <Select
                id="select-tag"
                value={explicitTag || Config.HASHTAG}
                label="Tag"
                onChange={(event: SelectChangeEvent) => { navigate(`/recent/${event.target.value as string}`) }}
            >
                {
                    Config.NOSTR_TAGS.map((tag: string) => <MenuItem value={tag}>#{tag}</MenuItem>)
                }
            </Select>
            {/*<Box>*/}
                <LoadingAnimation isLoading={loading}/>
            {/*</Box>*/}
        </Typography>
        <NostrEventListContextProvider events={events}>
            <EventListWrapper>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>
        <Backdrop open={!loaded} />
    </Box>
};