import {useState} from "react";
import {FormControl} from "@mui/material";
import {Info} from "@mui/icons-material";
import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormLabel from "@mui/material/FormLabel";
import Tooltip from "@mui/material/Tooltip";
import { HexColorPicker } from "react-colorful";
import Slider from "@mui/material/Slider";
import {ImageCreatorTextEdit} from "../ImageCreatorTextEdit/ImageCreatorTextEdit";

const DEFAULT_TEXT_SIZE = 21;
const DEFAULT_TEXT_COLOR = '#000';

interface NewTextDialogProps {
    label?: string;
    value?: string;
    onTextChange?: (event: any, size: number, color: string) => void,
    onTextReset?: (event: any) => void,
    open: boolean,
    onClose: (event: any, size: number, color: string) => void,
    defaultTextSize?: number;
    defaultTextColor?: string;
}

export const NewTextDialog = ({
    open,
    label = 'new-text',
    value = '',
    onTextChange = (event: any, size: number, color: string) => {},
    onTextReset = (event: any) => {},
    onClose = () => {},
    defaultTextSize = DEFAULT_TEXT_SIZE,
    defaultTextColor = DEFAULT_TEXT_COLOR
                               }: NewTextDialogProps) => {

    const [textSize, setTextSize] = useState<number>(defaultTextSize);
    const [textColor, setTextColor] = useState<string>(defaultTextColor);
    const [text, setText] = useState<string>('');


    const handleTextSizeChange = (size: number) => {
        setTextSize(size);
    };

    const handleTextReset = (event: any) => {
        onTextReset(event);
    };

    const handleClose = () => {
        onClose({ target: { value: text } }, textSize, textColor);
    };

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Add ${label} text`}</DialogTitle>
        <DialogContent>
            {/*<ImageCreatorTextEdit*/}
                {/*onTextChange={(text: string, fontSize: number, textColor: string, textShadow: string) => {*/}
                    {/*setText(text);*/}
                    {/*setTextSize(fontSize);*/}
                    {/*setTextColor(textColor);*/}
                {/*}}*/}
            {/*/>*/}
        </DialogContent>
    </Dialog>
};