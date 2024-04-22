import React from 'react';
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Config} from "../../resources/Config";
import "./LoadingAnimation.css"

interface LoadingAnimationProps {
    isLoading: boolean;
    loadingText?: string;
}

export const LoadingAnimation = ({ isLoading, loadingText }: LoadingAnimationProps) => {
    if (!isLoading) return <div></div>;

    return (
        <Box className="animationContainer" sx={{ margin: '1em' }}>
            <Box className="animationImageContainer" sx={{ width: '128px' }}>
                <img
                    width="72px"
                    className="loadingImage"
                    alt={'Loading...'}
                    src={Config.LOGO_IMG}
                />
            </Box>
            {
                loadingText && loadingText !== '' && <Typography
                    sx={{ paddingLeft: '21px' }}
                    component="div"
                    variant="body1"
                >
                    { loadingText }
                </Typography>
            }
        </Box>
    );
};