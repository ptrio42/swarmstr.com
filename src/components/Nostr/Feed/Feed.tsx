import React, {useEffect, useMemo, useRef, useState} from "react";
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
import {NOTE_TYPE, NoteEvent, NoteType} from "../../../models/commons";
import './Feed.css';
import {Backdrop} from "../../Backdrop/Backdrop";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {HelpOutline, Info} from "@mui/icons-material";
import {Metadata} from "../../Resources/Metadata/Metadata";
import Divider from "@mui/material/Divider";


const filter: NDKFilter = {
    kinds: [1, 30023],
    '#t': ['asknostr']
};

export const keywordsFromString = (s: string) => {
    return s.toLowerCase().trim()
        .replace(/([-_']+)/gm, ' ').split(' ').filter((word) => word.length > 1);
};

export const Feed = () => {
    const { ndk, user, setLoginDialogOpen } = useNostrContext();
    const { subscribe } = useNostrFeedContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');
    const [searchResults, setSearchResults] = useState<NostrEvent[]>([]);

    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [isQuerying, setIsQuerying] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const [limit, setLimit] = useState<number>(10);

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

    const getMostActivePubkeysByNoteType = (noteType: NoteType, notes: NoteEvent[]) => {
        return sortBy(
            groupBy(
                notes
                    .filter(({type}) => type === noteType)
                    .map(({pubkey}) => pubkey),
                (pubkey: string) => pubkey
            ),
            'length'
        ).reverse()
            .slice(0, 7)
    };

    const [contributors, inquirers, respondents] = useLiveQuery(async () => {
        const allEvents = await db.notes.toArray();
        const contributors = getMostActivePubkeysByNoteType(NOTE_TYPE.HINT, allEvents);
        const inquirers = getMostActivePubkeysByNoteType(NOTE_TYPE.QUESTION, allEvents);
        const respondents = getMostActivePubkeysByNoteType(NOTE_TYPE.ANSWER, allEvents);
        // console.log({contributors})
        return [contributors, inquirers, respondents];
    }, [], []);

    const explicitTags = ['relays', 'nips', 'badges', 'lightning'];

    const boxRef = useRef();

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

        const handleScroll = ((event: any) => {
            // console.log('scroll', {event});
            const {scrollHeight, scrollTop, clientHeight} = event.srcElement.scrollingElement;
            const bottom = scrollHeight - Math.floor(scrollTop as number) === clientHeight;
            if(bottom) {
                // console.log('reached scroll bottom')
                // setLimit(limit+10);
            }
        });

        // @ts-ignore
        window.addEventListener('scroll', handleScroll);
        // console.log({boxRef})
        return () => {
            // @ts-ignore
            window.removeEventListener('scroll', handleScroll);
        }
    },[]);

    return (
        <Box ref={boxRef}>
            {
                false && ndk && <Box sx={{ wordWrap: 'break-word' }}>
                    Relays: {ndk.pool.stats().connected}/{ndk.pool.stats().total}<br/>
                    User: {user?.npub}
                </Box>
            }

            <Typography sx={{ marginTop: '0.5em', padding: '0 10px', fontSize: '2rem!important' }} variant="h5" component="div">
                Use search to explore questions or pick a popular keyword
                <Tooltip title="Find out more">
                    <IconButton className="aboutSwarmstr-button" onClick={() => {
                        const a = document.createElement('a');
                        a.target = '_blank';
                        a.href = `${process.env.BASE_URL}/e/nevent1qqsw9yrz4yzks5rns52aprghenapqfq0pep8zzcsmd6a8anala296aczyrclnvyed48lr0m4u70yejzh0jy7kce7dpq4cla0wn830grmlq9asku2zd0`;
                        a.click();
                    }}>
                        <Info />
                    </IconButton>
                </Tooltip>
            </Typography>

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
                    (!searchString || searchString === '' || searchString.length < 2) &&
                        <React.Fragment>
                            {
                                tags && <React.Fragment>
                                    <Typography sx={{ marginBottom: '1em' }} component="div" variant="h5">
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
                            <Divider sx={{ margin: '1em 0;' }} />
                            <Typography sx={{ marginBottom: '1em' }} component="div" variant="h5">
                                Active users
                                <Tooltip title="Based on #asknostr hashtag activity">
                                    <IconButton className="activity-button">
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </Typography>
                            {
                                contributors && <React.Fragment>
                                    <Typography sx={{ margin: '1em 0' }} component="div" variant="h6">
                                        Contributors
                                    </Typography>
                                    {
                                        contributors.map((pubkey: string[]) => (
                                            <Badge
                                                badgeContent={pubkey.length}
                                                color="primary"
                                            >
                                                <Metadata variant={'avatar'} pubkey={pubkey[0]} />
                                            </Badge>
                                        ))
                                    }
                                </React.Fragment>
                            }
                            {
                                inquirers && <React.Fragment>
                                    <Typography sx={{ margin: '1em 0' }} component="div" variant="h6">
                                        Inquirers
                                    </Typography>
                                    {
                                        inquirers.map((pubkey: string[]) => (
                                            <Badge
                                                badgeContent={pubkey.length}
                                                color="primary"
                                            >
                                                <Metadata variant={'avatar'} pubkey={pubkey[0]} />
                                            </Badge>
                                        ))
                                    }
                                </React.Fragment>
                            }
                            {
                                respondents && <React.Fragment>
                                    <Typography sx={{ margin: '1em 0' }} component="div" variant="h6">
                                        Respondents
                                    </Typography>
                                    {
                                        respondents.map((pubkey: string[]) => (
                                            <Badge
                                                badgeContent={pubkey.length}
                                                color="primary"
                                            >
                                                <Metadata variant={'avatar'} pubkey={pubkey[0]} />
                                            </Badge>
                                        ))
                                    }
                                </React.Fragment>
                            }
                            <Divider sx={{ margin: '1em 0;' }} />
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
                <Fab
                    sx={{ position: 'fixed', bottom: '21px', right: '21px' }}
                    color="primary"
                    aria-label="add new note"
                    onClick={() => {
                        if (user) {
                            setNewNoteDialogOpen(true);
                        } else {
                            setLoginDialogOpen(true);
                        }
                    }}
                >
                    <AddIcon/>
                </Fab>
            }
            <NewNoteDialog open={newNoteDialogOpen} onClose={() => setNewNoteDialogOpen(false)} label="What's your question?" explicitTags={[['t', 'asknostr']]} />
            <Backdrop open={showPreloader} />
        </Box>
    )
};