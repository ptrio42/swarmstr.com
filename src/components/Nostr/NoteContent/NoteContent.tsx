import {TimeAgo} from "../../TimeAgo/TimeAgo";
import {QuestionSummary} from "../QuestionSummary/QuestionSummary";
import React, {useEffect, useState} from "react";
import {UnfoldLess, UnfoldMore} from "@mui/icons-material";
import {EventSkeleton} from "../EventSkeleton/EventSkeleton";
import {Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import {NostrEvent} from "@nostr-dev-kit/ndk";
import {Metadata} from "../Metadata/Metadata";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import {containsTag, valueFromTag} from "../../../utils/utils";
import {Config} from "../../../resources/Config";
import {nip19} from "nostr-tools";
import {noteContentToHtml} from "../../../services/note2html";

interface NoteContentProps {
    event: NostrEvent;
    expanded?: boolean;
    floating?: boolean;
    nevent: string;
    searchString?: string;
    props: any;
}

const MetadataMemo = React.memo(Metadata);

export const NoteContent = ({ event, expanded, floating, nevent, searchString, props }: NoteContentProps) => {

    const navigate = useNavigate();

    const [parsedContent, setParsedContent] = useState<any>();
    const [showFullText, setShowFullText] = useState<boolean>(false);

    useEffect(() => {
        if (!!event?.content) {
            let content = event!.content;
            if (!expanded && !showFullText && content.length > 250) content = content.slice(0, 250) + '...';
            const referencedEventId = valueFromTag(event, 'e');
            if (referencedEventId &&
                containsTag(event!.tags, ['t', Config.HASHTAG]) &&
                !(new RegExp(/nostr:note1([a-z0-9]+)/gm).test(event.content) ||
                    new RegExp(/nostr:nevent1([a-z0-9]+)/gm).test(event.content))) {
                const bech32Id = nip19.noteEncode(referencedEventId);
                content = `${content}\nnostr:${bech32Id}`;
            }
            // @ts-ignore
            const _parsedContent = noteContentToHtml(content, event!.tags, searchString, floating);
            setParsedContent(_parsedContent);
        }
    }, [event, showFullText, expanded]);

    if (!event) {
        return <EventSkeleton visible={true} />
    }

    const { id } = event;

    return <CardContent sx={{ paddingBottom: 0, paddingLeft: '50px' }}>
        <TimeAgo timestamp={event.created_at*1000}/>
        <Typography sx={{ display: 'flex' }} component="div">
            <MetadataMemo
                variant="link"
                pubkey={event.pubkey}
            />
        </Typography>
        <Typography
            sx={{ textAlign: 'left', fontSize: '16px', fontWeight: '300', marginTop: '1em!important', wordBreak: 'break-word', ...(!expanded && { cursor: 'pointer' }) }}
            gutterBottom
            variant="body2"
            component="div"
            {...(!expanded && !floating && { onClick: () => { navigate(`/e/${nevent}`, { state: { events: props.state?.events, event, limit: props.state?.events?.length, previousUrl: location?.pathname} }) } })}
            {...(floating && { onClick: () => { navigate(`/search/${searchString}?e=${nevent}`) } })}
        >
            <QuestionSummary id={id!}/>
            {
                // @ts-ignore
                parsedContent
            }
        </Typography>
        {
            !expanded && event?.content?.length > 250 && <Box>
                <Button className="showMoreLess-button" color="secondary" variant="text" onClick={() => { setShowFullText(!showFullText) }}>
                    { showFullText ? <React.Fragment><UnfoldLess/>Show less</React.Fragment> :
                        <React.Fragment><UnfoldMore/>Show more</React.Fragment> }
                </Button>
            </Box>
        }

    </CardContent>
};