import {Note} from "../Note/Note";
import React, {useEffect, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {Link, useNavigate} from "react-router-dom";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";
import Button from "@mui/material/Button";
import {ArrowBack} from "@mui/icons-material";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {NewLabelDialog} from "../../../dialog/NewLabelDialog";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {request} from "../../../services/request";
import ButtonGroup from "@mui/material/ButtonGroup";
import { orderBy, chunk } from 'lodash';
import './Thread.css';
import {Config} from "../../../resources/Config";

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
}

export const NoteThread = ({ nevent, data = {}, children, expanded, floating }: ThreadProps) => {
    const { id } = nevent && nip19.decode(nevent).data;

    const filter: NDKFilter = { kinds: [1], '#e': [id] };

    const { subscribe } = useNostrNoteThreadContext();

    const navigate = useNavigate();

    const events = useLiveQuery(async () => {
       const events = await db.notes
           .where({ referencedEventId: id })
           // filter spam notes
           .filter(({ content }) => !content.toLowerCase().includes('airdrop is live') &&
               !content.toLowerCase().includes('claim your free $'))
           .toArray();
       return events;
    }, [id]);

    const [stats, setStats] = useState<any>({});
    const [sort, setSort] = useState<'score' | 'zap' | 'recent'>('score');

    useEffect(() => {
        if (events && events.length > 0) {
            const ids = events!.map((e: NostrEvent) => e.id);
            ids && chunk(ids, 10)
                // @ts-ignore
                .forEach((_ids: string[]) => {
                    request({
                        url: `https://api.nostr.band/v0/stats/event/batch?objects=${_ids.join(',')}`,
                        method: 'GET'
                    }).then((response) => {
                        setStats({
                            ...stats,
                            ...response.data.stats
                        });
                    })
                });
        }
    }, [events]);

    useEffect(() => {
        subscribe(filter);
    }, []);

    const calculateScore = (id: string) => {
        if (!stats) return 0;

        const { zaps , reaction_count, repost_count, report_count } = stats[id] || { zaps: { count: 0 }, reaction_count: 0, repost_count: 0, report_count: 0 };
        return ((zaps?.count || 0) + ((reaction_count || 0) * 0.5) + ((repost_count || 0) * 0.25)) - (report_count || 0);
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
                    <meta property="og:image" content="" />
                    <meta property="og:description" content={ Config.APP_DESCRIPTION } />

                    <meta itemProp="name" content={`${ nevent } - Swarmstr.com`} />
                    <meta itemProp="image" content="" />

                    <meta name="twitter:title" content={`${ nevent } - Swarmstr.com`} />
                    <meta name="twitter:description" content={ Config.APP_DESCRIPTION } />
                    <meta name="twitter:image" content="" />

                </Helmet>
            }

            <List>

                {
                    expanded && <ListItem key={'nostr-resources-nav-back'}>
                        <Button sx={{ textTransform: 'capitalize', fontSize: '16px', borderRadius: '18px' }} color="secondary" variant="outlined" onClick={() =>
                            // @ts-ignore
                            navigate(-1, { replace: false })
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
                        { !events && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">Loading answers...</Typography> }
                        { (events && events.length === 0) && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">No answers yet...</Typography> }
                        {
                            (orderBy(events, ({id, created_at}) => {
                                switch (sort) {
                                    case 'score':
                                        const score = calculateScore(id!);
                                        return score;
                                    case 'zap':
                                        return stats && stats[id!] && stats[id!].zaps ? stats[id!].zaps.count : 0;
                                    case 'recent':
                                        return created_at;
                                }
                            }, (sort === 'score' || sort === 'zap') ? 'desc' : 'asc') || [])
                                .map((event: NostrEvent) => ({
                                    _nevent: nip19.neventEncode({ id: event.id, author: event.pubkey }),
                                    event
                                    }))
                                .map(({_nevent, event}) => (
                                    <NostrNoteContextProvider thread={true}>
                                        <Note key={`${_nevent}-content`} nevent={_nevent} event={event} floating={floating} />
                                    </NostrNoteContextProvider>
                                ))
                        }
                    </List>
                }
            </List>
        </React.Fragment>
    );
};