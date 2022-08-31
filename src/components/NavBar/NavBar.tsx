import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Receipt from '@mui/icons-material/Receipt';
import Media from 'react-media';
import {Build, Menu as MenuIcon, Payments} from '@mui/icons-material';
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
                <ListItem disablePadding component={Link} to="/#were-handed-a-card" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Got a card?" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/#spread-the-word"  sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Spread the word!" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/#converter" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <SwapVerticalCircleIcon />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Converter" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/card-generator" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Payments />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Card generator" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/bitcoin-resources" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Receipt />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Resources" />
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
                    <img width="40px" alt="Useless Shit" src={process.env.PUBLIC_URL + '/images/uselessshit-logo.png'} />
                    <Grid
                        container
                        justifyContent="flex-end"
                        className="navbar-actions">
                        <Media query={{ maxWidth: '570px' }} render={() => (
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
                        <Media query={{ minWidth: '571px' }} render={() => (
                            <React.Fragment>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/#were-handed-a-card"
                                >
                                    Got a card?
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/#spread-the-word"
                                >
                                    Spread the word!
                                </Button>
                                <Button
                                    id="tools-menu-button"
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    aria-controls={toolsMenuOpen ? 'tools-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={toolsMenuOpen ? 'true' : undefined}
                                    startIcon={<Build color="warning" />}
                                    onClick={handleToolsMenuClick}
                                >
                                    Tools
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/bitcoin-resources"
                                    startIcon={<Receipt sx={{ color: pink[500] }} />}
                                >
                                    Resources
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