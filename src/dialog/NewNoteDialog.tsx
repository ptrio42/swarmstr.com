import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import React, {useEffect, useRef} from "react";
import TextField from "@mui/material/TextField";
import './NewNoteDialog.css';
import {DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";
import {NDKTag} from "@nostr-dev-kit/ndk";
import {nip19} from 'nostr-tools';
import {differenceWith} from 'lodash';

interface NewNoteDialogProps {
    open: boolean;
    onClose?: () => void;
    replyTo?: string;
    label?: string;
    explicitTags?: NDKTag[]
}

export const NewNoteDialog = ({ open, onClose, replyTo, label, explicitTags }: NewNoteDialogProps) => {

    const { post } = useNostrContext();

    const tags = useRef<NDKTag[]>([]);

    const formik = useFormik({
        initialValues: {
            content: '',
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    useEffect(() => {
        if (explicitTags) {
            tags.current.push(...explicitTags);
        }
    }, []);

    useEffect(() => {
        replyTo && tags.current.push(['e', replyTo])
    }, [replyTo]);

    const handleClose = () => {
        console.log('close');
        onClose && onClose();
    };

    return <Dialog open={open} onClose={() => { console.log('close') }}>
            <DialogTitle sx={{ color: 'rgba(255,255,255,.77)', paddingLeft: '8px' }}>
                {
                    replyTo && <React.Fragment>
                        Reply to: { nip19.noteEncode(replyTo).slice(0, 12) }...
                    </React.Fragment>
                }
                {
                    !replyTo && <React.Fragment>Post to: #asknostr</React.Fragment>
                }
            </DialogTitle>
            <Box className="newNote-form">
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        sx={{ minWidth: '272px' }}
                        id="content"
                        name="content"
                        label={ label || 'Post' }
                        multiline
                        rows={10}
                        value={formik.values.content}
                        onChange={(event: any) => {
                            formik.handleChange(event);
                        }}
                    />
                </form>
            </Box>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={() => {
                    // find tags in content
                    const tagsInContent = formik.values.content.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/gm)
                        ?.map((match: string) => match.replace('#', ''))
                        .map((tag: string) => ['t', tag]);
                    if (tagsInContent) {
                        const diff = differenceWith(tagsInContent, tags.current, (t1, t2) => t1[0] === t2[0] && t1[1] === t2[1]);
                        tags.current.push(...diff);
                    }
                    // console.log({tags: tags.current})
                    post(formik.values.content, tags.current)
                        .then(() => {
                            onClose && onClose();
                        })
                }} autoFocus>
                    Post
                </Button>
            </DialogActions>
        </Dialog>
};