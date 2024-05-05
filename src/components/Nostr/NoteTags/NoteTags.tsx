import {NDKTag} from '@nostr-dev-kit/ndk';
import {Typography} from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from "@mui/material/Badge";
import {MoreHoriz} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

interface NoteTagsProps {
    tags: NDKTag[];
    styles?: any;
    explicitlyExpanded?: boolean;
    path?: string;
}

const DEFAULT_MAX_TAGS = 3;

export const TAG_EMOJIS: { [key: string]: string } = {
    'swarmstr': '🐝',
    'coffeechain': '☕️',
    'plebchain': '🫂',
    'bookstr': '📚',
    'asknostr': '🗣️',
    'biblestr': '✝️',
    'memestr': '🐸',
    'foodstr': '🥩',
    'grownostr': '🌱',
    'zapathon': '⚡️',
    'bountstr': '💰'
};

export const NoteTags = ({ tags = [], path = 'recent', ...props }: NoteTagsProps) => {
    const [visibleTagsNo, setVisibleTagsNo] = useState(DEFAULT_MAX_TAGS);
    const navigate = useNavigate();

    const showAllTags = () => {
        setVisibleTagsNo(tags.length);
    };

    return <Stack sx={props.styles} direction="row" spacing={1}>
        {
            tags.slice(0, props.explicitlyExpanded? tags.length : visibleTagsNo).map((t: string[]) => <Chip onClick={() => { navigate(`/${path}/${t[1]}`) }} size="small" label={TAG_EMOJIS[t[1]] ? TAG_EMOJIS[t[1]] + ' ' + t[1] : t[1]} />)
        }
        {
            !props.explicitlyExpanded && tags.length > visibleTagsNo && <Badge color="primary" badgeContent={tags.length-visibleTagsNo}>
                <IconButton onClick={showAllTags} size="small"><MoreHoriz/></IconButton>
            </Badge>
        }
    </Stack>
};