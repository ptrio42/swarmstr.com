import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {NoteThread} from "../Thread/Thread";
import {Note} from "../Note/Note";
import {Box} from "@mui/material";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";
import {NDKFilter, NDKRelay, NDKSubscription, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {nip19} from "nostr-tools";
import {useSearchParams} from "react-router-dom";
import { containsTag } from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
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
import {Metadata} from "../Metadata/Metadata";
import Divider from "@mui/material/Divider";
import {Config} from "../../../resources/Config";
import {Helmet} from "react-helmet";
import {debounce} from 'lodash';
import Button from "@mui/material/Button";
import {ThreadDialog} from "../../../dialog/ThreadDialog";
import {SearchResults} from "../SearchResults/SearchResults";

const filter: NDKFilter = {
    kinds: [1, 30023],
    '#t': [Config.HASHTAG]
};

export const Feed = () => {
    const { events, clearEvents, loading, query, setQuery, startSubs, stopSubs } = useNostrFeedContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');
    const nevent = searchParams.get('e');

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const [limit, setLimit] = useState<number>(10);

    const tags = useLiveQuery(async () => {
       const allEvents = await db.notes.toArray();
       const tags = sortBy(
           groupBy(allEvents
                   .filter(({tags}) => containsTag(tags, ['t', Config.HASHTAG]))
                   .map(({tags}) => tags
                       .filter((tag: NDKTag) => tag[0] === 't' && tag[1] !== Config.HASHTAG)
                       .map(([_, tag]) => tag))
                   .flat(2),
               (tag: string) => tag
           ),
           'length'
       ).reverse()
           .map((tags: string[]) => tags[0].toLowerCase())
           .slice(3, 36);
       return tags;
    });

    const filteredEvents = useCallback(() =>
        uniqBy(sortBy(events, 'created_at').reverse(), 'id')
            .slice(0, limit), [events, limit]);

    const contributors = Config.CONTRIBUTORS;

    const explicitTags = Config.EXPLICIT_TAGS;

    const boxRef = useRef();

    const debouncedQuery = useMemo(() =>
        debounce((query: string) => {
            if (query && query.length > 2) {
                startSubs({ search: query });
                setSubscribed(true);
            }
        }, 500)
    , []);

    useEffect(() => {
        clearEvents();
        setSubscribed(false);
        setQuery(searchString || '');
    }, [searchString]);

    useEffect(() => {
        debouncedQuery(query);
        // console.log('change:', {query})
    }, [query]);

    useEffect(() => {
        if (!!nevent && !!nip19.decode(nevent).data) {
            stopSubs();
        } else {
            startSubs({ search: query }, filteredEvents());
        }
    }, [nevent]);

    useEffect(()=>{
        setTimeout(() => {
            setShowPreloader(false);
        }, 2100);
    },[]);

    return (
        <React.Fragment>
            <Helmet>
                <title>{ query && query.length > 2 && `Search results for: ${query} - ` }{ Config.APP_TITLE }</title>
                <meta property="description" content={ Config.APP_DESCRIPTION } />
                <meta property="keywords" content={ Config.APP_KEYWORDS } />

                <meta property="og:url" content={ `${process.env.BASE_URL}/` } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={ `${query && query.length > 2 && `Search results for: ${query}`} - ${Config.APP_TITLE}` } />
                <meta property="og:image" content={ Config.APP_IMAGE } />
                <meta property="og:description" content={ Config.APP_DESCRIPTION } />

                <meta itemProp="name" content={ `${query && query.length > 2 && `Search results for: ${query}`} - ${Config.APP_TITLE}` } />
                <meta itemProp="image" content={ Config.APP_IMAGE }  />

                <meta name="twitter:title" content={ `${query && query.length > 2 && `Search results for: ${query}`} - ${Config.APP_TITLE}` } />
                <meta name="twitter:description" content={ Config.APP_DESCRIPTION } />
                <meta name="twitter:image" content={ Config.APP_IMAGE }  />

            </Helmet>
            <Box className="landingPage-boxContainer" ref={boxRef}>
                {
                    searchString === null && <React.Fragment>
                        <Box className="landingPage-box">
                        <Typography variant="h5" component="div">
                            { Config.SLOGAN }
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
                        <Typography component="div" variant="body1">
                            <Button className="nav-button" variant="contained" color="primary" onClick={() => { setSearchParams({s: ''}) }}>
                                Search
                            </Button>
                            <Button
                                className="nav-button"
                                variant="text"
                                color="secondary"
                                onClick={() =>
                                    setSearchParams({ s: Config.HASHTAG })
                                }>
                                Recent questions
                            </Button>
                        </Typography>
                    </Box>
                        <Typography sx={{ marginBottom: '1em', marginTop: '1em' }} component="div" variant="h5">
                            Contributors
                            <Tooltip title={`People that helped in Swarmstr development.`}>
                                <IconButton className="contributors-button">
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                contributors && <React.Fragment>
                                    {
                                        contributors.map((pubkey: string) => (
                                            <Metadata variant={'avatar'} pubkey={pubkey} />
                                        ))
                                    }
                                </React.Fragment>
                            }
                        </Box>
                    </React.Fragment>
                }

                <SearchResults
                    search={searchString !== null && <Search
                        query={searchString || ''}
                        resultsCount={events.length}
                        onQueryChange={(event: any) => {
                            setSearchParams({ s: event.target.value});
                        }}
                        isQuerying={loading}
                    />}
                    results={filteredEvents()}
                    limit={limit}
                    handleSetLimit={(l: number) => { setLimit(l) }}
                >

                        {
                            (filteredEvents() || [])
                                .filter(({id}) => !!id)
                                .map((nostrEvent: NostrEvent) => ({
                                    event: nostrEvent,
                                    nevent: nip19.neventEncode({
                                        id: nostrEvent.id,
                                        author: nostrEvent.pubkey,
                                        relays: ['wss://q.swarmstr.com']
                                    })
                                }))
                                .map(({event, nevent}) => (
                                    <NoteThread
                                        key={`${nevent}-thread`}
                                        nevent={nevent}
                                    >
                                        <NostrNoteContextProvider>
                                            <Note key={`${nevent}-content`} event={event} nevent={nevent} floating={true}/>
                                        </NostrNoteContextProvider>
                                    </NoteThread>
                                ))
                        }
                </SearchResults>
                {
                    (searchString !== null && (searchString === '' || searchString.length < 2)) &&
                    <React.Fragment>
                        {
                            tags && <Box>
                                <Typography sx={{ marginBottom: '1em' }} component="div" variant="h6">
                                    or explore questions by topics
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
                            </Box>
                        }
                    </React.Fragment>
                }
                <Backdrop open={showPreloader} />
            </Box>
            <ThreadDialog open={!!nevent && !!nip19.decode(nevent).data} nevent={nevent} onClose={() => {
                setSearchParams({ e: '', ...(!!searchString && { s: searchString }) });
            }}/>
        </React.Fragment>
    )
};