import {Info} from "@mui/icons-material";
import React from "react";
import {FormControl} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import {ImageFormat} from "../ImageCreator";
import FormControlLabel from "@mui/material/FormControlLabel";
import Badge from "@mui/material/Badge";
import Radio from "@mui/material/Radio";

export const BASE_FORMATS_WIDTH = 400;

interface ImageFormatSelectorProps {
    format?: ImageFormat;
    onFormatChange: (event: any) => void
}

export const ImageFormatSelector = ({ format = ImageFormat.Sticker, onFormatChange = (event: any) => {} }) => {
    return <FormControl>
        <FormLabel id="image-format-label">
            Format
            <Tooltip title="Pick a format for your graphic.">
                <IconButton>
                    <Info />
                </IconButton>
            </Tooltip>
        </FormLabel>
        <RadioGroup
            row
            aria-labelledby="image-format-label"
            value={format}
            onChange={(event: any)  => {
                onFormatChange(event);
            }}
            name="image-format"
            id="image-format"
            sx={{ justifyContent: 'center' }}
        >
            <FormControlLabel value="sticker" control={<Radio />} label="1:1" />
            <FormControlLabel value="christmas-card" control={<Radio />} label="4:3" />
            <FormControlLabel value="business-card" control={<Radio />} label="1:3" />
            <FormControlLabel value="bookmark" control={<Radio />} label="3:1" />
        </RadioGroup>
    </FormControl>
}