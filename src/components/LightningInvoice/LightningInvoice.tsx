import React, {useCallback} from "react";
import lightBolt11Decoder from "light-bolt11-decoder";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import './LightningInvoice.css';
import {useNostrNoteContext} from "../../providers/NostrNoteContextProvider";

interface LightningInvoiceProps {
    lnbc: string;
}

export const LightningInvoice = ({lnbc}: LightningInvoiceProps) => {

    const { payInvoice } = useNostrNoteContext();

    const getAmount = useCallback(() => {
        // console.log({lnbc})
        return lightBolt11Decoder.decode(lnbc).sections
            .find((section: any) => section.name === 'amount').value
    }, [lnbc]);

    return (
        <Box className="lightningInvoice-container">
            <Typography>
                Lightning Invoice
            </Typography>
            <Typography>
                { getAmount() } sats
            </Typography>
            <Button className="lightningInvoice-button" color="warning" variant="outlined" onClick={() => { payInvoice(lnbc) }}>Pay</Button>
        </Box>
    );
};