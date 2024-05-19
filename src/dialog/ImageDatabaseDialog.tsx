import {Box, DialogContent} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import ImageListItem from "@mui/material/ImageListItem";
import {useEffect, useState} from "react";
import {SearchBar} from "../components/SearchBar/SearchBar";
import React from "react";
import {request} from "../services/request";
import InfiniteScroll from "react-infinite-scroll-component";
import {Cancel} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const ITEMS_PER_PAGE = 20;

export const ImageDatabaseDialog = ({ open, onClose = () => {} }: { open: boolean, onClose?: (imageUrl?: string) => void }) => {

    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalImages, setTotalImages] = useState<number>(0);

    const handleClose = () => {
        onClose();
    };

    const searchImages = () => {
        if (query === '') return;
        setLoading(true);

        request({
            url: `${process.env.BASE_URL}/api/images/${encodeURIComponent(query)}/${page}`
        }).then((response: any) => {
            console.log('ImageDBDialog response', {response})
            setImages((prevState) => prevState.length > 0 ? [
                ...prevState,
                ...response.data.hits
            ]: response.data.hits);
            setTotalImages(response.data.totalHits);
            setLoading(false);
        })
    };

    const onScrollEnd = () => {
        console.log('ImageDbDialog: reached scroll end');
        setPage(page + 1);
    };

    useEffect(() => {
        setImages([]);
        setPage(1);
        setTotalImages(0);
        searchImages();
    }, [query]);

    useEffect(() => {
        searchImages();
    }, [page])

    useEffect(() => {
        console.log('ImageDbDialog: totalImages', {totalImages});
    }, [totalImages]);

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Search image database <IconButton onClick={() => { onClose() }}><Cancel/></IconButton></DialogTitle>
        <DialogContent>
            <SearchBar
                showSearchBarOptions={false}
                placeholder={`Search...`}
                isQuerying={loading}
                query={query}
                onQueryChange={(event: any) => {
                    setQuery(event.target.value);
                }}
            />
            {/*<InfiniteScroll*/}
                {/*dataLength={5}*/}
                {/*next={onScrollEnd}*/}
                {/*hasMore={true}*/}
                {/*loader={<Box sx={{ display: 'none' }}>Loading...</Box>}*/}
                {/*endMessage={*/}
                    {/*<p style={{ textAlign: 'center' }}>*/}
                        {/*<b>No more results.</b>*/}
                    {/*</p>*/}
                {/*}*/}
            {/*>*/}
                <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={3} gap={8}>
                    {images && images.map((item) => (
                        <ImageListItem  onClick={() => {
                            onClose(item.largeImageURL);
                        }} key={item.id}>
                            <img
                                srcSet={`${item.previewURL}?w=161&fit=crop&auto=format&dpr=2 2x`}
                                src={item.previewURL}
                                alt={item.tags}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                    {
                        images.length < totalImages && <ImageListItem cols={3}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {
                                    <Button sx={{ marginBottom: '1em' }} variant="contained" color="primary" onClick={() => { setPage(page + 1) }}>Load more</Button>
                                }
                            </Box>
                        </ImageListItem>
                    }
                </ImageList>

            {/*</InfiniteScroll>*/}
        </DialogContent>
    </Dialog>
};