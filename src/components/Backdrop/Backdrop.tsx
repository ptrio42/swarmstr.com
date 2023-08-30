import {Box} from "@mui/material";
import React from 'react';
import './Backdrop.css';
import {Config} from "../../resources/Config";

export const Backdrop = ({ open }: any) => {
    const mountedStyle = {
        animation: "inAnimation 250ms ease-in"
    };
    const unmountedStyle = {
        animation: "outAnimation 270ms ease-out",
        animationFillMode: "forwards"
    };

    return (
        <Box className="swarmstrPreloader"
                     style={open ? mountedStyle : unmountedStyle}
                     sx={{
                         width: '100%',
                         height: '100%',
                         position: 'absolute',
                         zIndex: 99999,
                         top: 0,
                         left: 0,
                         backgroundColor: 'rgba(0,0,0,.9)',
                         backdropFilter: 'blur(10px)'
                     }}>
            <Box className="swarmstrPreloaderLogoContainer">
                <img alt={Config.APP_TITLE} src={Config.LOGO_IMG}/>
            </Box>
        </Box>
    );
};