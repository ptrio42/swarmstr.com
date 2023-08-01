import React, {useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Receipt from '@mui/icons-material/Receipt';
import Media from 'react-media';
import {
    Build,
    CurrencyBitcoin,
    Dns,
    ElectricBolt,
    Menu as MenuIcon,
    Payments,
    Link as LinkIcon,
    School,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import './NavBar.css';
import {useNostrContext} from "../../providers/NostrContextProvider";
import {Metadata} from "../Nostr/Metadata/Metadata";
import {LoginDialog} from "../../dialog/LoginDialog";

export const NavBar = () => {
    const [state, setState] = React.useState(false);
    const [toolsMenuAnchorEl, setToolsMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const toolsMenuOpen = Boolean(toolsMenuAnchorEl);

    const { user, loginDialogOpen, setLoginDialogOpen } = useNostrContext();

    const handleToolsMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setToolsMenuAnchorEl(event.currentTarget);
    };

    const handleToolsMenuClose = () => {
        setToolsMenuAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setState(open);
    };

    const list = () => (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {/*<ListItem disablePadding component={Link} to="/card-generator"  sx={{ color: '#000' }}>*/}
                    {/*<ListItemButton>*/}
                        {/*<ListItemIcon>*/}
                            {/*<CurrencyBitcoin />*/}
                        {/*</ListItemIcon>*/}
                        {/*<ListItemText sx={{ textTransform: 'uppercase' }} primary="Bitcoin Artwork" />*/}
                    {/*</ListItemButton>*/}
                {/*</ListItem>*/}
                <ListItem disablePadding component={Link} to="/#converter" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <SwapVerticalCircleIcon />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Satoshi Calculator" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/resources/bitcoin" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Receipt />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Bitcoin Resources" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/resources/nostr" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Box className="nostr-icon" sx={{ width: '20px', height: '20px' }}>
                                <img src={`${process.env.BASE_URL}/images/nostr-icon.png`} height={30}/>
                            </Box>
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Nostr" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component="a" href="https://nostr.uselessshit.co" target="_blank" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Dns />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Relay" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/nostr/nip-05" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <LinkIcon />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Nip-05" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/nostr/zaps" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ElectricBolt />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Zaps" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                className="navbar"
                position="static"
            >
                <Toolbar>
                    <Link className="logo" to="/">
                        <img width="56px" alt="Swarmstr: Your knowledge hub for curious minds" src={`${process.env.BASE_URL}/images/swarmstr.png`}/>
                    </Link>
                    <Grid
                        container
                        justifyContent="flex-end"
                        className="navbar-actions">
                        {
                            !user && <Button
                                sx={{ fontWeight: 'bold' }}
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    console.log(`login request`);
                                    setLoginDialogOpen(true);
                                }}
                            >
                                Login
                            </Button>
                        }
                        {
                            user && <Metadata
                                variant={'avatar'}
                                pubkey={user.hexpubkey()}
                            />
                        }
                        {/*<Media query={{ maxWidth: '1060px' }} render={() => (*/}
                            {/*<React.Fragment>*/}
                                {/*<IconButton onClick={toggleDrawer(true)}><MenuIcon /></IconButton>*/}
                                {/*<Drawer*/}
                                    {/*anchor="right"*/}
                                    {/*open={state}*/}
                                    {/*onClose={toggleDrawer(false)}*/}
                                {/*>*/}
                                    {/*{list()}*/}
                                {/*</Drawer>*/}
                            {/*</React.Fragment>*/}
                        {/*)} />*/}
                        {/*<Media query={{ minWidth: '1061px' }} render={() => (*/}
                            {/*<React.Fragment>*/}
                                {/*/!*<Button*!/*/}
                                    {/*/!*sx={{ fontWeight: 'bold' }}*!/*/}
                                    {/*/!*variant="text"*!/*/}
                                    {/*/!*color="inherit"*!/*/}
                                    {/*/!*component={Link}*!/*/}
                                    {/*/!*to="/card-generator"*!/*/}
                                    {/*/!*startIcon={<CurrencyBitcoin color="warning" />}*!/*/}
                                {/*/!*>*!/*/}
                                    {/*/!*BITCOIN ARTWORK*!/*/}
                                {/*/!*</Button>*!/*/}
                                {/*<Button*/}
                                    {/*sx={{ fontWeight: 'bold' }}*/}
                                    {/*variant="text"*/}
                                    {/*color="inherit"*/}
                                    {/*component={Link}*/}
                                    {/*to="/#converter"*/}
                                    {/*startIcon={<SwapVerticalCircleIcon color="success" />}*/}
                                {/*>*/}
                                    {/*SATOSHI CALCULATOR*/}
                                {/*</Button>*/}
                                {/*<Button*/}
                                    {/*sx={{ fontWeight: 'bold' }}*/}
                                    {/*variant="text"*/}
                                    {/*color="inherit"*/}
                                    {/*component={Link}*/}
                                    {/*to="/resources/bitcoin"*/}
                                    {/*startIcon={<School />}*/}
                                {/*>*/}
                                    {/*BITCOIN RESOURCES*/}
                                {/*</Button>*/}
                                {/*<Button*/}
                                    {/*sx={{ fontWeight: 'bold' }}*/}
                                    {/*variant="text"*/}
                                    {/*color="inherit"*/}
                                    {/*component={Link}*/}
                                    {/*to="/resources/nostr"*/}
                                    {/*startIcon={<Box className="nostr-icon" sx={{ width: '20px', height: '20px' }}>*/}
                                        {/*<img src={`${process.env.BASE_URL}/images/nostr-icon.png`} height={30}/>*/}
                                    {/*</Box>}*/}
                                {/*>*/}
                                    {/*NOSTR*/}
                                {/*</Button>*/}
                                {/*/!*<Button*!/*/}
                                    {/*/!*sx={{ fontWeight: 'bold' }}*!/*/}
                                    {/*/!*variant="text"*!/*/}
                                    {/*/!*color="inherit"*!/*/}
                                    {/*/!*component="a"*!/*/}
                                    {/*/!*href="https://nostr.uselessshit.co"*!/*/}
                                    {/*/!*target="_blank"*!/*/}
                                    {/*/!*startIcon={<Dns />}*!/*/}
                                {/*/!*>*!/*/}
                                    {/*/!*RELAY*!/*/}
                                {/*/!*</Button>*!/*/}
                                {/*<Button*/}
                                    {/*sx={{ fontWeight: 'bold' }}*/}
                                    {/*variant="text"*/}
                                    {/*color="inherit"*/}
                                    {/*component={Link}*/}
                                    {/*to="/nostr/nip-05"*/}
                                    {/*startIcon={<LinkIcon />}*/}
                                {/*>*/}
                                    {/*NIP-05*/}
                                {/*</Button>*/}
                                {/*<Button*/}
                                    {/*sx={{ fontWeight: 'bold' }}*/}
                                    {/*variant="text"*/}
                                    {/*color="inherit"*/}
                                    {/*component={Link}*/}
                                    {/*to="/nostr/zaps"*/}
                                    {/*startIcon={<ElectricBolt />}*/}
                                {/*>*/}
                                    {/*ZAPS*/}
                                {/*</Button>*/}
                                {/*<Menu*/}
                                    {/*id="tools-menu"*/}
                                    {/*anchorEl={toolsMenuAnchorEl}*/}
                                    {/*open={toolsMenuOpen}*/}
                                    {/*onClose={handleToolsMenuClose}*/}
                                    {/*MenuListProps={{*/}
                                        {/*'aria-labelledby': 'tools-menu-button'*/}
                                    {/*}}*/}
                                {/*>*/}
                                    {/*<MenuItem*/}
                                        {/*onClick={handleToolsMenuClose}*/}
                                        {/*component={Link}*/}
                                        {/*to="/#converter"*/}
                                    {/*>*/}
                                        {/*<ListItemIcon>*/}
                                            {/*<SwapVerticalCircleIcon color="success" />*/}
                                        {/*</ListItemIcon>*/}
                                        {/*<ListItemText>*/}
                                            {/*FIAT TO SATS CONVERTER*/}
                                        {/*</ListItemText>*/}
                                    {/*</MenuItem>*/}
                                {/*</Menu>*/}
                            {/*</React.Fragment>*/}
                        {/*)} />*/}
                    </Grid>
                </Toolbar>
            </AppBar>
            <LoginDialog open={loginDialogOpen}
                         onClose={() => {
                setLoginDialogOpen(false)
            }} />
        </Box>
    );
};