import React, {useEffect} from "react";
import {useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { nip19 } from 'nostr-tools';
import {checkName, createInvoice, getInvoiceStatus, registerName} from '../../../services/invoices';
import Button from "@mui/material/Button";
import {QrCodeDialog} from "../Metadata/Metadata";
import {Helmet} from "react-helmet";
import './Nip05.css';

export const Nip05 = () => {
    const [pubkey, setPubkey] = useState<string>();
    const [pubkeyValid, setPubkeyValid] = useState<boolean>();
    const [name, setName] = useState<string>();
    const [nameAvailable, setNameAvailable] = useState<boolean>();
    const [nameAvailableMessage, setNameAvailableMessage] = useState<string>('');
    const [invoice, setInvoice] = useState();
    const [invoiceStatus, setInvoiceStatus] = useState<string|undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    let fallbackTimeout: any;

    useEffect(() => {
        checkPubkey();
        if (invoice) {
            setInvoice(undefined);
            setInvoiceStatus(undefined);
        }
    }, [pubkey]);

    useEffect(() => {
        if (name && new RegExp(/(^[a-zA-Z0-9_.]+$)/).test(name) === false) {
            setNameAvailable(false);
            setNameAvailableMessage('Name not available (used characters not allowed).');
            return;
        }
        if (name) {
            checkName(name).then(response => {
                setNameAvailable(response.nameAvailable);
                if (!response.nameAvailable) {
                    setNameAvailableMessage('Name already registered.')
                }
            });
        }
        if (invoice) {
            setInvoice(undefined);
            setInvoiceStatus(undefined);
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
                <title>Get free Swarmstr.com Nostr Address</title>
                <meta property="description" content="Get a Nostr address at @swarmstr.com" />
                <meta property="keywords" content="nostr, nip05, nostr handle, nostr address" />

                <meta property="og:url" content="https://swarmstr.com/nostr-address" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Get free Swarmstr.com Nostr Address" />
                <meta property="og:description" content="Get a Nostr address at @swarmstr.com" />

                <meta itemProp="name" content="Get free Swarmstr.com Nostr Address" />

                <meta name="twitter:title" content="Get free Swarmstr.com Nostr Address" />
                <meta name="twitter:description" content="Get a Nostr address at @swarmstr.com" />

            </Helmet>
            <Box sx={{ flexDirection: 'column' }}>
                <Typography
                    component="div"
                    variant="h5"
                    sx={{ margin: '0.33em' }}
                >
                    Get a free yourname@swarmstr.com Nostr Address
                </Typography>
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Human readable identifier for your public key (NIP-05).
                </Typography>
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Provide your Nostr pubkey and desired name.
                </Typography>
                {/*<Typography component="div" sx={{ margin: '0.33em' }}>*/}
                    {/*Fee: 420 sats*/}
                {/*</Typography>*/}
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Allowed characters: a-zA-Z0-9_. case insensitive
                </Typography>
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Having issues? Reach out on Nostr or Telegram @pitiunited
                </Typography>
                <Card className="form-container">
                    <CardContent>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Your handle: {name}@swarmstr.com
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
                            {...(name && name.length > 0 && !nameAvailable) ? { error: true, helperText: nameAvailableMessage } : {error: false}}
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
                    </CardContent>
                    <Button
                        sx={{ width:'50%', alignSelf: 'center', marginBottom: '1em' }}
                        variant="contained"
                        color="secondary"
                        disabled={!pubkey || !pubkeyValid || !name || !nameAvailable || (invoiceStatus && invoiceStatus! === 'completed') || false}
                        onClick={() => {
                            if (pubkey && name) {
                                registerName(pubkey!, name!)
                                    .then(data => {
                                        // setInvoice(data.invoice);
                                        setInvoiceStatus('completed');
                                        // setDialogOpen(true);
                                        // fallbackTimeout = setTimeout(handleInvoiceStatus, getBackoffTime());
                                    })
                                    .catch(() => {
                                        setInvoiceStatus('failure');
                                    })
                            }
                        }}
                    >
                        Submit
                    </Button>
                </Card>
                {
                    invoiceStatus && invoiceStatus! === 'completed' && <Typography sx={{ marginTop: '0.33em' }} variant="h5">
                        Your handle is now all set and ready to be used 💜
                    </Typography>
                }
                {
                    invoiceStatus && invoiceStatus! === 'failure' && <Typography sx={{ marginTop: '0.33em' }} variant="h5">
                        Something went wrong... Please try again.
                    </Typography>
                }
            </Box>
            {/*<QrCodeDialog*/}
                {/*str={invoice && `lightning:${invoice}` || ''}*/}
                {/*dialogOpen={dialogOpen}*/}
                {/*close={() => setDialogOpen(false)}*/}
                {/*fee={420}*/}
                {/*status={invoiceStatus}*/}
                {/*lnbc={invoice}*/}
            {/*/>*/}
        </React.Fragment>
    );
};