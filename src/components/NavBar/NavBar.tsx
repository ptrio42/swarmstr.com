import React, {useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {
    Create, Notifications as NotificationsIcon
} from '@mui/icons-material';
import './NavBar.css';
import {useNostrContext} from "../../providers/NostrContextProvider";
import {Config} from "../../resources/Config";
import {SearchBar} from "../SearchBar/SearchBar";
import {Badge} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Metadata } from '../Nostr/Metadata/Metadata';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {nip19} from 'nostr-tools';
import {LoadingAnimation} from "../LoadingAnimation/LoadingAnimation";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {NostrEvent} from "nostr-tools";
import {uniqBy} from "lodash";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import {Notifications} from "../Notifications/Notifications";

export const NavBar = () => {
    const { user, setLoginDialogOpen, setNewNoteDialogOpen, query, loading, ndk, setRelayListDialogOpen } = useNostrContext();
    const navigate = useNavigate();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(userMenuAnchorEl);

    const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotificationsAnchorEl(event.currentTarget);
        // update last time viewed
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    const notificationsOpen = Boolean(notificationsAnchorEl);

    const [userSearchString, setUserSearchString] = useState<string>('');

    const searchSuggestions = useLiveQuery(
        () => userSearchString.length > 2 ? db.users
            .filter(({content}: NostrEvent) => {
                try {
                    const metadata = JSON.parse(content);
                    // console.log('NavBar: metadata: ', {metadata}, {userSearchString})
                    return new RegExp(userSearchString, 'gmi')
                        .test(`${metadata.name}:${metadata.displayName}:${metadata.display_name}:${metadata.username}`)
                } catch (e) {
                    return false;
                }
            })
            // .distinct()
            // .limit(5)
            .toArray() : []
        , [userSearchString], []);

    const handleNewNoteButtonClick = () => {
        // if (user) {
            setNewNoteDialogOpen(true);
        // } else {
        //     setLoginDialogOpen(true);
        // }
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<any>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleRelaysDialogOpen = () => () => {
        handleUserMenuClose();
        setRelayListDialogOpen(true)
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                className="navbar"
                position="fixed"
            >
                <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: '640px', margin: 'auto', padding: 0, position: 'relative' }}>
                    {/*<Badge>*/}
                        <Link className="logo" to="/">
                            {/*<img width="64px" height="64px" alt={Config.APP_TITLE} src={Config.LOGO_IMG}/>*/}
                            {/*<Box sx={{ width: '64px', height: '64px', overflow: 'visible', display: 'flex' }}><LoadingAnimation isLoading={true}/></Box>*/}
                            {/*{*/}
                                <Box sx={{ width: '50px', height: '64px' }}><LoadingAnimation isLoading={loading}/></Box>
                            {/*}*/}
                        </Link>
                    {/*</Badge>*/}
                    <Box className="navbarMenu" sx={{ width: '100%', display: 'flex' }}>
                        <SearchBar
                            placeholder={`Search...`}
                            isQuerying={loading}
                            query={decodeURIComponent(query)}
                            onQueryChange={(event: any) => {
                                navigate(`/search/${encodeURIComponent(event.target.value?.replace('?', '%3F'))}`);
                            }}
                            onSilentQueryChange={({ target: {value} }) => {
                                setUserSearchString(decodeURIComponent(value))
                            }}
                            searchSuggestions={uniqBy(searchSuggestions, 'pubkey').map(({pubkey}) => pubkey)}
                        />
                    </Box>

                    <Box sx={{
                        width: '96px',
                        minWidth: '96px!important',
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '7px'
                    }}>
                        <Button
                            className="newNote-button"
                            sx={{
                                textTransform: 'math-auto',
                                fontWeight: '400',
                                fontSize: '16px',
                                borderRadius: '18px!important',
                                padding: '5px 8px',
                                width: 'auto'
                            }}
                            color="warning"
                            variant="contained"
                            onClick={handleNewNoteButtonClick}
                        >
                            <Create sx={{ paddingLeft: '2px'}} />
                        </Button>

                        <IconButton sx={{ width: '42px', border: '1px solid' }} onClick={handleNotificationsClick}>
                            <NotificationsIcon sx={{ fontSize: 27 }}/>
                        </IconButton>
                        <Popover
                            id={'user-notifications'}
                            open={notificationsOpen}
                            anchorEl={notificationsAnchorEl}
                            onClose={handleNotificationsClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            classes={{
                                paper: 'userNotifications_paper'
                            }}
                        >
                            { user && <Notifications pubkey={user.pubkey} /> }
                        </Popover>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: '7px'
                        }}
                    >
                        <Badge variant="dot" color={ndk.pool.stats().connected > 0 ? 'success' : 'error'}>
                            <Button sx={{ padding: 0, width: 'unset', minWidth: 'unset' }} variant="text" onClick={handleUserMenuOpen}>
                                {
                                    !user && <Avatar alt="Not logged in" src={`${process.env.BASE_URL}/images/nostr-logo.webp`} />
                                }
                                {
                                    user && <Metadata variant="avatar" pubkey={user.pubkey} />
                                }
                            </Button>
                        </Badge>

                    </Box>

                    <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchorEl}
                        open={open}
                        onClose={handleUserMenuClose}
                    >
                        { !user && <MenuItem onClick={() => { setLoginDialogOpen(true); handleUserMenuClose(); }}>Login</MenuItem> }
                        { user && <MenuItem onClick={() => { handleUserMenuClose(); navigate(`/p/${nip19.npubEncode(user.pubkey)}`) }}>Profile</MenuItem> }
                        <MenuItem>
                            <Badge onClick={handleRelaysDialogOpen} badgeContent={`${ndk.pool.stats().connected}/${ndk.pool.stats().total}`} color={ndk.pool.stats().connected > 0 ? 'success' : 'error'}>
                                Relays
                            </Badge>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
};