import {Box} from "@mui/material";
import React from "react";
import "./Image.css";

interface ImageProps {
    url: string;
    alt?: string;
}

export const Image = ({ url, alt }: ImageProps) => {
    return <Box className="imagePreviewContainer">
        <img className="imagePreview" src={url} />
    </Box>
};