import {List} from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import React, {useEffect, useState} from "react";
import {ChatBubble, CopyAll, DoneOutline, Expand, IosShare, ThumbUp, UnfoldLess} from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import {Metadata} from "../Metadata/Metadata";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Snackbar from "@mui/material/Snackbar";
import {Reaction} from "../NostrResources/NostrResources";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { nip19 } from 'nostr-tools';

interface NoteProps {
    id: string;
    title: string;
    content: string;
    bulletPoints?: string[];
    metadata?: Metadata[];
    imageUrls?: string[];
    tags?: string[];
    urls?: string[];
    updatedAt: string;
    reactions?: Reaction[];
    pubkeys?: string[];
    comments?: any[];
    author?: string;
    pinned?: boolean;
    handleClick?: () => any;
    isExpanded?: boolean;
    isCollapsable?: boolean;
}

export const Note = ({
     id, title, content, bulletPoints, metadata, imageUrls, tags, urls, updatedAt, reactions,
     pubkeys, comments, author, pinned, handleClick, isExpanded, isCollapsable }: NoteProps
) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        setExpanded(!!isExpanded);
    }, []);

    const handleShareAnswer = (event: any) => {
        event.stopPropagation();
        navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${id}`);
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
            .replace(new RegExp(/(https?:\/\/[^ ]*)/, 'g'), '<a href="$1" target="_blank">$1</a>')
            .replace(/(#### [a-zA-Z0-9\/.,&\'’?\-` ]*)/, '<h4>$1</h4>')
            .replace(/(#+)/, '')
            .replace(/(\n+)/, '$1<br/>')

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
                    setExpanded(!expanded);
                }}
            >
                <React.Fragment>
                    { parseHtml(title) }
                    <Typography>
                        {
                            new RegExp(/([0123456789abcdef]{64})/).test(id) &&
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    const noteEncoded = nip19.noteEncode(id);
                                    navigator.clipboard.writeText(noteEncoded);
                                    setSnackBarMessage(noteEncoded);
                                    setSnackbarOpen(true);
                                }}
                            >
                                <CopyAll sx={{ fontSize: 18 }} />
                            </IconButton>
                        }
                        {
                            isCollapsable &&
                            <IconButton>
                                {
                                    expanded ? <UnfoldLess sx={{ fontSize: 18 }} /> : <Expand sx={{ fontSize: 18 }} />
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
                                    <ListItem>{
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
                        { tags &&
                        <Typography sx={{ fontSize: '12px' }}>
                            <Divider sx={{ margin: '0.4em', marginBottom: '2em' }} component="div" />
                            {
                                tags.map(tag => (
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
                            Last update: {updatedAt}
                        </Typography>
                    </Stack>
                    <Divider sx={{ margin: '0.4em' }} component="div" />
                    <Stack sx={{ justifyContent: 'flex-end', alignItems: 'center' }} direction="row" spacing={1}>
                        { pinned &&
                        <DoneOutline color="success" />
                        }
                        { comments &&
                        <IconButton
                            onClick={(event) => {
                                handleClick && handleClick() ;
                            }}
                        >
                            <Badge
                                badgeContent={comments.length}
                                color="primary"
                            >
                                <ChatBubble/>
                            </Badge>

                        </IconButton>
                        }
                        {
                            reactions &&
                            <Badge badgeContent={reactions.length} color="primary">
                                <ThumbUp />
                            </Badge>
                        }
                        <IconButton
                            onClick={(event) => {
                                handleShareAnswer(event);
                            }}
                        >
                            <IosShare />
                        </IconButton>
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
    </React.Fragment>);
};