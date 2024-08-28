import React, {useEffect, useMemo, useRef, useState} from "react";
import {Box} from "@mui/material";
import {useNostrFeedContext} from "../../providers/NostrFeedContextProvider";
import {NDKFilter, NDKRelay, NDKSubscription, NDKTag, NDKEvent} from "@nostr-dev-kit/ndk";
import {nip19, NostrEvent} from "nostr-tools";
import {Link, useSearchParams} from "react-router-dom";
import {containsTag, useManageSubs, valueFromTag} from "../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {groupBy, uniqBy, sortBy, uniq, debounce} from 'lodash'
import Typography from "@mui/material/Typography";
import './Search.css';
import {Backdrop} from "../../components/Backdrop/Backdrop";
import {Config} from "../../resources/Config";
import EventList, {Sort} from "../../components/Nostr/EventList/EventList";
import {useParams, useNavigate} from "react-router-dom";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {LabelEvent} from "../../models/commons";
import {EventListWrapper} from "../../components/Nostr/EventListWrapper/EventListWrapper";
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import {request} from "../../services/request";
import {getSearchResults} from "../../services/search";
import Button from "@mui/material/Button";
import {Refresh} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {useWebSocket} from "react-use-websocket/dist/lib/use-websocket";
import ButtonGroup from "@mui/material/ButtonGroup";
import {HtmlHead} from "../../components/Html/HtmlHead";
import {subscribe} from "../../services/nostr/relays";
import {EventListSort} from "../../components/Nostr/EventListSort/EventListSort";

