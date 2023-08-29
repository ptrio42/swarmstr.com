import React, {useEffect, useMemo, useRef, useState} from "react";
import {Box} from "@mui/material";
import {useNostrFeedContext} from "../../../providers/NostrFeedContextProvider";
import {NDKFilter, NDKRelay, NDKSubscription, NDKTag} from "@nostr-dev-kit/ndk";
import {nip19} from "nostr-tools";
import {Link, useSearchParams} from "react-router-dom";
import { containsTag } from "../../../utils/utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {groupBy, uniqBy, sortBy, uniq} from 'lodash'
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
import {debounce} from 'lodash';
import {useParams, useNavigate} from "react-router-dom";

export const Search = () => {
    const { events, clearEvents, loading, query, setQuery, startSubs, stopSubs } = useNostrFeedContext();
    const { searchString } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    // const searchString = searchParams.get('s');
    const nevent = searchParams.get('e');

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [showPreloader, setShowPreloader] = useState<boolean>(true);

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

    const filteredEvents = useMemo(() =>
        uniqBy(sortBy(events, 'created_at').reverse(), 'id'), [events]);

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
            startSubs({ search: query }, filteredEvents);
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
                <SearchResults
                    search={searchString !== null && <SearchBar
                        query={searchString || ''}
                        resultsCount={events.length}
                        onQueryChange={(event: any) => {
                            navigate(`/search/${encodeURIComponent(event.target.value)}`);
                        }}
                        isQuerying={loading}
                    />}
                    results={filteredEvents}
                >
                        <EventList/>
                </SearchResults>
                {
                    (!searchString || (searchString && (searchString === '' || searchString.length < 2))) &&
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
                                            navigate(`/search/${tag}`);
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
                navigate(`/search/${searchString}?e=`);
            }}/>
        </React.Fragment>
    )
};