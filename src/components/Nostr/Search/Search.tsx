import React, {useEffect, useMemo, useRef, useState} from "react";
import {Box} from "@mui/material";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";
import {NDKFilter, NDKRelay, NDKSubscription, NDKTag} from "@nostr-dev-kit/ndk";
import {nip19} from "nostr-tools";
import {Link, useSearchParams} from "react-router-dom";
import {containsTag, valueFromTag} from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {groupBy, uniqBy, sortBy, uniq, debounce} from 'lodash'
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {SearchBar} from "../../SearchBar/SearchBar";
import './Search.css';
import {Backdrop} from "../../Backdrop/Backdrop";
import {Config} from "../../../resources/Config";
import {Helmet} from "react-helmet";
import {ThreadDialog} from "../../../dialog/ThreadDialog";
import {SearchResults} from "../SearchResults/SearchResults";
import {EventList} from "../EventList/EventList";
import {useParams, useNavigate} from "react-router-dom";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {LabelEvent} from "../../../models/commons";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {request} from "../../../services/request";
import {getSearchResults} from "../../../services/search";
import Button from "@mui/material/Button";
import {Refresh} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {useWebSocket} from "react-use-websocket/dist/lib/use-websocket";
import {ReadyState} from "react-use-websocket";
import {LoadingAnimation} from "../../LoadingAnimation/LoadingAnimation";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import WebSocket from 'ws';

