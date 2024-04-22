import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import React, {useState} from "react";
import {Box} from "@mui/material";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import IconButton from "@mui/material/IconButton";
import {NostrEvent} from "@nostr-dev-kit/ndk";

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
            <KeyboardArrowUp/>
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
            <KeyboardArrowDown/>
        </IconButton>
    </Box>
};