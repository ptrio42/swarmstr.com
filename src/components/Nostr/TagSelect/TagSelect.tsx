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
    formatLabelFn?: (item: string) => string;
}

export const TagSelect = ({ tags = [], onTagSelect = (event: SelectChangeEvent) => {}, selectedTag = '', label, displayHash = true, formatLabelFn }: TagSelectProps) => {
    return <FormControl sx={{ minWidth: '140px', width: 'auto!important' }}>
        { label && <InputLabel id="select-tag-label">{ label }</InputLabel> }
        <Select
            id="select-tag"
            className="select-tag"
            color="secondary"
            sx={{ padding: 0 }}
            value={selectedTag}
            onChange={onTagSelect}
            { ... label && { label, labelId: 'select-tag-label' }}
        >
            {
                tags.map((tag: string) => <MenuItem value={tag}>{ displayHash && '#' }{formatLabelFn ? formatLabelFn(tag) : tag}</MenuItem>)
            }
        </Select>
    </FormControl>
};