export const Search = () => {
    const { events, clearEvents } = useNostrFeedContext();
    const { subscribe, query, setQuery, loading, setLoading, tags } = useNostrContext();
    const { searchString } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    // const searchString = searchParams.get('s');
    const nevent = searchParams.get('e');

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const [searchApiResults, setSearchApiResults] = useState<string[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);

    const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

    const [hasErrors, setHasErrors] = useState<boolean>(false);

    // const ws = useRef(new WebSocket('ws://localhost:8082'));

    const { sendMessage, lastMessage, readyState,  } = useWebSocket('ws://localhost:8082', {
        onMessage: (message) => {
            console.log('websocket: onMessage', message)
        }
    });

    const [messageHistory, setMessageHistory] = useState([]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const [searchStatus, setSearchStatus] = useState<string>('idle');

    useEffect(() => {
        if (lastMessage !== null) {
            //@ts-ignore
            setMessageHistory((prev) => prev.concat(lastMessage));
            console.log(`webSocket message: ${lastMessage.data}`, lastMessage)
            setSearchStatus(lastMessage.data)
        }
    }, [lastMessage, setMessageHistory]);

    // const tags = useLiveQuery(async () => {
    //    const allEvents = await db.notes.toArray();
    //    const tags = sortBy(
    //        groupBy(allEvents
    //                .filter(({tags}) => containsTag(tags, ['t', Config.HASHTAG]))
    //                .map(({tags}) => tags
    //                    .filter((tag: NDKTag) => tag[0] === 't' && tag[1] !== Config.HASHTAG)
    //                    .map(([_, tag]) => tag))
    //                .flat(2),
    //            (tag: string) => tag
    //        ),
    //        'length'
    //    ).reverse()
    //        .map((tags: string[]) => tags[0].toLowerCase())
    //        .slice(3, 36);
    //    return tags;
    // });

    const filteredEvents = useMemo(() =>
        uniqBy(sortBy(events, 'created_at').reverse(), 'id'), [events]);

    const bestResultsSuggestions = useLiveQuery(
        async () => {
            const labels = await db.labels
                .filter(({tags}) => containsTag(tags, ['l', `search/${encodeURIComponent(query)}`, '#e']))
                .toArray();
            return labels.map((event: LabelEvent) => valueFromTag(event, 'e'))
        }
    , [query], []);

    const bestResults = useLiveQuery(
        async () => searchApiResults.length > 0 ? db.notes
            // @ts-ignore
            .where('id').anyOf(uniq([...searchApiResults, ...bestResultsSuggestions].filter((id) => !!id)!))
            .toArray() : []
    , [searchApiResults], []);

    const explicitTags = Config.EXPLICIT_TAGS;

    const boxRef = useRef();

    const debouncedQuery = useMemo(() =>
        debounce((query: string) => {
            if (query && query.length > 2) {
                request({ url: `${process.env.BASE_URL}/search-suggestions/${query}` })
                    .then((response) => {
                        setSearchSuggestions(response.data);
                        console.log({suggestions: response.data})
                    })

                console.log({tags})

                getSearchResults(query, tags)
                    .then((ids?: string[]|void) => {
                        // const ids = response.data;
                        if (!!ids) {
                            setSearchApiResults(ids);
                        }
                        setLoading(false);
                        setHasErrors(false);
                        setLoaded(true);
                    })
                    .catch((reason: any) => {
                        console.error(`error: ${reason}`);
                        setHasErrors(true);
                        setLoading(false);
                    });

                subscribe({
                    kinds: [1985],
                    '#l': [`search/${encodeURIComponent(query)}`, '#e']
                }, {closeOnEose: false, groupable: false});
            }
        }, 1000)
    , [tags]);

    useEffect(() => {
        subscribe({
                kinds: [1],
                ids: [...searchApiResults]
            },
            { closeOnEose: true, groupable: false })

    }, [searchApiResults]);

    useEffect(() => {
        clearEvents();
        setSubscribed(false);
        setLoading(true);
        setLoaded(false);
        setHasErrors(false);
        setSearchSuggestions([]);
        setSearchApiResults([]);
        setQuery(searchString?.replace('?', '%3F') || '');
    }, [searchString]);

    useEffect(() => {
        debouncedQuery(query);
        console.log('change:', {query})
    }, [query]);

    useEffect(() => {
        if (!!nevent && !!nip19.decode(nevent).data) {
            // stopSubs();
        } else {
            console.log({query})

            // startSubs({ search: query }, filteredEvents);
        }
    }, [nevent]);

    useEffect(()=> {
        setTimeout(() => {
            setShowPreloader(false);
        }, 2100);

        // ws.current.on('message', (message: any) => {
        //     console.log(`webSocket message: ${message}`)
        // })

        sendMessage(`websocket: Hello from Search.tsx!`)
    },[]);

    useEffect(() => {
        console.log({bestResults});
    }, [bestResults]);

    // useEffect(() => {
    //     console.log({loading})
    // }, [loading])

    return (
        <React.Fragment>
            <Helmet>
                <title>{ (searchString && searchString.length > 2) ? `Search results for: ${searchString} - ` : '' }{ Config.APP_TITLE }</title>
                <meta property="description" content={ Config.APP_DESCRIPTION } />
                <meta property="keywords" content={ Config.APP_KEYWORDS } />

                <meta property="og:url" content={ `${process.env.BASE_URL}/` } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={ `${(searchString && searchString.length > 2) ? `Search results for: ${searchString} - ` : ''}${Config.APP_TITLE}` } />
                <meta property="og:image" content={ Config.APP_IMAGE } />
                <meta property="og:description" content={ Config.APP_DESCRIPTION } />

                <meta itemProp="name" content={ `${(searchString && searchString.length > 2) ? `Search results for: ${searchString} - ` : ''}${Config.APP_TITLE}` } />
                <meta itemProp="image" content={ Config.APP_IMAGE }  />

                <meta name="twitter:title" content={ `${(searchString && searchString.length > 2) ? `Search results for: ${searchString} - ` : ''}${Config.APP_TITLE}` } />
                <meta name="twitter:description" content={ Config.APP_DESCRIPTION } />
                <meta name="twitter:image" content={ Config.APP_IMAGE }  />

            </Helmet>
            <Box className="landingPage-boxContainer" ref={boxRef}>
                {
                    !loading && hasErrors && <Typography className="searchResults-apiTimeout" component="div" variant="body1">
                        Timeout. Please try again.
                        <IconButton color="error" size="small" onClick={() => { debouncedQuery(query); setLoading(true); }}><Refresh fontSize="inherit"/></IconButton>
                    </Typography>
                }
                {
                    loading && <Typography className="searchResults-loadingResults" component="div" variant="body1">
                        <LoadingAnimation isLoading={loading} loadingText={searchStatus || ''}/>
                    </Typography>
                }
                {
                    !loading && !hasErrors && bestResults.length > 0 && <Typography component="div" variant="body1">{bestResults.length} results</Typography>
                }
                {
                    loaded && bestResults.length === 0 && <Typography className="searchResults-noResults" component="div" variant="body1">No results for: {decodeURIComponent(query)}</Typography>
                }
                <NostrEventListContextProvider events={bestResults}>
                    <EventListWrapper>
                        <EventList floating={false}/>
                    </EventListWrapper>
                </NostrEventListContextProvider>
                <Backdrop open={showPreloader} />
            </Box>
            {
                searchSuggestions && searchSuggestions.length > 0 && <Box>
                    <Typography component="div" variant="body1">Similar searches</Typography>
                    { searchSuggestions
                        .slice(0, 3)
                        .map((s: any) =>
                            <Box><Link to={`/search/${encodeURIComponent(s.query)}`}>{ s.query }</Link></Box>
                        )
                    }
                </Box>
            }
            {
                loaded && bestResults.length === 0 && <img width="39%" alt={`No results`} src={`${process.env.BASE_URL}/images/nostrnaut3.png`}/>
            }
        </React.Fragment>
    )
};