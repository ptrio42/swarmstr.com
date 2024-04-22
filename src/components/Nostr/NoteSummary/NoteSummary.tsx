import React from "react";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";

interface NoteSummaryProps {
    content?: string;
}

export const NoteSummary = ({ content }: NoteSummaryProps) => {
    if (!content || content === '') {
        return null;
    }

    return <Tooltip title="This summary was automatically generated based on the note text.">
        <Box sx={{ fontWeight: 'bold', marginBottom: '7px' }}>{content}</Box>
    </Tooltip>
};