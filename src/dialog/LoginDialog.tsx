import {Dialog} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";
import React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import './LoginDialog.css';
import {Link} from "react-router-dom";
import Avatar from "@mui/material/Avatar";

interface LoginDialogProps {
    open: boolean;
    onClose?: () => void
}

export const LoginDialog = ({ open, onClose }: LoginDialogProps) => {

    const { signIn } = useNostrContext();

    const handleClose = (event?: any) => {
        console.log('close', {event});
        onClose && onClose();
    };

    const onLoginWithBrowserExtension = () => {
        signIn()
            .then(() => {
                console.log(`signed in`);
                handleClose();
            })
            .catch((error) => console.error(`login error`, {error}));
    };

    const loginAsGuest = () => {

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ color: '#fff' }}>Login</DialogTitle>
            <DialogContent>
                <Typography className="loginInfo" component="div" variant="body1">

                    To be able to post new questions, participate in discussions, sent zaps or reactions, you need to own a Nostr key pair.
                    <br/><br/>
                    If you already have your keys, you'll need a browser extension to log in to Swarmstr. &nbsp;
                    <Link to={`https://github.com/aljazceru/awesome-nostr#nip-07-browser-extensions`}>Start here if you need one.</Link>
                </Typography>
                <Stack direction="column" spacing={3}>
                    {/*<Paper>*/}
                        <Button
                            sx={{ textTransform: 'capitalize' }}
                            color="primary"
                            variant="contained"
                            onClick={onLoginWithBrowserExtension}
                        >
                            Login with browser extension
                            <Avatar sx={{ marginLeft: '6px', width: '30px', height: '30px' }} src={`${process.env.BASE_URL}/images/nostr-logo.webp`} />
                        </Button>
                    {/*</Paper>*/}
                    {/*<Paper>*/}
                        {/*<h6>Have trouble logging in with browser?</h6>*/}
                    {/*</Paper>*/}
                    {/*<Paper>*/}
                        {/*<Button*/}
                            {/*sx={{ background: 'rgb(0, 0, 0, .33)', textTransform: 'capitalize' }}*/}
                            {/*color="secondary"*/}
                            {/*// variant="outlined"*/}
                        {/*>*/}
                            {/*Create guest account (?)*/}
                        {/*</Button>*/}
                    {/*</Paper>*/}
                    {/*<Tooltip title="Login method not yet available">*/}
                        {/*<Paper>*/}
                            {/*<Button*/}
                                {/*sx={{ background: 'rgb(0, 0, 0, .33)', width: '100%' }}*/}
                                {/*color="secondary"*/}
                                {/*variant="outlined"*/}
                                {/*disabled={true}>*/}
                                {/*Login with Nostr Connect (NIP-46)*/}
                            {/*</Button>*/}
                        {/*</Paper>*/}
                    {/*</Tooltip>*/}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button sx={{ textTransform: 'capitalize' }} color="secondary" autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};