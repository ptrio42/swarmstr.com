import {Note} from "../Note/Note";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";
import Button from "@mui/material/Button";
import {ArrowBack} from "@mui/icons-material";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NDKEvent, NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {NewLabelDialog} from "../../../dialog/NewLabelDialog";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {request} from "../../../services/request";
import ButtonGroup from "@mui/material/ButtonGroup";
import { orderBy, chunk, uniqBy } from 'lodash';
import './Thread.css';
import {Config} from "../../../resources/Config";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import {EventList} from "../EventList/EventList";
import {NostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";

interface ThreadProps {
    nevent?: string;
    children?: any;
    expanded?: boolean;
    render?: boolean;

    data?: {
        noteId?: string
        events?: any[];
        event?: any;
    }
    floating?: boolean;
    state?: {
        events?: NostrEvent[]
    }
}

export const NoteThread = ({ nevent, data = {}, children, expanded, floating, ...props }: ThreadProps) => {
    const { id } = nevent && nip19.decode(nevent).data;

    const filter: NDKFilter = { kinds: [1], '#e': [id] };

    const { subscribe, commentEvents, stats } = useNostrNoteThreadContext();

    const navigate = useNavigate();

    const [sort, setSort] = useState<'score' | 'zap' | 'recent'>('score');

    const location = useLocation();

    const calculateScore = useCallback((id: string) => {
        if (!stats) return 0;

        const { zaps , reaction_count, repost_count, report_count } = stats[id] || { zaps: { count: 0 }, reaction_count: 0, repost_count: 0, report_count: 0 };
        return ((+zaps?.msats/10000 || 0) + ((reaction_count || 0) * 0.5) + ((repost_count || 0) * 0.25)) - (report_count || 0);
    }, [stats]);

    const filteredCommentEvents = useMemo(() => {
        return (orderBy(commentEvents, ({id, created_at}) => {
            switch (sort) {
                case 'score':
                    const score = calculateScore(id!);
                    return score;
                case 'zap':
                    return stats && stats[id!] && stats[id!].zaps ? +stats[id!].zaps.msats : 0;
                case 'recent':
                    return created_at;
            }
        }, (sort === 'score' || sort === 'zap') ? 'desc' : 'asc') || [])
    }, [commentEvents, sort, stats]);

    useEffect(() => {
        subscribe(filter);
    }, []);

    const goBack = () => {
        const previousUrl = location?.state?.previousUrl;
        const opts = { preventScrollReset: true, replace: false };
        if (previousUrl === '/' || previousUrl === '/recent') {
            navigate(`${previousUrl}#${id}`, { ...opts, state: {
                id,
                events: location?.state?.events,
                limit: location?.state?.limit
            }});
        } else if (new RegExp(/\/d\//).test(previousUrl)) {
            navigate(`${previousUrl}#${id}`);
        } else {
            navigate(-1);
        }
    };

    return (
        <React.Fragment>
            {
                expanded && <Helmet>
                    <title>{`Thread ${ nevent } - Swarmstr.com`}</title>
                    <meta property="description" content={ Config.APP_DESCRIPTION } />
                    <meta property="keywords" content={ Config.APP_KEYWORDS } />

                    <meta property="og:url" content={process.env.BASE_URL + '/e/' + nevent } />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={`Thread ${ nevent } - Swarmstr.com`} />
                    <meta property="og:image" content={ Config.APP_IMAGE } />
                    <meta property="og:description" content={ Config.APP_DESCRIPTION } />

                    <meta itemProp="name" content={`${ nevent } - Swarmstr.com`} />
                    <meta itemProp="image" content={ Config.APP_IMAGE } />

                    <meta name="twitter:title" content={`${ nevent } - Swarmstr.com`} />
                    <meta name="twitter:description" content={ Config.APP_DESCRIPTION } />
                    <meta name="twitter:image" content={ Config.APP_IMAGE } />

                </Helmet>
            }

            <List id={id}>

                {
                    expanded && <ListItem key={'nostr-resources-nav-back'}>
                        <Button sx={{ textTransform: 'capitalize', fontSize: '16px', borderRadius: '18px' }} color="secondary" variant="outlined" onClick={() =>
                            // @ts-ignore
                            goBack()
                        }>
                            <ArrowBack sx={{ fontSize: 18, marginRight: 1 }} />
                            Back
                        </Button>
                        {/*{*/}
                            {/*floating && <React.Fragment>*/}
                                {/*<Button component={Link} to={`/e/${nevent}`}>Open</Button>*/}
                                {/*<Button component={Link} to="/?s=">Search</Button>*/}
                            {/*</React.Fragment>*/}
                        {/*}*/}
                    </ListItem>
                }
                <ListItem key={`${id}-container`} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                    {children}
                </ListItem>
                {
                    expanded && <ListItem key={`${id}-replySort`} sx={{ justifyContent: 'flex-end' }}>
                        <ButtonGroup sx={{ boxShadow: 'none' }} variant="contained" aria-label="reply sort">
                            <Button
                                color={'primary'}
                                sx={{ textTransform: 'capitalize', padding: '7px', fontSize: '15px',
                                    ...(sort !== 'score' && { backgroundColor: 'rgba(240, 230, 140, .5)', fontWeight: '300' } || { fontWeight: '400' }) }}
                                onClick={() => setSort('score')}
                            >Best answers
                            </Button>
                            <Button color={'primary'}
                                    sx={{ textTransform: 'capitalize', padding: '7px', fontSize: '15px', ...(sort !== 'zap' && { backgroundColor: 'rgba(240, 230, 140, .5)', fontWeight: '300' } || { fontWeight: '400' }) }}  onClick={() => setSort('zap')}>Most zapped</Button>
                            <Button color={'primary'} sx={{ textTransform: 'capitalize', padding: '7px', fontSize: '15px', ...(sort !== 'recent' && { backgroundColor: 'rgba(240, 230, 140, .5)', fontWeight: '300' } || { fontWeight: '400' }) }}  onClick={() => setSort('recent')}>Date added</Button>
                        </ButtonGroup>
                    </ListItem>
                }
                {
                    expanded && <List key={`${nevent}-answers`} sx={{ width: '90%', margin: 'auto' }}>
                        { !commentEvents && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">Loading answers...</Typography> }
                        { (commentEvents && commentEvents.length === 0) && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">No answers yet...</Typography> }

                        <NostrEventListContextProvider limit={5} events={filteredCommentEvents}>
                            <EventListWrapper>
                                <EventList floating={floating}/>
                            </EventListWrapper>
                        </NostrEventListContextProvider>
                    </List>
                }
            </List>
        </React.Fragment>
    );
};