import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import React, {useEffect, useState} from "react";
import {useNostrContext} from "../providers/NostrContextProvider";
import {Dialog} from "@mui/material";
import Button from "@mui/material/Button";

interface NewLabelDialogProps {
    open: boolean;
    onClose?: () => void;
    reaction: string;
    event?: NostrEvent
}

export const NewLabelDialog = ({ open, onClose, ...props }: NewLabelDialogProps) => {
    const [reaction, setReaction] = useState<string|undefined>(props?.reaction);
    const [event, setEvent] = useState<NostrEvent|undefined>(props?.event);

    const { label, user } = useNostrContext();

    useEffect(() => {

    }, []);

    return (
        <Dialog open={open} onClose={() => onClose && onClose()}>
            {
                event && user && <Button onClick={() => { label(reaction as string, event! as NostrEvent, user.hexpubkey()) }}>Mark as helpful</Button>
            }
        </Dialog>
    )
};