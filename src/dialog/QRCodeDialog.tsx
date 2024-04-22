import React from "react";
import {DialogTitle} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {Close} from "@mui/icons-material";

interface QrCodeDialogProps {
    dialogOpen: boolean;
    str: string;
    close?: () => void;
    fee?: number;
    status?: string;
    lnbc?: string
}

export const QrCodeDialog = ({ dialogOpen, str, close, fee, status, lnbc }: QrCodeDialogProps) => {

    return <Dialog open={dialogOpen} onClose={close} >
        <DialogTitle>
            Scan QR Code
            <IconButton
                aria-label="close"
                onClick={close}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
        </DialogTitle>
        {
            fee && <Typography sx={{ textAlign: 'center' }}>
                Pay {fee} sats
            </Typography>
        }
        <Typography sx={{ padding: '1em' }}>
        </Typography>
        {
            status && <Typography sx={{ textAlign: 'center' }}>
                {
                    status === 'pending' && <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-3em' }}>
                        <CircularProgress sx={{ marginRight: '0.33em', marginBottom: '0.33em' }} color="secondary" /> Pending
                    </Typography>
                }
                {
                    status === 'completed' && <Typography sx={{ color: 'green', marginTop: '-3em' }}>
                        Payment {status}!
                    </Typography>
                }
            </Typography>
        }
    </Dialog>
};