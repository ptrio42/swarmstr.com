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
    return (
        <Box className={ isLoading ? 'animationContainer' : 'staticImageContainer' }>
            {/*{*/}
                {/*isLoading &&*/}
                <Box className={`animationImageContainer ${isLoading ? 'dataSyncInProgress' : '' }`}>
                    <img
                        width="50px"
                        alt={isLoading ? 'Syncing data...' : 'Swarmstr'}
                        src={Config.LOGO_IMG}
                    />
                </Box>
            {/*}*/}
            {/*{*/}
                {/*!isLoading && <Box className="staticLogoContainer">*/}
                        {/*<img*/}
                            {/*width="72px"*/}
                            {/*className="staticImage"*/}
                            {/*alt={'Swarmstr'}*/}
                            {/*src={Config.LOGO_IMG}*/}
                        {/*/>*/}
                    {/*</Box>*/}
            {/*}*/}
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