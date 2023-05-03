import {List} from "@mui/material";
import parse, {DOMNode, HTMLReactParserOptions} from 'html-react-parser';
import React, {FC, useEffect, useState} from "react";
import {
    CopyAll,
    DoneOutline,
    IosShare, Launch, MoreHoriz,
    QrCodeScanner,
    UnfoldLess,
    UnfoldMore,
    Note as NoteIcon,
    List as ListIcon
} from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import {Metadata, QrCodeDialog} from "../Metadata/Metadata";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import {nip19} from 'nostr-tools';
import {Reaction, ReactionEvent, Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import {createEvent, getEventsByKind, getNostrKeyPair, getSubscriptionOptions} from "../../../services/nostr";
import Button from "@mui/material/Button";
import { pink } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import './Note.css';
import { isTag } from 'domhandler/lib/node';
import { Element } from 'domhandler/lib/node';
import {Mux, Event as NostrEvent, Filter, SubscriptionOptions, Relay} from "nostr-mux";
import {DEFAULT_RELAYS} from "../NostrResources/NostrResources";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import {isGuideRead} from '../../../services/guides';
import {processText} from "../../../services/util";

interface NoteProps {
    id: string;
    content: string;
    tags?: string[][];

    title: string;
    bulletPoints?: string[];
    // metadata?: Metadata[];
    imageUrls?: string[];
    guideTags?: string[];
    urls?: string[];
    updatedAt: string;
    // reactions?: ReactionEvent[];
    pubkeys?: string[];
    // comments?: any[];
    author?: string;
    pinned?: boolean;
    handleThreadToggle?: (expanded: boolean) => any;
    handleNoteToggle?: (expanded: boolean) => any;
    isExpanded?: boolean;
    isThreadExpanded?: boolean;
    isCollapsable?: boolean;
    handleUpReaction?: (noteId: string, reaction?: string) => void;
    handleDownReaction?: (noteId: string, reaction?: string) => void;
    guideId?: string;
    isRead?: boolean;

    event: any;
    // reactionEvents?: NostrEvent[];
    // commentEvents?: NostrEvent[];
    metadataEvents?: any[];
}

const mux = new Mux();

export const Note = ({
     id, title, content, bulletPoints, imageUrls, guideTags, urls, updatedAt,
     pubkeys, author, pinned, handleNoteToggle, handleThreadToggle, isExpanded, isCollapsable, handleUpReaction,
     handleDownReaction, tags, isThreadExpanded, guideId, isRead, event,
                         metadataEvents = [] }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [events, setEvents] = useState<NostrEvent[]>([]);

    useEffect(() => {
        if (!id) {
            return;
        }
        // Subscription filters
        const filters = [
            // related notes (comments)
            {
                kinds: [1],
                '#e': [id]
            },
            // reactions
            {
                kinds: [7],
                '#e': [id]
            }
        ] as Filter[];

        console.log(`Opening comments & reactions subscription...`);

        // if this was a new mux instance, add relays
        if (mux.allRelays.length < DEFAULT_RELAYS.length) {
            DEFAULT_RELAYS.forEach((url: string) => {
                mux.addRelay(new Relay(url));
            });
        }

        // Get subscription options
        const options: SubscriptionOptions = getSubscriptionOptions(
            mux,
            filters,
            (event: any) => {
                console.log('received an event');
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            (subId: string) => {
                console.log(`Closing ${subId} subscription...`);
            },
            true
        );

        // Subscribe
        mux
            .waitRelayBecomesHealthy(1, 5000)
            .then((ok: any) => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }
                mux.subscribe(options);
            });

        setExpanded(!!isExpanded);
    }, []);

    useEffect(() => () => {
        DEFAULT_RELAYS.forEach(relay => {
            mux.removeRelay(relay);
        });
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleShareAnswer = (event: any) => {
        event.stopPropagation();
        navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${guideId}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    };

    const handleReaction = (reaction: string) => {
        const [privkey, pubkey] = getNostrKeyPair();
        const event = createEvent(privkey, pubkey, 7, reaction, [['e', id]]) as NostrEvent;
        mux.publish(event, {
            onResult: (results) => {
                // const accepted = results && results.filter((r: any) => r.received.accepted)?.length;
                // console.log(`event published and accepted on ${accepted}/${results.length} relays`);
            }
        });
    };

    const getProcessedText = (text: string) => {
        if (!text) {
            text = '';
        }
        return processText(text);

    };

    const parseHtml = (text: string) => {
        // TODO: Clean up after react-html-parser
        return parse(
            getProcessedText(text),
            {
                replace: (domNode) => {
                    const domElement: Element = domNode as Element;
                    if (isTag(domElement)) {
                        // @ts-ignore
                        const { attribs, children, name } = domNode;
                        if (name === 'button') {
                            const data = children.length > 0 && children[0].data;
                            const splitData = data.split(':');
                            return <Metadata
                                npub={splitData[0] || data}
                                supposedName={splitData[1] && splitData.length !== 64 ? splitData[2] || undefined : splitData[1]}
                                handleCopyNpub={(npub: string) => {
                                    setSnackBarMessage(npub);
                                    setSnackbarOpen(true);
                                }}
                            />
                        }
                    }
                }
            }
        );
    };

    const getUpReactions = (): Reaction[] => {
        return getReactionEvents() && getReactionEvents()
            .filter(r => REACTIONS
                .filter(r1 => r1.type === ReactionType.UP)
                .map(r2 => r2.content)
                .includes(r.content)
            )
            .map(r3 => ({ type: ReactionType.UP, event: r3 }))|| [];
    };

    const getDownReactions = (): Reaction[] => {
        return getReactionEvents() && getReactionEvents()
            .filter(r => REACTIONS
                .filter(r1 => r1.type === ReactionType.DOWN)
                .map(r2 => r2.content)
                .includes(r.content)
            )
            .map(r3 => ({ type: ReactionType.DOWN, event: r3 })) || [];
    };

    const reacted = (type: ReactionType) => {
       const [_, pubkey] = getNostrKeyPair();
       return getReactionEvents() && !!getReactionEvents()
           .filter(r => REACTIONS.filter(r3 => r3.type === type).map(r2 => r2.content).includes(r.content))
           .find(r1 => r1.pubkey && r1.pubkey === pubkey);
    };

    const getCommentEvents = () => {
        return getEventsByKind(events, 1);
    };

    const getReactionEvents = () => {
        return getEventsByKind(events, 7);
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
                onClick={() => {
                    handleNoteToggle && handleNoteToggle(!expanded);
                    handleThreadToggle && handleThreadToggle(false);

                    setExpanded(!expanded);
                }}
            >
                <React.Fragment>
                    <Typography
                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                    >
                        <Tooltip title={event && event.id || '?'}>
                            { guideId && isGuideRead(guideId) ?
                                <React.Fragment>
                                    { parseHtml(title + '') }
                                </React.Fragment> :
                                <Badge sx={{
                                    maxWidth: '100%',
                                    '& .MuiBadge-badge': {
                                        backgroundColor: pink[300],
                                    }}} badgeContent="" variant="dot">
                                    { parseHtml(title) }
                                </Badge>
                            }
                        </Tooltip>
                    </Typography>
                    <Typography sx={{ textAlign: 'end' }}>
                        {
                            new RegExp(/([0123456789abcdef]{64})/).test(id) &&
                            <React.Fragment>
                                <IconButton
                                    aria-controls={menuOpen ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleMenuOpen(event);
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
                                    <MenuItem onClick={(event) => {
                                        const noteEncoded = nip19.noteEncode(id);
                                        navigator.clipboard.writeText(noteEncoded);
                                        setSnackBarMessage(noteEncoded);
                                        setSnackbarOpen(true);
                                        event.stopPropagation();
                                    }}>
                                        <CopyAll sx={{ fontSize: 18, marginRight: 1 }} /> Copy note ID
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            setDialogOpen(true);
                                        }}>
                                        <QrCodeScanner sx={{ fontSize: 18, marginRight: 1 }} /> Show QR
                                    </MenuItem>
                                    <MenuItem onClick={(event) => {
                                        const noteEncoded = nip19.noteEncode(id);
                                        const a = document.createElement('a');
                                        a.href = 'nostr:' + noteEncoded;
                                        a.click();
                                    }}>
                                        <Launch sx={{ fontSize: 18, marginRight: 1 }}/> Open in client
                                    </MenuItem>
                                    {/*<MenuItem*/}
                                        {/*onClick={() => {*/}
                                            {/*const content = listToNote(getPeopleInvolvedInNostr());*/}
                                            {/*console.log({content})*/}
                                        {/*}}>*/}
                                        {/*<CopyAll sx={{ fontSize: 18 }} /> Copy note text*/}
                                    {/*</MenuItem>*/}
                                </Menu>
                            </React.Fragment>
                        }
                        {
                            isCollapsable &&
                            <IconButton>
                                {
                                    expanded ? <UnfoldLess sx={{ fontSize: 18 }} /> : <UnfoldMore sx={{ fontSize: 18 }} />
                                }
                            </IconButton>
                        }
                        {
                            isCollapsable && id && <IconButton component={Link} to={'/resources/nostr/' + nip19.noteEncode(id)}>
                                <NoteIcon sx={{ fontSize: 18 }}/>
                            </IconButton>
                        }
                        {
                            !isCollapsable && guideId && <IconButton component={Link} to={'/resources/nostr#' + guideId}>
                                <ListIcon sx={{ fontSize: 18 }}/>
                            </IconButton>
                        }
                    </Typography>
                </React.Fragment>
            </Typography>
            {
                expanded &&
                    <React.Fragment>
                        <Typography sx={{ display: 'flex' }}>
                            {
                                author &&
                                <Metadata
                                    variant="simplified"
                                    npub={author && nip19.npubEncode(author)}
                                    handleCopyNpub={(npub: string) => {
                                        setSnackBarMessage(npub);
                                        setSnackbarOpen(true);
                                    }}
                                />
                            }
                        </Typography>
                        <Typography sx={{ textAlign: 'justify' }} gutterBottom variant="body2">
                            { parseHtml(content) }
                            { bulletPoints &&
                            <List>
                                { bulletPoints.map(point =>
                                    <ListItem sx={{ display: 'block' }}>{
                                        parseHtml(point)
                                    }</ListItem>
                                ) }
                            </List>
                            }
                        </Typography>
                        { urls && urls.length > 0 && urls.map(url =>
                            <React.Fragment>
                                <a href={url} target="_blank">{ url }</a><br />
                            </React.Fragment>
                        )

                        }
                        { guideTags &&
                        <Typography sx={{ fontSize: '12px' }}>
                            <Divider sx={{ margin: '0.4em', marginBottom: '2em' }} component="div" />
                            {
                                guideTags.map(tag => (
                                    <Chip sx={{ marginLeft: '0.33em' }} label={tag} color="success" />
                                ))
                            }
                        </Typography>
                        }
                        { imageUrls && imageUrls.length > 0 &&
                        <a href={imageUrls[0]} target="_blank">
                            <CardMedia
                                component="img"
                                height="194"
                                image={imageUrls[0]}
                                alt="Show full-sized image in a new tab"
                            />
                        </a>
                        }
                    </React.Fragment>
            }
        </CardContent>
        <CardActions>
            <Typography sx={{ width: '100%' }} variant="body2">
                <Divider sx={{ margin: '0.4em' }} component="div" />
                <Stack sx={{ justifyContent: 'flex-start', alignItems: 'center' }} direction="row" spacing={1}>
                    <Typography sx={{ fontSize: '14px' }}>
                        Last update: {updatedAt}
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
                                    badgeContent={getCommentEvents().length}
                                    color="primary"
                                    className="comments-count"
                                >
                                    Discussion
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
                                        handleUpReaction && handleUpReaction(id, reaction);
                                    }}
                                    placeholder={REACTIONS[0].content}
                                    reacted={reacted(ReactionType.UP)}
                                />
                                <Reactions reactions={getDownReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
                                    handleReaction(reaction);
                                    handleDownReaction && handleDownReaction(id, reaction);
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
    </Card>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
        />
        <QrCodeDialog str={id && new RegExp(/([0123456789abcdef]{64})/).test(id) && `nostr:${nip19.noteEncode(id)}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
    </React.Fragment>);
};