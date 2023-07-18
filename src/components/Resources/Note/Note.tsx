import parse, {DOMNode, HTMLReactParserOptions} from 'html-react-parser';
import React, {FC, lazy, useCallback, useEffect, useMemo, useRef, useState, Suspense} from "react";
import {
    CopyAll,
    DoneOutline,
    IosShare, Launch, MoreHoriz,
    QrCodeScanner,
    UnfoldLess,
    UnfoldMore,
    Note as NoteIcon, ChatBubbleOutline, ElectricBolt
} from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Metadata, QrCodeDialog} from "../Metadata/Metadata";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import {nip19} from 'nostr-tools';
import {Reaction, Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import './Note.css';
import { Element, isTag } from 'domhandler';
import {Link, useSearchParams} from "react-router-dom";
import {processText} from "../../../services/util";
import {NoteThread} from "../Thread/Thread";
import {Skeleton} from "@mui/material";
import ReactPlayer from 'react-player';
import NDK, {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscription, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider, useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import { intersection } from 'lodash';
import {containsTag, matchString, nFormatter, noteIsVisible} from "../../../utils/utils";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import CircularProgress from "@mui/material/CircularProgress";
import {NewNoteDialog} from "../../../dialog/NewNoteDialog";
import {ZapDialog} from "../../../dialog/ZapDialog";
import {ZapEvent} from "../../../models/commons";

const ReactMarkdown = lazy(() => import('react-markdown'));
const MDEditor = lazy(() => import('@uiw/react-md-editor'));
// const rehypeRaw = lazy(() => import('rehype-raw'));
import rehypeRaw from 'rehype-raw'
import Tooltip from "@mui/material/Tooltip";

interface NoteProps {
    noteId?: string;
    pinned?: boolean;
    handleThreadToggle?: (expanded: boolean) => any;
    handleNoteToggle?: (expanded: boolean) => any;
    isThreadExpanded?: boolean;
    isCollapsable?: boolean;
    handleUpReaction?: (noteId: string, reaction?: string) => void;
    handleDownReaction?: (noteId: string, reaction?: string) => void;
    isRead?: boolean;
    data?: {
        event?: any;
    };
    threadView?: boolean;
    nevent: string;
    context?: 'feed' | 'thread';
    expanded?: boolean;

    onSearchQuery?: (nevent: string, display: boolean) => void
}

const MetadataMemo = React.memo(Metadata);

export const Note = ({ nevent, context, noteId, pinned, handleNoteToggle, handleThreadToggle, isCollapsable, handleUpReaction,
     handleDownReaction, isThreadExpanded, isRead, data = {}, threadView = false, onSearchQuery, expanded }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [parsedContent, setParsedContent] = useState<any>();

    const { subscribe, addReaction, zap, subs } = useNostrNoteContext();

    const { id, author } = nip19.decode(nevent).data;
    const filter: NDKFilter = { kinds: [1], ids: [id]};
    const filter1: NDKFilter = { kinds: [1, 7, 9735, 30023], '#e': [id]};

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    const [event, loaded] = useLiveQuery(async () => {
        const event = await db.notes.get({ id });
        // console.log('useLiveQuery', {event});
        // if (event) {
        //     const {type, ...nostrEvent} = event;
        //     return nostrEvent;
        // }
        return [event, true];
    }, [id], []);

    const zapEvents = useLiveQuery(async () => {
        const zapEvents = await db.zaps
            .where({ zappedNote: id })
            .toArray();
        return zapEvents;
    }, [id]);

    const reactionEvents = useLiveQuery(async () => {
        const reactionEvents = await db.reactions
            .where({ reactedToEventId: id })
            .toArray();
        return reactionEvents;
    }, [id]);

    const commentEvents = useLiveQuery(async () => {
        const commentEvents = await db.notes
            .where({ referencedEventId: id })
            .toArray();
        return commentEvents;
    }, [id]);


    const noteRef = useRef(null);
    const noteVisible = noteIsVisible(noteRef);

    const { user, setLoginDialogOpen } = useNostrContext();

    const [newReplyDialogOpen, setNewReplyDialogOpen] = useState<boolean>(false);
    const [zapDialogOpen, setZapDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            subs && subs
                .forEach((sub: NDKSubscription) => {
                    // console.log('stopping sub...', {sub})
                    sub.stop();
                })
        }
    }, []);

    useEffect(() => {
        if (!parsedContent && !!event?.content) {
            const _parsedContent = parseHtml(event!.content);
            setParsedContent(_parsedContent);
        }
    }, [event]);

    // useEffect(() => {
    //     console.log({loaded})
    //
    //     if (loaded) {
    //         console.log('event loaded...', 'found?', !!event);
    //     }
    // }, [loaded]);

    useEffect(() => {

        // note was displayed on screen
        // 1. wait for note event from cache
        // 2. if event isn't in cache, subscribe
        // 3. once event was received from a relay, stop subscription
        // run subs for reactions, zaps & comments in parallel

        if (noteVisible && !subscribed && loaded) {
            // only subscribe if the event does not exist in the db
            if (!event) {
                // console.log(`loaded: ${loaded} but event not in the db; subscribing...`)
                subscribe(filter);
            } else {
                // console.log('event already in the db. not subscribing...');
            }
            subscribe(filter1);
            setSubscribed(true);
        }
        if (!noteVisible && subscribed) {
            // console.log(`will stop subs for note ${id} in 3 seconds...`);
            setTimeout(() => {
                // console.log(`stopping subs for ${id}`)
                subs && subs
                    .forEach((sub: NDKSubscription) => {
                        sub.stop();
                    });
                setSubscribed(false);
            }, 3000);
        }
    }, [noteVisible, subscribed, loaded]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleShareAnswer = useCallback((e: any) => {
        e.stopPropagation();
        event && navigator.clipboard.writeText(`${process.env.BASE_URL}/e/${nevent}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    }, []);

    const getProcessedText = useCallback((text: string) => {
        if (!text) {
            text = '';
        }
        return processText(text, event && event.tags, searchString || undefined);

    }, [event]);

    const parseHtml = useCallback((text: string) => {
        // TODO: Clean up after react-html-parser
        // return text;
        return parse(
            getProcessedText(text),
            {
                replace: (domNode) => {
                    const domElement: Element = domNode as Element;
                    if (isTag(domElement)) {
                        // @ts-ignore
                        const { attribs, children, name } = domNode;
                        if (name === 'button' && attribs.class === 'metadata-btn') {
                            const data = children.length > 0 && children[0].data;
                            try {
                                const userPubkey = nip19.decode(data)?.data || data;
                                if (userPubkey) {
                                    return  <Metadata
                                        variant={'link'}
                                        pubkey={userPubkey}
                                    />
                                }
                            } catch (error) {
                                console.error(`unable to decode npub ${data}...`, {error});
                            }
                        }
                        if (name === 'button' && attribs.class === 'thread-btn') {
                            const data = children.length > 0 && children[0].data;
                            return <NoteThread
                                key={`${data}-thread`}
                                nevent={data}
                            >
                                <NostrNoteContextProvider>
                                    <Note key={`${data}-content`} nevent={data}/>
                                </NostrNoteContextProvider>
                            </NoteThread>
                        }
                        if (name === 'button' && attribs.class === 'video-btn') {
                            let data = children.length > 0 && children[0].data;
                            if (!data.includes('https')) {
                                data = `https://www.youtube.com/watch?v=${data}`
                            }
                            return <ReactPlayer url={data} playing={true} volume={0} muted={true} loop={true} controls={true} />
                        }
                    }
                }
            }
        );
    }, [event]);

    const reacted = useCallback((type: ReactionType) => {
        // @ts-ignore
        return user && reactionEvents && !!reactionEvents
        // @ts-ignore
            .filter(r => REACTIONS.filter(r3 => r3.type === type)
            // @ts-ignore
                .map(r2 => r2.content).includes(r.content))
            .find((r1: any) => r1.pubkey && r1.pubkey === nip19.decode(user.npub).data);
    }, [user, reactionEvents]);

    const userZapEvents = useCallback(() => {
        return zapEvents?.filter(({ zapper }) => zapper === author)
    }, [zapEvents]);

    const zapped = useCallback(() => {
        const zap = user && zapEvents && zapEvents
            .find((zapEvent: ZapEvent) => zapEvent.zapper === nip19.decode(user.npub).data);
        return zap;
    }, [user, userZapEvents()]);

    const getUpReactions = useCallback(() => reactionEvents && reactionEvents
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.UP)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            .map((r3: any) => ({ type: ReactionType.UP, event: r3 }))|| []
        , [reactionEvents]);

    const getDownReactions = useCallback(() => reactionEvents && reactionEvents
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.DOWN)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            // @ts-ignore
            .map((r3: any) => ({ type: ReactionType.DOWN, event: r3 })) || []
        , [reactionEvents]);

    const getTotalZaps = useCallback(() => {
        const totalZaps = zapEvents && zapEvents
            .map((zapEvent: ZapEvent) => zapEvent.amount)
            .reduce((total: number, current: number) => total + current / 1000, 0);
        return totalZaps && nFormatter(totalZaps, 1);
    }, [zapEvents]);

    return (<React.Fragment>
        <Card
            ref={noteRef}
            sx={{
                minWidth: 275,
                marginBottom: '0.5em',
                width: '100%',
                ...(pinned && { backgroundColor: '#f1f1f1' })
            }}
            className="note"
        >
            <CardContent sx={{ paddingBottom: 0 }}>
                <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 0
                    }}
                    color="text.secondary"
                    gutterBottom
                    component="div"
                >
                    <React.Fragment>
                        <Typography component="div" sx={{ position: 'absolute', top: '1em', right: '2em', textAlign: 'end' }}>
                            <React.Fragment>
                                <IconButton
                                    color="secondary"
                                    aria-controls={menuOpen ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={(_event) => {
                                        _event.stopPropagation();
                                        handleMenuOpen(_event);
                                    }}
                                >
                                    <MoreHoriz sx={{ fontSize: 18 }} />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    id="account-menu"
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                >
                                    <MenuItem onClick={(_event) => {
                                        navigator.clipboard.writeText(nevent);
                                        setSnackBarMessage(nevent);
                                        setSnackbarOpen(true);
                                        _event.stopPropagation();
                                    }}>
                                        <CopyAll sx={{ fontSize: 18, marginRight: 1 }} /> Copy note ID
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(_) => {
                                            setDialogOpen(true);
                                        }}>
                                        <QrCodeScanner sx={{ fontSize: 18, marginRight: 1 }} /> Show QR
                                    </MenuItem>
                                    <MenuItem onClick={(_) => {
                                        const a = document.createElement('a');
                                        a.href = 'nostr:' + nevent;
                                        a.click();
                                    }}>
                                        <Launch sx={{ fontSize: 18, marginRight: 1 }}/> Open in client
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        </Typography>
                    </React.Fragment>
                </Typography>
                <Typography sx={{ display: 'flex' }} component="div">
                    <MetadataMemo
                        variant="simplified"
                        pubkey={author || (event && event.pubkey)}
                        handleCopyNpub={(npub: string) => {
                            setSnackBarMessage(npub);
                            setSnackbarOpen(true);
                        }}
                    />
                </Typography>
                <Typography
                    sx={{ textAlign: 'justify', marginTop: '1em!important', ...(!expanded && { cursor: 'pointer' }) }}
                    gutterBottom
                    variant="body2"
                    component="div"
                    {...(!expanded ? { onClick: () => {
                            const a = document.createElement('a');
                            a.href = `${process.env.BASE_URL}/e/${nevent}`;
                            a.click();
                        } } : {}) }
                >
                    {
                        // @ts-ignore
                        event && parseHtml(event.content)
                    }
                </Typography>
                {
                    !event && <React.Fragment>
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                    </React.Fragment>
                }
            </CardContent>
            {
                event && <CardActions>
                    <Typography sx={{ width: '100%' }} variant="body2" component="div">
                        <Divider sx={{ margin: '0.4em' }} component="div" />
                        <Stack sx={{ justifyContent: 'flex-start', alignItems: 'center' }} direction="row" spacing={1}>
                            <Typography sx={{ fontSize: '14px' }}>
                                Posted on {event && new Date(event.created_at*1000).toDateString()}
                            </Typography>
                        </Stack>
                        <Divider sx={{ margin: '0.4em' }} component="div" />
                        <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }} direction="row" spacing={1}>
                            <Typography component="div" sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                                <React.Fragment>
                                    <Tooltip title="Add new answer">
                                        <Button
                                            color="secondary"
                                            sx={{ textTransform: 'none' }}
                                            onClick={() => {
                                                if (user) {
                                                    setNewReplyDialogOpen(true);
                                                } else {
                                                    setLoginDialogOpen(true);
                                                }
                                            }}
                                        >
                                            <Badge
                                                badgeContent={commentEvents?.length}
                                                color="primary"
                                                className="comments-count"
                                            >
                                                <ChatBubbleOutline sx={{ fontSize: 18 }} />
                                            </Badge>
                                        </Button>
                                    </Tooltip>
                                </React.Fragment>
                            </Typography>
                            <Typography component="div" sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                { pinned &&
                                <DoneOutline color="success" />
                                }
                                <Tooltip title={`Zaps from ${(zapEvents || []).length} user(s)`}>
                                    <Button
                                        sx={{ ...(zapped() && { color: '#fbf722' }) }}
                                        color="secondary"
                                        onClick={() => {
                                            console.log('zap', {event});
                                            if (user) {
                                                setZapDialogOpen(true);
                                            } else {
                                                setLoginDialogOpen(true);
                                            }
                                        }}
                                    >
                                        {
                                            zapEvents && <React.Fragment>
                                                <ElectricBolt sx={{ fontSize: 18 }} />
                                                { getTotalZaps() }
                                            </React.Fragment>
                                        }
                                    </Button>
                                </Tooltip>
                                {
                                    reactionEvents && <React.Fragment>
                                        <Reactions
                                            reactions={getUpReactions()}
                                            type={ReactionType.UP}
                                            handleReaction={(reaction: string) => {
                                                if (user) {
                                                    addReaction(id, reaction);
                                                } else {
                                                    setLoginDialogOpen(true);
                                                }
                                            }}
                                            placeholder={REACTIONS[0].content}
                                            reacted={reacted(ReactionType.UP)}
                                        />
                                        <Reactions reactions={getDownReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
                                            if (user) {
                                                addReaction(id, reaction);
                                            } else {
                                                setLoginDialogOpen(true);
                                            }
                                        }} placeholder={REACTIONS[4].content.replace('-', '👎')} reacted={reacted(ReactionType.DOWN)} />
                                    </React.Fragment>
                                }
                                {
                                    (!reactionEvents || !zapEvents) && <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />
                                }
                                <IconButton
                                    color="secondary"
                                    sx={{ marginLeft: '0.5em' }}
                                    onClick={(event) => {
                                        handleShareAnswer(event);
                                    }}
                                >
                                    <IosShare sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Typography>
                        </Stack>
                    </Typography>
                </CardActions>
            }
        </Card>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
        />
        <NewNoteDialog open={newReplyDialogOpen} onClose={() => setNewReplyDialogOpen(false)} noteId={id} replyTo={event && [event.pubkey]} label="Your reply..." />
        <ZapDialog open={zapDialogOpen} event={event} onClose={() => setZapDialogOpen(false)} npub={author && nip19.npubEncode(author)} />
        {/*<QrCodeDialog str={event && new RegExp(/([0123456789abcdef]{64})/).test(event.id) && `nostr:${nip19.noteEncode(event.id)}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />*/}
    </React.Fragment>);
};
