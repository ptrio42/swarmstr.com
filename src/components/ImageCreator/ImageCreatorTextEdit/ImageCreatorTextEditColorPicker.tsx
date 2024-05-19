import {HexColorPicker} from "react-colorful";
import {ClickAwayListener, FormControl} from "@mui/material";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import "./ImageCreatorTextEditColorPicker.css";

export const ImageCreatorTextEditColorPicker = ({ selectedColor, onSelectColor = () => {} }: { selectedColor?: string, onSelectColor?: (color: string) => void }) => {

    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>();

    const handleColorChange = (color: string) => {
        onSelectColor(color);
    };

    return <Box>
        <ClickAwayListener onClickAway={() => { setColorPickerOpen(false); }}>
            <Box
                className="textEdit-colorPicker"
                sx={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: selectedColor,
                    border: '1px solid #000'
                }}
                onClick={(event: any) => { setColorPickerOpen(true); }}>
                {
                    colorPickerOpen && <HexColorPicker color={selectedColor} onChange={handleColorChange} />
                }
            </Box>
        </ClickAwayListener>
    </Box>;
}