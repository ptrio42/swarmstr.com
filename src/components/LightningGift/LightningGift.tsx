import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import {createLightningGift} from "../../services/lightningGift";
import {MouseEventHandler, useEffect, useState} from "react";
import * as React from "react";
import QRCode from 'react-qr-code';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import {TabPanel} from "../TabPanel/TabPanel";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import './LightningGift.css';
import makeStyles from "@mui/material/styles/makeStyles";

interface LnurlsProps {
    redeem: string;
    pay: string;
}

interface LightningGiftProps {
    handleRedeemLnurl?: (values: string[]) => void,
    satsAmount: number,
    handleIsLoading: (value: boolean) => void,
    numberOfGifts?: number
}

interface LightningGiftDialogProps {
    open: boolean;
    lnurls: LnurlsProps[];
    onClose: (value?: string) => void;
}

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: 'none',
    maxWidth: '257px'
}));

export const LightningGiftDialog = ({ open, lnurls, onClose }: LightningGiftDialogProps) => {
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(1);
    const itemsPerPage = 1;
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    const handleClose = () => {
        onClose();
    };

    const copyTextToClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    };

    const handleCopyLnurlClick = (lnurl: string) => {
        copyTextToClipboard(lnurl)
            .then(() => {
                setSnackbarOpen(true);
            });
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
                {
                    lnurls.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((url: any) => (
                        <Stack spacing={2}>
                            <Item>
                                To load up the card with sats, copy the Lightning Invoice by clicking on the box below
                                or scan the QR Code with a Lightning Wallet.
                            </Item>
                            <Item>
                                <TextField type="text" value={url.pay} inputProps={{ readOnly: true }} onClick={(event) => {
                                handleCopyLnurlClick((event.target as HTMLInputElement).value)
                            }} />
                            </Item>
                            <Item>
                                <QRCode value={url.pay} />
                            </Item>
                        </Stack>
                    ))
                }
                <Pagination className="pagination" count={Math.ceil(lnurls.length / itemsPerPage)} page={page} onChange={handlePageChange} />
            </TabPanel>
            <TabPanel index={1} value={tab}>
                {
                    lnurls.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((url: any) => (
                        <Stack spacing={2}>
                            <Item>
                                <TextField type="text" value={url.redeem} inputProps={{ readOnly: true }} onClick={(event) => {
                                    handleCopyLnurlClick((event.target as HTMLInputElement).value)
                                }} />
                            </Item>
                            <Item>
                                <QRCode value={url.redeem} />
                            </Item>
                        </Stack>
                    ))
                }
                <Pagination className="pagination" count={Math.ceil(lnurls.length / itemsPerPage)} page={page} onChange={handlePageChange} />
            </TabPanel>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => {
                    setSnackbarOpen(false);
                }}
                message="Text copied!"
            />
        </Dialog>
    );
};

export const LightningGift = ({ handleRedeemLnurl, satsAmount, handleIsLoading, numberOfGifts = 1 }: LightningGiftProps) => {
    const [lnurls, setLnurls] = useState<LnurlsProps[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleOpen = () => {
        setDialogOpen(true);
    };

    const createGift = async () => {
        handleIsLoading && handleIsLoading(true);
        const urls = [];
        for (let i = 0; i < numberOfGifts; i++) {
            const data = await createLightningGift(satsAmount);
            urls.push({
                pay: data.lightningInvoice.payreq,
                redeem: data.lnurl
            });
        }
        setLnurls(urls);
        handleRedeemLnurl && handleRedeemLnurl(urls.map(url => url.redeem));
        handleIsLoading && handleIsLoading(false);
        setDialogOpen(true);
    };

    return (
        <Box>
            <Button color="secondary" onClick={createGift} disabled={satsAmount < 100}>Create Gift!</Button>

            {
                lnurls.length > 0 && lnurls[0].pay !== '' && lnurls[0].redeem !== '' &&
                <Button color="secondary" onClick={handleOpen}>Show QR Codes</Button>
            }

            <LightningGiftDialog open={dialogOpen} lnurls={lnurls} onClose={handleClose} />
        </Box>
    );
};