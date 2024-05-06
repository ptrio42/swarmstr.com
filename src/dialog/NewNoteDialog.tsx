import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {useFormik, useFormikContext} from "formik";
import React, {lazy, useEffect, useRef, useState, Suspense} from "react";
import TextField from "@mui/material/TextField";
import './NewNoteDialog.css';
import {DialogActions, SelectChangeEvent} from "@mui/material";
import Button from "@mui/material/Button";
import {useNostrContext} from "../providers/NostrContextProvider";
import {NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
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
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import {Config} from "../resources/Config";
import {TAG_EMOJIS} from "../components/Nostr/NoteTags/NoteTags";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CompareIcon from '@mui/icons-material/Compare';
import {TagChipSelect} from "../components/Nostr/TagChipSelect/TagChipSelect";
import {ImageCreatorDialog} from "./ImageCreatorDialog";
import DialogContent from "@mui/material/DialogContent";
import {LoadingDialog} from "./LoadingDialog";

const SWARMSTR_SUB_TAGS: NDKTag[] = [['t', 'enhancement'], ['t', 'bug'], ['t', 'announcement']];

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
    // replyTo?: string[];
    label?: string;
    explicitTags?: NDKTag[];
    event?: NostrEvent;
}

export const NewNoteDialog = ({ open, onClose, label, event, ...props }: NewNoteDialogProps) => {

    const formik = useFormik({
        // enableReinitialize: true,
        initialValues: {
            content: '',
            title: ''
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    const { post, setEvent, setImageCreatorDialogOpen, imageCreatorDialogOpen, setSnackbarMessage } = useNostrContext();

    const [tags, setTags] = useState<NDKTag[]>([]);

    const fileInputRef = useRef<HTMLInputElement|null>(null);

    const [kind, setKind] = useState<number>(1);
    const [tabIndex, setTabIndex] = useState<number>(0);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const [gifDialogOpen, setGifDialogOpen] = useState<boolean>(false);

    const [explicitTags, setExplicitTags] = useState<NDKTag[]>(props.explicitTags || []);

    const [imageUrl, setImageUrl] = useState<string>();

    const [content, setContent] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // const diff = replyTo && differenceWith(replyTo.map((pubkey: string) => (['p', pubkey])), tags, (t1, t2) => t1[0] === t2[0] && t1[1] === t2[1]);
        // diff && diff.length > 0 && tags.current.push(...(diff));
    }, [event?.pubkey]);

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
        // const { content } = formik.values;
        console.log(`content change`, {content}, formik.values.content);
        setContent(formik.values.content);
        if (!formik.values.content) return;

        const eTags: NDKTag[] = [
            ...(content.match(/nostr:note1([a-z0-9]+)/gm) || []),
            ...(content.match(/nostr:nevent1([a-z0-9]+)/gm) || [])
        ]?.filter((e) => !!e)
            .map((match: string) => nip19.decode(match.split(':')[1]))
            .map(({data}) => ['e', data?.id || data]);

        const tTags = content.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/gm)
            ?.map((match: string) => ['t', match.replace('#', '')]);
        // console.log({tags: [eTags, tTags, explicitTags]})

        const _tags = uniqBy(
            [
                ...(eTags || []),
                ...(tTags || []),
                ...(explicitTags || [])
            ].filter((t) => !!t && t.length > 0)
            , '[1]');

        if (event && event.id) {
            _tags.push(['e', event.id])
        }

        // @ts-ignore
        setTags(_tags);
    }, [formik.values.content, explicitTags]);

    useEffect(() => {
        // console.log({tags})
    }, [tags]);

    useEffect(() => {
        // if (!imageUrl) return;
        // console.log({imageUrl});
        // setTimeout(() => {
        //     formik.setFieldValue('content', formik.values.content + `\n${imageUrl}`, false);
        //     formik.setFieldTouched('content', true, false);
        // }, 1000);
        // setImageUrl(undefined);
    }, [imageUrl]);

    const handleClose = () => {
        // console.log('close');
        onClose && onClose();
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        // console.log({newValue});
        setTabIndex(newValue);
    };

    const handleTagsSelectChange = (event: SelectChangeEvent<any>) => {
        const {
            target: { value }
        } = event;
        console.log({value})
        const newExplicitTags = typeof value === 'string' ? ['t', value] : value.map((t: string) => ['t', t]);
        console.log({newExplicitTags})
        setExplicitTags(newExplicitTags);
        // if (tags.findIndex((t: any) => t[1] === value) > -1) {
        //     console.log(`removing tag ${value}`);
        //     // const newContent = formik.values.content.replace(new RegExp(`\\b#${value}\\b`, 'gm'), '');
        //     // console.log({newContent})
        //
        //     // formik.setFieldValue('content', newContent);
        // } else {
        //     console.log(`adding tag ${value}`)
        //     formik.setFieldValue('content', formik.values.content + ` #${value}`);
        // }


        // const _tags = tags.filter((t: any) => t[1] !== value);
        // if (tags.findIndex((t: any) => t[1] === value) > -1) {
        //     _tags.push(['t', value]);
        // }
        // setTags(_tags);
    };

    return <React.Fragment><Dialog fullWidth={true} fullScreen={fullScreen} open={open} onClose={() => { console.log('close') }}>
            <DialogTitle sx={{ color: 'rgba(255,255,255,.77)', paddingLeft: '8px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="Choose note type">
                        <Tab className="newNote-tab" label={event?.id ? 'Short reply' : 'New Note'} {...a11yProps(0)} />
                        <Tab className="newNote-tab" label={ event?.id ? 'Create reply' : 'Create Post' } {...a11yProps(1)} />
                        <Button sx={{ textTransform: 'capitalize', margin: '8px' }} color="warning" variant="outlined" onClick={() => { setImageCreatorDialogOpen(true) }}>
                            <CompareIcon sx={{ fontSize: 32 }}/> Create Image
                        </Button>
                    </Tabs>
                </Box>
            </DialogTitle>
        <DialogContent>
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
                            value={content}
                            onChange={(event: any) => {
                                console.log('content event', {event}, formik.values.content)
                                // formik.setFieldValue('content', event.target.value);
                                // setContent(event.target.value);
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
                                value={content}
                                onChange={(value: string | undefined) => {
                                    formik.setFieldValue('content', value);
                                }}
                            />
                        </Suspense>
                    </TabPanel>
                </form>
            </Box>
            <TagChipSelect
                tags={Config.NOSTR_TAGS}
                selectedTags={explicitTags.map((t: NDKTag) => t[1])}
                onTagSelect={handleTagsSelectChange}
            />

        {/*{*/}
            {/*explicitTags.findIndex((tag: NDKTag) => tag[0] === 't' && tag[1] === 'swarmstr') && <TagChipSelect*/}
                {/*tags={SWARMSTR_SUB_TAGS.map((t: NDKTag) => t[1])}*/}
                {/*selectedTags={explicitTags.filter((t: NDKTag) => SWARMSTR_SUB_TAGS.includes(t)).map((t: NDKTag) => t[1])}*/}
                {/*onTagSelect={handleTagsSelectChange}*/}
            {/*/>*/}
        {/*}*/}
            {/*<Box sx={{ marginLeft: '24px' }}>*/}
                {/*<FormControl>*/}
                {/*<InputLabel id="tags-chip-label">Select tags</InputLabel>*/}
                {/*<Select*/}
                    {/*sx={{ width: '94%' }}*/}
                    {/*labelId="tags-chip-label"*/}
                    {/*id="tags-chip"*/}
                    {/*label={'Tags'}*/}
                    {/*multiple*/}
                    {/*color={'primary'}*/}
                    {/*value={explicitTags.map((t: NDKTag) => t[1])}*/}
                    {/*onChange={handleTagsSelectChange}*/}
                    {/*input={<OutlinedInput id="select-multiple-chip" label="Chip" />}*/}
                    {/*renderValue={(selected) => (*/}
                        {/*<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>*/}
                            {/*{selected.map((value) => (*/}
                                {/*<Chip size={'small'} key={value} label={`${TAG_EMOJIS[value]} ${value}`} />*/}
                            {/*))}*/}
                        {/*</Box>*/}
                    {/*)}*/}
                    {/*MenuProps={MenuProps}*/}
                {/*>*/}
                    {/*{Config.NOSTR_TAGS.map((tag) => (*/}
                        {/*<MenuItem*/}
                            {/*key={tag}*/}
                            {/*value={tag}*/}
                        {/*>*/}
                            {/*{tag}*/}
                        {/*</MenuItem>*/}
                    {/*))}*/}
                {/*</Select>*/}
                {/*</FormControl>*/}
            {/*</Box>*/}
            <ImageCreatorDialog
                open={imageCreatorDialogOpen}
                formik={formik}
                onClose={(image?: any, _formik?: any) => {
                    setLoading(true);
                    // console.log({imageUrl});
                    // setImageUrl(imageUrl);

                    if (image) {
                        // fileInputRef.current!.value = image;
                        // fileInputRef.current?.click();
                        uploadToNostrCheckMe(image)
                            .then((url: string) => {
                                console.log({content: formik.values.content, url});
                                formik.setFieldValue('content', formik.values.content + `\n${url}`);
                                setLoading(false);
                            })
                    } else {
                        setLoading(false);
                    }
                    // {
                    //     setTimeout(() => {
                    //         formik.setFieldValue('content', formik.values.content + `\n${imageUrl}`);
                    //         setFieldValue('content', formik.values.content + `\ngfy`);
                    //         formik.handleChange('content');
                    //         console.log({content: formik.values.content, imageUrl})
                    //     }, 1);
                    // }
                    setImageCreatorDialogOpen(false);
                }}
            />
        </DialogContent>
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
                                setLoading(true);
                                uploadToNostrCheckMe(files[0])
                                    .then((url: string) => {
                                        console.log('uploaded')
                                        formik.setFieldValue('content', formik.values.content + `\n${url}`);
                                        setLoading(false);
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
                    setLoading(true);
                    post(formik.values.content, tags, kind)
                        .then(() => {
                            formik.setFieldValue('content', '');
                            formik.setFieldValue('title', '');
                            setEvent(undefined);
                            setLoading(false);
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
        <LoadingDialog open={loading}/>
    </React.Fragment>
};