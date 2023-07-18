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
import {NOTE_TYPE, NoteEvent} from "../../../models/commons";
import './Feed.css';
import {Backdrop} from "../../Backdrop/Backdrop";

const filter: NDKFilter = {
    kinds: [1, 30023],
    '#t': ['asknostr']
};

export const keywordsFromString = (s: string) => {
    return s.toLowerCase().trim()
        .replace(/([-_']+)/gm, ' ').split(' ').filter((word) => word.length > 1);
};

export const Feed = () => {
    const { ndk, user } = useNostrContext();
    const { subscribe } = useNostrFeedContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');
    const [searchResults, setSearchResults] = useState<NostrEvent[]>([]);

    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [isQuerying, setIsQuerying] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const questions = useLiveQuery(async () => {
        if (!searchString || searchString.length < 3) return [];
        // console.log(`querying results...`);
        setIsQuerying(true);

        const questions: NostrEvent[] = await db.notes.where({ type: NOTE_TYPE.QUESTION })
            .filter((event: NostrEvent) => {
                const keywords = keywordsFromString(searchString);
                const tags = event.tags
                    .filter((tag: NDKTag) => tag[0] === 't').map((tag: NDKTag) => tag[1]);
                const content = event.content.toLowerCase().replace(/([-_']+)/gm, ' ');
                return keywords.some((keyword: string) => content.includes(keyword) || (tags?.indexOf(keyword) > -1))
            })
            .toArray();
        // console.log(`questions queried...`);
        setIsQuerying(false);
        return questions;
    }, [searchString], false);

    const tags = useLiveQuery(async () => {
       const allEvents = await db.notes.toArray();
       const tags = sortBy(
           groupBy(allEvents
                   .filter(({tags}) => containsTag(tags, ['t', 'asknostr']))
                   .map(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 't' && tag[1] !== 'asknostr').map(([_, tag]) => tag))
                   .flat(2),
               (tag: string) => tag
           ),
           'length'
       ).reverse()
           .map((tags: string[]) => tags[0].toLowerCase())
           .slice(0, 21);
       return tags;
    });

    const explicitTags = ['relays', 'nips', 'badges', 'lightning'];

    const filter1: NDKFilter = {
        kinds: [1],
        search: searchString
    };

    useEffect(() => {
        if (!!questions && !subscribed) {
            subscribe(filter);
            setSubscribed(true);
        }
    }, [questions, subscribed]);



    useEffect(() => {
        if (questions && searchString && searchString.length > 2) {
            const results = searchText(searchString, questions)
                // ignore notes with uselessshit.co dev links
                .filter(({content}) => !content.includes('https://beta.uselessshit.co') &&
                    !content.includes('https://dev.uselessshit.co')
                    // && !content.includes('https://uselessshit.co')
                    // && !content.includes('https://swarmstr.com')
                );
            setSearchResults(results)
        } else {
            setSearchResults([]);
        }
    }, [questions, searchString]);

    useEffect(()=>{
        setTimeout(() => {
            setShowPreloader(false);
        }, 2100);
    },[]);

    return (
        <React.Fragment>
            {
                false && ndk && <Box sx={{ wordWrap: 'break-word' }}>
                    Relays: {ndk.pool.stats().connected}/{ndk.pool.stats().total}<br/>
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
                    isQuerying={isQuerying}
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
            <LoadingAnimation isLoading={!questions}/>
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
            <Backdrop open={showPreloader} />
        </React.Fragment>
    )
};