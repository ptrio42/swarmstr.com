import {NDKFilter, NostrEvent, NDKTag} from "@nostr-dev-kit/ndk";
import React, {useEffect, useState} from "react";
import {useNostrContext} from "../providers/NostrContextProvider";
import {Dialog, SelectChangeEvent} from "@mui/material";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {LoadingDialog} from "./LoadingDialog";
import {TagChipSelect} from "../components/Nostr/TagChipSelect/TagChipSelect";
import {ThumbDown, ThumbUp} from "@mui/icons-material";

export enum Thumb {
    Up = 'up',
    Down = 'down'
}

interface NewLabelDialogProps {
    open: boolean;
    onClose?: () => void;
    reaction?: string;
    event?: NostrEvent;
    selectedLabelName?: string;
    thumb?: Thumb;
}

export interface NoteLabel {
    name: string;
    reaction: string;
    emoji?: string;
}

const NOTE_LABELS = [
    'informative',
    'provocative',
    'truthful',
    'relevant',
    'funny',
    'thoughtful',
    'original'
];



export const thumbsUpTags = (labels?: string[]): NDKTag[] => {
    const tags: NDKTag[] = [];
    tags.push(['l', 'thumb', 'note', JSON.stringify({ quality: 0.5 })]);

    if (labels && labels.length > 0) {
        tags.push(...labels.map((label: string) => ['l', label, 'note', JSON.stringify({ quality: 0.5/NOTE_LABELS.length })]))
    }
    console.log('thumbsUpTags', {tags});
    return tags;
};

export const thumbsDownTags = (): NDKTag[] => {
    return [
        ['l', 'thumb', 'note', JSON.stringify({ quality: 0 })]
    ];
};

const LABELS: NoteLabel[] = [
    {
        name: 'question/duplicate',
        reaction: 'garlic'
    },
    {
        name: 'question/missing_tag',
        reaction: 'hash'
    },
    {
        name: 'note/useful',
        reaction: 'brain'
    },
    {
        name: 'note/not_useful',
        reaction: 'shrug'
    },
    // {
    //     name: 'bounty',
    //     reaction: 'zap'
    // },
    {
        name: 'note/spam',
        reaction: 'triangular_flag_on_post'
    }
];

