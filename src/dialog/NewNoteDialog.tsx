import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import React from "react";
import TextField from "@mui/material/TextField";
import './NewNoteDialog.css';
import {DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";

interface NewNoteDialogProps {
    open: boolean;
    onClose?: () => void
}

export const NewNoteDialog = ({ open, onClose }: NewNoteDialogProps) => {

    const { post } = useNostrContext();

    const formik = useFormik({
        initialValues: {
            content: '',
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    const handleClose = () => {
        console.log('close');
        onClose && onClose();
    };

    return <Dialog open={open} onClose={() => { console.log('close') }}>
            <DialogTitle sx={{ color: 'rgba(255,255,255,.77)', paddingLeft: '8px' }}>Post to: #asknostr</DialogTitle>
            <Box className="newNote-form">
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        sx={{ minWidth: '272px' }}
                        id="content"
                        name="content"
                        label="What's your question?"
                        multiline
                        rows={10}
                        value={formik.values.content}
                        onChange={(event: any) => {
                            formik.handleChange(event);
                            console.log(`content change`, {event})
                        }}
                    />
                </form>
            </Box>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={() => {
                    post(formik.values.content, [['t', 'asknostr']])
                        .then(() => {
                            onClose && onClose();
                        })
                }} autoFocus>
                    Post
                </Button>
            </DialogActions>
        </Dialog>
};