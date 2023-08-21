import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import {Link, useSearchParams, useNavigate} from "react-router-dom";
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
    School, HistoryEdu, Create, Search, Feed,
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
import AddIcon from '@mui/icons-material/Add';
import {Config} from "../../resources/Config";
import {NewNoteDialog} from "../../dialog/NewNoteDialog";
import {NewLabelDialog} from "../../dialog/NewLabelDialog";
import {ButtonGroup} from "@mui/material";
import {useParams} from "react-router";


export const NavBar = () => {
    const { user, loginDialogOpen, setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen } = useNostrContext();
    const [newNoteButtonText, setNewNoteButtonText] = useState<string>('');
    const [_, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                className="navbar"
                position="static"
            >
                <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: '640px', margin: 'auto', padding: 0 }}>
                    <Link className="logo" to="/">
                        <img width="64px" height="64px" alt={Config.APP_TITLE} src={Config.LOGO_IMG}/>
                    </Link>
                    <Box sx={{ display: 'flex' }}>
                        <ButtonGroup variant="outlined">
                            <Button color="secondary" onClick={() => { navigate('/recent') }}>
                                <Feed/> Recent
                            </Button>
                            <Button color="secondary" onClick={() => { navigate('/?s=') }}>
                                <Search/> Search
                            </Button>
                        </ButtonGroup>
                    </Box>

                    <Box sx={{ width: '114px', display: 'flex', justifyContent: 'flex-end', marginRight: '8px' }}>
                        <Button
                            className="newNote-button"
                            sx={{ textTransform: 'math-auto', fontWeight: '400', fontSize: '16px', borderRadius: '18px!important', padding: '5px 8px', width: 'auto' }}
                            color="warning"
                            variant="contained"
                            onClick={() => {
                                if (user) {
                                    setNewNoteDialogOpen(true);
                                } else {
                                    setLoginDialogOpen(true);
                                }
                            }}
                            onMouseEnter={() => {
                                setNewNoteButtonText(`#${Config.HASHTAG}`)
                            }}
                            onMouseLeave={() => {
                                setNewNoteButtonText('');
                            }}
                        >
                            { `${newNoteButtonText} ` }<Create sx={{ paddingLeft: '2px'}} />
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <LoginDialog open={loginDialogOpen}
                         onClose={() => {
                setLoginDialogOpen(false)
            }} />
            <NewNoteDialog
                open={newNoteDialogOpen}
                onClose={() => setNewNoteDialogOpen(false)}
                label="What's your question?"
                explicitTags={[['t', Config.HASHTAG]]}
            />
        </Box>
    );
};