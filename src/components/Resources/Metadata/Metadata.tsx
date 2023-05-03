import React, {useEffect, useState} from "react";
import {Bolt, CopyAll, Launch, QrCodeScanner} from "@mui/icons-material";
import {ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {CardType, SocialCard} from "../../Card/Card";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from "@mui/material/CircularProgress";
import {Event as NostrEvent, Filter, Mux, Relay, SubscriptionOptions} from "nostr-mux";
import {DEFAULT_RELAYS} from "../NostrResources/NostrResources";
import {getSubscriptionOptions} from "../../../services/nostr";
import {nip19} from 'nostr-tools';

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
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        {
            fee && <Typography sx={{ textAlign: 'center' }}>
                Pay {fee} sats
            </Typography>
        }
        <Typography sx={{ padding: '1em' }}>
            <SocialCard
                slogan=""
                sloganColor=""
                sloganFontSize={18}
                sloganTextShadow={false}
                sloganTextShadowColor=""
                mainImage=""
                backgroundImageSize={100}
                type={CardType.Sticker}
                footerColor=""
                footerFontSize={14}
                cardWidth={2.5}
                cardHeight={3.25}
                backgroundPositionX={0}
                backgroundPositionY={0}
                primaryImageFormatWidth={0}
                primaryImageFormatHeight={0}
                secondaryImageFormatWidth={2.5}
                secondaryImageFormatHeight={2.5}
                qrCodeSize={240}
                lnurl={str}
                {...(lnbc && { footer: lnbc }) }
                disableClick={true}
                qrCodeOnly={true}
            />
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

export interface Metadata {
    nip05: string;
    lud06: string;
    lud16: string;
    about: string;
    picture: string;
    pubkey: string;
    name: string;
}

interface MetadataProps {
    picture?: string;
    lud06?: string;
    lud16?: string;
    npub?: string;
    nip05?: string;
    name?: string;
    supposedName?: string;
    about?: string;
    handleCopyNpub?: (value: string) => any;
    variant?: 'full' | 'simplified';
}

const mux = new Mux();

export const Metadata = ({ npub, handleCopyNpub, supposedName, variant = 'full' }: MetadataProps) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [events, setEvents] = useState<NostrEvent[]>([]);
    const [metadata, setMetadata] = useState<Metadata | undefined>();

    useEffect(() => {
        if (!npub) {
            return;
        }
        const hex = nip19.decode(npub);
        if (!hex.data)
        {
            return;
        }
        // Subscription filters
        const filters = [
            // metadata
            {
                kinds: [0],
                authors: [hex.data]
            }
        ] as Filter[];

        console.log(`Opening metadata subscription...`);

        // if this was a new mux instance, add relays
        if (mux.allRelays.length < DEFAULT_RELAYS.length) {
            DEFAULT_RELAYS.forEach((url: string) => {
                mux.addRelay(new Relay(url));
            });
        }

        // Get subscription options
        const options: SubscriptionOptions = getSubscriptionOptions(
            mux,
            filters,
            (event: any) => {
                console.log('received an event');
                setEvents((state) => ([
                    ...state
                        .filter((e: NostrEvent) => e.id !== event.id),
                    { ...event }
                ]));
            },
            (subId: string) => {
                console.log(`Closing ${subId} subscription...`);
            },
            true
        );

        // Subscribe
        mux
            .waitRelayBecomesHealthy(1, 5000)
            .then((ok: any) => {
                if (!ok) {
                    console.error('no healthy relays');
                    return;
                }
                mux.subscribe(options);
            });

    }, []);

    useEffect(() => () => {
        DEFAULT_RELAYS.forEach(relay => {
            mux.removeRelay(relay);
        });
    }, []);

    useEffect(() => {
        try {
            const event = events && events.length > 0 && events[0];
            if (event) {
                const content = JSON.parse(event.content);
                setMetadata(content);
            }
        } catch (e) {

        }
    }, [events]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const getProfileDisplayedName = () => {
        return metadata ? (metadata.nip05 || metadata.name) : supposedName || (npub && npub.slice(4, 12) + ':' + npub.slice(npub.length - 8));
    };

    return (
        <React.Fragment>
            <Typography sx={{ display: 'flex' }} component="div">
                <ListItemAvatar>
                    <Avatar alt="" src={metadata && metadata.picture} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {getProfileDisplayedName()}
                                {
                                    metadata && (metadata.lud06 || metadata.lud16) &&
                                    <React.Fragment>
                                        <a href={'lightning:' + metadata.lud06 || metadata.lud16}>
                                            <IconButton>
                                                <Bolt sx={{ fontSize: 18 }} color="secondary"/>
                                            </IconButton>
                                        </a>
                                    </React.Fragment>
                                }
                                <IconButton
                                    aria-controls={menuOpen ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={handleMenuOpen}
                                >
                                    <CopyAll sx={{ fontSize: 18 }} />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    id="account-menu"
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                >
                                    <MenuItem onClick={(event) => {
                                        navigator.clipboard.writeText(npub || '');
                                        handleCopyNpub && handleCopyNpub(npub || '');
                                    }}>
                                        <CopyAll sx={{ fontSize: 18, marginRight: 1 }} /> Copy npub
                                    </MenuItem>
                                    <MenuItem onClick={() => { setDialogOpen(true) }}>
                                        <QrCodeScanner sx={{ fontSize: 18, marginRight: 1 }} /> Show QR
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = 'nostr:' + npub;
                                        a.click();
                                    }}>
                                        <Launch sx={{ fontSize: 18, marginRight: 1 }}/> Open in client
                                    </MenuItem>
                                </Menu>
                            </Typography>
                        </React.Fragment>
                    }
                    { ...(variant === 'full' && {'secondary':
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    { metadata && metadata.about }
                                </Typography>
                            </React.Fragment>
                    }) }
                />
            </Typography>
            <QrCodeDialog str={`nostr:${npub}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
        </React.Fragment>
    );
};