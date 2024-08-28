import Note from "../Note/Note";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, ListItem, SelectChangeEvent} from "@mui/material";
import List from "@mui/material/List";
import {useLocation, useNavigate} from "react-router-dom";
import {nip19, NostrEvent} from 'nostr-tools';
import Button from "@mui/material/Button";
import {ArrowBack} from "@mui/icons-material";
import NostrNoteThreadContextProvider, {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NDKEvent, NDKFilter, NDKTag} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useManageSubs, valueFromTag} from "../../../utils/utils";
import Typography from "@mui/material/Typography";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import './Thread.css';
import {Config} from "../../../resources/Config";
import {EventListWrapper} from "../EventListWrapper/EventListWrapper";
import EventList, {Sort} from "../EventList/EventList";
import NostrEventListContextProvider from "../../../providers/NostrEventListContextProvider";
import {TagSelect} from "../TagSelect/TagSelect";
import {NoteMeta} from "../NoteMeta/NoteMeta";
import {subscribe} from "../../../services/nostr/relays";
import {EventListSort} from "../EventListSort/EventListSort";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

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
    showReplies?: boolean;
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

const NoteThread = ({ data = {}, children, expanded, floating, depth = 0, showReplies = false, ...props }: ThreadProps) => {
    const { id, pubkey, kind, nevent, event, eventStore, visible } = useNostrNoteThreadContext();

    // const threadRef = useRef(null);

    // const threadIsVisible = noteIsVisible(threadRef);

    // const filter: NDKFilter = { kinds: [1, 7, 9735, 30023, 6, /*1985*/], '#e': [id] };

    // const [event, loaded] = useLiveQuery(async () => {
    //     const event = await db.notes.get({id});
    //     console.log('Thread: event: ', {event})
    //     return [event, true];
    // }, [id], [undefined, false]);

    const parentEvent = useMemo(() => event, [event]);

    const parentNevents = useMemo(() => {
        if (!event || !valueFromTag(event!, 'e')) return [];
        console.log('Thread: ', {parentId: valueFromTag(event!, 'e')})
        let identifiers: string[] = [];
        try {
            identifiers = event!
                .tags
                .filter((tag: NDKTag) => tag[0] === 'e' && !!tag[1])
                .map((tag: NDKTag) => nip19.neventEncode({ id: tag[1] }));
        } catch (error) {
            console.error('parentNevents: ', {error});
        }
        return identifiers;
    }, [id, event]);

    if (parentNevents.includes(nip19.neventEncode({id}))) return;

    // const parentEvent = useMemo(() => event, [loaded]);

    // const events = useLiveQuery(async () => {
    //     const events = await db.notes
    //         .where('referencedEventsIds').equals(id).toArray();
    //     console.log('Thread: events: ', {events});
    //     return events;
    // }, [id]);

    // const commentEvents = useMemo(() => events, [events?.length || 0]);

    const commentEvents = useMemo(() => eventStore.getEvents()
        // @ts-ignore
        ?.filter(({kind, ...event}) => (kind === 1 || kind === 30023) && event.id !== id &&
            !event.tags.includes(['q', id] as NDKTag)
        )
    , [eventStore, visible]);



    // const { stats, connected, loaded } = useNostrNoteThreadContext();
    const {ndk, connected} = useNostrContext();
    const {addSub, stopAllSubs} = useManageSubs({ndk, subscribe});

    // const { highlightedNote, setHighlightedNote } = useThreadPoolContext();

    const navigate = useNavigate();

    const [sort, setSort] = useState<Sort>(Sort.MOST_ZAPPED);

    const location = useLocation();

    // const subIds = useRef<string[]>([]);

    // const [blockScroll, allowScroll] = useScrollBlock();

    // const [largeSubTime, setLargeSubTime] = useState<number>();

    // useEffect(() => {
    //     if (threadIsVisible && !(pubkey && kind === 30023)) {
    //         if (!parentEvent) {
    //             // addSub({ ids: [id] }, { closeOnEose: true, groupable: true, groupableDelay: 100 });
    //             // console.log('Thread: addSub: ', { ids: [id] })
    //         }
    //         // addSub({...filter, /*...(commentEvents!.length > 0) && { since: commentEvents[0]?.created_at }*/}, { groupable: true, closeOnEose: true, groupableDelay: 100 });
    //         // addSub({...filter, since: largeSubTime || Math.floor(Date.now() / 1000)}, { groupable: false, closeOnEose: false });
    //         // console.log(`Thread: starting sub ${id}`);
    //         // subIds.current.push(subId);
    //     }
    //     if (!threadIsVisible) {
    //         console.log(`Thread: stopping subs ${subIds.current.join(',')}`);
    //         stopAllSubs();
    //     }
    // }, [threadIsVisible]);

    useEffect(() => {
        if (!connected) return;
        // get root note and comment notes
        // getEventsAsPromise(ndk, filter)
        //     .then((events: NostrEvent[]) => {
        //         console.log('Thread: event: ', {events});
        //         if (events) {
        //             setCommentEvents(events!.filter(({kind}) => kind === 1 || kind === 30023));
        //         }
        //     });

        // getEventsAsPromise(ndk, { ids: [id] })
        //     .then((events: NostrEvent[]) => {
        //         console.log('Thread: event: ', {events});
        //         if (events[0]) {
        //             setParentEvent(events[0]);
        //         }
        //     });
        // const time = Math.floor(Date.now() / 1000);
        // @ts-ignore
        // addSub({...filter}, { groupable: true, closeOnEose: true, groupableDelay: 100 });
        // console.log(`Thread: sub ${id}`);
        // setLargeSubTime(time);
        return () => {
            console.log(`Thread: sub ${id} closing`);
            stopAllSubs();
        };
    }, [connected]);

    // useEffect(() => {
    //     console.log(`Thread: loaded status changed`, {loaded});
    //     if (parentNevents.length > 0 && loaded && expanded) {
    //         console.log('Thread: ', {parentNevents, loaded, expanded})
    //         setHighlightedNote({id, depth});
    //         // blockScroll();
    //         // navigate(`#${id}`);
    //     }
    // }, [!loaded]);

    // useEffect(() => {
    //     if (loaded && highlightedNote && highlightedNote.depth < depth) {
    //         console.log(`Thread: notes below level ${depth} loaded...`);
    //         allowScroll();
    //         navigate(`#${highlightedNote.id}`);
    //     }
    // }, [loaded]);

    // useEffect(() => {
    //     console.log(`Thread: `, {depth}, {highlightedNote});
    //     if (highlightedNote && highlightedNote.depth < depth) {
    //         console.log(`Thread: notes below level ${depth} loaded...`);
    //         navigate(`#${highlightedNote.id}`);
    //     }
    // }, [highlightedNote, !loaded]);

    // useEffect(() => {
    //     console.log('Thread: ', {highlightedNote, id})
    // }, [highlightedNote])

    const goBack = useCallback(() => {
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
    }, [location]);

    useEffect(() => {
        console.log('Thread: events: commentEvents', {commentEvents});
    }, [commentEvents])

    return (
        <React.Fragment>
            {
                expanded && parentEvent && <NoteMeta event={parentEvent}/>
            }

            <List sx={{ padding: 0 }} id={`note-thread-${id}`}>

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
                        <NostrNoteThreadContextProvider nevent={nevent}>
                            <NoteThread
                                key={`${nevent}-thread`}
                                nevent={nevent}
                                floating={false}
                                depth={i}
                                // expanded={expanded}
                            >
                                <NostrNoteContextProvider>
                                    <Note key={`${nevent}-content`} nevent={nevent} floating={false}/>
                                </NostrNoteContextProvider>
                            </NoteThread>
                        </NostrNoteThreadContextProvider>
                        {/*<Link to={`/e/${parentNevent}#${id}`}>Load more</Link>*/}
                    </ListItem>)
                }
                <ListItem
                    key={`${id}-container`}
                    className={expanded ? 'rootNote-container' : ''}
                    sx={{
                        padding: 0,
                        ...(expanded && parentNevents && parentNevents.length > 0 && { width: `${100 - depth * 10}%!important`, margin: 'auto' })
                    }}>
                    {children}
                </ListItem>
                {
                    (expanded || !expanded && showReplies) && <List key={`${nevent}-answers`} sx={{ width: '90%', margin: 'auto', padding: '0!important' }}>
                        { !commentEvents && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">Loading notes...</Typography> }
                        { (commentEvents && commentEvents.length === 0 && !showReplies) && <Typography className="thread-repliesPlaceholder" component="div" variant="body1">No replies yet...</Typography> }


                        <NostrEventListContextProvider limit={10} eventStore={eventStore}>
                            { expanded && commentEvents.length > 0 && <EventListSort/> }
                            <EventListWrapper>
                                <EventList expanded={showReplies} parentId={id} grandparentId={parentEvent && valueFromTag(parentEvent!, 'e')} depth={(parentNevents.length > 0 ? depth + parentNevents.length : depth)} floating={floating}/>
                            </EventListWrapper>
                        </NostrEventListContextProvider>
                    </List>
                }
                {
                    expanded && <ListItem sx={{ flexDirection: 'column' }}>
                        {/*<Typography variant="h6" component="div">Reply</Typography>*/}
                        <TextField
                            sx={{ width: '100%' }}
                            id="content"
                            name="content"
                            label={ 'Write a quick reply...' }
                            multiline
                            rows={5}
                            // value={''}
                            onChange={(event: any) => {
                                // console.log('content event', {event}, formik.values.content)
                                // formik.setFieldValue('content', event.target.value);
                                // setContent(event.target.value);
                                // formik.handleChange(event);
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Button
                                    sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '18px'
                                    }}
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        // setLoading(true);
                                        // post(formik.values.content, tags, kind)
                                        //     .then(() => {
                                        //         formik.setFieldValue('content', '');
                                        //         formik.setFieldValue('title', '');
                                        //         setEvent(undefined);
                                        //         setLoading(false);
                                        //         onClose && onClose();
                                        //     })
                                    }} autoFocus
                                >
                                    Add reply
                                </Button></InputAdornment>
                            }}
                        />
                        {/*<Box*/}
                        {/*sx={{*/}
                        {/*padding: '3px',*/}
                        {/*textAlign: 'right',*/}
                        {/*width: '100%'*/}
                        {/*}}*/}
                        {/*>*/}
                        {/*<Button*/}
                        {/*sx={{*/}
                        {/*textTransform: 'capitalize',*/}
                        {/*borderRadius: '18px'*/}
                        {/*}}*/}
                        {/*variant="contained"*/}
                        {/*color="warning"*/}
                        {/*onClick={() => {*/}
                        {/*// setLoading(true);*/}
                        {/*// post(formik.values.content, tags, kind)*/}
                        {/*//     .then(() => {*/}
                        {/*//         formik.setFieldValue('content', '');*/}
                        {/*//         formik.setFieldValue('title', '');*/}
                        {/*//         setEvent(undefined);*/}
                        {/*//         setLoading(false);*/}
                        {/*//         onClose && onClose();*/}
                        {/*//     })*/}
                        {/*}} autoFocus*/}
                        {/*>*/}
                        {/*Add reply*/}
                        {/*</Button>*/}
                        {/*</Box>*/}
                    </ListItem>
                }
            </List>
            {/*<LoadingDialog open={!loaded}/>*/}
        </React.Fragment>
    );
};

export default React.memo(NoteThread);