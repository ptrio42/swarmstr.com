import React, {useContext} from 'react';
import {Dialog, useTheme} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, SearchContextManager, SearchBar, SearchContext } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
// @ts-ignore
import type { IGif } from '@giphy/js-types'
import './GifDialog.css';

interface GifsProps {
    onGifClick: (url?: string) => void;
}

const Gifs = ({ onGifClick }: GifsProps) => {
    const { fetchGifs, searchKey } = useContext(SearchContext);

    const handleGifClick = (gif: IGif | undefined) => {
        // console.log({gif});
        let url = gif && gif.images.downsized_medium.url;
        url = url && url.slice(0, url.indexOf('?'));
        onGifClick && onGifClick(url);
        console.log({url});
    };

    return (
        <React.Fragment>
            <SearchBar />
            <Grid width={300} columns={3} gutter={6} fetchGifs={fetchGifs} key={searchKey} noLink={true} onGifClick={handleGifClick} />
        </React.Fragment>
    )
};

interface GifDialogProps {
    open: boolean;
    onClose?: (gifUrl?: string) => void;
}

export const GifDialog = ({ open, onClose }: GifDialogProps) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return <Dialog sx={{ marginTop: '12em', minWidth: '300px', minHeight: '180px' }} fullScreen={fullScreen} open={open} onClose={() => { onClose && onClose() }}>
        <SearchContextManager apiKey={process.env.GIPHY_API_KEY as string}>
            <Gifs onGifClick={(gifUrl?: string) => { onClose && onClose(gifUrl) }}/>
        </SearchContextManager>
    </Dialog>;
};