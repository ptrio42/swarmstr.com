import {Outlet} from "react-router-dom";
import React from 'react';
import {LoginDialog} from "../../dialog/LoginDialog";
import {NewNoteDialog} from "../../dialog/NewNoteDialog";
import {Config} from "../../resources/Config";
import {ZapDialog} from "../../dialog/ZapDialog";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {NewLabelDialog} from "../../dialog/NewLabelDialog";
import {RelayListDialog} from "../../dialog/RelayListDialog";
import {ImageCreatorDialog} from "../../dialog/ImageCreatorDialog";
import {ThemeProvider} from "@mui/material";

export const Nostr = () => {

    const { loginDialogOpen, setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen, zapDialogOpen,
        setZapDialogOpen, newReplyDialogOpen, setNewReplyDialogOpen, newLabelDialogOpen, setNewLabelDialogOpen,
        selectedLabelName, event, relayListDialogOpen, setRelayListDialogOpen, imageCreatorDialogOpen, setImageCreatorDialogOpen } = useNostrContext();

    return <React.Fragment>
        <Outlet/>
        <LoginDialog open={loginDialogOpen}
                     onClose={() => {
                         setLoginDialogOpen(false)
                     }} />
        <NewNoteDialog
            open={newNoteDialogOpen}
            onClose={() => setNewNoteDialogOpen(false)}
            label="Your note goes here..."
            explicitTags={[['t', Config.HASHTAG]]}
        />
        <ZapDialog
            open={zapDialogOpen}
            event={event}
            onClose={() => setZapDialogOpen(false)}
        />
        <NewNoteDialog
            open={newReplyDialogOpen}
            onClose={() => setNewReplyDialogOpen(false)}
            event={event}
            explicitTags={[['t', Config.REPLIES_HASHTAG]]} label="Your reply..."
        />
        <NewLabelDialog
            open={newLabelDialogOpen}
            onClose={() => setNewLabelDialogOpen(false)}
            selectedLabelName={selectedLabelName}
            reaction={'shaka'}
            event={event}
        />
        <RelayListDialog
            open={relayListDialogOpen}
            onClose={() => { setRelayListDialogOpen(false) }}
        />
    </React.Fragment>;
};