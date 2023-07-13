import React, {useEffect, useMemo, useState} from "react";
import {NostrResources} from "../../Resources/NostrResources/NostrResources";
import {NoteThread} from "../../Resources/Thread/Thread";
import {Note} from "../../Resources/Note/Note";
import {Box} from "@mui/material";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";
import {LoadingAnimation} from "../../LoadingAnimation/LoadingAnimation";
import {NDKFilter, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {nip19} from "nostr-tools";
import {useSearchParams} from "react-router-dom";
import {addHighlightAt, containsTag, matchString, searchText} from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import Fab from "@mui/material/Fab";
import AddIcon from '@mui/icons-material/Add';
import {NewNoteDialog} from "../../../dialog/NewNoteDialog";
import {groupBy, uniqBy, sortBy, uniq} from 'lodash'
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {Search} from "../../Search/Search";

const filter: NDKFilter = {
    kinds: [1],
    '#t': ['asknostr']
};

export const Feed = () => {
    const { ndk, user, subscribeToRelaySet } = useNostrContext();
    const { nevents, loading, subscribe } = useNostrFeedContext();
    const [filteredNevents, setFilteredNevents] = useState<string[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');
    const [searchResults, setSearchResults] = useState<NostrEvent[]>([]);

    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const events = useLiveQuery(async () => {
        const events: NostrEvent[] = await db.events.where('kind').equals(1)
            .and(({tags}) => containsTag(tags, ['t', 'asknostr']))
            .toArray()

        return await Promise.all(events.map (async (event: NostrEvent) => {
                    // @ts-ignore
                    const id =  event.tags!.filter((t) => t[0] === 'e')?.map((t) => t[1])[0];
                    if (id) {
                        // console.log(`quote event ${id}, content: ${event.content}`)
                        const referencedEvent: NostrEvent|undefined = await db.events.get({ id });
                        // console.log({referencedEvent})
                        // console.log({refContent: referencedEvent?.content})
                        return referencedEvent || event;
                    }
                    return event;
            }));
    }, [searchString]);

    // if (!events) return <div>yyyy</div>;

    const tags = useLiveQuery(async () => {
       const allEvents = await db.events.toArray();
       const tags = sortBy(
           groupBy(allEvents
                   .filter(({tags}) => containsTag(tags, ['t', 'asknostr']))
                   .map(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 't' && tag[1] !== 'asknostr').map(([_, tag]) => tag))
                   .flat(2),
                   // .filter((tag: string) => tag !== 'asknostr'),
               (tag: string) => tag
           ),
           'length'
       ).reverse()
           .map((tags: string[]) => tags[0].toLowerCase())
           .slice(0, 21);
       return tags;
    });

    const explicitTags = ['relays', 'nips', 'badges'];

    const filter1: NDKFilter = {
        kinds: [1],
        search: searchString
    };

    useEffect(() => {
        // console.log({tags})
        // console.log(`searchString change ${searchString}`);
        if (searchString && searchString !== '' && searchString.length > 2) {
            // console.log(`subscribe to relaySet`);
            // subscribeToRelaySet(filter1, ['wss://relay.nostr.band', 'wss://search.nos.today']);
        }
    }, [searchString]);

    useEffect(() => {
        if (!!events && !subscribed) {
            subscribe(filter);
            setSubscribed(true);
        }
    }, [events, subscribed]);



    useEffect(() => {
        if (events && searchString && searchString.length > 2) {
            const results = searchText(searchString, events)
            // ignore notes with uselessshit.co dev links
                .filter(({content}) => !content.includes('https://beta.uselessshit.co') &&
                    !content.includes('https://dev.uselessshit.co')
                );
            setSearchResults(results)
        } else {
            setSearchResults([]);
        }
    }, [events, searchString]);

    return (
        <React.Fragment>
            {
                false && ndk && <Box sx={{ wordWrap: 'break-word' }}>
                    Relays: {ndk.pool.stats().connected}/{ndk.pool.stats().total}<br/>
                    {/*Events: {nevents.length}<br/>*/}
                    User: {user?.npub}
                </Box>
            }

            <NostrResources
                search={<Search
                    query={searchString || ''}
                    resultsCount={searchResults?.length}
                    onQueryChange={(event: any) => {
                        setSearchParams({ s: event.target.value});
                    }}
                />}>
                {
                    (!searchString || searchString === '' || searchString.length < 2) && tags &&
                        <React.Fragment>
                            <Typography component="div" variant="h6">
                                Popular keywords
                            </Typography>
                            {
                                uniq([...tags, ...explicitTags]).map((tag: string) => <Chip
                                    sx={{ color: '#fff' }}
                                    label={tag}
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchParams({ s: tag })
                                    }}
                                />)
                            }
                        </React.Fragment>
                }
                {
                    (sortBy(searchResults, 'created_at').reverse() || [])
                        .filter(({id}) => !!id)
                        .map((nostrEvent: NostrEvent) => nip19.neventEncode({
                    id: nostrEvent.id,
                    author: nostrEvent.pubkey,
                    relays: []
                }))
                        .map((nevent: string) => (
                            <NoteThread
                                key={`${nevent}-thread`}
                                nevent={nevent}
                            >
                                <NostrNoteContextProvider>
                                    <Note key={`${nevent}-content`} nevent={nevent}/>
                                </NostrNoteContextProvider>
                            </NoteThread>
                        ))
                }
            </NostrResources>
            <LoadingAnimation isLoading={!events}/>
            {
                user && <Fab
                    sx={{ position: 'fixed', bottom: '21px', right: '21px' }}
                    color="primary"
                    aria-label="add new note"
                    onClick={() => {
                        setNewNoteDialogOpen(true);
                    }}
                >
                    <AddIcon/>
                </Fab>
            }
            <NewNoteDialog open={newNoteDialogOpen} onClose={() => setNewNoteDialogOpen(false)} label="What's your question?" explicitTags={[['t', 'asknostr']]} />
        </React.Fragment>
    )
};