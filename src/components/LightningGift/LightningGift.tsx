import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import {createLightningGift} from "../../services/lightningGift";
import {useState} from "react";
import * as React from "react";
import QRCode from 'react-qr-code';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import {TabPanel} from "../TabPanel/TabPanel";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

interface LnurlsProps {
    redeem: string;
    pay: string;
}

interface LightningGiftProps {
    handleRedeemLnurl?: (value: string) => void,
    satsAmount: number,
    handleIsLoading: (value: boolean) => void
}

interface LightningGiftDialogProps {
    open: boolean;
    lnurls: LnurlsProps;
    onClose: (value?: string) => void
}

export const LightningGiftDialog = ({ open, lnurls, onClose }: LightningGiftDialogProps) => {
    const [tab, setTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Create Lightning Gift
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="Lightning Gift"
                textColor="secondary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                <Tab label="Pay Invoice" />
                <Tab label="Redeem" />
            </Tabs>
            <TabPanel index={0} value={tab}>
                <QRCode value={lnurls.pay} />
            </TabPanel>
            <TabPanel index={1} value={tab}>
                <QRCode value={lnurls.redeem} />
            </TabPanel>
        </Dialog>
    );
};

export const LightningGift = ({ handleRedeemLnurl, satsAmount, handleIsLoading }: LightningGiftProps) => {
    const [lnurls, setLnurls] = useState<LnurlsProps>({
        pay: '',
        redeem: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        setDialogOpen(false)
    };

    const handleOpen = () => {
        setDialogOpen(true);
    };

    const createGift = async () => {
        handleIsLoading && handleIsLoading(true);
        const data = await createLightningGift(satsAmount);
        setLnurls({
            pay: data.lightningInvoice.payreq,
            redeem: data.lnurl
        });
        handleIsLoading && handleIsLoading(false);
        handleRedeemLnurl && handleRedeemLnurl(data.lnurl);
        setDialogOpen(true);
    };

    return (
        <Box>
            <Button color="secondary" onClick={createGift} disabled={satsAmount < 100}>Create Gift!</Button>

            {
                lnurls.pay !== '' && lnurls.redeem !== '' &&
                <Button color="secondary" onClick={handleOpen}>Show QR Codes</Button>
            }

            <LightningGiftDialog open={dialogOpen} lnurls={lnurls} onClose={handleClose} />
        </Box>
    );
};