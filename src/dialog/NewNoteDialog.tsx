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
import Input from "@mui/material/Input";
import { Image as ImageIcon } from '@mui/icons-material';
import {uploadToNostrCheckMe} from "../services/uploadImage";

interface NewNoteDialogProps {
    open: boolean;
    onClose?: () => void;
    noteId?: string;
    replyTo?: string[];
    label?: string;
    explicitTags?: NDKTag[];
}

export const NewNoteDialog = ({ open, onClose, noteId, replyTo, label, explicitTags }: NewNoteDialogProps) => {

    const { post } = useNostrContext();

    const tags = useRef<NDKTag[]>([]);

    const fileInputRef = useRef<HTMLInputElement|null>(null);

    const formik = useFormik({
        initialValues: {
            content: '',
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    useEffect(() => {
        // console.log('didMount')
        if (explicitTags) {
            tags.current.push(...explicitTags);
        }
    }, []);

    useEffect(() => {
        noteId && tags.current.push(['e', noteId])
    }, [noteId]);

    useEffect(() => {
        const diff = replyTo && differenceWith(replyTo.map((pubkey: string) => (['p', pubkey])), tags.current, (t1, t2) => t1[0] === t2[0] && t1[1] === t2[1]);
        diff && diff.length > 0 && tags.current.push(...(diff));
    }, [replyTo]);

    const handleClose = () => {
        console.log('close');
        onClose && onClose();
    };

    return <Dialog open={open} onClose={() => { console.log('close') }}>
            <DialogTitle sx={{ color: 'rgba(255,255,255,.77)', paddingLeft: '8px' }}>
                {
                    noteId && <React.Fragment>
                        Reply to: { nip19.noteEncode(noteId).slice(0, 12) }...
                    </React.Fragment>
                }
                {
                    !noteId && <React.Fragment>Post to: #asknostr</React.Fragment>
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
                <form>
                    <input
                        style={{ display: 'none' }}
                        id="upload-image"
                        name="upload-image"
                        key="upload-image"
                        type="file"
                        ref={fileInputRef}
                        onChange={(event: any) => {
                            const files = (event.currentTarget as HTMLInputElement).files;
                            if (files && files.length > 0) {
                                uploadToNostrCheckMe(files[0])
                                    .then((url: string) => {
                                        console.log('uploaded')
                                        formik.setFieldValue('content', formik.values.content + `\n${url}`);
                                    });
                            }
                        }} />
                        <Button onClick={() => {
                            console.log({fileInpuRef: fileInputRef.current})
                            fileInputRef.current?.click();
                        }}>
                            <ImageIcon/>
                        </Button>
                </form>
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
                            formik.setFieldValue('content', '');
                            onClose && onClose();
                        })
                }} autoFocus>
                    Post
                </Button>
            </DialogActions>
        </Dialog>
};