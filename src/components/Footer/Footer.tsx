import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { styled } from "@mui/material";
import Favorite from '@mui/icons-material/Favorite';
import Twitter from '@mui/icons-material/Twitter';
import GitHub from '@mui/icons-material/GitHub';
import './Footer.css';
import Bolt from "@mui/icons-material/Bolt";
import React from "react";
import Box from "@mui/material/Box";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    textAlign: 'center',
    background: 'transparent',
    color: '#FFF'
}));

export const Footer = () => {
    return (
        <Grid
            className="footer"
            container
            direction="column"
            justifyContent="center"
            alignContent="center" sx={{ color: '#C0C0C0' }}>
            <Item>
                &copy; 2023 Swarmstr |&nbsp; <a className="link1" href={`${process.env.BASE_URL}/nostr-address`} target="_blank">Get free nostr address</a>
            </Item>
            <Grid item>
                <Item sx={{ display: 'inline-flex' }}>
                    Made with <Favorite sx={{ color: '#FFA500', margin: 'auto 0.25em' }} /> in Warsaw by <Box className="nostr-icon" sx={{ width: '20px', height: '20px', marginLeft: '0.5em' }}>
                    <img src={`${process.env.BASE_URL}/images/nostr-icon.png`} height={30}/>
                </Box> <Link sx={{ color: '#7139f1' }} href="https://snort.social/p/npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4" target="_blank">pitiunited</Link>
                </Item>
            </Grid>
            {/*<Grid item>*/}
                {/*<Item sx={{ display: 'inline-flex', margin: '1em 0' }}>*/}
                    {/*Check out our <GitHub sx={{ margin: 'auto 0.25em' }} /> <a className="link1" href="https://github.com/ptrio42/uselessshit.co" target="_blank">repository</a>.*/}
                {/*</Item>*/}
            {/*</Grid>*/}
            {/*<Grid item>*/}
                {/*<Item sx={{ display: 'inline-flex' }}>*/}
                    {/*Tips: <Bolt sx={{ color: '#FADA5E' }} /> pitiunited@uselessshit.co | <Link href="https://uselessshit.co/tip-jar/pitiunited">Tip Jar</Link>*/}
                {/*</Item>*/}
            {/*</Grid>*/}
        </Grid>
    );
};