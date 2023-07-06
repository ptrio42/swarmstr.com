import parse, {DOMNode, HTMLReactParserOptions} from 'html-react-parser';
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {Config} from "nostr-hooks/dist/types";
import {DEFAULT_RELAYS} from "../../../resources/Config";
// @ts-ignore
import {useSubscribe} from "nostr-hooks";
import {DEFAULT_EVENTS} from "../../../stubs/events";
import {NoteThread} from "../Thread/Thread";
import {Skeleton} from "@mui/material";
import ReactPlayer from 'react-player';
import NDK, {NDKEvent, NDKFilter, NDKRelaySet, NDKSubscription, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider, useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import { intersection } from 'lodash';
import {containsTag, matchString, nFormatter, noteIsVisible} from "../../../utils/utils";
import Box from "@mui/material/Box";
import {useNostrContext} from "../../../providers/NostrContextProvider";
// import { decode } from 'bolt11';
import lightBolt11Decoder from 'light-bolt11-decoder';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import CircularProgress from "@mui/material/CircularProgress";

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
    // const [expanded, setExpanded] = useState<boolean>(false);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [parsedContent, setParsedContent] = useState<any>();

    const { subscribe, addReaction, zap, subs } = useNostrNoteContext();

    const { id, author, relays } = nip19.decode(nevent).data;
    const filter: NDKFilter = { kinds: [1], ids: [id]};
    const filter1: NDKFilter = { kinds: [1, 7, 9735], '#e': [id]};
    // const filter2: NDKFilter = ;
    // const filter3: NDKFilter = ;
    // const filters: NDKFilter[] = [
    //     ,
    //     { kinds: [7], '#e': [id]},
    //     { kinds: [9735], '#e': [id]}
    // ];

    // const [event, setEvent] = useState<NostrEvent>();

    const event = useLiveQuery(async () => {
        const event = await db.events.get({ id });
        return event;
    }, [id]);

    const zapEvents = useLiveQuery(async () => {
        const zapEvents = await db.events
            .where('kind').equals(9735)
            .and(({tags}: NostrEvent) => containsTag(tags, ['e', id || '']))
            .toArray();
        return zapEvents;
    }, [id]);

    const reactionEvents = useLiveQuery(async () => {
        const reactionEvents = await db.events
            .where('kind').equals(7)
            .and(({tags}: NostrEvent) => containsTag(tags, ['e', id || '']))
            .toArray();
        return reactionEvents;
    }, [id]);

    const commentEvents = useLiveQuery(async () => {
        const commentEvents = await db.events
            .where('kind').equals(1)
            .and(({content, tags}: NostrEvent) => content !== '' && containsTag(tags, ['e', id || '']))
            .toArray();
        return commentEvents;
    }, [id]);


    const noteRef = useRef(null);
    const noteVisible = noteIsVisible(noteRef);

    const { user } = useNostrContext();

    useEffect(() => {
        const i = intersection(DEFAULT_RELAYS, relays);

        // if (!event) {
        //     subscribe(filter);
        // }

        return () => {
            subs && subs
                .forEach((sub: NDKSubscription) => {
                    sub.stop();
                })
        }
    }, []);

    useEffect(() => {
        if (!parsedContent && event && event.content) {
            setParsedContent(parseHtml(event.content));
        }
    }, [event]);

    useEffect(() => {
        if (noteVisible) {
            subscribe(filter);
            subscribe(filter1);
            // subscribe(filters[1]);
            // subscribe(filters[2]);
        } else {
                subs && subs.length > 0 && subs
                    .forEach((sub: NDKSubscription) => {
                        sub.stop();
                    })
        }

        // if (!noteVisible) {

        // }
    }, [noteVisible]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleShareAnswer = useCallback((e: any) => {
        e.stopPropagation();
        event && navigator.clipboard.writeText(`${process.env.BASE_URL}/nostr/e/${nevent}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    }, []);

    const handleReaction = (reaction: string) => {
        // const [privkey, pubkey] = getNostrKeyPair();
        // const newEvent = event && createEvent(privkey, pubkey, 7, reaction, [['e', event.id]]) as any;
        // if (newEvent) {
            // nostrClient.publish(newEvent);
        // }
    };

    const getProcessedText = useCallback((text: string) => {
        if (!text) {
            text = '';
        }
        return processText(text, event && event.tags);

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
                            const userPubkey = nip19.decode(data)?.data || data;
                            if (userPubkey) {
                                return  <Metadata
                                    variant={'link'}
                                    pubkey={userPubkey}
                                />
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
        return zapEvents?.filter(({ tags }) => containsTag(tags, ['p', author || '']))
    }, [zapEvents]);

    const zapped = useCallback(() => {
        const zap = user && zapEvents && zapEvents
        // @ts-ignore
            .filter(({tags}) => !!tags
                // @ts-ignore
                .find((t: NDKTag) => {
                    return t[0] === 'description' && (JSON.parse(t[1])?.pubkey === nip19.decode(user.npub).data);
                })
            ).length > 0;
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
            // @ts-ignore
            .map(({ tags }) => tags && tags
                .find((tag: NDKTag) => tag[0] === 'bolt11')
            )
            // @ts-ignore
            .map((tag: NDKTag) => tag[1])
            // @ts-ignore
            .map((bolt11: string) => lightBolt11Decoder.decode(bolt11).sections
                .find((section: any) => section.name === 'amount').value)
            .reduce((total: number, current: string) => total + (+current) / 1000, 0);
        return nFormatter(totalZaps, 1);
    }, [zapEvents]);

    // if (!noteVisible) {
    //     return <Card className="note" sx={{
    //         minWidth: 275,
    //         marginBottom: '0.5em',
    //         width: '100%',
    //         ...(pinned && { backgroundColor: '#f1f1f1' })
    //     }}>
    //         <CardContent>
    //             <CircularProgress/>
    //         </CardContent>
    //     </Card>
    // }

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
                            a.href = `${process.env.BASE_URL}/nostr/e/${nevent}`;
                            a.click();
                        } } : {}) }
                >
                    { event && parseHtml(event.content) }
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
                                {/*{ commentEvents &&*/}
                                <React.Fragment>
                                    <Button
                                        color="secondary"
                                        sx={{ textTransform: 'none' }}
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = `${process.env.BASE_URL}/nostr/e/${nevent}`;
                                            a.click();
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
                                </React.Fragment>
                                {/*}*/}
                            </Typography>
                            <Typography component="div" sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                { pinned &&
                                <DoneOutline color="success" />
                                }
                                <Button
                                    sx={{ ...(zapped() && { color: '#fbf722' }) }}
                                    color="secondary"
                                    onClick={() => {
                                        console.log('zap', {event});
                                        event && zap(event!, 21);
                                    }}
                                >
                                    {
                                        zapEvents && <React.Fragment>
                                            <ElectricBolt sx={{ fontSize: 18 }} />
                                            { getTotalZaps() }
                                        </React.Fragment>
                                    }
                                </Button>
                                {
                                    reactionEvents && <React.Fragment>
                                        <Reactions
                                            reactions={getUpReactions()}
                                            type={ReactionType.UP}
                                            handleReaction={(reaction: string) => {
                                                addReaction(id, reaction);
                                            }}
                                            placeholder={REACTIONS[0].content}
                                            reacted={reacted(ReactionType.UP)}
                                        />
                                        <Reactions reactions={getDownReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
                                            addReaction(id, reaction);
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
        {/*<QrCodeDialog str={event && new RegExp(/([0123456789abcdef]{64})/).test(event.id) && `nostr:${nip19.noteEncode(event.id)}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />*/}
    </React.Fragment>);
};