import parse, {DOMNode, HTMLReactParserOptions} from 'html-react-parser';
import React, {FC, useCallback, useEffect, useState} from "react";
import {
    CopyAll,
    DoneOutline,
    IosShare, Launch, MoreHoriz,
    QrCodeScanner,
    UnfoldLess,
    UnfoldMore,
    Note as NoteIcon
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
import {Link} from "react-router-dom";
import {processText} from "../../../services/util";
import {Config} from "nostr-hooks/dist/types";
import {DEFAULT_RELAYS} from "../../../resources/Config";
// @ts-ignore
import {useSubscribe} from "nostr-hooks";
import {DEFAULT_EVENTS} from "../../../stubs/events";
import {NoteThread} from "../Thread/Thread";
import {Skeleton} from "@mui/material";
import ReactPlayer from 'react-player';

interface NoteProps {
    noteId: string;
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
    threadView?: boolean
}

export const Note = ({ noteId, pinned, handleNoteToggle, handleThreadToggle, isCollapsable, handleUpReaction,
     handleDownReaction, isThreadExpanded, isRead, data = {}, threadView = false }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const { events } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [1, 7],
            '#e': [noteId]
        }],
        options: {
            enabled: !!noteId,
            closeAfterEose: false
        }
    } as Config);

    const { events: _event } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [1],
            ids: [noteId]
        }],
        options: {
            enabled: !!noteId && !data.event,
            closeAfterEose: true
        }
    } as Config);

    const event = data.event || _event && _event[0];

    const { events: metadataEvents } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [0],
            // @ts-ignore
            authors: [event && event.pubkey]
        }],
        options: {
            enabled: !!data.event || !!(_event && _event[0]),
            closeAfterEose: false
}
} as Config);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleShareAnswer = (e: any) => {
        e.stopPropagation();
        event && navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/${nip19.npubEncode(event.id)}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    };

    const handleReaction = (reaction: string) => {
        // const [privkey, pubkey] = getNostrKeyPair();
        // const newEvent = event && createEvent(privkey, pubkey, 7, reaction, [['e', event.id]]) as any;
        // if (newEvent) {
            // nostrClient.publish(newEvent);
        // }
    };

    const getProcessedText = (text: string) => {
        if (!text) {
            text = '';
        }
        return processText(text, event && event.tags);

    };

    const parseHtml = (text: string) => {
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
                            return <Metadata
                                variant={'link'}
                                npub={data}
                            />
                        }
                        if (name === 'button' && attribs.class === 'thread-btn') {
                            const data = children.length > 0 && children[0].data;
                            const hex = nip19.decode(data);
                            if (hex) {
                                return <NoteThread
                                    key={data}
                                    data={{
                                        // @ts-ignore
                                        noteId: hex.data
                                    }}
                                />
                            }
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
    };

    const getUpReactions = (): Reaction[] => {
        // @ts-ignore
        return getReactionEvents() && getReactionEvents()
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.UP)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            .map((r3: any) => ({ type: ReactionType.UP, event: r3 }))|| [];
    };

    const getDownReactions = (): Reaction[] => {
        // @ts-ignore
        return getReactionEvents() && getReactionEvents()
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.DOWN)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            // @ts-ignore
            .map((r3: any) => ({ type: ReactionType.DOWN, event: r3 })) || [];
    };

    const reacted = (type: ReactionType) => {
        return false;
       // const [_, pubkey] = getNostrKeyPair();
       // @ts-ignore
       // return getReactionEvents() && !!getReactionEvents()
       // // @ts-ignore
       //     .filter(r => REACTIONS.filter(r3 => r3.type === type)
       //     // @ts-ignore
       //         .map(r2 => r2.content).includes(r.content))
       //     .find((r1: any) => r1.pubkey && r1.pubkey === pubkey);
    };

    const getCommentEvents = () => {
        const allEvents = [...events, ...DEFAULT_EVENTS];
        return event && allEvents
            .filter((e: any) => e.kind === 1)
            .filter((e: any) => e.tags && !!e.tags.find((t: string[]) => t[0] === 'e' && t[1] === event.id));
    };

    const getReactionEvents = () => {
        return event && events
            .filter((e: any) => e.kind === 7)
            .filter((e: any) => e.tags && !!e.tags.find((t: string[]) => t[0] === 'e' && t[1] === event.id));
    };

    return (<React.Fragment>
        <Card
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
                        <Typography sx={{ position: 'absolute', top: '1em', right: '2em', textAlign: 'end' }}>
                            {
                                event && new RegExp(/([0123456789abcdef]{64})/).test(event.id) &&
                                <React.Fragment>
                                    <IconButton
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
                                            const noteEncoded = event && nip19.noteEncode(event.id);
                                            navigator.clipboard.writeText(noteEncoded);
                                            setSnackBarMessage(noteEncoded);
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
                                            const npub = event && nip19.noteEncode(event.id);
                                            const a = document.createElement('a');
                                            a.href = 'nostr:' + npub;
                                            a.click();
                                        }}>
                                            <Launch sx={{ fontSize: 18, marginRight: 1 }}/> Open in client
                                        </MenuItem>
                                    </Menu>
                                </React.Fragment>
                            }
                        </Typography>
                    </React.Fragment>
                </Typography>
                {
                    event && event.pubkey && metadataEvents && metadataEvents.find(e => e.pubkey === event.pubkey) && <Typography sx={{ display: 'flex' }} component="div">
                        <Metadata
                            variant="simplified"
                            data={{
                                event: metadataEvents && metadataEvents.find(e => e.pubkey === event.pubkey)
                            }}
                            handleCopyNpub={(npub: string) => {
                                setSnackBarMessage(npub);
                                setSnackbarOpen(true);
                            }}
                        />
                    </Typography>
                }

                {
                    event && event.pubkey && (!metadataEvents || !metadataEvents.find(e => e.pubkey === event.pubkey)) && <Typography sx={{ display: 'flex' }} component="div">
                        <Metadata
                            variant="simplified"
                            isSkeleton={true}
                            npub={nip19.npubEncode(event.pubkey)}
                            handleCopyNpub={(npub: string) => {
                                setSnackBarMessage(npub);
                                setSnackbarOpen(true);
                            }}
                        />
                    </Typography>
                }

                <Typography
                    sx={{ textAlign: 'justify', marginTop: '1em!important', ...(threadView && { cursor: 'pointer' }) }}
                    gutterBottom
                    variant="body2"
                    component="div"
                    {...(threadView ? { onClick: () => {
                            const a = document.createElement('a');
                            a.href = `${process.env.BASE_URL}/resources/nostr/${nip19.noteEncode(event.id)}`;
                            a.click();
                        } } : {}) }
                >
                    { event && event.content && parseHtml(event.content) }
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
                            <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                                { getCommentEvents() &&
                                <React.Fragment>
                                    <Button
                                        color="secondary"
                                        sx={{ textTransform: 'none' }}
                                        startIcon={isThreadExpanded ? <UnfoldLess sx={{ fontSize: 18 }} /> : <UnfoldMore sx={{ fontSize: 18 }} /> }
                                        onClick={() => {
                                            handleThreadToggle && handleThreadToggle(!isThreadExpanded);
                                        }}
                                    >
                                        <Badge
                                            badgeContent={getCommentEvents()?.length}
                                            color="primary"
                                            className="comments-count"
                                        >
                                            Answers
                                        </Badge>
                                    </Button>
                                </React.Fragment>
                                }
                            </Typography>
                            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                { pinned &&
                                <DoneOutline color="success" />
                                }

                                {
                                    getReactionEvents() &&
                                    <React.Fragment>
                                        <Reactions
                                            reactions={getUpReactions()}
                                            type={ReactionType.UP}
                                            handleReaction={(reaction: string) => {
                                                handleReaction(reaction);
                                                handleUpReaction && event && handleUpReaction(event && event.id, reaction);
                                            }}
                                            placeholder={REACTIONS[0].content}
                                            reacted={reacted(ReactionType.UP)}
                                        />
                                        <Reactions reactions={getDownReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
                                            handleReaction(reaction);
                                            handleDownReaction && event && handleDownReaction(event && event.id, reaction);
                                        }} placeholder={REACTIONS[4].content.replace('-', '👎')} reacted={reacted(ReactionType.DOWN)} />
                                    </React.Fragment>
                                }
                                <IconButton
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
        <QrCodeDialog str={event && new RegExp(/([0123456789abcdef]{64})/).test(event.id) && `nostr:${nip19.noteEncode(event.id)}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
    </React.Fragment>);
};