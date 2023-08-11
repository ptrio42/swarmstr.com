import React, {useCallback} from "react";
import lightBolt11Decoder from "light-bolt11-decoder";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import './LightningInvoice.css';
import {useNostrContext} from "../../providers/NostrContextProvider";

interface LightningInvoiceProps {
    lnbc: string;
}

export const LightningInvoice = ({lnbc}: LightningInvoiceProps) => {

    const { payInvoice } = useNostrContext();

    const getAmount = useCallback(() => {
        try {
            const decoded = lightBolt11Decoder.decode(lnbc);
            return decoded.sections
                .find((section: any) => section.name === 'amount').value
        } catch (e) {
            console.error('unable to decode lnbc');
            return 'n/a';
        }
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