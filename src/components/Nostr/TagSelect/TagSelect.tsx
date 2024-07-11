import {SelectChangeEvent} from "@mui/material";
import {Config} from "../../../resources/Config";
import * as React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import './TagSelect.css';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface TagSelectProps {
    tags?: string[],
    selectedTag?: string,
    onTagSelect?: (event: SelectChangeEvent) => void,
    label?: string;
    displayHash?: boolean;
}

export const TagSelect = ({ tags = [], onTagSelect = (event: SelectChangeEvent) => {}, selectedTag = '', label = 'Browse tags', displayHash = true }: TagSelectProps) => {
    return <FormControl sx={{ minWidth: '140px', width: 'auto!important' }}>
        <InputLabel id="select-tag-label">{ label }</InputLabel>
        <Select
            id="select-tag"
            labelId="select-tag-label"
            className="select-tag"
            color="secondary"
            sx={{ padding: 0 }}
            value={selectedTag}
            label="Browse tags"
            onChange={onTagSelect}
        >
            {
                tags.map((tag: string) => <MenuItem value={tag}>{ displayHash && '#' }{tag}</MenuItem>)
            }
        </Select>
    </FormControl>
};