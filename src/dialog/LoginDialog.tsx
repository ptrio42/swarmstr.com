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

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ color: '#fff' }}>Secure login</DialogTitle>
            <DialogContent>
                <Typography className="loginInfo" component="div" variant="body1">
                    To be able to post new questions, answer to existing ones, sent zaps and add reactions, you need to login first.
                </Typography>
                <Stack direction="column" spacing={3}>
                    <Paper>
                        <Button
                            sx={{ width: '100%' }}
                            color="primary"
                            variant="contained"
                            onClick={onLoginWithBrowserExtension}
                        >
                            Login with browser extension (NIP-07)
                        </Button>
                    </Paper>
                    <Tooltip title="Login method not yet available">
                        <Paper>
                            <Button
                                sx={{ background: 'rgb(0, 0, 0, .33)', width: '100%' }}
                                color="secondary"
                                variant="outlined"
                                disabled={true}>
                                Login with Nostr Connect (NIP-46)
                            </Button>
                        </Paper>
                    </Tooltip>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};