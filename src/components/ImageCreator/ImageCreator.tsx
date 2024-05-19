import React, {createRef, RefObject, useEffect, useRef, useState} from 'react';
import {Box, styled} from "@mui/material";
import { jsPDF } from 'jspdf';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useFormik} from "formik";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import {LightningGift} from "../LightningGift/LightningGift";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import QRCode from "react-qr-code";
import html2canvas from 'html2canvas';
import {LoadingAnimation} from "../LoadingAnimation/LoadingAnimation";
import './ImageCreator.css';
import {Helmet} from "react-helmet";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
// TODO: clean up after react-color
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {Info} from "@mui/icons-material";
import Slider from "@mui/material/Slider";
import Badge from "@mui/material/Badge";
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {cropImage, resizeImage} from "../../services/cardGenerator";
import {LatestBitcoinBlock} from "../LatestBitcoinBlock/LatestBitcoinBlock";
import Snackbar from "@mui/material/Snackbar";
import {useWindowDimensions} from "../../utils/utils";
import {renderToStaticMarkup} from "react-dom/server";
import {BASE_FORMATS_WIDTH, ImageFormatSelector} from "./ImageFormatSelector/ImageFormatSelector";
import {ImageActionButton} from "./ImageActionButton/ImageActionButton";
import {NewImageDialog} from "./NewImageDialog/NewImageDialog";
import {NewTextDialog} from "./NewTextDialog/NewTextDialog";
import {
    DEFAULT_ITEM_POSITION,
    ImageCreatorWorkArea,
    ImageCreatorWorkItem,
    ImageCreatorWorkItemPosition
} from "./ImageCreatorWorkArea/ImageCreatorWorkArea"
import {useImageCreatorWorkAreaContext} from "../../providers/ImageCreatorWorkAreaContextProvider";
import {LoadingDialog} from "../../dialog/LoadingDialog";

export enum ImageFormat {
    BusinessCard = 'business-card',
    Bookmark = 'bookmark',
    Sticker = 'sticker',
    ChristmasCard = 'christmas-card',
    Auto = 'auto',

    // BannerImage = 'banner'
}

interface ImageConfig {
    [key: string]: {
        format: number[],
        orientation: 'p' | 'l' | 'portrait' | 'landscape',
        primaryImageFormat?: number[],
        secondaryImageFormat?: number[],
        qrCodeSize: number,
        maxCopies: number
    }
}

const imagesConfig: ImageConfig = {
    [ImageFormat.BusinessCard]: {
        format: [2, 1],
        orientation: 'landscape',
        primaryImageFormat: [0.75, 0.75],
        secondaryImageFormat: [0.75, 0.75],
        qrCodeSize: 144,
        maxCopies: 9
    },
    [ImageFormat.Bookmark]: {
        format: [1, 3],
        orientation: 'portrait',
        primaryImageFormat: [0.75, 0.75],
        secondaryImageFormat: [0.75, 0.75],
        qrCodeSize: 144,
        maxCopies: 5
    },
    [ImageFormat.Sticker]: {
        format: [1, 1],
        orientation: 'landscape',
        primaryImageFormat: [1, 1],
        secondaryImageFormat: [1, 1],
        qrCodeSize: 192,
        maxCopies: 6
    },
    [ImageFormat.ChristmasCard]: {
        format: [3, 4],
        orientation: 'portrait',
        primaryImageFormat: [1.5, 1.5],
        secondaryImageFormat: [1.5, 1.5],
        qrCodeSize: 288,
        maxCopies: 2
    },
    // [ImageFormat.BannerImage]: {
    //     format: [15.625, 5.2083333333],
    //     orientation: 'landscape',
    //     primaryImageFormat: [1.5, 1.5],
    //     secondaryImageFormat: [1.5, 1.5],
    //     qrCodeSize: 144,
    //     maxCopies: 1
    // }
};

interface ImageProps {
    slogan: string;
    sloganColor: string;
    sloganFontSize: number;
    sloganTextShadow: boolean;
    sloganTextShadowColor: string;
    mainImage: any;
    backgroundImage?: any;
    backgroundImageSize: number;
    satsAmount?: number;
    copies: number;
    type: ImageFormat;
    footer: string;
    footerColor: string;
    footerFontSize: number;
    receiveAddress?: string;
    config: any;
    overlay?: boolean;
    overlayColor?: string;
    latestBlock?: boolean;
    hideNonEssentials?: boolean;
}

const initialImageProps: ImageProps = {
    slogan: '',
    sloganColor: '#000000',
    sloganFontSize: 14,
    sloganTextShadow: false,
    sloganTextShadowColor: '#000000',
    // mainImage: new Image().src = process.env.PUBLIC_URL + '/images/bitcoin.png',
    mainImage: null,
    satsAmount: 0,
    copies: 1,
    backgroundImage: null,
    backgroundImageSize: 100,
    type: ImageFormat.Sticker,
    footer: '',
    footerColor: '#1B3D2F',
    footerFontSize: 10,
    receiveAddress: '',
    config: { ...imagesConfig[ImageFormat.Sticker] },
    overlay: false,
    overlayColor: 'rgba(255,255,255,.8)',
    hideNonEssentials: true
};

const PAGE_FORMAT = {
    WIDTH: 11.7,
    HEIGHT: 8.3
};

