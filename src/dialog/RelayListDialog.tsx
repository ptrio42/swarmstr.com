import {Box, Dialog} from "@mui/material";
import {Relays} from "../components/Nostr/Relays/Relays";
import React from 'react';
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface RelayListDialogProps {
    open: boolean;
    onClose?: () => void;
}

export const RelayListDialog = ({ open, onClose }: RelayListDialogProps) => {
  return <Dialog open={open} onClose={() => onClose && onClose()}>
      <DialogTitle sx={{ color: '#fff' }}>
          Relays
      </DialogTitle>
      <DialogContent>
          <Relays/>
      </DialogContent>
  </Dialog>
};