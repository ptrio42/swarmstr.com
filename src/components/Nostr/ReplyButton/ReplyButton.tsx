import {ChatBubbleOutline} from "@mui/icons-material";
import React from "react";
import {Button} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NostrEvent} from "@nostr-dev-kit/ndk";

interface ReplyButtonProps {
    event?: NostrEvent;
}

export const ReplyButton = ({ event }: ReplyButtonProps) => {
    const { setLoginDialogOpen, user, setNewReplyDialogOpen, setEvent } = useNostrContext();
    const { commentEvents } = useNostrNoteThreadContext();

    if (!event) {
        return null;
    }

    return <React.Fragment>
        <Tooltip title="Add new answer">
            <Button
                color="secondary"
                sx={{ textTransform: 'none' }}
                onClick={() => {
                    if (user) {
                        setEvent(event);
                        setNewReplyDialogOpen(true);
                    } else {
                        setLoginDialogOpen(true);
                    }
                }}
            >
                <Badge
                    badgeContent={commentEvents?.length}
                    color="primary"
                    className="comments-count"
                >
                    <ChatBubbleOutline sx={{ fontSize: 18 }} />
                </Badge>
            </Button>
        </Tooltip>
    </React.Fragment>
};