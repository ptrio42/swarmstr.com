import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Bolt, CopyAll, ElectricBolt, Launch, QrCodeScanner} from "@mui/icons-material";
import {ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {nip19, NostrEvent} from 'nostr-tools';
import CircularProgress from "@mui/material/CircularProgress";
import {NDKFilter, } from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Link} from "react-router-dom";
import Badge from "@mui/material/Badge";
import {useManageSubs, useWindowDimensions} from "../../../utils/utils";
import {subscribe} from "../../../services/nostr/relays";
import Button from "@mui/material/Button";
import {sortBy} from "lodash";

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
    badge?: any;
    relayUrls?: string[];
}

export const Metadata = ({ pubkey, handleCopyNpub, variant = 'full', badge, relayUrls }: MetadataProps) => {
    if (!pubkey) {
        return <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />
    }

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [metadata, setMetadata] = useState<Metadata | undefined>(undefined);

    const { ndk, connected } = useNostrContext();

    const manageSubs = useManageSubs({ndk, subscribe});

    const filter: NDKFilter = { kinds: [0], authors: [pubkey] };

    const dims = useWindowDimensions();
    const [bannerSize, setBannerSize] = useState<string>('100% 100%');

    // const [event, loaded] = useLiveQuery(async () => {
    //     const event = await db.users
    //         .where({pubkey})
    //         .first();
    //     return [event, true];
    // }, [pubkey, connected], [undefined, false]);

    const [event, setEvent] = useState<NostrEvent>();

    const npub = pubkey && nip19.npubEncode(pubkey);

    useEffect(() => {
        console.log('Metadata: ', {connected, event})
        if (connected && !event) {
            console.log('Metadata: starting subscription: ', {filter})

            manageSubs
                .addSubAndReturnAsPromise(filter, relayUrls)
                .then((events: NostrEvent[]) => {
                    setEvent(sortBy(events, 'created_at', 'desc')[0])
                });

            // manageSubs
            //     .addSub(
            //         filter,
            //         { closeOnEose: true, groupable: true, groupableDelay: 300 },
            //         undefined,
            //         undefined,
            //         relayUrls
            //     );
        }
    }, [pubkey, connected]);

    useEffect(() => {
        if (event && event.content) {
            try {
                const content = JSON.parse(event.content);
                console.log('event 0 metadata: ', {content})
                if (!content.banner) content.banner = `${process.env.BASE_URL}/images/background.jpg`;
                setMetadata(content);
            } catch (error) {
                console.error('error parsing metadata content', {error})
            }
        }
    }, [event]);

    useEffect(() => {
        const banner = metadata?.banner;
        if (banner) getImageDimensions(banner);
    }, [metadata]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const getProfileDisplayedName = () => {
        return metadata ? (metadata.name || metadata.displayName || metadata.nip05) : (npub && npub.slice(5, 13) + ':' + npub.slice(npub.length - 8));
    };

    const bannerDims = useCallback(() => {
        return bannerSize.split(' ').map((d: string) => +d.replace('px', ''))
    }, [bannerSize]);

    const calculateDimsForHeight = useCallback((height: number, offSet: number, _dims?: number[]) => {
        let [w, h] = _dims || bannerDims();
        if ((h + offSet) > dims.height) {
            w = w * (dims.height - offSet) / h;
            h = dims.height - offSet;

        }
        return {w, h};
    }, [dims]);

    const getImageDimensions = useCallback((imageUrl: string, offSet: number = 222) => {

        let img = new Image();

        img.src = imageUrl;
        img.onload = ({currentTarget}) => {
            let {width, height} = currentTarget as HTMLImageElement;
            console.log('height: '+height);
            console.log('width: '+width);
            const _dims = { w: dims.width, h: dims.width * height/width};
            // leave 222px for user info
            const {w, h} = calculateDimsForHeight(dims.height, offSet, Object.values(_dims));
            setBannerSize(`${w}px ${h}px`);
        }
    }, [dims]);

    const handleScroll = (event: any) => {
        const {offsetHeight} = event.srcElement.body;
        console.log('metadata: scroll: ', {offsetHeight}, {event});
        if (offsetHeight > dims.height) {
            const {w, h} = calculateDimsForHeight(dims.height, 0);
            console.log('metadata: newbannersize', {w, h});
            setBannerSize(`${w}px ${h}px`);
        }
    };

    // useEffect(() => {
    //     document.addEventListener('scroll', handleScroll);
    //     return () => {
    //         document.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    const avatar = useMemo(() => {
        switch (variant) {
            case 'avatar': {
                return <Tooltip  title={getProfileDisplayedName()}>
                    <Link to={`/p/${npub}`}>
                        <Avatar imgProps={{ height: '42' }} sx={{ width: '42px', height: '42px' }} alt="" src={metadata?.picture} />
                    </Link>
                </Tooltip>
            }
            case 'full': {
                return <Avatar
                    imgProps={{ height: '64' }}
                    sx={{
                        width: '64px',
                        height: '64px',
                        boxShadow: '1px 1px 5px #000',
                        // position: 'absolute',
                        // top: '-32px',
                        // left: '10px'
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

    const getBlurWidth = () => {
        return `${(dims.width - (+bannerSize.split(' ')[0].replace('px', ''))) /2}px`
    };

    return (
        <React.Fragment>
            {
                pubkey && <React.Fragment>
                    {
                        variant === 'full' &&
                        <Box>
                            <Box
                                sx={{
                                    minHeight: '121px',
                                    width: '100%',
                                    height: bannerSize.split(' ')[1],
                                    background: `url(${metadata?.banner})`,
                                    backgroundSize: bannerSize,
                                    position: 'fixed',
                                    top: '69px',
                                    left: 0,
                                    backgroundPosition: '50%'
                                }}>

                            </Box>
                            <Box sx={{ width: getBlurWidth(), position: 'absolute', height: '100%', backdropFilter: 'blur(6px)', top: 0, left: 0 }}></Box>
                            <Box sx={{ width: getBlurWidth(), position: 'absolute', height: '100%', backdropFilter: 'blur(6px)', top: 0, right: 0 }}></Box>
                        </Box>
                    }
                    <Typography
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            ...(variant === 'full' && { marginBottom: '1em', marginTop: `${+bannerSize.split(' ')[1].replace('px', '') + 77}px` }),
                            ...(variant !== 'avatar' && { width: '100%', }),
                            ...(variant === 'link' && {
                                    transform: 'translateY(5px)',
                                    fontWeight: '400!important',
                                    width: 'auto!important',
                                    display: 'inline-flex'
                            })
                        }}
                        component="div"
                    >
                        <Badge badgeContent={badge} anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                            <ListItemAvatar {...(variant === 'avatar' && { component: Link, to: `/p/${npub}` })} sx={{minWidth: '0', marginRight: '2px'}}>
                                { avatar }
                            </ListItemAvatar>
                        </Badge>
                        {
                            variant !== 'avatar' && <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                ...(variant === 'link' && {
                                                    textAlign: 'left'
                                                })
                                            }}
                                        >

                                            <Typography component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box
                                                    sx={{
                                                        ...(variant === 'full' && { fontSize: '37px', color: '#fff', textShadow: '1px 1px #000000' })
                                                    }}
                                                    {
                                                        ...(variant !== 'full' && { variant: 'text', component: Link, to: `/p/${npub}`})
                                                    }>
                                                    {getProfileDisplayedName()}
                                                </Box>
                                            </Typography>
                                            {
                                                variant !== 'link' &&
                                                <React.Fragment>
                                                    {
                                                        metadata && (metadata.lud06 || metadata.lud16) && <IconButton component={Link} to={`lightning:${metadata.lud06 || metadata.lud16}`}>
                                                            <ElectricBolt sx={{ fontSize: variant === 'full' ? 36: 18 }} />
                                                        </IconButton>
                                                    }
                                                    <IconButton
                                                        aria-controls={menuOpen ? 'account-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={menuOpen ? 'true' : undefined}
                                                        onClick={handleMenuOpen}
                                                    >
                                                        <CopyAll sx={{ fontSize: variant === 'full' ? 36: 18 }} />
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
                                                sx={{ display: 'inline', paddingLeft: '3px', background: '#fff' }}
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
                </React.Fragment>
            }
            {/*<QrCodeDialog str={`nostr:${npub}` || ''} dialogOpen={dialogOpen} close={() => setDialogOpen(false)} />*/}
        </React.Fragment>
    );
};