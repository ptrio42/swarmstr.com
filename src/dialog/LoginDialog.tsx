import {Dialog} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";
import React from "react";

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
            <DialogTitle sx={{ color: '#fff' }}>Login</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={3}>
                    <Paper>
                        <Button
                            sx={{ background: 'rgb(46, 125, 50)' }}
                            color="primary"
                            variant="outlined"
                            onClick={onLoginWithBrowserExtension}
                        >
                            Login with browser extension (NIP-07)
                        </Button>
                    </Paper>
                    <Paper>
                        <Button
                            sx={{ background: 'rgb(0, 0, 0, .33)' }}
                            color="secondary"
                            variant="outlined"
                            disabled={true}>
                            Login with nSecBunker (NIP-46)
                        </Button>
                    </Paper>
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