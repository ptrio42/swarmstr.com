import {List} from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import React, {useEffect, useState} from "react";
import {
    ChatBubble,
    CopyAll,
    DoneOutline,
    Expand,
    IosShare,
    QrCodeScanner,
    UnfoldLess,
    UnfoldMore
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
import {Reaction, Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import {getNostrKeyPair} from "../../../services/nostr";
import Button from "@mui/material/Button";
import pink from "@mui/material/colors/pink";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface NoteProps {
    id: string;
    content: string;
    tags?: string[][];

    title: string;
    bulletPoints?: string[];
    metadata?: Metadata[];
    imageUrls?: string[];
    guideTags?: string[];
    urls?: string[];
    updatedAt: string;
    reactions?: Reaction[];
    pubkeys?: string[];
    comments?: any[];
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
}

export const Note = ({
     id, title, content, bulletPoints, metadata, imageUrls, guideTags, urls, updatedAt, reactions,
     pubkeys, comments, author, pinned, handleNoteToggle, handleThreadToggle, isExpanded, isCollapsable, handleUpReaction, handleDownReaction,
                         tags, isThreadExpanded, guideId, isRead }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        setExpanded(!!isExpanded);
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

    const getProcessedText = (text: string) => {
        if (!text) {
            text = '';
        }
        return text
            // @ts-ignore
            // .replace(/(#\[[0-9]\]*)/, pubkeys && pubkeys.length > 0 && nip19.npubEncode(pubkeys[+('$1'.slice(2, '$1'.length - 2))]) + ':' + pubkeys[+('$1'.slice(2, '$1'.length - 2))] + ':pitiunited')
            .replace(/([0123456789abcdef]{64})/, '$1')
            .replace(/(npub[a-z0-9A-Z.:_]{59,}$)/, '<button>$1</button>')
            // .replace(/(https?:\/\/.*\.(?!:png|jpg|jpeg|gif|svg))/i, '<a href="$1" target="_blank">$1</a>')
            .replace(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i, '<img width="100%" src="$1" />')
            .replace(new RegExp(/^(?!\=")(https?:\/\/[^]*)/, 'g'), '<a href="$1" target="_blank">$1</a>')
            .replace(/(#### [a-zA-Z0-9\/.,&\'’?\-`@ ]*)/, '<h4>$1</h4>')
            .replace(/(#+)/, '')
            .replace(/(\n+)/, '$1<br/>')
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/~~(.*?)~~/g, "<i>$1</i>")
            .replace(/__(.*?)__/g, "<u>$1</u>")

    };

    const parseHtml = (text: string) => {
        return ReactHtmlParser(
            getProcessedText(text),
            {
                transform: (node) => {
                    if (node.type === 'tag' && node.name === 'button') {
                        const data = node.children[0].data;
                        const splitData = data.split(':');
                        const profile = metadata && metadata.find(m => m.pubkey === splitData[1]);
                        return <Metadata
                            { ...profile }
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
        )
    };

    const getUpReactions = (): Reaction[] => {
        return reactions && reactions
            .filter(r => REACTIONS
                .filter(r1 => r1.type === ReactionType.UP)
                .map(r2 => r2.content)
                .includes(r.content)
            ) || [];
    };

    const getDownReactions = (): Reaction[] => {
        return reactions && reactions
            .filter(r => REACTIONS
                .filter(r1 => r1.type === ReactionType.DOWN)
                .map(r2 => r2.content)
                .includes(r.content)
            ) || [];
    };

    const reacted = (type: ReactionType) => {
       const [_, pubkey] = getNostrKeyPair();
       return reactions && !!reactions
           .filter(r => REACTIONS.filter(r3 => r3.type === type).map(r2 => r2.content).includes(r.content))
           .find(r1 => r1.pubkey && r1.pubkey === pubkey);
    };

    return (<React.Fragment>
        <Card sx={{
            minWidth: 275,
            marginBottom: '0.5em',
            width: '100%',
            ...(pinned && { backgroundColor: '#f1f1f1' })
        }}>
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
                        { isRead ?
                            <React.Fragment>
                                { parseHtml(title) }
                            </React.Fragment> :
                            <Badge sx={{
                                maxWidth: '100%',
                                '& .MuiBadge-badge': {
                                    backgroundColor: pink[300],
                                }}} badgeContent="" variant="dot">
                                { parseHtml(title) }
                            </Badge>
                        }
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
                                    <CopyAll sx={{ fontSize: 18 }} />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    id="account-menu"
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                >
                                    <MenuItem onClick={(event) => {
                                        event.stopPropagation();
                                        const noteEncoded = nip19.noteEncode(id);
                                        navigator.clipboard.writeText(noteEncoded);
                                        setSnackBarMessage(noteEncoded);
                                        setSnackbarOpen(true);
                                    }}>
                                        <CopyAll sx={{ fontSize: 18, marginRight: 1 }} /> Copy npub
                                    </MenuItem>
                                    <MenuItem onClick={() => { setDialogOpen(true) }}>
                                        <QrCodeScanner sx={{ fontSize: 18, marginRight: 1 }} /> Show QR
                                    </MenuItem>
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
                                    { ...(metadata && metadata.find(m => m.pubkey === author))  }
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
            {
                expanded && <Typography sx={{ width: '100%' }} variant="body2">
                    <Divider sx={{ margin: '0.4em' }} component="div" />
                    <Stack sx={{ justifyContent: 'flex-start', alignItems: 'center' }} direction="row" spacing={1}>
                        <Typography sx={{ fontSize: '14px' }}>
                            {updatedAt}
                        </Typography>
                    </Stack>
                    <Divider sx={{ margin: '0.4em' }} component="div" />
                    <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }} direction="row" spacing={1}>
                        <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                            { comments &&
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
                                            badgeContent={comments.length}
                                            color="primary"
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
                                reactions &&
                                <React.Fragment>
                                    <Reactions
                                        reactions={getUpReactions()}
                                        type={ReactionType.UP}
                                        handleReaction={(reaction: string) => {
                                            handleUpReaction && handleUpReaction(id, reaction);
                                        }}
                                        placeholder={REACTIONS[0].content}
                                        reacted={reacted(ReactionType.UP)}
                                    />
                                    <Reactions reactions={getDownReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
                                        handleDownReaction && handleDownReaction(id, reaction);
                                    }} placeholder={REACTIONS[4].content} reacted={reacted(ReactionType.DOWN)} />
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
            }
        </CardActions>
    </Card>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
        />
        <QrCodeDialog pubkey={id && new RegExp(/([0123456789abcdef]{64})/).test(id) && nip19.noteEncode(id) || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
    </React.Fragment>);
};