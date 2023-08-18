import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import React, {lazy, useEffect, useRef, useState, Suspense} from "react";
import TextField from "@mui/material/TextField";
import './NewNoteDialog.css';
import {DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";
import {NDKTag} from "@nostr-dev-kit/ndk";
import {nip19} from 'nostr-tools';
import {differenceWith, uniqBy} from 'lodash';
import Input from "@mui/material/Input";
import {GifBox, Image as ImageIcon} from '@mui/icons-material';
import {uploadToNostrCheckMe} from "../services/uploadImage";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import {GifDialog} from "./GifDialog";

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`newNote-tabpanel-${index}`}
            aria-labelledby={`newNote-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `simplnewNote-tab-${index}`,
        'aria-controls': `newNote-tabpanel-${index}`,
    };
};

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

    const [tags, setTags] = useState<NDKTag[]>([]);

    const fileInputRef = useRef<HTMLInputElement|null>(null);

    const [kind, setKind] = useState<number>(1);
    const [tabIndex, setTabIndex] = useState<number>(0);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const [gifDialogOpen, setGifDialogOpen] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            content: '',
            title: ''
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    useEffect(() => {
        // console.log('didMount')
        // if (explicitTags) {
        //     tags.current.push(...explicitTags);
        // }
    }, []);

    useEffect(() => {

    }, [noteId]);

    useEffect(() => {
        // const diff = replyTo && differenceWith(replyTo.map((pubkey: string) => (['p', pubkey])), tags, (t1, t2) => t1[0] === t2[0] && t1[1] === t2[1]);
        // diff && diff.length > 0 && tags.current.push(...(diff));
    }, [replyTo]);

    useEffect(() => {
        let newKind: number;
        if (tabIndex === 1) {
            newKind = 30023;
        } else {
            newKind = 1;
        }
        setKind(newKind!);
    }, [tabIndex]);

    useEffect(() => {
        const { content } = formik.values;
        // console.log(`content change`, {content});
        if (!content) return;

        const eTags: NDKTag[] = [
            ...(content.match(/nostr:note1([a-z0-9]+)/gm) || []),
            ...(content.match(/nostr:nevent1([a-z0-9]+)/gm) || [])
        ]?.filter((e) => !!e)
            .map((match: string) => nip19.decode(match.split(':')[1]))
            .map(({data}) => ['e', data?.id || data]);

        const tTags = content.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/gm)?.map((match: string) => ['t', match.replace('#', '')]);
        console.log({tags: [eTags, tTags, explicitTags]})
        // @ts-ignore
        setTags(uniqBy(
            [
                ...(eTags || []),
                ...(tTags || []),
                ...(explicitTags || []),
                // @ts-ignore
                noteId && ['e', `${noteId}`]
            ].filter((t) => !!t && t.length > 0)
        , '[1]'));
    }, [formik.values.content]);

    useEffect(() => {
        // console.log({tags})
    }, [tags])

    const handleClose = () => {
        console.log('close');
        onClose && onClose();
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log({newValue});
        setTabIndex(newValue);
    };

    return <React.Fragment><Dialog fullWidth={true} fullScreen={fullScreen} open={open} onClose={() => { console.log('close') }}>
            <DialogTitle sx={{ color: 'rgba(255,255,255,.77)', paddingLeft: '8px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="Choose note type">
                        <Tab className="newNote-tab" label={noteId ? 'Short reply' : 'Add Question'} {...a11yProps(0)} />
                        <Tab className="newNote-tab" label={ noteId ? 'Create reply' : 'Create Post' } {...a11yProps(1)} />
                    </Tabs>
                </Box>
            </DialogTitle>
            <Box sx={{ height: '90%' }} className="newNote-form">
                <form onSubmit={formik.handleSubmit}>
                    <TabPanel index={0} value={tabIndex}>
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
                    </TabPanel>
                    <TabPanel index={1} value={tabIndex}>
                        <TextField
                            sx={{ marginBottom: '1em', padding: '0!important' }}
                            id="title"
                            name="title"
                            type="text"
                            label="Post title..."
                            value={formik.values.title}
                            onChange={(event) => {
                                formik.handleChange(event);
                            }} />
                        <Suspense fallback={'Loading...'}>
                            <MDEditor
                                value={formik.values.content}
                                onChange={(value: string | undefined) => {
                                    formik.setFieldValue('content', value);
                                }}
                            />
                        </Suspense>
                    </TabPanel>
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
                        <Button color="warning" onClick={() => {
                            console.log({fileInpuRef: fileInputRef.current})
                            fileInputRef.current?.click();
                        }}>
                            <ImageIcon sx={{ fontSize: 32 }}/>
                        </Button>
                </form>
                <Button color="warning" onClick={() => {
                    setGifDialogOpen(true);
                }}>
                    <GifBox sx={{ fontSize: 32 }}/>
                </Button>
                <Button sx={{ textTransform: 'capitalize', borderRadius: '18px' }} variant="outlined" color="secondary" autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button  sx={{ textTransform: 'capitalize', borderRadius: '18px' }} variant="contained" color="warning" onClick={() => {
                    // find tags in content
                    const tagsInContent = formik.values.content.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/gm)
                        ?.map((match: string) => match.replace('#', ''))
                        .map((tag: string) => ['t', tag]);
                    // if (tagsInContent) {
                    //     const diff = differenceWith(tagsInContent, tags, (t1, t2) => t1[0] === t2[0] && t1[1] === t2[1]);
                    //     tags.current.push(...diff);
                    // }
                    // if (kind === 30023) {
                    //     const index = tags.current.findIndex((tag: NDKTag) => tag[0] === 'title');
                    //     if (index > -1) {
                    //         tags.current.slice(index, 1);
                    //     }
                    //     tags.current.push(['title', formik.values.title]);
                    // }
                    post(formik.values.content, tags, kind)
                        .then(() => {
                            formik.setFieldValue('content', '');
                            formik.setFieldValue('title', '');
                            onClose && onClose();
                        })
                }} autoFocus>
                    Post
                </Button>
            </DialogActions>
        </Dialog>
        <GifDialog open={gifDialogOpen} onClose={(gifUrl?: string) => {
            if (gifUrl) formik.setFieldValue('content', formik.values.content + `\n${gifUrl}`);
            setGifDialogOpen(false);
        }} />
    </React.Fragment>
};