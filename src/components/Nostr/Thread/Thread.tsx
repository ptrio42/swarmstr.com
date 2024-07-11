import {Note} from "../Note/Note";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ListItem, SelectChangeEvent} from "@mui/material";
import List from "@mui/material/List";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";
import Button from "@mui/material/Button";
import {ArrowBack} from "@mui/icons-material";
import {decodeEventPointer, useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NDKEvent, NDKFilter, NostrEvent, NDKTag} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag, noteIsVisible, useScrollBlock, valueFromTag} from "../../../utils/utils";
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
import {EventPointer} from "nostr-tools/lib/types/nip19";
import {TagSelect} from "../TagSelect/TagSelect";
import {LoadingAnimation} from "../../LoadingAnimation/LoadingAnimation";
import {LoadingDialog} from "../../../dialog/LoadingDialog";
import {useThreadPoolContext} from "../ThreadWrapper/ThreadWrapper";
import {NoteMeta} from "../NoteMeta/NoteMeta";

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
    };
    depth?: number;
}

// export const decodeNevent = (nevent: string): EventPointer => {
//     // console.log('decodeNevent', {nevent})
//     let decoded: EventPointer = { id: '' };
//     try {
//         const
//         decoded = { ...(nevent && nip19.decode(nevent)!.data) as any}
//     } catch (error) {}
//     return decoded;
// };

