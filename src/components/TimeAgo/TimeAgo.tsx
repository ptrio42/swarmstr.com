import React from "react";
import {Tooltip} from "@mui/material";
import ReactTimeAgo from "react-time-ago";
import Typography from "@mui/material/Typography";

interface TimeAgoProps {
    timestamp: number;
}

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {

    if (!Number.isInteger(timestamp)) {
        return null;
    }

    return <Typography
        sx={{
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 0
        }}
        color="text.secondary"
        gutterBottom
        component="div"
    >
        <Typography component="div" sx={{ position: 'absolute', top: '0.25em', right: '16px', textAlign: 'end' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: '300', paddingLeft: '8px' }}>
                {
                    <Tooltip title={new Date(timestamp).toLocaleString()}>
                        <ReactTimeAgo date={timestamp} />
                    </Tooltip>
                }
            </Typography>
        </Typography>
    </Typography>
};