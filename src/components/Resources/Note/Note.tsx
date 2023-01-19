import {List} from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import React, {useState} from "react";
import {Favorite, IosShare} from "@mui/icons-material";
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
}

export const Note = ({ id, title, content, bulletPoints, metadata, imageUrls, tags, urls, updatedAt, reactions }: NoteProps) => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackBarMessage] = useState<string>('');

    const handleShareAnswer = (event: any) => {
        event.stopPropagation();
        navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${id}`);
        setSnackBarMessage('Direct link to answer was copied to clipboard!');
        setSnackbarOpen(true);
    };

    const getProcessedText = (text: string) => {
        return text
            .replace(/(npub[^ ]{59,}$)/, '<button>$1</button>')
            .replace(new RegExp(/(https?:\/\/[^ ]*)/, 'g'), '<a href="$1" target="_blank">$1</a>')
            .replace(/(#### [a-zA-Z0-9\/.,&\'\- ]*)/, '<h4>$1</h4>')
            .replace(/(#+)/, '')
            .replace(/(\n+)/, '$1<br/>');
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
    }

    return (<React.Fragment>
        <Card sx={{
            minWidth: 275,
            marginBottom: '0.5em'
        }}>
        <CardContent>
            <Typography
                sx={{ fontSize: '16px', fontWeight: 'bold', color: '#000', display: 'flex', alignItems: 'center' }}
                color="text.secondary"
                gutterBottom
            >
                { title }
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
                <Stack sx={{ justifyContent: 'flex-end', alignItems: 'center' }} direction="row" spacing={1}>
                    {
                        reactions &&
                        <Badge badgeContent={reactions.length} color="primary">
                            {/*<IconButton>*/}
                            <Favorite/>
                            {/*</IconButton>*/}
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