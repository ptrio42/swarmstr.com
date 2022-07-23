import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Receipt from '@mui/icons-material/Receipt';

export const NavBar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar style={{ background: '#F0E68C' }} position="static">
                <Toolbar>
                    <Avatar style={{ border: '3px solid #fff' }} alt="Useless Shit" src={process.env.PUBLIC_URL + '/images/uselessshit-logo.png'} />
                    <Grid container justifyContent="flex-end" sx={{ color: '#000' }}>
                        <Button sx={{ fontWeight: 'bold' }} variant="text" color="inherit" component={Link} to="/#were-handed-a-card">Were handed a card?</Button>
                        <Button sx={{ fontWeight: 'bold' }} variant="text" color="inherit" component={Link} to="/#let-s-shame-someone">Let's shame someone!</Button>
                        <Button sx={{ fontWeight: 'bold' }} variant="text" color="inherit" component={Link} to="/#credits" startIcon={<Receipt />}>Credits</Button>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    );
};