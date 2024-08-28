import {ChatBubbleOutline} from "@mui/icons-material";
import React, {memo} from "react";
import {Button} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {NostrEvent} from "nostr-tools";

interface ReplyButtonProps {
    event?: NostrEvent;
    totalReplies?: number;
}

const ReplyButton = ({ event, totalReplies }: ReplyButtonProps) => {
    const { setLoginDialogOpen, user, setNewReplyDialogOpen, setEvent } = useNostrContext();

    if (!event) {
        return null;
    }

    return <React.Fragment>
        <Tooltip title="Add new answer">
            <Button
                sx={{ textTransform: 'none', padding: 0, minWidth: 'unset', color: '#909090', '&:hover': { color: '#000' } }}
                onClick={() => {
                    if (user) {
                        setEvent(event);
                        setNewReplyDialogOpen(true);
                    } else {
                        setLoginDialogOpen(true);
                    }
                }}
            >
                <ChatBubbleOutline sx={{ fontSize: 27 }} />
                {totalReplies}
                {/*<Badge*/}
                    {/*badgeContent={totalReplies || 0 }*/}
                    {/*color="primary"*/}
                    {/*className="comments-count"*/}
                {/*>*/}
                    {/**/}
                {/*</Badge>*/}
            </Button>
        </Tooltip>
    </React.Fragment>
};

export default memo(ReplyButton);