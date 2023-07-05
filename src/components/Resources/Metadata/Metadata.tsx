import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {nip19} from 'nostr-tools';
import {useSubscribe} from "nostr-hooks";
import {Config} from "nostr-hooks/dist/types";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import CircularProgress from "@mui/material/CircularProgress";
import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";

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
    displayName: string;
}

interface MetadataProps {
    picture?: string;
    lud06?: string;
    lud16?: string;
    // npub?: string;
    nip05?: string;
    name?: string;
    supposedName?: string;
    about?: string;
    handleCopyNpub?: (value: string) => any;
    variant?: 'full' | 'simplified' | 'link';
    data?: {
        event?: any
    };
    isSkeleton?: boolean;
    pubkey: string;
}

export const Metadata = ({ pubkey, handleCopyNpub, supposedName, variant = 'full', data = {}, isSkeleton }: MetadataProps) => {
    if (!pubkey) {
        return <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />
    }

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [metadata, setMetadata] = useState<Metadata | undefined>(undefined);

    const { subscribe } = useNostrNoteContext();

    const filter: NDKFilter = { kinds: [0], authors: [pubkey] };

    // const event = events.find((e: NostrEvent) => e.pubkey === pubkey && e.kind === 0);
    const event = useLiveQuery(async () =>
        await db.events
            .where('kind').equals(0)
            .and((nostrEvent: NostrEvent) => nostrEvent.pubkey === pubkey)
            .first()
    );

    const npub = pubkey && nip19.npubEncode(pubkey);

    useEffect(() => {
        subscribe(filter);
    }, [pubkey]);

    // useEffect(() => () => {
    // }, []);

    useEffect(() => {
        if (event && event.content) {
            try {
                const content = JSON.parse(event.content);
                setMetadata(content);
            } catch (error) {
                console.error('error parsing metadata content', {error})
            }
        }
    }, [event]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const getProfileDisplayedName = () => {
        return metadata ? (metadata.nip05 || metadata.name || metadata.displayName) : (npub && npub.slice(5, 13) + ':' + npub.slice(npub.length - 8));
    };

    return (
        <React.Fragment>
            {
                pubkey && <Typography sx={{ display: 'inline-flex', alignItems: 'center' }} component="div">
                    <ListItemAvatar sx={{minWidth: '0', marginRight: '2px'}}>
                        <Avatar imgProps={{ height: '21' }} sx={{ width: '21px', height: '21px' }} alt="" src={metadata && metadata.picture} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>

                                    <a target="_blank" href={'https://snort.social/p/' + nip19.npubEncode(pubkey)}>
                                        {getProfileDisplayedName()}
                                    </a>

                                    {/*{*/}
                                    {/*variant !== 'link' &&*/}
                                    {/*metadata && (metadata.lud06 || metadata.lud16) &&*/}
                                    {/*<React.Fragment>*/}
                                    {/*<a href={'lightning:' + metadata.lud06 || metadata.lud16}>*/}
                                    {/*<IconButton>*/}
                                    {/*<Bolt sx={{ fontSize: 18 }} color="secondary"/>*/}
                                    {/*</IconButton>*/}
                                    {/*</a>*/}
                                    {/*</React.Fragment>*/}
                                    {/*}*/}
                                    {
                                        variant !== 'link' &&
                                        <React.Fragment>
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
                                                <MenuItem onClick={(e) => {
                                                    const pubkey = npub || event && nip19.npubEncode(event.pubkey);
                                                    navigator.clipboard.writeText(pubkey || '');
                                                    handleCopyNpub && handleCopyNpub(pubkey || '');
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
                                        </React.Fragment>
                                    }
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
            // <QrCodeDialog str={`nostr:${npub}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />
            }
        </React.Fragment>
    );
};