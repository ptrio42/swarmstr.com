import {CircularProgressProps} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export const CircularProgressWithLabel = (
    props: CircularProgressProps & { value: number },
) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}