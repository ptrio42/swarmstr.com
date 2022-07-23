import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export const Footer = () => {
    return (
        <Grid container justifyContent="center" alignContent="center" sx={{ width: '100%', height: '133px', background: '#000', color: '#C0C0C0' }}>
            &copy; 2022 UselessShit.co | &nbsp;<Link href="https://twitter.com/pitiunited" color="inherit">Get in touch</Link>
        </Grid>
    );
};