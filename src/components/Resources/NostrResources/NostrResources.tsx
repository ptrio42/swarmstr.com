import React, {useEffect, useState} from "react";
import {List} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import {useLocation} from "react-router-dom";
import {Helmet} from "react-helmet";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {ArrowDownward, ArrowUpward, ExpandLess, ExpandMore, Reply, ToggleOff} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import './NostrResources.css';
import ListItemButton from "@mui/material/ListItemButton";
import Snackbar from "@mui/material/Snackbar";
import CardMedia from "@mui/material/CardMedia";
import Input from "@mui/material/Input";
import {matchString} from "../../../utils/utils";
import {GUIDES} from "../../../stubs/nostrResources";
import Button from "@mui/material/Button";

export interface Guide {
    id: string;
    issue: string;
    fix: string;
    urls?: string[];
    createdAt?: string;
    updatedAt: string;
    imageUrls?: string[];
    tags?: string[];
    bulletPoints?: string[];
}

export const NostrResources = () => {

    const [guides, setGuides] = useState<Guide[]>([]);
    const [sort, setSort] = useState<string>('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { hash } = useLocation();

    useEffect(() => {
        setGuides(GUIDES);
    }, []);

    useEffect(() => {
        if (sort === '') {
            setGuides(GUIDES);
        } else {
            const guidesSorted = [ ... guides ];

            guidesSorted.sort((current, next) =>
                new Date(next.updatedAt).getTime() - new Date(current.updatedAt).getTime());
            if (sort === 'asc') {
                guidesSorted.reverse();
            }
            setGuides(guidesSorted);
        }
    }, [sort]);

    useEffect(() => {
        setExpanded((state) => [
            ...state,
            hash.slice(1)
        ]);

        if (hash === '') {
            window.scrollTo(0, 0);
        }
        else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 3000);
        }
    }, [hash]);

    const handleExpanded = (guideId: string) => {
        let newExpanded;
        if (expanded.includes(guideId)) {
            newExpanded = expanded.filter(expanded => expanded !== guideId);
        } else {
            newExpanded = [ ...expanded ];
            newExpanded.push(guideId);
        }
        setExpanded(newExpanded)
    };

    const handleShareAnswer = (event: any, guide: Guide) => {
        event.stopPropagation();
        navigator.clipboard.writeText(`https://uselessshit.co/resources/nostr/#${guide.id}`);
        setSnackbarOpen(true);
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Nostr newcomers most common questions and answers - UseLessShit.co</title>
                <meta property="description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Nostr Newcomers Most Common Questions and Answers - UseLessShit.co" />
                <meta property="og:image" content="https://uselessshit.co/images/guide-cover-v2.png" />
                <meta property="og:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content="Nostr newcomers most common questions and answers - UseLessShit.co" />
                <meta itemProp="image" content="https://uselessshit.co/images/guide-cover-v2.png" />

                <meta name="twitter:title" content="Nostr newcomers most common questions and answers - UseLessShit.co" />
                <meta name="twitter:description" content="Basic guide for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/guide-cover-v2.png" />

            </Helmet>
            <Stack sx={{ marginTop: '1em', marginLeft: '1em' }} direction="row" spacing={1}>
                <Chip
                    label="No sort"
                    variant={sort === '' ? 'filled' : 'outlined'}
                    onClick={() => {
                        setSort('')
                    }}
                />
                <Chip
                    icon={sort === 'asc' ?
                        <ArrowUpward /> : sort === 'desc' ? <ArrowDownward /> : <ToggleOff />
                    }
                    variant={sort !== '' ? 'filled' : 'outlined'}
                    label="Last updated"
                    onClick={() => {
                        setSort(
                            sort === 'asc' ? 'desc' : 'asc'
                        )
                    }}
                />
            </Stack>

            <Stack sx={{ marginLeft: '1em' }} direction="row" spacing={1}>
                <Input
                    id="searchQuery"
                    name="searchQuery"
                    placeholder={'Search by keywords'}
                    value={searchQuery}
                    onChange={(event) => {
                        setSearchQuery(event.target.value);
                    }}
                />
            </Stack>

            <List>
                <ListItem key="nostr-resources">
                    <ListItemText
                        sx={{ textTransform: 'uppercase' }}
                        primary="Useful tips for NOSTR newcomers"
                        primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '16px' } }}
                    />
                </ListItem>
                {
                    guides
                        .filter(guide => searchQuery === '' || matchString(searchQuery, guide.issue))
                        .map((guide, index) => (
                        <ListItemButton key={guide.id} id={guide.id} sx={{ flexWrap: 'wrap' }} onClick={() => {
                            handleExpanded(guide.id)
                        }}>
                            <ListItemText primary={guide.issue} />
                            {expanded.includes(guide.id) ? <ExpandLess /> : <ExpandMore />}
                            <Reply sx={{ marginLeft: '0.3em' }} onClick={(event) => {
                                handleShareAnswer(event, guide);
                            }} />
                            <Collapse sx={{ width: '100%'}} in={expanded.includes(guide.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem>
                                        <Card sx={{ minWidth: 275, marginBottom: '0.5em' }}>
                                            { guide.imageUrls && guide.imageUrls.length > 0 &&
                                            <a href={guide.imageUrls[0]} target="_blank">
                                                <CardMedia
                                                    component="img"
                                                    height="194"
                                                    image={guide.imageUrls[0]}
                                                    alt="Show full-sized image in a new tab"
                                                />
                                            </a>
                                            }
                                            <CardContent>
                                                <Typography
                                                    sx={{ fontSize: 14, fontWeight: 'bold', color: '#000', display: 'flex', alignItems: 'center' }}
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    { guide.issue }
                                                    { guide.tags &&
                                                        guide.tags.map(tag => (
                                                            <Chip sx={{ marginLeft: '0.33em' }} label={tag} color="success" />
                                                        ))
                                                    }
                                                </Typography>
                                                <Typography gutterBottom variant="body2">
                                                    { guide.fix }
                                                    { guide.bulletPoints &&
                                                        <List>
                                                            { guide.bulletPoints.map(point =>
                                                                <ListItem>{ point }</ListItem>
                                                            ) }
                                                        </List>
                                                    }
                                                </Typography>
                                                { guide.urls && guide.urls.length > 0 &&
                                                guide.urls.map(url =>
                                                    <React.Fragment>
                                                        <a href={url} target="_blank">{ url }</a><br />
                                                    </React.Fragment>
                                                )

                                                }
                                            </CardContent>
                                            <CardActions>
                                                <Stack direction="column" spacing={1}>
                                                    <Chip label={`Added: ${ guide.createdAt || guide.updatedAt }`} />
                                                    <Chip label={`Last update: ${ guide.updatedAt }`} />
                                                    <Button
                                                        variant="text"
                                                        color="secondary"
                                                        onClick={(event) => {
                                                            handleShareAnswer(event, guide);
                                                        }}
                                                    >
                                                        Click to share the link to the answer
                                                    </Button>
                                                </Stack>
                                            </CardActions>
                                        </Card>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </ListItemButton>
                    ))
                }
            </List>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Direct link to answer was copied to clipboard!"
            />
        </React.Fragment>
    );
};