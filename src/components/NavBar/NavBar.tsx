import React, {useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {
    Create
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
import {NostrEvent} from "@nostr-dev-kit/ndk";
import {uniqBy} from "lodash";

export const NavBar = () => {
    const { user, setLoginDialogOpen, setNewNoteDialogOpen, query, loading, ndk, setRelayListDialogOpen } = useNostrContext();
    const navigate = useNavigate();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(userMenuAnchorEl);

    const [userSearchString, setUserSearchString] = useState<string>('');

    const searchSuggestions = useLiveQuery(
        () => userSearchString.length > 2 ? db.users
            .filter(({content}: NostrEvent) => {
                try {
                    const metadata = JSON.parse(content);
                    // console.log('NavBar: metadata: ', {metadata}, {userSearchString})
                    return new RegExp(userSearchString, 'gi')
                        .test(`${metadata.name}:${metadata.displayName}:${metadata.display_name}:${metadata.username}`)
                } catch (e) {
                    return false;
                }
            })
            .distinct()
            .limit(5)
            .toArray() : []
        , [userSearchString], []);

    const handleNewNoteButtonClick = () => {
        if (user) {
            setNewNoteDialogOpen(true);
        } else {
            setLoginDialogOpen(true);
        }
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<any>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                className="navbar"
                position="static"
            >
                <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: '640px', margin: 'auto', padding: 0, position: 'relative' }}>
                    {/*<Badge>*/}
                        <Link className="logo" to="/">
                            {/*<img width="64px" height="64px" alt={Config.APP_TITLE} src={Config.LOGO_IMG}/>*/}
                            {/*<Box sx={{ width: '64px', height: '64px', overflow: 'visible', display: 'flex' }}><LoadingAnimation isLoading={true}/></Box>*/}
                            {/*{*/}
                                <Box sx={{ width: '64px', height: '64px' }}><LoadingAnimation isLoading={loading}/></Box>
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
                            searchSuggestions={uniqBy(searchSuggestions.map(({pubkey}) => pubkey), 'pubkey')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '7px' }}>
                        <Badge badgeContent={`${ndk.pool.stats().connected}/${ndk.pool.stats().total}`} color={ndk.pool.stats().connected > 0 ? 'success' : 'error'}>
                            <Button variant="text" onClick={handleUserMenuOpen}>
                                {
                                    !user && <Avatar alt="Not logged in" src={`${process.env.BASE_URL}/images/nostr-logo.webp`} />
                                }
                                {
                                    user && <Metadata variant="avatar" pubkey={user.pubkey} />
                                }
                            </Button>
                        </Badge>

                    </Box>

                    <Box sx={{
                        width: '64px',
                        minWidth: '64px!important',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '7px'
                    }}>
                        <Button
                            className="newNote-button"
                            sx={{
                                textTransform: 'math-auto',
                                fontWeight: '400',
                                fontSize: '16px',
                                borderRadius: '18px!important',
                                padding: '5px 8px', width: 'auto'
                            }}
                            color="warning"
                            variant="contained"
                            onClick={handleNewNoteButtonClick}
                        >
                            <Create sx={{ paddingLeft: '2px'}} />
                        </Button>
                    </Box>

                    <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchorEl}
                        open={open}
                        onClose={handleUserMenuClose}
                    >
                        { !user && <MenuItem onClick={() => { setLoginDialogOpen(true); handleUserMenuClose(); }}>Login</MenuItem> }
                        { user && <MenuItem onClick={() => { handleUserMenuClose(); navigate(`/p/${nip19.npubEncode(user.pubkey)}`) }}>Profile</MenuItem> }
                        <MenuItem onClick={() => { handleUserMenuClose(); setRelayListDialogOpen(true) }}>Relays</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
};