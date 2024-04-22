import React, {useEffect, useMemo, useState} from "react";
import {Bolt, CopyAll, ElectricBolt, Launch, QrCodeScanner} from "@mui/icons-material";
import {ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from '@mui/icons-material/Close';
import {nip19} from 'nostr-tools';
import CircularProgress from "@mui/material/CircularProgress";
import {NDKFilter, } from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

export interface Metadata {
    nip05: string;
    lud06: string;
    lud16: string;
    about: string;
    picture: string;
    pubkey: string;
    name: string;
    displayName: string;
    banner: string;
}

interface MetadataProps {
    handleCopyNpub?: (value: string) => any;
    variant?: 'full' | 'simplified' | 'link' | 'avatar';
    pubkey: string;
}

export const Metadata = ({ pubkey, handleCopyNpub, variant = 'full' }: MetadataProps) => {
    if (!pubkey) {
        return <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />
    }

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [metadata, setMetadata] = useState<Metadata | undefined>(undefined);

    const { subscribe, connected } = useNostrNoteContext();

    const filter: NDKFilter = { kinds: [0], authors: [pubkey] };

    const [event, loaded] = useLiveQuery(async () => {
        const event = await db.users
            .where({pubkey})
            .first();
        return [event, true];
    }, [pubkey, connected], [undefined, false]);

    const npub = pubkey && nip19.npubEncode(pubkey);

    useEffect(() => {
        console.log('Metadata: ', {loaded, connected, event})
        if (loaded && connected && !event) {
            console.log('Metadata: starting subscription: ', {filter})
            subscribe(filter, { closeOnEose: true, groupable: true, groupableDelay: 1500 });
        }
    }, [pubkey, loaded, connected]);

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
        return metadata ? (metadata.name || metadata.displayName || metadata.nip05) : (npub && npub.slice(5, 13) + ':' + npub.slice(npub.length - 8));
    };

    const avatar = useMemo(() => {
        switch (variant) {
            case 'avatar': {
                return <Tooltip title={getProfileDisplayedName()}>
                    <Avatar imgProps={{ height: '42' }} sx={{ width: '42px', height: '42px' }} alt="" src={metadata?.picture} />
                </Tooltip>
            }
            case 'full': {
                return <Avatar
                    imgProps={{ height: '64' }}
                    sx={{
                        width: '64px',
                        height: '64px',
                        border: '3px #000 solid',
                        position: 'absolute',
                        top: '-32px',
                        left: '10px'
                    }}
                    alt=""
                    src={metadata && metadata.picture}
                />
            }
            default: {
                return <Avatar imgProps={{ height: '21' }} sx={{ width: '21px', height: '21px' }} alt="" src={metadata && metadata.picture} />

            }
        }
    }, [variant, metadata]);

    return (
        <React.Fragment>
            {
                pubkey && <React.Fragment>
                    {
                        variant === 'full' && <Box sx={{ minHeight: '121px', width: '100%', background: `url(${metadata?.banner})`, backgroundSize: '100%!important' }}>

                        </Box>
                    }
                    <Typography
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            position: 'relative',
                            width: '100%',
                            ...(variant === 'link' && {
                                    transform: 'translateY(4px)',
                                    fontWeight: '400!important',
                                    width: 'auto!important'
                            })
                        }}
                        component="div"
                    >
                        <ListItemAvatar sx={{minWidth: '0', marginRight: '2px'}}>
                            { avatar }
                        </ListItemAvatar>
                        {
                            variant !== 'avatar' && <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                ...(variant === 'full' && {
                                                    textAlign: 'left',
                                                    textIndent: '84px'
                                                }),
                                                ...(variant === 'link' && {
                                                    textAlign: 'left'
                                                })
                                            }}
                                        >

                                            <a target="_blank" href={`${process.env.BASE_URL}/p/${npub}`}>
                                                {getProfileDisplayedName()}
                                            </a>
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
                        }
                    </Typography>
                    {
                        metadata && (metadata.lud06 || metadata.lud16) && <IconButton>
                            <ElectricBolt sx={{ fontSize: 18 }} />
                        </IconButton>
                    }
                </React.Fragment>
            }
            {/*<QrCodeDialog str={`nostr:${npub}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />*/}
        </React.Fragment>
    );
};