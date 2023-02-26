import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Receipt from '@mui/icons-material/Receipt';
import Media from 'react-media';
import {Build, CurrencyBitcoin, ElectricBolt, Menu as MenuIcon, Payments, School, Verified} from '@mui/icons-material';
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
import pink from "@mui/material/colors/pink";
import './NavBar.css';

export const NavBar = () => {
    const [state, setState] = React.useState(false);
    const [toolsMenuAnchorEl, setToolsMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const toolsMenuOpen = Boolean(toolsMenuAnchorEl);

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
                <ListItem disablePadding component={Link} to="/card-generator"  sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <CurrencyBitcoin />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Bitcoin Artwork" />
                    </ListItemButton>
                </ListItem>
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
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Resources" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/resources/nostr" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ElectricBolt />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Nostr" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/nostr/nip-05" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Verified />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Nip-05" />
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
                        <img
                            width="40px"
                            alt="Use Less Shit"
                            src={process.env.PUBLIC_URL + '/images/new-uselessshit-logo.png'}
                        />
                        <img className="logo-text"
                             height="40px"
                             alt="Use Less Shit"
                             src={process.env.PUBLIC_URL + '/images/new-uselessshit-logo-text.png'}
                        />
                    </Link>
                    <Grid
                        container
                        justifyContent="flex-end"
                        className="navbar-actions">
                        <Media query={{ maxWidth: '909px' }} render={() => (
                            <React.Fragment>
                                <IconButton onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
                                <Drawer
                                    anchor="right"
                                    open={state}
                                    onClose={toggleDrawer(false)}
                                >
                                    {list()}
                                </Drawer>
                            </React.Fragment>
                        )} />
                        <Media query={{ minWidth: '910px' }} render={() => (
                            <React.Fragment>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/card-generator"
                                    startIcon={<CurrencyBitcoin color="warning" />}
                                >
                                    BITCOIN ARTWORK
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/#converter"
                                    startIcon={<SwapVerticalCircleIcon color="success" />}
                                >
                                    SATOSHI CALCULATOR
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/resources/bitcoin"
                                    startIcon={<School />}
                                >
                                    Resources
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/resources/nostr"
                                    startIcon={<ElectricBolt />}
                                >
                                    NOSTR
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/nostr/nip-05"
                                    startIcon={<Verified />}
                                >
                                    NIP-05
                                </Button>
                                <Menu
                                    id="tools-menu"
                                    anchorEl={toolsMenuAnchorEl}
                                    open={toolsMenuOpen}
                                    onClose={handleToolsMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'tools-menu-button'
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleToolsMenuClose}
                                        component={Link}
                                        to="/#converter"
                                    >
                                        <ListItemIcon>
                                            <SwapVerticalCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText>
                                            FIAT TO SATS CONVERTER
                                        </ListItemText>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleToolsMenuClose}
                                        component={Link}
                                        to="/card-generator"
                                    >
                                        <ListItemIcon>
                                            <Payments color="secondary" />
                                        </ListItemIcon>
                                        <ListItemText>
                                            CARD GENERATOR
                                        </ListItemText>
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        )} />
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    );
};