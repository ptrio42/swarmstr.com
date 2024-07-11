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
// import {QrCodeDialog} from "../Metadata/Metadata";
import {Helmet} from "react-helmet";
import './Nip05.css';
import {Config} from "../../../resources/Config";
import {QrCodeDialog} from "../../../dialog/QRCodeDialog";
import {useSearchParams} from "react-router-dom";

export const Nip05 = () => {
    const [pubkey, setPubkey] = useState<string>();
    const [pubkeyValid, setPubkeyValid] = useState<boolean>();
    const [name, setName] = useState<string>();
    const [nameAvailable, setNameAvailable] = useState<boolean>();
    const [nameAvailableMessage, setNameAvailableMessage] = useState<string>('');
    const [invoice, setInvoice] = useState();
    const [invoiceStatus, setInvoiceStatus] = useState<string|undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [searchParams, _] = useSearchParams();
    const [domain, setDomain] = useState<string>(searchParams.get('domain') || Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS[0].name);


    const { price } = Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS.find((entry: any) => domain === entry.name) || { price: 0 };

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
            checkName(name, domain).then(response => {
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
    }, [name, domain]);

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
                const { status } = await getInvoiceStatus(name!, domain);

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

    const domains = Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS.map((d: any) => d.name).join(',');

    const submit = () => {
        if (pubkey && name) {
            registerName(pubkey!, name!, domain)
                .then(data => {
                    if (data.invoice) {
                        setInvoice(data.invoice);
                        setInvoiceStatus(data.status);
                        setDialogOpen(true);
                        fallbackTimeout = setTimeout(handleInvoiceStatus, getBackoffTime());
                    } else {
                        setInvoiceStatus('completed');
                    }
                })
                .catch(() => {
                    setInvoiceStatus('failure');
                })
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Get { domains } Nostr Address</title>
                <meta property="description" content={`Get a Nostr address at @${domains}`} />
                <meta property="keywords" content="nostr, nip05, nostr handle, nostr address" />

                <meta property="og:url" content={`${process.env.BASE_URL}/nostr-address`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Get ${domains} Nostr Address`} />
                <meta property="og:description" content={`Get ${domains} Nostr Address`} />
                <meta property="og:image" content={`${Config.APP_IMAGE}`} />

                <meta itemProp="name" content={`Get ${domains} Nostr Address`} />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@swarmstr" />
                <meta name="twitter:title" content={`Get ${domains} Nostr Address`} />
                <meta name="twitter:description" content={`Get ${domains} Nostr Address`} />
                <meta name="twitter:image:src" content={`${Config.APP_IMAGE}`} />
                <meta itemProp="image" content={`${Config.APP_IMAGE}`} />

            </Helmet>
            <Box sx={{ flexDirection: 'column' }}>
                <Typography
                    component="div"
                    variant="h5"
                    sx={{ margin: '0.33em' }}
                >
                    Get { price === 0 && 'a free ' } yourname@{domain} Nostr Address
                </Typography>
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Human readable identifier for your public key (NIP-05).
                </Typography>
                <Typography component="div" sx={{ margin: '0.33em' }}>
                    Provide your Nostr pubkey and desired name.
                </Typography>
                {
                    price > 0 &&
                        <Typography component="div" sx={{ margin: '0.33em', fontWeight: 'bold' }}>
                            Fee: {price} sats
                        </Typography>
                }
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
                            Your handle: {name}@{domain}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TextField
                                sx={{ margin: '0.33em 0' }}
                                id="name"
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                                {...(name && name.length > 0 && !nameAvailable) ? { error: true, helperText: nameAvailableMessage } : {error: false}}
                            />
                            <Box>@</Box>
                            <TextField
                                select
                                sx={{ margin: '0.33em 0' }}
                                id="domain"
                                label="Domain"
                                variant="outlined"
                                defaultValue={domain}
                                SelectProps={{
                                    native: true,
                                }}
                                onChange={(event) => {
                                    setDomain(event.target.value);
                                }}
                            >
                                {
                                    Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS.map((domain: any) => <option key={domain.name} value={domain.name}>
                                        { domain.name }
                                    </option>)
                                }
                            </TextField>
                        </Box>
                        <Box>
                            <TextField
                                sx={{ margin: '0.33em 0' }}
                                id="pubkey"
                                {...(pubkey && !pubkeyValid) ? { error: true, helperText: 'Invalid pubkey' } : {error: false}}
                                label="Public key (npub or hex)"
                                variant="outlined"
                                value={pubkey}
                                onChange={(event) => {
                                    setPubkey(event.target.value);
                                }}
                            />
                        </Box>
                    </CardContent>
                    <Button
                        sx={{ width:'50%', alignSelf: 'center', marginBottom: '1em' }}
                        variant="contained"
                        color="secondary"
                        disabled={!pubkey || !pubkeyValid || !name || !nameAvailable || (invoiceStatus && invoiceStatus! === 'completed') || false}
                        onClick={submit}
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
            <QrCodeDialog
                str={invoice && `lightning:${invoice}` || ''}
                dialogOpen={dialogOpen}
                close={() => setDialogOpen(false)}
                fee={price}
                status={invoiceStatus}
                lnbc={invoice}
            />
        </React.Fragment>
    );
};