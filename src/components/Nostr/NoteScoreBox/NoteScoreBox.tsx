import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import React, {useState} from "react";
import {Box} from "@mui/material";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import IconButton from "@mui/material/IconButton";
import {NostrEvent, NDKTag} from "@nostr-dev-kit/ndk";
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import {LabelEvent} from "../../../models/commons";
import Badge from "@mui/material/Badge";
import {isNumber} from "util";
import Tooltip from "@mui/material/Tooltip";
import {CircularProgressWithLabel} from "../../CircularProgressWithLabel/CircularProgressWithLabel";

interface NoteScoreBoxProps {
    id: string;
    event?: NostrEvent;
}

export const NoteScoreBox = ({ id, event }: NoteScoreBoxProps) => {

    const { user, setLoginDialogOpen, setNewLabelDialogOpen, setSelectedLabelName, setEvent } = useNostrContext();

    const score = useLiveQuery(async () => {
        const labels = await db.labels
            .where({ referencedEventId: id })
            .and(({ tags }) => containsTag(tags, ['l', 'note/useful', '#e']) || containsTag(tags, ['l', 'note/not_useful', '#e']))
            .toArray();

        return labels
            .map(({tags}) => containsTag(tags, ['l', 'note/useful', '#e']) ? 1 : -1)
            // @ts-ignore
            .reduce((previous: number, current: number) => previous + current, 0);
    }, [id], 0);

    const quality = useLiveQuery(async () => {
        const labels = await db.labels
            .where({ referencedEventId: id })
            .and(({ tags }) => containsTag(tags, ['l', 'thumb']))
            .toArray();

        const reviews = labels
            .map(({tags}: LabelEvent) => tags
                .filter((tag: NDKTag) => tag[2] === 'note')
                .map((tag: NDKTag) => JSON.parse(tag[3]).quality)
                .reduce((prev: number, curr: number) => +prev + curr, 0)
            )
            .flat(2);

        if (reviews.length === 0) {
            return undefined;
        }

        console.log('NoteScoreBox', reviews, {quality: reviews.reduce((prev: number, curr: number) => +prev + curr, 0) / reviews.length});

        const quality = reviews.reduce((prev: number, curr: number) => +prev + curr, 0) / reviews.length;
        return Math.round((quality + Number.EPSILON) * 100);
    }, [id], undefined);

    if (!event) {
        return null;
    }

    return <Box
        className="noteScore"
        sx={{
            width: '48px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'absolute',
            height: '100%',
            flexDirection: 'column',
            paddingTop: '12px'
        }}
    >
        <IconButton onClick={() => {
            if (user) {
                setSelectedLabelName('note/useful');
                setEvent(event);
                setNewLabelDialogOpen(true);
            } else {
                setLoginDialogOpen(true);
            }
        }}>
            <Tooltip title={"Thumbs up"}>
                <KeyboardArrowUp/>
            </Tooltip>
        </IconButton>
        { score }
        <IconButton onClick={() => {
            if (user) {
                setSelectedLabelName('note/not_useful');
                setEvent(event);
                setNewLabelDialogOpen(true);
            } else {
                setLoginDialogOpen(true);
            }
        }}>
            <Tooltip title={"Thumbs down"}>
                <KeyboardArrowDown/>
            </Tooltip>
        </IconButton>
        {
            quality !== undefined && <Tooltip title="Note rating">
                <CircularProgressWithLabel sx={{ width: '35px', height: '35px' }} value={quality} color={quality >= 50 ? 'success' : 'error'} />
            </Tooltip>
        }
        {/*{*/}
            {/*quality !== undefined && <Badge sx={{ textWrap: 'nowrap', marginTop: '1em' }}color={quality >= 50 ? 'success' : 'error'} badgeContent={`${quality}%`}>*/}
                {/*<Tooltip title="Note rating">*/}
                    {/*<ThumbsUpDownIcon/>*/}
                {/*</Tooltip>*/}
            {/*</Badge>*/}
        {/*}*/}
    </Box>
};