export const NewLabelDialog = ({ open, onClose, selectedLabelName, event, thumb, ...props }: NewLabelDialogProps) => {
    // const [event, setEvent] = useState<NostrEvent|undefined>(props?.event);

    const { label, user, setEvent } = useNostrContext();

    const [selectedLabel, setSelectedLabel] = useState<NoteLabel>();
    const [content, setContent] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    useEffect(() => {
        if (selectedLabelName) {
            const label = LABELS.find(({name}) => selectedLabelName === name);
            if (label) setSelectedLabel(label);
        }
    }, [selectedLabelName]);

    const getPlaceholder = () => {
        let placeholder = '';
        if (selectedLabel) {
            switch (selectedLabel!.name) {
                case 'question/duplicate':
                    placeholder = 'Add link to duplicated question...';
                    break;
                case 'question/missing_tag':
                    placeholder = 'Add missing tag(s) eg. #tag,#tag2,#tag3...';
                    break;
                case 'note/useful':
                case 'note/not_useful':
                    placeholder = 'Leave a comment...';
                    break;
                case 'note/spam':
                    placeholder = 'Additional info...';
                    break;
            }
            return placeholder;
        }
    };

    if (!selectedLabelName || !event) {
        console.log('null', {selectedLabelName, event})
        return null;
    }

    const handleSelectedLabelsChange = (event: SelectChangeEvent<any>) => {
        const {
            target: {value}
        } = event;
        const labels = typeof value === 'string' ? [value] : value;
        setSelectedLabels(labels);
    };

    return (
        <Dialog open={open} onClose={() => onClose && onClose()}>
            <DialogTitle sx={{ color: '#fff' }}>
                Review note
            </DialogTitle>
            <DialogContent>
                {selectedLabel?.reaction === 'brain' ? <ThumbUp color="success"/> : <ThumbDown color="error" />} You are leaving a {selectedLabel?.reaction === 'brain' ? 'positive' : 'negative'} review.
                {
                    selectedLabel?.reaction === 'brain' && <Box sx={{ paddingTop: '8px' }}>
                        <Box sx={{paddingBottom: '16px'}}>
                            Select some additional labels that best describe this note (optional).
                        </Box>
                        <TagChipSelect label="Select labels" tags={NOTE_LABELS} selectedTags={selectedLabels} onTagSelect={handleSelectedLabelsChange} />
                    </Box>
                }
                <Stack sx={{ flexWrap: 'wrap' }} direction="row">
                    {/*{*/}
                        {/*LABELS*/}
                            {/*.filter((label: NoteLabel) =>*/}
                                {/*containsTag(event!.tags, ['t', Config.HASHTAG]) ?*/}
                                    {/*!label.name.includes('answer') :*/}
                                    {/*!label.name.includes('question')*/}
                            {/*)*/}
                            {/*.map((item: any, index: number) =>*/}
                            {/*<React.Fragment>*/}
                                {/*<Button*/}
                                    {/*sx={{*/}
                                        {/*background: selectedLabel === item ? 'rgba(152, 149, 0, 0.3)!important' : 'transparent',*/}
                                        {/*margin: '3px',*/}
                                        {/*width: '170px',*/}
                                        {/*textTransform: 'capitalize'*/}
                                    {/*}}*/}
                                    {/*onClick={() => {*/}
                                        {/*setSelectedLabel(item);*/}
                                    {/*}}*/}
                                    {/*variant="outlined"*/}
                                    {/*color="secondary"*/}
                                    {/*startIcon={<React.Fragment>{REACTIONS.find(({name}) => name === item.reaction)?.content}</React.Fragment>}*/}
                                {/*>*/}
                                    {/*{ item.name*/}
                                        {/*.slice(item.name.indexOf('/') + 1)*/}
                                        {/*.replace('_', ' ') }*/}
                                {/*</Button>*/}
                                {/*{*/}
                                    {/*index % 2 === 0 && <Divider component="div" />*/}
                                {/*}*/}
                            {/*</React.Fragment>*/}

                        {/*)*/}
                    {/*}*/}
                    {/*<Divider component="div" />*/}
                    {/*{*/}
                        {/*selectedLabel && <Box sx={{ width: '100%' }}>*/}
                            {/*<Input*/}
                                {/*sx={{ width: '100%' }}*/}
                                {/*id="noteLabelContent"*/}
                                {/*name="noteLabelContent"*/}
                                {/*placeholder={getPlaceholder()}*/}
                                {/*value={content}*/}
                                {/*onChange={(event: any) => {*/}
                                    {/*setContent(event.target.value);*/}
                                {/*}}*/}
                                {/*startAdornment={*/}
                                    {/*<InputAdornment position="start">*/}
                                        {/*<LabelIcon />*/}
                                    {/*</InputAdornment>*/}
                                {/*}*/}
                                {/*{...(content !== '' && { endAdornment:*/}
                                        {/*<InputAdornment position="end" onClick={() => { setContent('') }}>*/}
                                            {/*<CancelIcon />*/}
                                        {/*</InputAdornment>*/}
                                {/*})}*/}
                            {/*/>*/}
                        {/*</Box>*/}
                    {/*}*/}
                </Stack>
                <LoadingDialog open={loading}/>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={() => { onClose && onClose() }}>
                    Close
                </Button>
                <Button
                    disabled={!selectedLabel}
                    variant="contained"
                    onClick={() => {
                        // console.log({selectedLabel})
                        setLoading(true);
                        if (user) label(selectedLabel!.reaction === 'brain' ? Thumb.Up : Thumb.Down, selectedLabel!, event! as NostrEvent, user!.pubkey, content, selectedLabels, () => {
                            setContent('');
                            setEvent(undefined);
                            setLoading(false);
                            setSelectedLabels([]);
                            onClose && onClose();
                        }, () => {
                            setLoading(false);
                        });

                    }}
                >
                    Post
                </Button>
            </DialogActions>
        </Dialog>
    )
};