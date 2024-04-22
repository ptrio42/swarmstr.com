import {NostrEvent} from "@nostr-dev-kit/ndk";
import {ReplyButton} from "../ReplyButton/ReplyButton";
import {DoneOutline} from "@mui/icons-material";
import {ZapButton} from "../ZapButton/ZapButton";
import {BoostButton} from "../BoostButton/BoostButton";
import {ReactionButton} from "../ReactionButton/ReactionButton";
import {EventMenu} from "../EventMenu/EventMenu";
import React from "react";
import {CardActions} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface NoteActionsProps {
    nevent?: string;
    event: NostrEvent;
    pinned?: boolean;
}

export const NoteActions = ({ event, pinned, nevent }: NoteActionsProps) => {
    if (!event || !nevent) {
        return null;
    }

    return <CardActions>
        <Typography sx={{ width: '100%' }} variant="body2" component="div">
            <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1em' }} direction="row" spacing={1}>
                <Typography component="div" sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                    <ReplyButton event={event} />
                </Typography>
                <Typography component="div" sx={{ fontSize: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    { pinned && <DoneOutline color="success" /> }
                    <ZapButton event={event!}/>
                    <BoostButton id={event!.id!} event={event!}/>
                    <ReactionButton id={event!.id!}/>
                    <EventMenu nevent={nevent} event={event}/>
                </Typography>
            </Stack>
        </Typography>
    </CardActions>
};