import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import styled from "@mui/material/styles/styled";
import Favorite from '@mui/icons-material/Favorite';
import Twitter from '@mui/icons-material/Twitter';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    textAlign: 'center',
    background: 'transparent',
    color: '#C0C0C0'
}));

export const Footer = () => {
    return (
        <Grid container direction="column" justifyContent="center" alignContent="center" sx={{ width: '100%', height: '133px', background: '#000', color: '#C0C0C0' }}>
            <Item>
                &copy; 2022 UselessShit.co |&nbsp; <a className="link1" href="https://opensource.org/licenses/MIT" target="_blank">License</a>
            </Item>
            <Grid item>
                <Item sx={{ display: 'inline-flex' }}>
                    Made with <Favorite sx={{ color: '#FFA500', margin: 'auto 0.25em' }} /> in Warsaw by <Twitter sx={{ color: '#1976D2', margin: 'auto 0.25em' }} /> <Link href="https://twitter.com/pitiunited" target="_blank">pitiunited</Link>
                </Item>
            </Grid>
        </Grid>
    );
};