export const Search = () => {
    const { events, clearEvents } = useNostrFeedContext();
    const { query, setQuery, loading, setLoading, tags, setTags, ndk } = useNostrContext();
    const { searchString } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchTags = searchParams.get('tags');
    // const searchString = searchParams.get('s');
    const nevent = searchParams.get('e');

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    const [searchApiResults, setSearchApiResults] = useState<string[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);

    const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

    const [hasErrors, setHasErrors] = useState<boolean>(false);

    const subIds = useRef<string[]>([]);

    const { sendMessage, lastMessage, readyState,  } = useWebSocket('ws://localhost:8082', {
        onMessage: (message) => {
            console.log('websocket: onMessage', message)
        }
    });

    const { addSub, stopAllSubs } = useManageSubs({ndk, subscribe});

    // const [sort, setSort] = useState<Sort>(Sort.RECENT);

    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         //@ts-ignore
    //         setMessageHistory((prev) => prev.concat(lastMessage));
    //         console.log(`webSocket message: ${lastMessage.data}`, lastMessage)
    //         setSearchStatus(lastMessage.data)
    //     }
    // }, [lastMessage, setMessageHistory]);

    // const filteredEvents = useMemo(() =>
    //     uniqBy(sortBy(events, 'created_at').reverse(), 'id'), [events]);

    const [bestResultsSuggestions, suggestionsLoaded] = useLiveQuery(
        async (): Promise<[string[], boolean]> => {
            const labels = await db.labels
                .filter(({tags}) => containsTag(tags, ['l', `search/${encodeURIComponent(decodeURIComponent(query).toLowerCase().replace(/([.?\-,_=])/gm, ''))}`, '#e']))
                .toArray();
            console.log('Search: labels: ', {labels});
            // @ts-ignore
            return [uniq(labels.map((event: LabelEvent) => valueFromTag(event, 'e'))), true];
        }
    , [query], [[], false]);

    const bestResults = useLiveQuery(
        async () => (searchApiResults.length > 0 || bestResultsSuggestions.length > 0) ? db.notes
            // @ts-ignore
            .where('id').anyOf(uniq([...searchApiResults, ...bestResultsSuggestions].filter((id) => !!id)!))
            .toArray() : []
    , [searchApiResults, bestResultsSuggestions], []);

    const explicitTags = Config.EXPLICIT_TAGS;

    const [userSuggestions, setUserSuggestions] = useState<NostrEvent[]>([]);

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

                const latestSuggestion = bestResults && bestResults.length > 0 &&
                    sortBy(bestResults, ['created_at']).reverse()[0].created_at;

                getSearchResults(query, tags === Config.NOSTR_TAGS ? undefined : tags, latestSuggestion || 0)
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

                addSub({
                    kinds: [1985],
                    '#l': [`search/${encodeURIComponent(decodeURIComponent(query).toLowerCase().replace(/([.?\-,_=])/gm, ''))}`, '#e']
                }, {closeOnEose: false, groupable: false});

                // addSub({
                //     kinds: [0],
                //     search: query
                // }, {closeOnEose: true, groupable: false}, () => {}, (ev: NDKEvent) => {
                //     setUserSuggestions((prevState) => uniqBy([
                //         ...prevState,
                //         ev.rawEvent()
                //     ], 'pubkey'));
                // }, [Config.SEARCH_RELAY])
            }
        }, 1000)
    , [tags, bestResults]);

    useEffect(() => {
        addSub({
                kinds: [1],
                ids: uniq([...searchApiResults, ...bestResultsSuggestions].filter((e: string) => !!e))
            },
            { closeOnEose: true, groupable: false });

    }, [searchApiResults, bestResultsSuggestions]);

    useEffect(() => {
        console.log('Search: userSuggestions: ', {userSuggestions})
    }, [userSuggestions]);

    useEffect(() => {
        clearEvents();
        setSubscribed(false);
        setLoaded(false);
        setHasErrors(false);
        setSearchSuggestions([]);
        setSearchApiResults([]);
        stopAllSubs();
        if (searchString && searchString.length > 2) {
            setLoading(true);
        }
        setQuery(searchString?.replace('?', '%3F') || '');
    }, [searchString, tags]);

    useEffect(() => {
        debouncedQuery(query);
        console.log('change:', {query, tags})
    }, [query, tags]);

    useEffect(() => {
        if (!!nevent && !!nip19.decode(nevent).data) {
            // stopSubs();
        } else {
            console.log({query})

            // startSubs({ search: query }, filteredEvents);
        }
    }, [nevent]);

    useEffect(() => {
        console.log({searchTags});

        const _tags: string[] | undefined = searchTags?.split(',');
        if (tags?.length > 0) {
            setTags(_tags!);
        } else {
            setTags(Config.NOSTR_TAGS);
        }
    }, [searchTags]);

    useEffect(()=> {
        setTimeout(() => {
            setShowPreloader(false);
        }, 200);

        setTags(Config.NOSTR_TAGS);

        // ws.current.on('message', (message: any) => {
        //     console.log(`webSocket message: ${message}`)
        // })

        sendMessage(`websocket: Hello from Search.tsx!`)

        return () => {
            stopAllSubs();
        }
    },[]);

    useEffect(() => {
        console.log({bestResultsSuggestions, searchApiResults});
    }, [bestResultsSuggestions, searchApiResults]);

    useEffect(() => {
        console.log({q: query, query: decodeURIComponent(query).toLowerCase().replace(/([.?\-,_=])/gm, '')})
    }, [query])

    return (
        <React.Fragment>
            <HtmlHead
                title={(searchString && searchString.length > 2) ? `Search results for: ${searchString} - ` : undefined}
                description={`Swarmstr Search powered by Nostr and AI models lets you easily find what you're looking for.`}
            />
            <Box className="landingPage-boxContainer" ref={boxRef}>
                {
                    !loading && bestResults.length === 0 && hasErrors && <Typography className="searchResults-apiTimeout" component="div" variant="body1">
                        Timeout. Please try again.
                        <IconButton color="error" size="small" onClick={() => { debouncedQuery(query); setLoading(true); }}><Refresh fontSize="inherit"/></IconButton>
                    </Typography>
                }
                {/*{*/}
                    {/*loading && <Typography className="searchResults-loadingResults" component="div" variant="body1">*/}
                        {/*<LoadingAnimation isLoading={loading}/>*/}
                    {/*</Typography>*/}
                {/*}*/}
                {
                    !loading && !hasErrors && bestResults.length > 0 && <Typography component="div" variant="body1">{bestResults.length} results</Typography>
                }
                {
                    loaded && bestResults.length === 0 && <Typography className="searchResults-noResults" component="div" variant="body1">No results for: {decodeURIComponent(query)}</Typography>
                }
                {/*<NostrEventListContextProvider events={bestResults} sort={sort}>*/}
                    {/*<EventListSort/>*/}
                    {/*<EventListWrapper>*/}
                        {/*<EventList floating={false}/>*/}
                    {/*</EventListWrapper>*/}
                {/*</NostrEventListContextProvider>*/}
                <Backdrop open={showPreloader} />
            </Box>
            {
                searchSuggestions && Array.isArray(searchSuggestions) && searchSuggestions.length > 0 && <Box>
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