import {TimeAgo} from "../../TimeAgo/TimeAgo";
import {QuestionSummary} from "../QuestionSummary/QuestionSummary";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {UnfoldLess, UnfoldMore} from "@mui/icons-material";
import {EventSkeleton} from "../EventSkeleton/EventSkeleton";
import {Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import {Metadata} from "../Metadata/Metadata";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Link, useNavigate} from 'react-router-dom';
import {containsTag, valueFromTag} from "../../../utils/utils";
import {Config} from "../../../resources/Config";
import {nip19, NostrEvent} from "nostr-tools";
import {noteContentToHtml} from "../../../services/note2html";
import "./NoteContent.css";
import {REACTIONS} from "../Reactions/Reactions";
import {getZapper, zapAmountFromEvent} from "../../../services/nostr/zap";

interface NoteContentProps {
    event: NostrEvent;
    expanded?: boolean;
    floating?: boolean;
    nevent?: string;
    searchString?: string;
    props: any;
}

const MetadataMemo = React.memo(Metadata);

const NoteContent = ({ event, expanded, floating, searchString, props }: NoteContentProps) => {

    const navigate = useNavigate();


    const [parsedContent, setParsedContent] = useState<any>();
    const [showFullText, setShowFullText] = useState<boolean>(false);

    const determineWhereToSliceText = useCallback((text: string) => {
        let defaultSliceIndex = 300;
        const [charsAllowedToSliceAt] = [' ', ',', '.', '?', '!'];

        while (
            defaultSliceIndex < text.length &&
            !charsAllowedToSliceAt.includes(text.charAt(defaultSliceIndex))
        ) {
            defaultSliceIndex++;
        }
        return defaultSliceIndex;
    }, []);

    const { id } = event;
    const nevent = useMemo(() => id && nip19.neventEncode({ id, relays: ['wss://q.swarmstr.com'] }), [id]);

    useEffect(() => {
        if (!!event?.content) {
            let content = event!.content;
            const sliceIndex = determineWhereToSliceText(content);
            if (!expanded && !showFullText && content.length > 300) content = content.slice(0, sliceIndex) + '...';
            const referencedEventId = valueFromTag(event, 'e');
            if (referencedEventId &&
                containsTag(event!.tags, ['t', Config.HASHTAG]) &&
                !(new RegExp(/nostr:note1([a-z0-9]+)/gmi).test(event.content) ||
                    new RegExp(/nostr:nevent1([a-z0-9]+)/gmi).test(event.content))) {
                const bech32Id = nip19.noteEncode(referencedEventId);
                content = `${content}\nnostr:${bech32Id}`;
            }
            // @ts-ignore
            const _parsedContent = noteContentToHtml(content, event!.tags, searchString, floating);
            setParsedContent(_parsedContent);
        }
    }, [event, showFullText, expanded, nevent, id]);

    if (!event) {
        return <EventSkeleton visible={true} />
    }

    const getTitle = (title?: string) => {
        return title ? <h1>{title}</h1> : '';
    };

    const getImage = (imageUrl?: string) => {
        if (imageUrl) {
            return <img src={imageUrl} width="100%" />
        }
        return;
    };

    return <CardContent sx={{ paddingBottom: 0, padding: 0 /*paddingLeft: '50px'*/ }}>
        { event && <TimeAgo timestamp={event.created_at*1000}/> }
        {
            [1, 30023].includes(event.kind) && <Typography sx={{ display: 'flex', paddingLeft: '3px' }} component="div">
                <MetadataMemo
                    variant="link"
                    pubkey={event.pubkey}
                />
            </Typography>
        }
        <Typography
            sx={{ '&:hover': { textDecoration: 'none' }, color: 'unset', margin: 0, padding: 0 }}
            gutterBottom
            variant="body2"
            component={expanded ? 'div': Link}
            // onClick={() => navigate(`/e/${nevent}`, {shallow: true})}
            {...(!expanded && { to: `/e/${nevent}` })}
        >
            <Typography
                className="noteContent"
                sx={{...(!expanded && { cursor: 'pointer' }) }}
                component="div"
            >
                {
                    [1, 30023].includes(event.kind) && <React.Fragment>
                        <QuestionSummary id={id!}/>
                        {
                            getTitle(valueFromTag(event, 'title'))
                        }
                        {
                            getImage(valueFromTag(event, 'image'))
                        }
                        {
                            // @ts-ignore
                            parsedContent
                        }
                    </React.Fragment>
                }
                {
                    [6,7,9735].includes(event.kind) && <Box sx={{ marginTop: '0.75em' }}>
                        {
                            [6, 7].includes(event.kind) && <React.Fragment>
                                <MetadataMemo
                                    variant="link"
                                    pubkey={event.pubkey}
                                /> { event.kind === 6 ? 'boosted your note.' : `reacted to your note with ${event.content.replace('+', '💜')}` }
                            </React.Fragment>
                        }
                        {
                            event.kind === 9735 && <React.Fragment>
                                <MetadataMemo
                                    variant="link"
                                    pubkey={getZapper(event)}
                                /> zapped your note { zapAmountFromEvent(event) } sats.
                            </React.Fragment>
                        }
                    </Box>
                }

            </Typography>
        </Typography>
        {
            !expanded && [1, 30023].includes(event.kind) && event?.content?.length > 300 && <Box>
                <Button className="showMoreLess-button" color="primary" variant="text" onClick={() => { setShowFullText(!showFullText) }}>
                    { showFullText ? <React.Fragment><UnfoldLess/>show less</React.Fragment> :
                        <React.Fragment><UnfoldMore/>show more</React.Fragment> }
                </Button>
            </Box>
        }

    </CardContent>
};

export default memo(NoteContent);