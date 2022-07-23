import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Receipt from '@mui/icons-material/Receipt';
import Media from 'react-media';
import Menu from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';

export const NavBar = () => {
    const [state, setState] = React.useState(false);

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
                <ListItem disablePadding component={Link} to="/#let-s-shame-someone"  sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Shame someone" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={Link} to="/#credits" sx={{ color: '#000' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Receipt />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Credits" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar style={{ background: '#F0E68C' }} position="static">
                <Toolbar>
                    <img width="40px" alt="Useless Shit" src={process.env.PUBLIC_URL + '/images/uselessshit-logo.png'} />
                    <Grid container justifyContent="flex-end" sx={{ color: '#000' }}>
                        <Media query={{ maxWidth: '427px' }} render={() => (
                            <React.Fragment>
                                <IconButton onClick={toggleDrawer(true)}><Menu /></IconButton>
                                <Drawer
                                    anchor="right"
                                    open={state}
                                    onClose={toggleDrawer(false)}
                                >
                                    {list()}
                                </Drawer>
                            </React.Fragment>
                        )} />
                        <Media query={{ minWidth: '428px' }} render={() => (
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
                                    to="/#let-s-shame-someone"
                                >
                                    Shame someone
                                </Button>
                                <Button
                                    sx={{ fontWeight: 'bold' }}
                                    variant="text"
                                    color="inherit"
                                    component={Link}
                                    to="/#credits"
                                    startIcon={<Receipt />}
                                >
                                    Credits
                                </Button>
                            </React.Fragment>
                        )} />
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    );
};