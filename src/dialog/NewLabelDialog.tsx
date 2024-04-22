import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import React, {useEffect, useState} from "react";
import {useNostrContext} from "../providers/NostrContextProvider";
import {Dialog} from "@mui/material";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import {containsTag, nFormatter} from "../utils/utils";
import Stack from "@mui/material/Stack";
import {REACTIONS} from "../components/Nostr/Reactions/Reactions";
import Divider from "@mui/material/Divider";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {Cancel as CancelIcon, Label as LabelIcon} from "@mui/icons-material";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import {Config} from "../resources/Config";

interface NewLabelDialogProps {
    open: boolean;
    onClose?: () => void;
    reaction?: string;
    event?: NostrEvent;
    selectedLabelName?: string;
}

export interface NoteLabel {
    name: string;
    reaction: string;
}

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

export const NewLabelDialog = ({ open, onClose, selectedLabelName, event, ...props }: NewLabelDialogProps) => {
    // const [event, setEvent] = useState<NostrEvent|undefined>(props?.event);

    const { label, user, setEvent } = useNostrContext();

    const [selectedLabel, setSelectedLabel] = useState<NoteLabel>();
    const [content, setContent] = useState<string>('');

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

    return (
        <Dialog open={open} onClose={() => onClose && onClose()}>
            <DialogTitle sx={{ color: '#fff' }}>
                Add Label
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ flexWrap: 'wrap' }} direction="row">
                    {
                        LABELS
                            .filter((label: NoteLabel) =>
                                containsTag(event!.tags, ['t', Config.HASHTAG]) ?
                                    !label.name.includes('answer') :
                                    !label.name.includes('question')
                            )
                            .map((item: any, index: number) =>
                            <React.Fragment>
                                <Button
                                    sx={{
                                        background: selectedLabel === item ? 'rgba(152, 149, 0, 0.3)!important' : 'transparent',
                                        margin: '3px',
                                        width: '170px',
                                        textTransform: 'capitalize'
                                    }}
                                    onClick={() => {
                                        setSelectedLabel(item);
                                    }}
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<React.Fragment>{REACTIONS.find(({name}) => name === item.reaction)?.content}</React.Fragment>}
                                >
                                    { item.name
                                        .slice(item.name.indexOf('/') + 1)
                                        .replace('_', ' ') }
                                </Button>
                                {
                                    index % 2 === 0 && <Divider component="div" />
                                }
                            </React.Fragment>

                        )
                    }
                    <Divider component="div" />
                    {
                        selectedLabel && <Box sx={{ width: '100%' }}>
                            <Input
                                sx={{ width: '100%' }}
                                id="noteLabelContent"
                                name="noteLabelContent"
                                placeholder={getPlaceholder()}
                                value={content}
                                onChange={(event: any) => {
                                    setContent(event.target.value);
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LabelIcon />
                                    </InputAdornment>
                                }
                                {...(content !== '' && { endAdornment:
                                        <InputAdornment position="end" onClick={() => { setContent('') }}>
                                            <CancelIcon />
                                        </InputAdornment>
                                })}
                            />
                        </Box>
                    }
                </Stack>
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
                        if (user) label(selectedLabel!, event! as NostrEvent, user!.pubkey, content, () => {
                            setContent('');
                            setEvent(undefined);
                            onClose && onClose();
                        });

                    }}
                >
                    Post
                </Button>
            </DialogActions>
        </Dialog>
    )
};