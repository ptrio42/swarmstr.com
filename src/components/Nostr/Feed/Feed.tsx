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
import {addHighlightAt, containsTag, matchString} from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import Fab from "@mui/material/Fab";
import AddIcon from '@mui/icons-material/Add';
import {NewNoteDialog} from "../../../dialog/NewNoteDialog";
import {groupBy, uniqBy, sortBy} from 'lodash'
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const filter: NDKFilter = {
    kinds: [1],
    '#t': ['asknostr']
};

export const Feed = () => {
    const { ndk, user } = useNostrContext();
    const { nevents, loading, subscribe } = useNostrFeedContext();
    const [filteredNevents, setFilteredNevents] = useState<string[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);

    const events = useLiveQuery(async () => {
        const events = await db.events.where('kind').equals(1)
            .and(({tags}) => containsTag(tags, ['t', 'asknostr']))
            .toArray();
        // let events1 = events.and(({tags}) => containsTag(tags, ['t', 'asknostr'])).toArray();
        // const events2 = events.and(({ id }) => events1.findIndex(({ tags }) => containsTag(tags, ['e', id])) > -1)
        // const events2 = events.and(({  }))
        return await Promise.all(events.map (async (event: NostrEvent): Promise<NostrEvent> => {
                    // @ts-ignore
                    const id =  event.tags!.filter((t) => t[0] === 'e')?.map((t) => t[1])[0];
                    if (id) {
                        const referencedEvent = await db.events.get({ id });
                        return referencedEvent || event;
                    }
                    return event;
            }));
        // await Promise.all(events, (async event => containsTag(event.tags, [])))
        //     .and(({tags, id}) => containsTag(tags, ['t', 'asknostr']))
        //     .and(({tags, id}) => !id || containsTag(tags, ['e', id])
        //         // (!id || containsTag(tags, ['e', id]))
        //         // containsTag(tags, ) ||
        //         // !!(searchString && searchString !== '' && !!matchString(searchString, content)))
        //     // .and(({content}) => )
        //     // .or('content')
        //     )
        //     .toArray();
        // return events;
    }, []);

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
           .slice(0, 21)
           .map((tags: string[]) => tags[0]);
       return tags;
    });

    useEffect(() => {
        // console.log({tags})
    }, [tags]);

    useEffect(() => {
        subscribe(filter);
    }, []);

    const matchContent = () => {
        return true;
    }

    const handleSearchQueryChange = (nevent: string, display: boolean) => {
        if (!display) {
            setFilteredNevents([
                ...filteredNevents,
                nevent
            ])
        } else {
            setFilteredNevents(filteredNevents.filter((_nevent: string) => _nevent !== nevent))
        }
    };

    const [searchResults, setSearchResults] = useState<any[]>([]);

    const sortByMatchScore = (res: any) => {
        return uniqBy(res, 'data.id')
            .sort((a: any, b: any) => {
            return b.metadata.matchScore - a.metadata.matchScore
        })
    }


    useEffect(() => {
        if (searchString && searchString.length > 2) {
            const words = searchString.toLowerCase().trim()
                .replace(/([-_']+)/gm, ' ').split(' ').filter((word) => word.length > 1);
            let results: any[] = [];
            // Sort items
            events && events!.forEach((event: NostrEvent) => {
                let isIn = false

                // For each attribute
                // attrs.forEach((attr) => {
                const attrValue = event.content.toLowerCase().replace(/([-_']+)/gm, ' ');

                // For each word in search input
                words.forEach((word) => {

                    const tags = event.tags
                        .filter((tag: NDKTag) => tag[0] === 't').map((tag: NDKTag) => tag[1]);

                    // Check if word is in item
                    const index = attrValue.indexOf(word) || tags?.indexOf(word);

                    // If the word is in the item
                    if (index != -1) {

                        // Insert strong tag
                        let strongValue = addHighlightAt(event.content, word, index)

                        // If item is already in the result
                        if (isIn) {
                            // Increase matchScore
                            results[results.length - 1].metadata.matchScore += word.length
                            results[results.length - 1].data['content'] = strongValue

                        } else {
                            // Set score and attribute
                            results.push({
                                data: {
                                    ...event,
                                    content: strongValue
                                },
                                metadata: { matchScore: word.length }
                            })
                            isIn = true
                        }
                    }
                })
                // })
            })

            // Sort res by matchScore DESC
            results = sortByMatchScore(results)

            setSearchResults(results)
        } else {
            setSearchResults([]);
        }
    }, [events, searchString]);

    const eventsMemo = useMemo(() => events && events
            .filter(({content, tags}) => searchString && (matchString(searchString, content) ||
        (tags
            .filter((t: any) => t[0] === 't')
            .map((t1: any) => t1[1].toLowerCase())
            .includes(searchString.toLowerCase()))))
        , [events, searchString]);

    return (
        <React.Fragment>
            {
                false && ndk && <Box>
                    Relays: {ndk.pool.stats().connected}/{ndk.pool.stats().total}<br/>
                    Events: {nevents.length}<br/>
                    User: {user?.npub}
                </Box>
            }
            <NostrResources resultsCount={searchResults?.length}>
                {
                    (!searchString || searchString === '' || searchString.length < 2) && tags &&
                        <React.Fragment>
                            <Typography component="div" variant="h6">
                                Popular keywords
                            </Typography>
                            {
                                tags.map((tag: string) => <Chip
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
                    (searchResults || [])
                        .map((result: { data: NostrEvent }) => result.data)
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