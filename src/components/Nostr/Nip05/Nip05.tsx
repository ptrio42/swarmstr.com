import React, {useEffect} from "react";
import {useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { nip19 } from 'nostr-tools';
import {checkName, createInvoice, getInvoiceStatus} from '../../../services/invoices';
import Button from "@mui/material/Button";
import {QrCodeDialog} from "../../Resources/Metadata/Metadata";
import {Helmet} from "react-helmet";

export const Nip05 = () => {
    const [pubkey, setPubkey] = useState<string>();
    const [pubkeyValid, setPubkeyValid] = useState<boolean>();
    const [name, setName] = useState<string>();
    const [nameAvailable, setNameAvailable] = useState();
    const [invoice, setInvoice] = useState();
    const [invoiceStatus, setInvoiceStatus] = useState();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    let fallbackTimeout: any;

    useEffect(() => {
        checkPubkey();
    }, [pubkey]);

    useEffect(() => {
        if (name) {
            checkName(name).then(response => {
                setNameAvailable(response.nameAvailable);
            });
        }
    }, [name]);

    useEffect(() => {
        if (invoiceStatus === 'completed' && fallbackTimeout) {
            clearTimeout(fallbackTimeout);
        }
    }, [invoiceStatus]);

    const getBackoffTime = () => {
        return 5000 + Math.floor(Math.random() * 5000)
    };

    const checkPubkey = () => {
        let pubkeyValid = false;
        if (pubkey) {
            if (new RegExp('npub1').test(pubkey)) {
                try {
                    pubkeyValid = !!nip19.decode(pubkey).data;
                } catch (error) {
                    console.error({error});
                }

            } else {
                pubkeyValid = pubkey.length === 64 && !!nip19.npubEncode(pubkey);
            }
        }
        setPubkeyValid(pubkeyValid);
    };

    const handleInvoiceStatus = async () => {
        if (name) {
            try {
                const { status } = await getInvoiceStatus(name);

                if (status === 'pending') {
                    fallbackTimeout = setTimeout(handleInvoiceStatus, getBackoffTime());
                    return;
                }

                setInvoiceStatus(status);
            } catch (error) {
                console.error('error fetching status', error);
                fallbackTimeout = setTimeout(handleInvoiceStatus, getBackoffTime());
            }
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Human readable identifier for your public key - UseLessShit.co</title>
                <meta property="description" content="Get verified on Nostr @nostrich.love" />
                <meta property="keywords" content="nostr, nostr nip05, nip-05, getting verified" />

                <meta property="og:url" content="https://uselessshit.co/resources/nostr" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Human readable identifier for your public key - UseLessShit.co" />
                <meta property="og:description" content="Get verified on Nostr @nostrich.love" />

                <meta itemProp="name" content="Human readable identifier for your public key - UseLessShit.co" />

                <meta name="twitter:title" content="Human readable identifier for your public key - UseLessShit.co" />
                <meta name="twitter:description" content="Get verified on Nostr @nostrich.love" />

            </Helmet>
            <Box>
                <Typography
                    component="div"
                    variant="h5"
                    sx={{ margin: '0.33em' }}
                >
                    Get yourname@nostrich.love NIP-05 handle
                </Typography>
                <Typography sx={{ margin: '0.33em' }}>
                    Human readable identifier for your public key.
                </Typography>
                <Typography sx={{ margin: '0.33em' }}>
                    Provide your Nostr pubkey and desired name to generate a Bitcoin Lightning invoice.
                </Typography>
                <Card>
                    <CardContent>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Your handle: {name}@nostrich.love
                        </Typography>

                        <TextField
                            sx={{ margin: '0.33em' }}
                            id="name"
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                            {...(name && name.length > 0 && !nameAvailable) ? { error: true, helperText: 'Name not available' } : {error: false}}
                        />
                        <TextField
                            sx={{ margin: '0.33em' }}
                            id="pubkey"
                            {...(pubkey && !pubkeyValid) ? { error: true, helperText: 'Invalid pubkey' } : {error: false}}
                            label="Public key (npub or hex)"
                            variant="outlined"
                            value={pubkey}
                            onChange={(event) => {
                                setPubkey(event.target.value);
                            }}
                        />
                            <Button
                                color="secondary"
                                disabled={!pubkey || !pubkeyValid || !name || !nameAvailable}
                                onClick={() => {
                                    if (pubkey && name) {
                                        createInvoice(pubkey, name)
                                            .then(data => {
                                                setInvoice(data.invoice);
                                                setInvoiceStatus(data.status);
                                                setDialogOpen(true);
                                                fallbackTimeout = setTimeout(handleInvoiceStatus, getBackoffTime());
                                            })
                                    }
                                }}
                            >
                                Submit
                            </Button>
                    </CardContent>
                </Card>
            </Box>
            <QrCodeDialog
                str={invoice && `lightning:${invoice}` || ''}
                dialogOpen={dialogOpen}
                close={() => setDialogOpen(false)}
                fee={1}
                status={invoiceStatus}
            />
        </React.Fragment>
    );
};