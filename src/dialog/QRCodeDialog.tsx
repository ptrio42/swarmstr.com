import React, {useEffect} from "react";
import {DialogTitle} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {Close} from "@mui/icons-material";
import QRCode from "react-qr-code";
import {useNostrContext} from "../providers/NostrContextProvider";

interface QrCodeDialogProps {
    dialogOpen: boolean;
    str: string;
    close?: () => void;
    fee?: number;
    status?: string;
    lnbc?: string
}

export const QrCodeDialog = ({ dialogOpen, str, close, fee, status, lnbc }: QrCodeDialogProps) => {

    const { setSnackbarMessage } = useNostrContext();

    useEffect(() => {
        console.log('Invoice status changed: ', {status})
    }, [status]);

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
            {
                str && <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={str}
                    viewBox={`0 0 256 256`}
                />
            }
        </Typography>
        <Typography sx={{
            cursor: 'pointer',
            maxWidth: '256px',
            padding: '0.5em',
            overflow: 'hidden',
            borderRadius: '5px',
            border: '1px #000 solid',
            margin: '0.5em'
        }} onClick={() => {
            navigator.clipboard.writeText(str);
            setSnackbarMessage({ message: 'Invoice copied to clipboard!' });
        }}>
            ⚡{ str }
        </Typography>
        {
            status && <Typography sx={{ textAlign: 'center' }}>
                {
                    status === 'pending' && <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress sx={{ marginRight: '0.33em', marginBottom: '0.33em' }} color="secondary" /> Pending
                    </Typography>
                }
                {
                    status === 'completed' && <Typography sx={{ color: 'green' }}>
                        Payment {status}!
                    </Typography>
                }
            </Typography>
        }
    </Dialog>
};