export const NoteThread = ({ nevent, data = {}, children, expanded, floating, depth = 0, ...props }: ThreadProps) => {
    // @ts-ignore
    const { id } = nevent && decodeEventPointer(nevent);

    const threadRef = useRef(null);

    const threadIsVisible = noteIsVisible(threadRef);

    const filter: NDKFilter = { kinds: [1, 7, 9735, 30023, 6, 1985], '#e': [id] };

    const parentEvent = useLiveQuery(async () => db.notes.get({id}));

    const parentNevents = useMemo(() => {
        if (!parentEvent || !valueFromTag(parentEvent, 'e')) return [];
        console.log('Thread: ', {parentId: valueFromTag(parentEvent, 'e')})
        return parentEvent
            .tags
                .filter((tag: NDKTag) => tag[0] === 'e')
                .map((tag: NDKTag) => nip19.neventEncode({ id: tag[1] }));
    }, [id, parentEvent]);

    const { subscribe, unsubscribe, commentEvents, stats, connected, loaded } = useNostrNoteThreadContext();

    const { highlightedNote, setHighlightedNote } = useThreadPoolContext();

    const navigate = useNavigate();

    const [sort, setSort] = useState<'score' | 'zap' | 'recent'>('score');

    const location = useLocation();

    const subIds = useRef<string[]>([]);

    const [blockScroll, allowScroll] = useScrollBlock();

    const calculateScore = useCallback((id: string) => {
        if (!stats) return 0;

        const { zaps , reaction_count, repost_count, report_count } = stats[id] || { zaps: { count: 0 }, reaction_count: 0, repost_count: 0, report_count: 0 };
        return ((+zaps?.msats/10000 || 0) + ((reaction_count || 0) * 0.5) + ((repost_count || 0) * 0.25)) - (report_count || 0);
    }, [stats]);

    const filteredCommentEvents = useMemo(() => {
        console.log('NoteThread: commentEvents', {commentEvents})
        // if (!sort || !connected || !stats) return [];
        // @ts-ignore
        return (orderBy(commentEvents
            // .filter(({tags}) => tags.filter((tag: NDKTag) => tag[0] === 'e').length >= (parentNevent ? depth + 1 : depth))
            .filter((e) => !!e), ({created_at, ..._event}: NostrEvent) => {
            switch (sort) {
                case 'score':
                    const score = calculateScore(_event.id!);
                    return score;
                case 'zap':
                    return stats && stats[_event.id!] && stats[_event.id!].zaps ? +stats[_event.id!].zaps.msats : 0;
                case 'recent':
                    return created_at;
            }
        }, (sort === 'score' || sort === 'zap') ? 'desc' : 'asc') || [])
    }, [commentEvents, sort, stats, connected]);

    useEffect(() => {
        if (connected && threadIsVisible) {
            const subId = subscribe(filter, { groupable: false, closeOnEose: false });
            console.log(`Thread: starting sub ${subId}`);
            subIds.current.push(subId);
        }
        if (!threadIsVisible && subIds.current.length > 0) {
            console.log(`Thread: stopping subs ${subIds.current.join(',')}`);
            unsubscribe(subIds.current);
        }
    }, [connected, threadIsVisible]);

    useEffect(() => {
        return () => {
            unsubscribe(subIds.current);
        };
    }, []);

    useEffect(() => {
        console.log(`Thread: loaded status changed`, {loaded});
        if (parentNevents.length > 0 && loaded && expanded) {
            console.log('Thread: ', {parentNevents, loaded, expanded})
            setHighlightedNote({id, depth});
            // blockScroll();
            // navigate(`#${id}`);
        }
    }, [!loaded]);

    useEffect(() => {
        if (loaded && highlightedNote && highlightedNote.depth < depth) {
            console.log(`Thread: notes below level ${depth} loaded...`);
            allowScroll();
            navigate(`#${highlightedNote.id}`);
        }
    }, [loaded]);

    // useEffect(() => {
    //     console.log(`Thread: `, {depth}, {highlightedNote});
    //     if (highlightedNote && highlightedNote.depth < depth) {
    //         console.log(`Thread: notes below level ${depth} loaded...`);
    //         navigate(`#${highlightedNote.id}`);
    //     }
    // }, [highlightedNote, !loaded]);

    useEffect(() => {
        console.log('Thread: ', {highlightedNote, id})
    }, [highlightedNote])

    const goBack = () => {
        const previousUrl = location?.state?.previousUrl;
        console.log('Thread: previousUrl', {previousUrl})
        const opts = { preventScrollReset: true, replace: false };
        if (previousUrl === '/' || previousUrl === '/recent' || previousUrl.includes('/recent')) {
            // navigate(`${previousUrl}#${id}`, opts);
            // navigate(-1);
            navigate(`${previousUrl}#${id}`, { ...opts, state: {
                id,
                ...(location?.state?.limit && {
                    // events: location?.state?.events.slice(0, location?.state?.limit),
                    limit: location?.state?.limit
                })
            }});
        } else if (new RegExp(/\/d\//).test(previousUrl)) {
            navigate(`${previousUrl}#${id}`);
        } else {
            console.log('Thread: navigate(-1)')
            navigate(-1);
        }
    };

    return (
        <React.Fragment>
            {
                expanded && parentEvent && <NoteMeta event={parentEvent}/>
            }

            <List sx={{ paddingBottom: 0, paddingTop: 0 }} id={`note-thread-${id}`}>

                {
                    expanded && <ListItem key={'nostr-resources-nav-back'} sx={{ justifyContent: 'space-between' }}>
                        <Button sx={{ textTransform: 'capitalize', fontSize: '16px', borderRadius: '18px' }} color="secondary" variant="outlined" onClick={() =>
                            // @ts-ignore
                            goBack()
                        }>
                            <ArrowBack sx={{ fontSize: 18, marginRight: 1 }} />
                            Back
                        </Button>
                        <TagSelect
                            tags={Config.NOSTR_TAGS}
                            onTagSelect={(event: SelectChangeEvent) => {
                                navigate(`/recent/${event.target.value as string}`);
                            }}
                        />
                        {/*{*/}
                            {/*floating && <React.Fragment>*/}
                                {/*<Button component={Link} to={`/e/${nevent}`}>Open</Button>*/}
                                {/*<Button component={Link} to="/?s=">Search</Button>*/}
                            {/*</React.Fragment>*/}
                        {/*}*/}
                    </ListItem>
                }
                {
                    expanded && parentNevents && parentNevents.map((nevent: string, i: number) => <ListItem className="replyParent">
                        <NoteThread
                            key={`${nevent}-thread`}
                            nevent={nevent}
                            floating={false}
                            depth={i}
                        >
                            <NostrNoteContextProvider>
                                <Note key={`${nevent}-content`} nevent={nevent} floating={false}/>
                            </NostrNoteContextProvider>
                        </NoteThread>
                        {/*<Link to={`/e/${parentNevent}#${id}`}>Load more</Link>*/}
                    </ListItem>)
                }
                <ListItem
                    ref={threadRef}
                    key={`${id}-container`}
                    className={expanded ? 'rootNote-container' : ''}
                    sx={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        ...(expanded && parentNevents && parentNevents.length > 0 && { width: `${100 - depth * 10}%!important`, margin: 'auto' })
                    }}>
                    {children}
                </ListItem>
                {
                    expanded && <ListItem
                        key={`${id}-replySort`}
                        sx={{
                            justifyContent: 'flex-end',
                            ...(parentNevents && parentNevents.length > 0 && { width: `${100 - depth * 10}%!important`, margin: 'auto' })
                        }}>
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
                    loaded && expanded && <List key={`${nevent}-answers`} sx={{ width: '90%', margin: 'auto' }}>
                        { !commentEvents && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">Loading answers...</Typography> }
                        { (commentEvents && commentEvents.length === 0) && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">No answers yet...</Typography> }

                        <NostrEventListContextProvider limit={10} events={filteredCommentEvents}>
                            <EventListWrapper>
                                <EventList parentId={id} grandparentId={parentEvent && valueFromTag(parentEvent, 'e')} depth={(parentNevents.length > 0 ? depth + parentNevents.length : depth)} floating={floating}/>
                            </EventListWrapper>
                        </NostrEventListContextProvider>
                    </List>
                }
            </List>
            {/*<LoadingDialog open={!loaded}/>*/}
        </React.Fragment>
    );
};