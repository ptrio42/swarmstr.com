import React from "react";
import {Button} from "@mui/material";
import Chip from "@mui/material/Chip";

interface ImageActionButtonProps {
    position: { left: string, bottom: string }
    children: any;
    onAction?: (event: any) => void
}

export const ImageActionButton = ({ position = { left: '0px', bottom: '0px' }, children, onAction = (event: any) => {} }: ImageActionButtonProps) => {
    const { left, bottom } = position;

    return <Chip color="primary" size="small" onClick={onAction} sx={{ position: 'absolute', left, bottom, zIndex: 999 }} label={children} />
};