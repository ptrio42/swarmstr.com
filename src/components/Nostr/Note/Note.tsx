import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    CopyAll,
    DoneOutline,
    Launch,
    MoreHoriz,
    QrCodeScanner,
    ChatBubbleOutline,
    ElectricBolt,
    Loop
} from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Metadata, QrCodeDialog} from "../Metadata/Metadata";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import {nip19} from 'nostr-tools';
import {Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import './Note.css';
import {useSearchParams, useNavigate} from "react-router-dom";
import {Skeleton} from "@mui/material";
import ReactPlayer from 'react-player';
import {NDKFilter, NDKRelaySet, NDKSubscription, NostrEvent, NDKSubscriptionOptions} from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import { intersection } from 'lodash';
import {containsTag, nFormatter, noteIsVisible} from "../../../utils/utils";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import CircularProgress from "@mui/material/CircularProgress";
import {NewNoteDialog} from "../../../dialog/NewNoteDialog";
import {ZapDialog} from "../../../dialog/ZapDialog";
import {RepostEvent, ZapEvent} from "../../../models/commons";
import Tooltip from "@mui/material/Tooltip";
import ReactTimeAgo from 'react-time-ago'
import {NewLabelDialog} from "../../../dialog/NewLabelDialog";
import {noteContentToHtml} from "../../../services/note2html";
import {Config} from "../../../resources/Config";

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
    threadView?: boolean;
    nevent: string;
    context?: 'feed' | 'thread';
    expanded?: boolean;
    event?: NostrEvent

    onSearchQuery?: (nevent: string, display: boolean) => void,
    floating?: boolean
}

const MetadataMemo = React.memo(Metadata);

