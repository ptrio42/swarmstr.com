import {FormControl} from "@mui/material";
import {Cancel, Info} from "@mui/icons-material";
import {HexColorPicker} from "react-colorful";
import React, {useEffect, useState} from "react";
import FormLabel from "@mui/material/FormLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ImageCreatorWorkItem} from "../ImageCreatorWorkArea/ImageCreatorWorkArea";
import {useImageCreatorWorkAreaContext} from "../../../providers/ImageCreatorWorkAreaContextProvider";

interface ImageCreatorTextEditProps {
    workItem: ImageCreatorWorkItem;
    onTextChange: (workItem: ImageCreatorWorkItem) => void;
    onRemoveTextItem?: () => void;
}

export const ImageCreatorTextEdit = ({
    onTextChange = (workItem: ImageCreatorWorkItem) => {},
    workItem,
    onRemoveTextItem = () => {}
}: ImageCreatorTextEditProps) => {
    const label = 'simple';

    // const [workItem, setWorkItem] = useState<ImageCreatorWorkItem>(props.workItem);

    const { selectedWorkItem } = useImageCreatorWorkAreaContext();

    // const [text, setText] = useState<string>('');
    // const [fontSize, setFontSize] = useState<number>(18);
    // const [textColor, setTextColor] = useState<string>('#000000');
    // const [textShadow, setTextShadow] = useState<string>('none');

    const [textColorPickerOpen, setTextColorPickerOpen] = useState<boolean>(false);
    const [textShadowColorPickerOpen, setTextShadowColorPickerOpen] = useState<boolean>(false);

    if (!workItem) return <div></div>

    // const createTextItem = () => {
    //     const newItem: ImageCreatorWorkItem = {
    //         id: getRandomInputKey(12),
    //         type: 'text',
    //         content: text,
    //         position,
    //         styles: {
    //             fontSize,
    //             color
    //         }
    //     };
    // }
    //
    // useEffect(() => {
    //     console.log('textChange', {workItem});
    //     onTextChange(workItem);
    // }, [workItem]);
    //
    // useEffect(() => {
    //     if (!workItem) {
    //
    //     }
    // }, []);

    return <React.Fragment>
        <FormControl>
            <FormLabel sx={{ paddingRight: '0.5em', textTransform: 'capitalize', display: 'flex', justifyContent: 'space-between', borderRadius: '4px' }} id={`${label}-text-label`}>
                { label } text
                <Tooltip title={`Add ${label} text`}>
                    {/*<IconButton>*/}
                        {/*<Info />*/}
                    {/*</IconButton>*/}
                    <IconButton onClick={(event: any) => { onRemoveTextItem() }}><Cancel/></IconButton>
                </Tooltip>
            </FormLabel>
            <TextField
                id={`${label}-text`}
                // labelId={`${label}-text-label`}
                name={`${label}-text`}
                type="text"
                label={`Enter ${label} text`}
                value={workItem.content}
                inputProps={{ maxLength: 500 }}
                onChange={(event: any) => { onTextChange({
                    ...workItem,
                    content: event.target.value
                }) }} />
        </FormControl>
        <FormControl>
            <FormLabel id={`${label}-text-size`}>Font size</FormLabel>
            <Select
                labelId={`${label}-font-size-select-label`}
                id="font-size-select"
                value={workItem.styles?.fontSize}
                label="Font size"
                onChange={(_event: any) => {
                    onTextChange({
                        ...workItem,
                        styles: {
                            ...workItem.styles,
                            fontSize: _event.target.value as number
                        }
                    })
                }}
            >
                {
                    Array.from(Array(88), (el, i) => <MenuItem value={i + 12}>{ i + 12 }</MenuItem>)
                }
            </Select>
            {/*<Slider*/}
                {/*aria-label="Primary Text Font Size"*/}
                {/*value={textSize}*/}
                {/*valueLabelDisplay="auto"*/}
                {/*onChange={(_event: any, newSloganFontSize: any) => {*/}
                    {/*handleTextSizeChange(newSloganFontSize as number);*/}
                {/*}}*/}
            {/*/>*/}
        </FormControl>
        <FormControl>
            <FormLabel id={`${label}-text-color`}>Text color </FormLabel>
            <Box sx={{ width: '16px', height: '16px', backgroundColor: workItem.styles?.color, border: '1px solid #000' }} onClick={(event: any) => { setTextColorPickerOpen(true); }}></Box>
            {
                textColorPickerOpen && <HexColorPicker color={workItem.styles?.color} onChange={(color: string) => { onTextChange({
                    ...workItem,
                    styles: {
                        ...workItem.styles,
                        color
                    }
                });
                setTextColorPickerOpen(false);
                }} />
            }
        </FormControl>
        <FormControl>
            <FormLabel id={`${label}-text-color`}>Text shadow color</FormLabel>
            <Box sx={{ width: '16px', height: '16px', backgroundColor: workItem.styles?.textShadow?.split(' ')[3], border: '1px solid #000' }} onClick={(event: any) => { setTextShadowColorPickerOpen(true); }}></Box>
            {
                textShadowColorPickerOpen && <HexColorPicker color={workItem.styles?.textShadow?.split(' ')[3]} onChange={(color: string) => { onTextChange({
                    ...workItem,
                    styles: {
                        ...workItem.styles,
                        textShadow: `1px 1px 2px ${color}`
                    }
                });
                    setTextShadowColorPickerOpen(false);
                }} />
            }
        </FormControl>
    </React.Fragment>
};