const PPI = 96;

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const ImageCreator = ({
        onSaveImage = () => {},
        onAddImageToNote = () => {},
        onClose = () => {}
    }: {
        onSaveImage: (imageData: string) => void,
        onAddImageToNote?: (image: any) => void,
        onClose?: () => void
    }) => {
    const [imageProps, setImageProps] = useState<ImageProps>({ ...initialImageProps });

    // const [includeLightningGift, setIncludeLightningGift] = useState(false);

    const [lnurls, setLnurls] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [qrCodeRefs, setQrCodeRefs] = useState<RefObject<unknown>[]>([]);

    // const { width, height } = useWindowDimensions();

    const getScale = () => {
        return 1;
        // return Math.floor(((width - 173) / PPI / imagesConfig[imageProps.type].format[0]) * 100);
    };

    const imageRef = useRef<any>();

    const [crop, setCrop] = useState<Crop|undefined>();

    // const maxCopiesInARow = Math.floor(PAGE_FORMAT.WIDTH / imageProps.config.format[0]);

    const [mainImageInputKey, setMainImageInputKey] = useState<string>();
    const [backgroundImageInputKey, setBackgroundImageInputKey] = useState<string>();

    const getRandomInputKey = () => {
        return Math.random().toString(36);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [newBackgroundImageDialogOpen, setNewBackgroundImageDialogOpen] = useState<boolean>(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [imagePosition, setImagePosition] = useState<ImageCreatorWorkItemPosition>(DEFAULT_ITEM_POSITION);

    const { workItems, selectWorkItem, addOrEditWorkItem, selectedWorkItem } = useImageCreatorWorkAreaContext();

    // useEffect(() => {
    //     setQrCodeRefs((qrCodeRefs) =>
    //         Array(imageProps.copies)
    //             .fill(undefined)
    //             .map((_, i) => qrCodeRefs[i] || createRef())
    //     );
    // }, [imageProps.copies]);

    useEffect(() => {
        setImageProps((props) => ({
            ...props,
            config: { ...imagesConfig[props.type] },
            receiveAddress: '',
            // copies: 1,
        }));
        // setIncludeLightningGift(false);
    }, [imageProps.type]);

    useEffect(() => {
        const crop: Crop = {
            unit: 'px',
            x: 0,
            y: 0,
            width: (imageRef.current?.offsetWidth || 0) * 0.75,
            height: imageProps.config.format[1]/imageProps.config.format[1]*((imageRef.current?.offsetWidth || 0) * 0.75)
        };
        setCrop(crop);
    }, [imageProps.config]);

    const formik = useFormik({
        initialValues: {
            ...initialImageProps
        },
        onSubmit: (values) => {
            setImageProps({
                ...imageProps,
                slogan: values.slogan
            });
        }
    });

    const handleNewBackgroundImageDialogOpen = (event: any) => {
        // console.log('display add image dialog')
        setNewBackgroundImageDialogOpen(true);
    };

    const handleNewBackgroundImageDialogClose = () => {
        setNewBackgroundImageDialogOpen(false);
    };

    const handleImageChange = (event: any, item: ImageCreatorWorkItem) => {
        console.log('display add image dialog')
        const {
            content,
            position
        } = item;
        setImagePosition(position);
        setImageProps({
            ...imageProps,
            mainImage: content
        });
        // setNewForegroundImageDialogOpen(true);
    };

    // const handleNewForegroundImageDialogClose = () => {
    //     setNewForegroundImageDialogOpen(false);
    // };

    // const handleNewTextDialogOpen = (event: any, item: ImageCreatorWorkItem) => {
    //     // setNewTextDialogOpen(true);
    // };

    const handleTextChange = (event: any, item: ImageCreatorWorkItem) => {
        // const {
        //     content,
        //     position,
        //     styles: {
        //         fontSize,
        //         color
        //     }
        // } = item;
        // formik.handleChange(event);
        // setImageProps({
        //     ...imageProps,
        //     slogan: content,
        //     sloganFontSize: fontSize,
        //     sloganColor: color
        // });
        // setTextPosition(position);
    };

    // const handleNewTextDialogClose = (event: any, size: number, color: string) => {
    //     handleNewTextChange(event, size, color);
    //     setNewTextDialogOpen(false);
    // };

    // const handleEditText = (event: any) => {
    //     setNewTextDialogOpen(true);
    // };
    //
    // const handleEditImage = (event: any) => {
    //     setNewForegroundImageDialogOpen(true);
    // };

    const getImagePreviewBackgroundSize = () => {
        if (imageProps.backgroundImage) {
            const {
                backgroundImage: {
                    naturalWidth,
                    naturalHeight
                }
            } = imageProps;
            return `${BASE_FORMATS_WIDTH+4}px ${((BASE_FORMATS_WIDTH+4) * (naturalHeight / naturalWidth))+50}px`
        }
        // if (imageProps.backgroundImage) {
        //     return imageProps.backgroundImageSize / 100 * imageProps.backgroundImage.naturalWidth + 'px'
        //         + ' ' + imageProps.backgroundImageSize / 100 * imageProps.backgroundImage.naturalHeight + 'px';
        // }
        return '100% 100%';
    };

    const getWorkAreaBaseHeight = () => {
        if (imageProps.backgroundImage) {
            const {
                backgroundImage: {
                    naturalWidth,
                    naturalHeight
                }
            } = imageProps;
            return BASE_FORMATS_WIDTH * (naturalHeight/naturalWidth)
        }
        const { config: { format: [x, y] } } = imageProps;
        return BASE_FORMATS_WIDTH * (x/y)
    };

    const cardHTML = <ImageCreatorWorkArea
        onAddText={handleTextChange}
        onAddImage={handleImageChange}
        onImageReset={() => {
            setImageProps({
                ...imageProps,
                mainImage: null,
            });
        }}
    >
        <Card className="imageCreator-image" ref={imageRef as any} elevation={0} sx={{
                width: `${BASE_FORMATS_WIDTH}px`,
                height: `${getWorkAreaBaseHeight()}px`,
                margin: '0 auto 3em auto',
                background: imageProps.backgroundImage ? `url(${imageProps.backgroundImage.src})` : 'none',
                backgroundSize: 'contain',
                // backgroundSize: getImagePreviewBackgroundSize(),
                backgroundRepeat: 'no-repeat',
                // backgroundPositionY: imageProps.type === ImageFormat.Bookmark ? '2in' : '0',
                // backgroundPosition: '-2px -2px',
                borderRadius: '0px',
                border: imageProps.backgroundImage?.src ? 'none' : '1px dashed #3c3c3c',
                boxShadow: 'none!important',
                position: 'relative',
                transition: 'none!important',
                padding: '0!important'
            }}>
                {
                    !isProcessing && <React.Fragment>
                        <ImageActionButton
                            position={{ left: '10px', bottom: '10px' }}
                            onAction={handleNewBackgroundImageDialogOpen}
                        >
                            { imageProps.backgroundImage ? 'Edit': 'Add' } background
                        </ImageActionButton>
                    </React.Fragment>
                }

                <Box sx={{
                    width: imageProps.overlay ? '90%' : '100%',
                    height: imageProps.overlay ? '90%' : '100%',
                    background: imageProps.overlay ? imageProps.overlayColor : 'transparent',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: imageProps.type === ImageFormat.BusinessCard ? 'center' : 'flex-start' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {/*<CardMedia*/}
                            {/*component="img"*/}
                            {/*sx={{*/}
                                {/*position: 'absolute',*/}
                                {/*zIndex: 999,*/}
                                {/*width: `43%`,*/}
                                {/*// height: `${imageProps.config.primaryImageFormat[1] * getScale()}%`,*/}
                                {/*objectFit: 'fill',*/}
                                {/*left: imagePosition.x,*/}
                                {/*top: imagePosition.y,*/}
                                {/*transform: 'translate(-50%, -50%)'*/}
                            {/*}}*/}
                            {/*image={imageProps.mainImage}*/}
                            {/*// onClick={handleEditImage}*/}
                        {/*/>*/}
                        {/*{*/}
                            {/*(includeLightningGift || (imageProps.type === CardType.Sticker && imageProps.receiveAddress && imageProps.receiveAddress !== '')) &&*/}
                            {/*<Box*/}
                                {/*sx={{*/}
                                    {/*width: `${imageProps.config.secondaryImageFormat[0] * getScale()}in`,*/}
                                    {/*height: `${imageProps.config.secondaryImageFormat[1] * getScale()}in`,*/}
                                    {/*marginLeft: '0.1in',*/}
                                    {/*marginTop: '0.15in',*/}
                                    {/*overflow: 'hidden',*/}
                                    {/*border: '0.1in #fff solid',*/}
                                    {/*borderRadius: '5px'*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{*/}
                                    {/*Array(imageProps.copies).fill(undefined).map((_, i) => (*/}
                                        {/*<Box*/}
                                            {/*sx={{*/}
                                                {/*width: `${imageProps.config.secondaryImageFormat[0] * getScale()}in`,*/}
                                                {/*height: `${imageProps.config.secondaryImageFormat[1] * getScale()}in`,*/}
                                                {/*margin: '0',*/}
                                                {/*padding: '0'*/}
                                            {/*}}*/}
                                            {/*ref={qrCodeRefs[i]}*/}
                                        {/*>*/}
                                            {/*<img width="100%" height="100%" src={ 'data:image/svg+xml,' + escape(renderToStaticMarkup((<QRCode size={imageProps.config.qrCodeSize} value={lnurls[i] || imageProps.receiveAddress || '' } />))) }/>*/}
                                        {/*</Box>*/}
                                    {/*))*/}
                                {/*}*/}
                            {/*</Box>*/}
                        
                        {/*}*/}
                        { imageProps.latestBlock &&
                        <Box sx={{
                            position: 'absolute',
                            top: '0.05in',
                            left: '0.05in',
                            fontWeight: 'bold'
                        }}>
                            <LatestBitcoinBlock />
                        </Box>
                        }
                    </Box>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            workItems
                                .map((workItem: ImageCreatorWorkItem, i: number) => workItem.type === 'text' ?
                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            zIndex: 999 + i,
                                            fontSize: `${workItem.styles.fontSize}px`,
                                            color: workItem.styles.color,
                                            left: (selectedWorkItem && selectedWorkItem.id === workItem.id) ? selectedWorkItem.position.x : workItem.position.x,
                                            top: (selectedWorkItem && selectedWorkItem.id === workItem.id) ? selectedWorkItem.position.y : workItem.position.y,
                                            overflow: 'hidden', overflowWrap: 'break-word',
                                            textShadow: workItem.styles?.textShadow,
                                            transform: 'translate(-50%, -50%)',
                                            width: '100%',
                                            textAlign: 'center',
                                            border: (selectedWorkItem && selectedWorkItem.id === workItem.id) ? '2px solid #F0E68C' : 'none',
                                            borderRadius: '3px',
                                            background: workItem.styles?.background || 'transparent',
                                            padding: '0 1em'
                                        }}
                                        onClick={() => {
                                            (selectedWorkItem && selectedWorkItem.id === workItem.id) ? addOrEditWorkItem({
                                                ...selectedWorkItem,
                                                selected: false
                                            }) : selectWorkItem(workItem)
                                        }}
                                    >
                                {
                                    workItem.content
                                }
                            </Typography> : <Box sx={{
                                        position: 'absolute',
                                        zIndex: 1000 + i,
                                        width: workItem.styles?.width,
                                        transform: 'translate(-50%, -50%)',
                                        border: workItem.content === '' ? '1px #000 solid' : '',
                                        left: (selectedWorkItem && selectedWorkItem.id === workItem.id) ? selectedWorkItem.position.x : workItem.position.x,
                                        top: (selectedWorkItem && selectedWorkItem.id === workItem.id) ? selectedWorkItem.position.y : workItem.position.y,
                                    }}
                                                 onClick={() => {
                                                     (selectedWorkItem && selectedWorkItem.id === workItem.id) ? addOrEditWorkItem({
                                                         ...selectedWorkItem,
                                                         selected: false
                                                     }) : selectWorkItem(workItem)
                                                 }}
                                                 onMouseEnter={() => {
                                                     console.log('ImageCreator: enter')
                                                 }}
                                                 onMouseLeave={() => {
                                                     console.log('ImageCreator: leave')
                                                 }}
                                    >
                                        <img src={workItem.content} width="100%" />
                                    </Box>
                                )
                        }
                    </CardContent>
                    <CardActions>
                        <Typography sx={{ fontSize: `${imageProps.footerFontSize * getScale()}px`, color: imageProps.footerColor }}>
                            { imageProps.footer }
                        </Typography>
                    </CardActions>
                </Box>
    </Card></ImageCreatorWorkArea>;

    // const getCardFormat = () => {
    //     return imageProps.config.format;
    //     // const format = imageProps.config.format;
    //     // const columns = imageProps.copies > maxCopiesInARow ? maxCopiesInARow : imageProps.copies;
    //     // const rows = Math.ceil(imageProps.copies / columns);
    //     //
    //     // return [
    //     //     format[0] * columns,
    //     //     format[1] * rows
    //     // ];
    // };

    // const getRowAndColumnNo = (copyNo: number): { rowNo: number, columnNo: number } => {
    //     const rowNo = Math.ceil(copyNo / maxCopiesInARow);
    //     const columnNo = copyNo > maxCopiesInARow ? copyNo - (maxCopiesInARow * (rowNo - 1)) : copyNo;
    //     return {
    //         rowNo, columnNo
    //     };
    // };

    // const getMainImagePosition = (iterator: number) => {
    //     const position = createPosition();
    //     const format = imageProps.config.format;
    //
    //     const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);
    //
    //     position.x = (columnNo * format[0] - (format[0] / 2));
    //     position.y = format[1] * (rowNo - 1) + 0.375;
    //
    //     if (includeLightningGift || (imageProps.type === CardType.Sticker && imageProps.receiveAddress)) {
    //         position.x -= (imageProps.config.primaryImageFormat[0] + 0.05);
    //     } else {
    //         position.x -= imageProps.config.primaryImageFormat[0] / 2;
    //     }
    //     return position;
    // };

    // const createPosition = (x: number = 0, y: number = 0) => {
    //     return {
    //         x, y
    //     };
    // };

    // const getBackgroundImagePosition = (iterator: number) => {
    //     const position = createPosition();
    //     const format = imageProps.config.format;
    //
    //     const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);
    //
    //     position.x = (columnNo - 1) * format[0];
    //     position.y = format[1] * (rowNo - 1);
    //
    //     return position;
    // };

    // const getQrCodeImagePosition = (iterator: number) => {
    //     let { x, y } = getMainImagePosition(iterator);
    //     x += imageProps.config.primaryImageFormat[0] + 0.1;
    //     return { x, y };
    // };

    // const getMainTextPosition = (iterator: number) => {
    //     const position = createPosition();
    //     const format = cardsConfig[imageProps.type].format;
    //     const mainImagePosition = getMainImagePosition(iterator);
    //     const mainImageFormat = imageProps.config.primaryImageFormat[1];
    //     const relativeTextPosition = mainImagePosition.y + mainImageFormat;
    //
    //     const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);
    //
    //     position.x = columnNo * format[0] - (format[0] / 2);
    //     position.y = (relativeTextPosition + 0.25);
    //     return position;
    // };

    // const getSecondaryTextPosition = (iterator: number) => {
    //     const position = createPosition();
    //     const format = imageProps.config.format;
    //
    //     const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);
    //
    //     position.x = columnNo * format[0] - (format[0] / 2);
    //     position.y = rowNo * format[1] - 0.3;
    //     return position;
    // };

    // const getOverlayPosition = (iterator: number) => {
    //     const position = createPosition();
    //     const format = imageProps.config.format;
    //
    //     const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);
    //
    //     position.x = (columnNo - 1) * format[0] + 0.15;
    //     position.y = format[1] * (rowNo - 1) + 0.15;
    //
    //     return position;
    // };

    const htmlToCanvas = async (): Promise<HTMLCanvasElement> => {
        // setTimeout(async () => {
            const cardElement: HTMLElement = imageRef.current as unknown as HTMLElement;
            const cardCanvas = await html2canvas(cardElement, {
                scale: 5,
                removeContainer: true,
                foreignObjectRendering: false,
                backgroundColor: null,
                // copyStyles: true
            });
            return cardCanvas;
        // });
    };

    const downloadCardAsImage = async () => {
        setIsProcessing(true);
        setTimeout(async () => {
            const canvas = await htmlToCanvas();
            const imageData = canvas.toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            console.log('imageData', imageData);
            onSaveImage(imageData as string);
            setIsProcessing(false);
        });

    };

    const addImageToNote = async () => {
        setIsProcessing(true);
        setTimeout(async () => {
            const canvas = await htmlToCanvas();
            canvas.toBlob((file: any) => {
                console.log('imageBlob', file);
                // setTimeout(() => {
                onAddImageToNote(file);
                setIsProcessing(false);
                // })
            }, 'image/png');

        });

    };

    // const uploadToNostrBuild = async () => {
    //     handleIsLoading(true);
    //     const cardElement: HTMLElement = cardRef.current as unknown as HTMLElement;
    //     const cardCanvas = await html2canvas(cardElement);
    //
    //     cardCanvas.toBlob(async (blob: any) => {
    //         // const imageFile = new File([blob], "fileName.png", { type: "image/png" });
    //         // const formData = new FormData();
    //         // formData.append('fileToUpload', imageFile);
    //         // formData.append('submit', 'Upload Image');
    //         // const response = await uploadImage(formData);
    //         //
    //         // const regExp = new RegExp(/(https?:\/\/[^ ]*)/, 'g');
    //         // let imageUrl: string = response.match(regExp)[9];
    //         // imageUrl = imageUrl.slice(0, imageUrl.indexOf('\"'));
    //         // handleIsLoading(false);
    //         // setSnackbarMessage('Upload successfull! Image URL: ' + imageUrl);
    //         // setSnackbarOpen(true);
    //     }, 'image/png');
    //
    // };

    // const downloadCardAsPDF = async () => {
    //     const cardFormat = getCardFormat();
    //     const card = new jsPDF({
    //         orientation: (imageProps.type === 'bookmark'
    //             && imageProps.copies > 2) || (cardProps.type === CardType.ChristmasCard && cardProps.copies > 1) ?
    //             'landscape' :
    //             cardsConfig[cardProps.type].orientation,
    //         unit: 'in',
    //         format: cardFormat
    //     });
    //     handleIsLoading(true);
    //
    //     let backgroundImage = new Image();
    //     if (cardProps.backgroundImage) {
    //         // resize bg image begin
    //         const backgroundImageBase64 = cardProps.backgroundImage.src;
    //         const resizedImageBase64 = await resizeImage(
    //             backgroundImageBase64,
    //             cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.width,
    //             cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.height
    //         );
    //
    //         // resize bg image end
    //
    //         if (resizedImageBase64) {
    //             // crop bg image begin
    //             const croppedImageBase64 = await cropImage(resizedImageBase64 as string, crop);
    //             if (croppedImageBase64) {
    //                 backgroundImage.src = croppedImageBase64 as string;
    //             }
    //         }
    //         // crop bg image end
    //     }
    //
    //     for (let i = 0; i < cardProps.copies; i++) {
    //         if (cardProps.backgroundImage) {
    //             const backgroundImagePosition = getBackgroundImagePosition(i);
    //             card.addImage({
    //                 imageData: backgroundImage.src,
    //                 x: backgroundImagePosition.x,
    //                 y: backgroundImagePosition.y,
    //                 width: cardsConfig[cardProps.type].format[0],
    //                 height: cardsConfig[cardProps.type].format[1]
    //             });
    //         }
    //
    //         if (cardProps.overlay) {
    //             const overlayPosition = getOverlayPosition(i);
    //             card.saveGraphicsState();
    //             // @ts-ignore
    //             card.setGState(new card.GState({opacity: 0.8}));
    //             card.setFillColor(255, 255, 255);
    //             card.rect(
    //                 overlayPosition.x,
    //                 overlayPosition.y,
    //                 cardsConfig[cardProps.type].format[0] - 0.3,
    //                 cardsConfig[cardProps.type].format[1] - 0.3,
    //                 'F'
    //             );
    //             card.restoreGraphicsState();
    //         }
    //
    //         if (cardProps.mainImage) {
    //             const imageData = new Image();
    //             imageData.src = cardProps.mainImage as string;
    //             const imagePosition = getMainImagePosition(i);
    //             card.addImage({
    //                 imageData,
    //                 x: imagePosition.x,
    //                 y: imagePosition.y,
    //                 width: cardProps.config.primaryImageFormat[0],
    //                 height: cardProps.config.primaryImageFormat[1]
    //             });
    //         }
    //
    //         if (includeLightningGift || (cardProps.receiveAddress && cardProps.receiveAddress !== '')) {
    //             const qrCodeElement: HTMLElement = qrCodeRefs[i].current as unknown as HTMLElement;
    //             const qrCodeCanvas = await html2canvas(qrCodeElement);
    //             const qrCodeImage = qrCodeCanvas.toDataURL('image/png');
    //
    //             const { x, y } = getQrCodeImagePosition(i);
    //             card.addImage({
    //                 imageData: qrCodeImage,
    //                 x,
    //                 y,
    //                 width: cardProps.config.secondaryImageFormat[0],
    //                 height: cardProps.config.secondaryImageFormat[1]
    //             });
    //         }
    //
    //         const textPosition = getMainTextPosition(i);
    //         const secondaryTextPosition = getSecondaryTextPosition(i);
    //
    //         card.saveGraphicsState();
    //         // @ts-ignore
    //         card.setGState(new card.GState({lineHeight: 0.75}));
    //         card.restoreGraphicsState();
    //         card.setFontSize(cardProps.sloganFontSize);
    //         card.setFont('Merriweather-Regular', 'normal');
    //         card.setTextColor(cardProps.sloganColor);
    //         card.text(
    //             cardProps.slogan,
    //             textPosition.x,
    //             textPosition.y,
    //             { align: 'center', maxWidth: cardsConfig[cardProps.type].format[0] - 0.5 }
    //         );
    //
    //
    //         card.setFontSize(cardProps.footerFontSize);
    //         card.setTextColor(cardProps.footerColor);
    //         card.text(
    //             cardProps.footer,
    //             secondaryTextPosition.x,
    //             secondaryTextPosition.y,
    //             { align: 'center' }
    //         );
    //     }
    //
    //     handleIsLoading(false);
    //     card.save('custom-card.pdf')
    // };

    return (
        <Box sx={{ width: '80%', margin: '1em auto' }}>
            {/*<Helmet>*/}
                {/*<title>Bitcoin Artwork Creator: Cards, Bookmarks, Stickers - UselessShit.co</title>*/}
            {/*</Helmet>*/}
            
            {/*<img height="128" src={process.env.PUBLIC_URL + '/images/spread-the-bitcoin-vibes.png'} />*/}
            {/*<Badge badgeContent="alpha" color="primary">*/}
                {/*<Typography variant="h3" component="div" gutterBottom>*/}
                    {/*Create Bitcoin Artwork*/}
                {/*</Typography>*/}
            {/*</Badge>*/}
            {/*<Typography sx={{ marginBottom: '3em' }} align="justify" gutterBottom>*/}
                {/*Spread bitcoin awareness with personalized business & greeting cards, bookmarks and stickers.*/}
                {/*With this little tool you can easily create unique graphics (in a print friendly format)*/}
                {/*without the need for an external software (like Gimp or Photoshop).*/}
                {/*<br/><br/>*/}
                {/*Additionally, business & greeting cards and bookmarks can be loaded with sats (fractions of bitcoin) through Lightning*/}
                {/*- create an item, top it up and gift them to your beloved ones!*/}
            {/*</Typography>*/}

            {
                false && <ImageFormatSelector
                    format={imageProps.type}
                    onFormatChange={(event: any) => {
                        formik.handleChange(event);
                        setImageProps({
                            ...imageProps,
                            type: event.target.value,
                        });
                    }}
                />
            }

            {cardHTML}

            {/*<Typography gutterBottom component="div" variant="h6" sx={{ textAlign: 'left' }}>*/}
                {/*Create card*/}
            {/*</Typography>*/}
            <form className="card-generator-form" onSubmit={formik.handleSubmit}>
                {
                    false && <Stack spacing={3}>
                        <Item>

                        </Item>
                        <Item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="checkbox"
                                        checked={imageProps.hideNonEssentials}
                                        onChange={(_event) => {
                                            setImageProps({
                                                ...imageProps,
                                                hideNonEssentials: !imageProps.hideNonEssentials
                                            })
                                        }}
                                    />
                                }
                                label="Hide non-essential options"
                            />
                            <Tooltip title="Indicates whether to display non-essential image processing options.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Item>
                        { !!imageProps.hideNonEssentials === false &&
                        <React.Fragment>
                            {/*<Item>*/}
                            {/*<FormLabel id="cardPrimaryTextSize">Primary text font size</FormLabel>*/}
                            {/*</Item>*/}
                            {/*<Item>*/}
                            {/*<Slider*/}
                            {/*aria-label="Primary Text Font Size"*/}
                            {/*value={imageProps.sloganFontSize}*/}
                            {/*valueLabelDisplay="auto"*/}
                            {/*onChange={(event, newSloganFontSize) => {*/}
                            {/*setImageProps({*/}
                            {/*...imageProps,*/}
                            {/*sloganFontSize: newSloganFontSize as number*/}
                            {/*});*/}
                            {/*}} />*/}
                            {/*</Item>*/}
                            {/*<Item>*/}
                            {/*<FormLabel id="cardPrimaryTextColor">*/}
                            {/*Primary text color*/}
                            {/*<Tooltip title="Choose a color for the primary text.">*/}
                            {/*<IconButton>*/}
                            {/*<Info />*/}
                            {/*</IconButton>*/}
                            {/*</Tooltip>*/}
                            {/*</FormLabel>*/}
                            {/*</Item>*/}
                            {/*<Item>*/}
                            // TODO: clean up after react-color
                            {/*<SketchPicker className="color-picker" color={imageProps.sloganColor} onChangeComplete={(color: any) => {*/}
                            {/*setImageProps({*/}
                            {/*...imageProps,*/}
                            {/*sloganColor: color.hex*/}
                            {/*})*/}
                            {/*}} />*/}
                            {/*</Item>*/}
                            <Item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className="checkbox"
                                            checked={imageProps.sloganTextShadow}
                                            onChange={(_event) => {
                                                setImageProps({
                                                    ...imageProps,
                                                    sloganTextShadow: !imageProps.sloganTextShadow
                                                })
                                            }}
                                        />
                                    }
                                    label="Primary Text Shadow (image only)"
                                />
                                <Tooltip title="Whether to display display text shadow for the primary text.">
                                    <IconButton>
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </Item>
                            { imageProps.sloganTextShadow &&
                            <React.Fragment>
                                <Item>
                                    <FormLabel id="cardPrimaryTextColor">
                                        Primary Text Shadow Color
                                        <Tooltip title="Choose a color for the primary text shadow.">
                                            <IconButton>
                                                <Info />
                                            </IconButton>
                                        </Tooltip>
                                    </FormLabel>
                                </Item>
                                <Item>
                                    // TODO: clean up after react-color
                                    {/*<SketchPicker className="color-picker" color={imageProps.sloganTextShadowColor} onChangeComplete={(color: any) => {*/}
                                    {/*setImageProps({*/}
                                    {/*...imageProps,*/}
                                    {/*sloganTextShadowColor: color.hex*/}
                                    {/*})*/}
                                    {/*}} />*/}
                                </Item>
                            </React.Fragment>

                            }
                            <Item>
                                <FormLabel id="cardSecondaryText">
                                    Secondary text
                                    <Tooltip title="Enter the secondary text.">
                                        <IconButton>
                                            <Info />
                                        </IconButton>
                                    </Tooltip>
                                </FormLabel>
                            </Item>
                            <Item>
                                <TextField
                                    id="footer"
                                    name="footer"
                                    type="text"
                                    label="Enter text"
                                    sx={{ width: '80%' }}
                                    value={imageProps.footer}
                                    inputProps={{ maxLength: 100 }}
                                    onChange={(event) => {
                                        formik.handleChange(event);
                                        setImageProps({
                                            ...imageProps,
                                            footer: event.target.value
                                        });
                                    }} />
                            </Item>
                            <Item>
                                <FormLabel id="cardSecondaryTextColor">
                                    Secondary text color
                                    <Tooltip title="Choose a color for the secondary text.">
                                        <IconButton>
                                            <Info />
                                        </IconButton>
                                    </Tooltip>
                                </FormLabel>
                            </Item>
                            <Item>
                                // TODO: clean up after react-color
                                {/*<SketchPicker className="color-picker" color={imageProps.footerColor} onChangeComplete={(color: any) => {*/}
                                {/*setImageProps({*/}
                                {/*...imageProps,*/}
                                {/*footerColor: color.hex*/}
                                {/*})*/}
                                {/*}} />*/}
                            </Item>
                            <Item>
                                <FormLabel sx={{ paddingRight: '0.5em' }} id="imageLabel">
                                    Image
                                    <Tooltip title="Upload an image. Images with equal width & height please.">
                                        <IconButton>
                                            <Info />
                                        </IconButton>
                                    </Tooltip>
                                </FormLabel>
                            </Item>
                        </React.Fragment>
                        }
                        {/*<Item>*/}
                            {/*<FormLabel id="cardPrimaryTextSize">Background Image Size</FormLabel>*/}
                        {/*</Item>*/}
                        {/*<Item>*/}
                            {/*<Slider*/}
                                {/*aria-label="Background Image Size"*/}
                                {/*value={imageProps.backgroundImageSize}*/}
                                {/*valueLabelDisplay="auto"*/}
                                {/*defaultValue={100}*/}
                                {/*max={150}*/}
                                {/*onChange={(event, newBackgroundImageSize) => {*/}
                                    {/*const backgroundImageSize = newBackgroundImageSize as number;*/}
                                    {/*setImageProps({*/}
                                        {/*...imageProps,*/}
                                        {/*backgroundImageSize*/}
                                    {/*});*/}
                                {/*}} />*/}
                        {/*</Item>*/}
                        {/*<Item>*/}
                        {/*<ReactCrop crop={crop} onChange={c => {*/}
                        {/*setCrop(c);*/}
                        {/*}} locked={true}>*/}
                        {/*<img*/}
                        {/*src={imageProps.backgroundImage && imageProps.backgroundImage.src}*/}
                        {/*width={imageProps.backgroundImage && imageProps.backgroundImage.naturalWidth * ((imageProps.backgroundImageSize && imageProps.backgroundImageSize / 100) * getScale() || 100) || '100%'}*/}
                        {/*height={imageProps.backgroundImage && imageProps.backgroundImage.naturalHeight * ((imageProps.backgroundImageSize && imageProps.backgroundImageSize / 100) * getScale() || 100) || '100%'} />*/}
                        {/*</ReactCrop>*/}
                        {/*</Item>*/}
                        <Item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="checkbox"
                                        checked={imageProps.latestBlock}
                                        onChange={(_event) => {
                                            setImageProps({
                                                ...imageProps,
                                                latestBlock: !imageProps.latestBlock
                                            })
                                        }}
                                    />
                                }
                                label="Include timestamp (image only)"
                            />
                            <Tooltip title="Whether to display bitcoin latest block on the card.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Item>
                        { !!imageProps.hideNonEssentials === false &&
                        <React.Fragment>
                            <Item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className="checkbox"
                                            checked={imageProps.overlay}
                                            onChange={(_event) => {
                                                setImageProps({
                                                    ...imageProps,
                                                    overlay: !imageProps.overlay
                                                })
                                            }}
                                        />
                                    }
                                    label="Add background overlay"
                                />
                                <Tooltip title="Add a background overlay.">
                                    <IconButton>
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </Item>
                            {/*<Item>*/}
                            {/*<FormControlLabel*/}
                            {/*control={*/}
                            {/*<Checkbox*/}
                            {/*className="checkbox"*/}
                            {/*checked={includeLightningGift}*/}
                            {/*onChange={toggleIncludeLightningGift}*/}
                            {/*/>*/}
                            {/*}*/}
                            {/*label="Include Lightning Gift"*/}
                            {/*disabled={!!(imageProps.type === CardType.Sticker &&*/}
                            {/*(imageProps.receiveAddress || imageProps.receiveAddress !== ''))}*/}
                            {/*/>*/}
                            {/*<Tooltip title="Add some sats to your creation and make it a gift card. Minimum 100 sats.">*/}
                            {/*<IconButton>*/}
                            {/*<Info />*/}
                            {/*</IconButton>*/}
                            {/*</Tooltip>*/}
                            {/*</Item>*/}
                            {/*{*/}
                            {/*includeLightningGift &&*/}
                            {/*<React.Fragment>*/}
                            {/*<Item>*/}
                            {/*<Input*/}
                            {/*id="satsAmount"*/}
                            {/*name="satsAmount"*/}
                            {/*type="number"*/}
                            {/*inputProps={{*/}
                            {/*step: "1",*/}
                            {/*min: 100*/}
                            {/*}}*/}
                            {/*startAdornment={*/}
                            {/*<InputAdornment className="icon" position="start">*/}
                            {/*<i className="fak fa-satoshisymbol-solidtilt" />*/}
                            {/*</InputAdornment>*/}
                            {/*}*/}
                            {/*placeholder={'Enter amount in sats'}*/}
                            {/*value={formik.values.satsAmount}*/}
                            {/*onChange={formik.handleChange}*/}
                            {/*/>*/}
                            {/*</Item>*/}
                            {/*<Item>*/}
                            {/*<LightningGift*/}
                            {/*handleRedeemLnurl={(urls) => {*/}
                            {/*setLnurls(urls);*/}
                            {/*}}*/}
                            {/*handleIsLoading={handleIsLoading}*/}
                            {/*satsAmount={formik.values.satsAmount as unknown as number}*/}
                            {/*numberOfGifts={imageProps.copies}*/}
                            {/*/>*/}
                            {/*</Item>*/}
                            {/*</React.Fragment>*/}
                            {/*}*/}
                        </React.Fragment>
                        }
                        <Item>
                            { (imageProps.type === ImageFormat.Sticker) &&
                            <React.Fragment>
                                <Item>
                                    <FormLabel id="cardPrimaryTextColor">
                                        Lightning address or LNURL
                                        <Tooltip title="Your lightning address/LNURL to receive payments.">
                                            <IconButton>
                                                <Info />
                                            </IconButton>
                                        </Tooltip>
                                    </FormLabel>
                                </Item>
                                <Item>
                                    <TextField
                                        id="receiveAddress"
                                        name="receiveAddress"
                                        type="text"
                                        label="Enter address"
                                        sx={{ width: '80%' }}
                                        value={imageProps.receiveAddress}
                                        onChange={(event) => {
                                            formik.handleChange(event);
                                            setImageProps({
                                                ...imageProps,
                                                receiveAddress: event.target.value
                                            });
                                        }} />
                                </Item>
                            </React.Fragment>
                            }
                        </Item>
                        {/*{ !!imageProps.hideNonEssentials === false &&*/}
                        {/*<React.Fragment>*/}
                        {/*<Item>*/}
                        {/*<FormLabel sx={{ paddingRight: '0.5em' }} id="copies-label">*/}
                        {/*No. of copies*/}
                        {/*<Tooltip title="Up to 9 business card copies per page & up to 5 bookmarks.">*/}
                        {/*<IconButton>*/}
                        {/*<Info />*/}
                        {/*</IconButton>*/}
                        {/*</Tooltip>*/}
                        {/*</FormLabel>*/}
                        {/*</Item>*/}
                        {/*<Item>*/}
                        {/*<Input*/}
                        {/*id="copies"*/}
                        {/*name="copies"*/}
                        {/*type="number"*/}
                        {/*inputProps={{*/}
                        {/*step: "1",*/}
                        {/*label: "Number of copies"*/}
                        {/*}}*/}
                        {/*placeholder="Number of copies"*/}
                        {/*value={imageProps.copies}*/}
                        {/*onChange={(event) => {*/}
                        {/*formik.handleChange(event);*/}
                        {/*handleSetCopies(event.target.value as unknown as number);*/}
                        {/*}}*/}
                        {/*/>*/}
                        {/*</Item>*/}
                        {/*</React.Fragment>*/}
                        {/*}*/}
                        <Item>
                            {/*{ !!imageProps.hideNonEssentials === false &&*/}
                            {/*<Button*/}
                            {/*sx={{ fontWeight: 'bold' }}*/}
                            {/*variant="contained"*/}
                            {/*onClick={() => {*/}
                            {/*downloadCardAsPDF()*/}
                            {/*.then()*/}
                            {/*.catch(error => console.error({error}))*/}
                            {/*;*/}
                            {/*}}*/}
                            {/*disabled={includeLightningGift && lnurls.length === 0}*/}
                            {/*>*/}
                            {/*Download Print (PDF)*/}
                            {/*</Button>*/}
                            {/*}*/}
                            {/*<Button*/}
                            {/*sx={{ fontWeight: 'bold', marginLeft: '1em' }}*/}
                            {/*variant="contained"*/}
                            {/*color="warning"*/}
                            {/*onClick={() => {*/}
                            {/*uploadToNostrBuild()*/}
                            {/*.then()*/}
                            {/*.catch(error => console.error({error}))*/}
                            {/*;*/}
                            {/*}}*/}
                            {/*disabled={includeLightningGift && lnurls.length === 0}*/}
                            {/*>*/}
                            {/*Upload to nostr.build*/}
                            {/*</Button>*/}
                        </Item>

                    </Stack>
                }
                <Button variant="outlined" color="secondary" onClick={() => { onClose() }}>
                    Cancel
                </Button>
                <Button
                    sx={{ fontWeight: 'bold', marginLeft: '1em' }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        downloadCardAsImage()
                            .then()
                            .catch(error => console.error({error}))
                        ;
                    }}
                    // disabled={includeLightningGift && lnurls.length === 0}
                >
                    Download image
                </Button>
                <Button
                    sx={{ fontWeight: 'bold', marginLeft: '1em' }}
                    variant="contained"
                    color="warning"
                    onClick={() => {
                        addImageToNote();
                    }}
                    // disabled={includeLightningGift && lnurls.length === 0}
                >
                    Add to note
                </Button>
                <NewImageDialog
                    open={newBackgroundImageDialogOpen}
                    label={'background'}
                    inputKey={backgroundImageInputKey}
                    onImageUpload={(image: any) => {
                        setImageProps({
                            ...imageProps,
                            backgroundImage: image
                        });
                        handleNewBackgroundImageDialogClose();

                    }}
                    onSizeChange={(size: number) => {
                        setImageProps({
                            ...imageProps,
                            backgroundImageSize: size as number
                        });
                    }}
                    onImageReset={(_event: any) => {
                        setImageProps({
                            ...imageProps,
                            backgroundImage: null
                        });
                        setBackgroundImageInputKey(getRandomInputKey());
                    }}
                    onClose={handleNewBackgroundImageDialogClose}
                />
            </form>
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <LoadingDialog open={isProcessing} />
        </Box>
    );
};