export const Note = ({ nevent, context, noteId, pinned, handleNoteToggle, handleThreadToggle, isCollapsable, handleUpReaction,
     handleDownReaction, isThreadExpanded, isRead, threadView = false, onSearchQuery, expanded, floating, ...props }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [parsedContent, setParsedContent] = useState<any>();

    const { subscribe, subs } = useNostrNoteContext();

    const { id, author } = nip19.decode(nevent).data;
    const filter: NDKFilter = { ids: [id]};
    const filter1: NDKFilter = { kinds: [1, 7, 9735, 30023, 6], '#e': [id]};

    const [subscribed, setSubscribed] = useState<boolean>(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchString = searchParams.get('s');

    const navigate = useNavigate();

    const noteRef = useRef(null);
    const noteVisible = noteIsVisible(noteRef);

    const { user, setLoginDialogOpen, newLabelDialogOpen, setNewLabelDialogOpen, addReaction, boost } = useNostrContext();

    const [newReplyDialogOpen, setNewReplyDialogOpen] = useState<boolean>(false);
    const [zapDialogOpen, setZapDialogOpen] = useState<boolean>(false);

    const [event, loaded] = useLiveQuery(async () => {
        const event = await db.notes.get({ id });
        return [event || props?.event, true];
    }, [id], [props?.event, false]);

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
        return commentEvents
            .filter(({ content }) => !content.toLowerCase().includes('airdrop is live') && !content.toLowerCase().includes('claim your free $'));
    }, [id]);

    const repostEvents = useLiveQuery(async () => {
        const repostEvents = await db.reposts
            .where({ repostedEventId: id })
            .toArray();
        return repostEvents;
    }, [id], []);

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
            // @ts-ignore
            const _parsedContent = noteContentToHtml(event!.content, event!.tags, searchString, floating);
            setParsedContent(_parsedContent);
        }
    }, [event]);

    useEffect(() => {
        if (noteVisible && loaded && !event) {
            console.log(`event ${id} was not found in db`);
            subscribe(filter, { closeOnEose: true });
        }
    }, [loaded]);

    useEffect(() => {
        // note was displayed on screen
        // 1. wait for note event from cache
        // 2. if event isn't in cache, subscribe
        // 3. once event was received from a relay, stop subscription
        // run subs for reactions, zaps & comments in parallel

        if (noteVisible && !subscribed && loaded) {
            // only subscribe if the event does not exist in the db
            if (!event) {
                subscribe(filter);
            }
            const opts: NDKSubscriptionOptions = { groupableDelay: 1500, closeOnEose: false };
            const kinds = [1, 7, 9735, 30023, 6];
            // subscribe(filter1);
            for (let i = 0; i < kinds.length; i++) {
                subscribe({ kinds: [kinds[i]], '#e': [id]}, opts);
            }

            setSubscribed(true);
        }
        if (!noteVisible && subscribed) {
            console.log(`will stop subs for note ${id} in 3 seconds...`);
            setTimeout(() => {
                subs && subs
                    .forEach((sub: NDKSubscription) => {
                        sub.stop();
                    });
                setSubscribed(false);
            }, 3000);
        }
    }, [noteVisible, subscribed, loaded, event]);

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

    const boosted = useCallback(() => {
        const boost = user && repostEvents && repostEvents
            .find((repostEvent: RepostEvent) => repostEvent.pubkey === user.hexpubkey());
        return boost;
    }, [repostEvents]);

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
                ...(pinned && { backgroundColor: '#f1f1f1' }),
                ...(containsTag(event?.tags || [], ['t', Config.REPLIES_HASHTAG]) && { backgroundColor: 'rgba(0,0,0,.01)' })
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
                        <Typography component="div" sx={{ position: 'absolute', top: '0.25em', right: '16px', textAlign: 'end' }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: '300', paddingLeft: '8px', margin: '1em 0' }}>
                                {
                                    event && <Tooltip title={new Date(event.created_at*1000).toLocaleString()}>
                                        <ReactTimeAgo date={event.created_at*1000} />
                                    </Tooltip>
                                }
                            </Typography>
                        </Typography>
                    </React.Fragment>
                </Typography>
                <Typography sx={{ display: 'flex' }} component="div">
                    <MetadataMemo
                        variant="link"
                        pubkey={author || (event && event.pubkey)}
                    />
                </Typography>
                <Typography
                    sx={{ textAlign: 'left', fontSize: '16px', fontWeight: '300', marginTop: '1em!important', wordBreak: 'break-word', ...(!expanded && { cursor: 'pointer' }) }}
                    gutterBottom
                    variant="body2"
                    component="div"
                    {...(!expanded && !floating && { onClick: () => { navigate(`/e/${nevent}`) } })}
                    {...(floating && { onClick: () => { setSearchParams({ e: nevent, ...(!!searchString && { s: searchString }) }) } })}
                >
                    {
                        // @ts-ignore
                        parsedContent
                    }
                </Typography>
                {
                    (!event || !parsedContent) && <React.Fragment>
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                        <Skeleton sx={{ width: '100%' }} animation="wave" />
                    </React.Fragment>
                }
            </CardContent>
            {
                event && <CardActions>
                    <Typography sx={{ width: '100%' }} variant="body2" component="div">
                        <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1em' }} direction="row" spacing={1}>
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
                                        sx={{ ...(zapped() && { color: '#ffdf00' }) }}
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
                                <Button sx={{ minWidth: '21px' }} color="secondary" onClick={() => {
                                    console.log('boost', {event});
                                    if (user) {
                                        boost(event);
                                    } else {
                                        setLoginDialogOpen(true);
                                    }
                                }}>
                                    {
                                        repostEvents.length >= 1 && <React.Fragment>
                                            <Badge className="reposts-count"
                                                   sx={{ opacity: boosted() ? 1 : 0.5 }}
                                                   color="primary"
                                                   badgeContent={repostEvents.length}>
                                                <Loop sx={{ fontSize: 18 }} />
                                            </Badge>
                                        </React.Fragment>
                                    }
                                    {
                                        repostEvents.length === 0 && <Loop sx={{ fontSize: 18, opacity: boosted() ? 1 : 0.5 }} />
                                    }
                                </Button>
                                {
                                    reactionEvents && <React.Fragment>
                                        <Reactions
                                            reactions={getUpReactions()}
                                            type={ReactionType.UP}
                                            handleReaction={(reaction: string) => {
                                                if (user) {
                                                    addReaction(id, reaction);
                                                    // setNewLabelDialogOpen(true);
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
                                                // if (reaction === 'shaka') {
                                                    setNewLabelDialogOpen(true);
                                                // }
                                            } else {
                                                setLoginDialogOpen(true);
                                            }
                                        }} placeholder={REACTIONS[4].content.replace('-', '👎')} reacted={reacted(ReactionType.DOWN)} />
                                    </React.Fragment>
                                }
                                {
                                    (!reactionEvents || !zapEvents) && <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />
                                }
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
                                        <MenuItem onClick={(event) => {
                                            handleShareAnswer(event);
                                        }}>
                                            Share link
                                        </MenuItem>
                                    </Menu>
                                </React.Fragment>
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
        <NewNoteDialog open={newReplyDialogOpen} onClose={() => setNewReplyDialogOpen(false)} noteId={id} replyTo={event && [event.pubkey]} explicitTags={[['t', Config.REPLIES_HASHTAG]]} label="Your reply..." />
        <ZapDialog open={zapDialogOpen} event={event} onClose={() => setZapDialogOpen(false)} npub={author && nip19.npubEncode(author)} />
        { event && <NewLabelDialog open={newLabelDialogOpen} onClose={() => { setNewLabelDialogOpen(false) }} reaction={'shaka'} event={event} /> }
        <QrCodeDialog str={event && new RegExp(/([0123456789abcdef]{64})/).test(event!.id!) && `nostr:${nip19.noteEncode(event.id)}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
    </React.Fragment>);
};
