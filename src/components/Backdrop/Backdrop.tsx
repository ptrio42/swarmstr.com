import {Box} from "@mui/material";
import React from 'react';
import './Backdrop.css';

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
                         background: '#000'
                     }}>
            <Box className="swarmstrPreloaderLogoContainer">
                <img alt="Swarmstr: Your knowledge hub for curious minds" src={`${process.env.BASE_URL}/images/swarmstr.png`}/>
            </Box>
        </Box>
    );
};