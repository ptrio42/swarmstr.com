import {Dialog, useTheme} from "@mui/material";
import {NostrNoteThreadContext} from "../contexts/NostrNoteThreadContext";
import {NoteThread} from "../components/Nostr/Thread/Thread";
import {NostrNoteContextProvider} from "../providers/NostrNoteContextProvider";
import {Note} from "../components/Nostr/Note/Note";
import {NostrNoteThreadContextProvider} from "../providers/NostrNoteThreadContextProvider";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";

interface ThreadDialogProps {
    open: boolean;
    onClose?: () => void,
    nevent?: string | null
}

export const ThreadDialog = ({ open, onClose, nevent }: ThreadDialogProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <Dialog fullWidth={true} fullScreen={fullScreen} open={open} onClose={() => onClose && onClose()}>
            {
                !!nevent && <NostrNoteThreadContextProvider nevent={nevent}>
                    <NoteThread
                        key={`${nevent}-thread`}
                        nevent={nevent}
                        expanded={true}
                        floating={true}
                    >
                        <NostrNoteContextProvider thread={true}>
                            <Note key={`${nevent}-content`} nevent={nevent} expanded={true} floating={true}/>
                        </NostrNoteContextProvider>
                    </NoteThread>
                </NostrNoteThreadContextProvider>
            }
        </Dialog>
    );
};