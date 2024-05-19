import {TAG_EMOJIS} from "../NoteTags/NoteTags";
import React from "react";
import {FormControl, SelectChangeEvent} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import { NDKTag } from "@nostr-dev-kit/ndk";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface TagChipSelectProps {
    tags?: string[],
    // selectedTag?: string,
    selectedTags?: string[],
    onTagSelect?: (event: SelectChangeEvent<string|string[]>) => void,
    label?: string
}

export const TagChipSelect = ({ tags = [], label = 'Select tags', onTagSelect = (event: SelectChangeEvent<string|string[]>) => {}, selectedTags = [] }: TagChipSelectProps) => {
    return <Box sx={{ marginLeft: '24px', minWidth: '360px' }}>
        <FormControl>
            <InputLabel id="tags-chip-label">{label}</InputLabel>
            <Select
                sx={{ width: '94%' }}
                labelId="tags-chip-label"
                id="tags-chip"
                label={'Tags'}
                multiple
                color={'primary'}
                value={selectedTags}
                onChange={onTagSelect}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: string) => (
                            <Chip size={'small'} key={value} label={`${TAG_EMOJIS[value] ? TAG_EMOJIS[value] : '#️⃣'} ${value}`} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {tags.map((tag) => (
                    <MenuItem
                        key={tag}
                        value={tag}
                    >
                        {tag}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
};