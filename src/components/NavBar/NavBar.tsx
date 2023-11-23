import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useSearchParams, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {
    Create, Search, Feed,
} from '@mui/icons-material';
import './NavBar.css';
import {useNostrContext} from "../../providers/NostrContextProvider";
import {LoginDialog} from "../../dialog/LoginDialog";
import {Config} from "../../resources/Config";
import {NewNoteDialog} from "../../dialog/NewNoteDialog";
import {ButtonGroup} from "@mui/material";
import {SearchBar} from "../SearchBar/SearchBar";
import {useParams} from "react-router";
import {useNostrFeedContext} from "../../providers/NostrFeedContextProvider";


export const NavBar = () => {
    const { user, loginDialogOpen, setLoginDialogOpen, newNoteDialogOpen, setNewNoteDialogOpen, query, loading } = useNostrContext();
    const [newNoteButtonText, setNewNoteButtonText] = useState<string>('');
    const navigate = useNavigate();

    const { searchString } = useParams();

    const handleNewNoteButtonClick = () => {
        if (user) {
            setNewNoteDialogOpen(true);
        } else {
            setLoginDialogOpen(true);
        }
    };

    useEffect(() => {
        console.log({query})
    }, [query]);

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
                    <Box className="navbarMenu" sx={{ width: '100%', display: 'flex' }}>
                        {/*<ButtonGroup variant="outlined">*/}
                            {/*<Button color="secondary" onClick={() => { navigate('/recent') }}>*/}
                                {/*<Feed/> Recent*/}
                            {/*</Button>*/}
                            {/*<Button color="secondary" onClick={() => { navigate('/search') }}>*/}
                                {/*<Search/> Search*/}
                            {/*</Button>*/}
                        {/*</ButtonGroup>*/}

                        <SearchBar
                            placeholder={`Search #${Config.HASHTAG}...`}
                            isQuerying={loading}
                            query={decodeURIComponent(query)}
                            onQueryChange={(event: any) => {
                                navigate(`/search/${encodeURIComponent(event.target.value?.replace('?', '%3F'))}`);
                            }}
                        />
                    </Box>

                    <Box sx={{
                        width: '114px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginRight: '8px'
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