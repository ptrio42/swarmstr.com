import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Config} from "../../../resources/Config";
import {Box, SelectChangeEvent} from "@mui/material";
import {EventList, Sort} from "../EventList/EventList";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {Backdrop} from "../../Backdrop/Backdrop";
import './RecentNotes.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {uniq} from 'lodash';
import {Helmet} from "react-helmet";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {NDKRelay, NDKSubscription, NDKSubscriptionCacheUsage, NostrEvent} from '@nostr-dev-kit/ndk';
import {NoteEvent} from "../../../models/commons";
import {TagSelect} from "../TagSelect/TagSelect";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const since =  Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60);
const to =  Math.floor(Date.now() / 1000 + 24 * 60 * 60);

export const RecentNotes = () => {
    const location = useLocation();
    const { explicitTag } = useParams() || { explicitTag: Config.HASHTAG };
    const filter = { kinds: [1, 30023], "#t": [explicitTag!], since };
    const [events, loaded] = useLiveQuery(
        async () => {
            const events = await db.notes.where('created_at')
                .between(since, to, true, true)
                .and(({tags}: NoteEvent) => containsTag(tags, ['t', explicitTag || Config.HASHTAG]))
                .reverse()
                .sortBy('created_at');
            console.log('RecentNotes totalEvents: ', events.length)
            return [events, true];
        }, [explicitTag], [location?.state?.events, false]);

     const { subscribe, readRelays, connected, loading, setLoading, ndk, subs } = useNostrContext();

     const subIds = useRef<string[]>([]);

     const navigate = useNavigate();

     const [timesReachedScrollEnd, setTimesReachedScrollEnd] = useState<number>(0);

     const [sort, setSort] = useState<Sort>(Sort.DEFAULT);

     const unsubscribe = () => {
        ndk.pool.connectedRelays().forEach((relay: NDKRelay) => {
            relay.activeSubscriptions().forEach((subs: NDKSubscription[]) => {
                subs.forEach((sub: NDKSubscription) => {
                    if (subIds.current.includes(sub.internalId)) {
                        sub.stop();
                        console.log(`Stopping sub ${sub.internalId}`);
                    }
                })
            })
        });
    };


     useEffect(() => {
         if (!loaded || !connected) return;
         console.log('RecentNotes: events loaded')
         console.log('RecentNotes', { subIds: subIds.current });
         unsubscribe();
         setLoading(true);

         const now = Math.floor(Date.now() / 1000);
         // get events between now and latest cached event
         const sub1Id = subscribe(
             {
                 ...filter,
                 before: now,
                 ...(events[0] && { since: events[0].created_at }),
             },
             { closeOnEose: false, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST },
             () => {
                 console.log('RecentNotes: eose');
                 setLoading(false);
         });

         // subscribe to events since now
         const sub2Id = subscribe(
             {
                 ...filter,
                 since: now
             },
             { closeOnEose: false, groupable: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST },
             () => {
                setLoading(false);
            });
         subIds.current.push(sub1Id, sub2Id);
     }, [loaded, readRelays, connected, explicitTag]);

     useEffect(() => {
         if (loaded) {
             const { pathname, hash, key } = location;
             console.log('RecentNotes: cached items loaded', {hash})

             if (hash !== '') {
                 setTimeout(() => {
                     const id = hash.replace('#', '');
                     const element = document.getElementById(id);
                     if (element) {
                         console.log('RecentNotes: scrolling into view');
                         element.scrollIntoView();
                     }
                 }, 1000);
             }
         }
     }, [loaded]);

     useEffect(() => {
         console.log('recent notes did mount');
         return () => {
             console.log('closing recent notes subscriptions...');
             unsubscribe();
         };
     }, []);

    return <Box>
        <Helmet>
            <title>Recent from #{explicitTag} - { Config.APP_TITLE }</title>
            <meta property="description" content={`Browse latest notes from #${explicitTag}`} />
            <meta property="keywords" content={ Config.APP_KEYWORDS } />

            <meta property="og:url" content={ `${process.env.BASE_URL}/recent/${explicitTag}` } />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`Recent from ${explicitTag} - ${Config.APP_TITLE}`} />
            <meta property="og:image" content={ Config.APP_IMAGE } />
            <meta property="og:description" content={`Browse latest notes from #${explicitTag}`} />

            <meta itemProp="name" content={`Recent from #${explicitTag} - ${Config.APP_TITLE}`} />
            <meta itemProp="image" content={ Config.APP_IMAGE }  />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:website" content="@swarmstr" />
            <meta name="twitter:title" content={`Recent from #${explicitTag} - ${Config.APP_TITLE}`} />
            <meta name="twitter:description" content={`Browse latest notes from #${explicitTag}`} />
            <meta name="twitter:image:src" content={ Config.APP_IMAGE } />

        </Helmet>
        <Typography sx={{ display: 'flex', marginBottom: '0.5em', marginTop: '0.5em', textAlign: 'left', marginLeft: '15px', justifyContent: 'space-between', marginRight: '1em' }} component="div" variant="body1">

            <ButtonGroup sx={{ boxShadow: 'none' }} variant="contained" aria-label="recent notes sort">
                <Button color={'primary'}
                        sx={{
                            textTransform: 'lowercase',
                            padding: '7px',
                            fontSize: '15px',
                            ...(sort !== Sort.DEFAULT && { backgroundColor: 'rgba(240, 230, 140, .5)', fontWeight: '300' } || { fontWeight: '400' }) }}
                        onClick={() => setSort(Sort.DEFAULT)}>recent</Button>
                <Button
                    color={'primary'}
                    sx={{ textTransform: 'lowercase', padding: '7px', fontSize: '15px', ...(sort !== Sort.MOST_ZAPPED && { backgroundColor: 'rgba(240, 230, 140, .5)', fontWeight: '300' } || { fontWeight: '400' }) }}
                    onClick={() => setSort(Sort.MOST_ZAPPED)}>most zaps</Button>
            </ButtonGroup>

            <TagSelect
                tags={uniq([...Config.NOSTR_TAGS, explicitTag!])}
                selectedTag={explicitTag}
                onTagSelect={(event: SelectChangeEvent) => {
                    navigate(`/recent/${event.target.value as string}`);
                }}
            />
        </Typography>
        <NostrEventListContextProvider events={events} sort={sort}>
            <EventListWrapper onReachedListEnd={() => {
                console.log('onReachedListEnd', {events})
                if (!events) return;
                // subscribe to event before last note
                let i = timesReachedScrollEnd + 1;
                const subId = subscribe(
                    {
                        ...filter,
                        ...(events[events.length - 1] && {
                            before: events[events.length - 1].created_at,
                            since: events[events.length - 1].created_at - (6 * 60 * 60) * i
                        }),
                    },
                    { closeOnEose: true, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL });
                setTimesReachedScrollEnd(i);
                subIds.current.push(subId);
            }}>
                <EventList floating={false}/>
            </EventListWrapper>
        </NostrEventListContextProvider>
        {
            !loading && loaded && (!events || events.length === 0) && <Box>No recent notes.</Box>
        }
        <Backdrop open={!loaded} />
    </Box>
};