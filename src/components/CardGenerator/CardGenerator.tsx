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
import './CardGenerator.css';
import {Helmet} from "react-helmet";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { SketchPicker } from 'react-color';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {Info} from "@mui/icons-material";
import Slider from "@mui/material/Slider";
import '../../fonts/Merriweather-Regular-normal';
import Badge from "@mui/material/Badge";
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {cropImage, resizeImage} from "../../services/cardGenerator";
import {LatestBitcoinBlock} from "../LatestBitcoinBlock/LatestBitcoinBlock";
import {uploadImage} from "../../services/uploadImage";
import Snackbar from "@mui/material/Snackbar";

export enum CardType {
    BusinessCard = 'business-card',
    Bookmark = 'bookmark',
    Sticker = 'sticker',
    ChristmasCard = 'christmas-card',
    BannerImage = 'banner-image'
}

interface CardsConfig {
    [key: string]: {
        format: number[],
        orientation: 'p' | 'l' | 'portrait' | 'landscape',
        primaryImageFormat?: number[],
        secondaryImageFormat?: number[],
        qrCodeSize: number,
        maxCopies: number
    }
}

const cardsConfig: CardsConfig = {
    [CardType.BusinessCard]: {
        format: [3.5, 2],
        orientation: 'landscape',
        primaryImageFormat: [0.75, 0.75],
        secondaryImageFormat: [0.75, 0.75],
        qrCodeSize: 72,
        maxCopies: 9
    },
    [CardType.Bookmark]: {
        format: [2, 6],
        orientation: 'portrait',
        primaryImageFormat: [0.75, 0.75],
        secondaryImageFormat: [0.75, 0.75],
        qrCodeSize: 72,
        maxCopies: 5
    },
    [CardType.Sticker]: {
        format: [3.5, 3.5],
        orientation: 'landscape',
        primaryImageFormat: [1, 1],
        secondaryImageFormat: [1, 1],
        qrCodeSize: 96,
        maxCopies: 6
    },
    [CardType.ChristmasCard]: {
        format: [5, 7],
        orientation: 'portrait',
        primaryImageFormat: [1.5, 1.5],
        secondaryImageFormat: [1.5, 1.5],
        qrCodeSize: 144,
        maxCopies: 2
    },
    [CardType.BannerImage]: {
        format: [15.625, 5.2083333333],
        orientation: 'landscape',
        primaryImageFormat: [1.5, 1.5],
        secondaryImageFormat: [1.5, 1.5],
        qrCodeSize: 144,
        maxCopies: 1
    }
};

interface CardProps {
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
    type: CardType;
    footer: string;
    footerColor: string;
    footerFontSize: number;
    receiveAddress?: string;
    config: any;
    overlay?: boolean;
    overlayColor?: string;
    latestBlock?: boolean;
}

const initialCardProps: CardProps = {
    slogan: 'CYBERPOWER.',
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
    type: CardType.BannerImage,
    footer: '',
    footerColor: '#1B3D2F',
    footerFontSize: 10,
    receiveAddress: '',
    config: { ...cardsConfig[CardType.BannerImage] },
    overlay: false,
    overlayColor: 'rgba(255,255,255,.8)'
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

export const CardGenerator = () => {
    const [cardProps, setCardProps] = useState<CardProps>({ ...initialCardProps });

    const [includeLightningGift, setIncludeLightningGift] = useState(false);

    const [lnurls, setLnurls] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [qrCodeRefs, setQrCodeRefs] = useState<RefObject<unknown>[]>([]);

    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 0,
        y: 0,
        width: cardProps.config.format[0] * PPI,
        height: cardProps.config.format[1] * PPI
    });

    const maxCopiesInARow = Math.floor(PAGE_FORMAT.WIDTH / cardProps.config.format[0]);

    const cardRef = useRef();

    const [mainImageInputKey, setMainImageInputKey] = useState<string>();
    const [backgroundImageInputKey, setBackgroundImageInputKey] = useState<string>();

    const getRandomInputKey = () => {
        return Math.random().toString(36);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        setQrCodeRefs((qrCodeRefs) =>
            Array(cardProps.copies)
                .fill(undefined)
                .map((_, i) => qrCodeRefs[i] || createRef())
        );
    }, [cardProps.copies]);

    useEffect(() => {
        setCardProps((props) => ({
            ...props,
            config: { ...cardsConfig[props.type] },
            receiveAddress: '',
            copies: 1,
        }));
        setIncludeLightningGift(false);
    }, [cardProps.type]);

    useEffect(() => {
        setCrop({
            unit: 'px',
            x: 0,
            y: 0,
            width: cardProps.config.format[0] * PPI,
            height: cardProps.config.format[1] * PPI
        });
    }, [cardProps.config]);

    const formik = useFormik({
        initialValues: {
            ...initialCardProps
        },
        onSubmit: (values) => {
            setCardProps({
                ...cardProps,
                slogan: values.slogan
            });
        }
    });

    const toggleIncludeLightningGift = () => {
        setIncludeLightningGift(!includeLightningGift);
    };

    const handleIsLoading = (isLoading: boolean) => {
        setIsLoading(isLoading);
    };

    const handleSetCopies = (copies: number) => {
        if (copies === 0) {
            copies = 1;
        }

        if (copies > cardProps.config.maxCopies) {
            copies = cardProps.config.maxCopies;
        }

        copies = +copies;

        setCardProps({
            ...cardProps,
            copies
        });
    };

    const getCardPreviewBackgroundSize = () => {
        if (cardProps.backgroundImage) {
            return cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.naturalWidth + 'px'
                + ' ' + cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.naturalHeight + 'px';
        }
        return '100% 100%';
    };

    const cardHTML = () => (
        <React.Fragment>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'left' }}>
                Card Preview
            </Typography>
            <Card ref={cardRef as any} sx={{
                width: `${cardsConfig[cardProps.type].format[0]}in`,
                height: `${cardsConfig[cardProps.type].format[1]}in`,
                margin: '0 auto 3em auto',
                background: cardProps.backgroundImage ? `url(${cardProps.backgroundImage.src})` : 'none',
                backgroundSize: getCardPreviewBackgroundSize(),
                backgroundRepeat: 'no-repeat',
                backgroundPositionY: cardProps.type === CardType.Bookmark ? '2in' : '0',
                backgroundPosition: `${-crop.x}px ${-crop.y}px`,
                borderRadius: '0px'
            }}>
                <CardActionArea sx={{
                    width: cardProps.overlay ? '90%' : '100%',
                    height: cardProps.overlay ? '90%' : '100%',
                    background: cardProps.overlay ? cardProps.overlayColor : 'transparent',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: cardProps.type === CardType.BusinessCard ? 'center' : 'flex-start' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: cardProps.type === CardType.BusinessCard ? 'center' : 'flex-start' }}>
                        <CardMedia
                            component="img"
                            sx={{
                                width: `${cardProps.config.primaryImageFormat[0]}in`,
                                height: `${cardProps.config.primaryImageFormat[1]}in`,
                                objectFit: 'fill',
                                marginTop: '0.15in'
                            }}
                            image={cardProps.mainImage}
                        />
                        {
                            (includeLightningGift || (cardProps.type === CardType.Sticker && cardProps.receiveAddress && cardProps.receiveAddress !== '')) &&
                            <Box
                                sx={{
                                    width: `${cardProps.config.secondaryImageFormat[0]}in`,
                                    height: `${cardProps.config.secondaryImageFormat[1]}in`,
                                    marginLeft: '0.1in',
                                    marginTop: '0.15in',
                                    overflow: 'hidden'
                                }}
                            >
                                {
                                    Array(cardProps.copies).fill(undefined).map((_, i) => (
                                        <Box
                                            sx={{
                                                width: `${cardProps.config.secondaryImageFormat[0]}in`,
                                                height: `${cardProps.config.secondaryImageFormat[1]}in`,
                                                margin: '0',
                                                padding: '0'
                                            }}
                                            ref={qrCodeRefs[i]}
                                        >
                                            <QRCode size={cardProps.config.qrCodeSize} value={lnurls[i] || cardProps.receiveAddress || '' } />
                                        </Box>
                                    ))
                                }
                            </Box>

                        }
                        { cardProps.latestBlock &&
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
                    <CardContent>
                        <Typography
                            sx={{
                                fontSize: `${cardProps.sloganFontSize}pt`,
                                color: cardProps.sloganColor,
                                maxWidth: `${cardProps.config.format[0] - 0.5}in`,
                                overflow: 'hidden', overflowWrap: 'break-word',
                                textShadow: cardProps.sloganTextShadow ? `1px 1px ${cardProps.sloganTextShadowColor}` : 'none'
                            }}
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            {cardProps.slogan}
                        </Typography>
                    </CardContent>
                        <CardActions>
                        <Typography sx={{ fontSize: `${cardProps.footerFontSize}pt`, color: cardProps.footerColor }}>
                            { cardProps.footer }
                        </Typography>
                    </CardActions>
                </CardActionArea>
            </Card>
        </React.Fragment>
    );

    const getCardFormat = () => {
        const format = cardProps.config.format;
        const columns = cardProps.copies > maxCopiesInARow ? maxCopiesInARow : cardProps.copies;
        const rows = Math.ceil(cardProps.copies / columns);

        return [
            format[0] * columns,
            format[1] * rows
        ];
    };

    const getRowAndColumnNo = (copyNo: number): { rowNo: number, columnNo: number } => {
        const rowNo = Math.ceil(copyNo / maxCopiesInARow);
        const columnNo = copyNo > maxCopiesInARow ? copyNo - (maxCopiesInARow * (rowNo - 1)) : copyNo;
        return {
            rowNo, columnNo
        };
    };

    const getMainImagePosition = (iterator: number) => {
        const position = createPosition();
        const format = cardProps.config.format;

        const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);

        position.x = (columnNo * format[0] - (format[0] / 2));
        position.y = format[1] * (rowNo - 1) + 0.375;

        if (includeLightningGift || (cardProps.type === CardType.Sticker && cardProps.receiveAddress)) {
            position.x -= (cardProps.config.primaryImageFormat[0] + 0.05);
        } else {
            position.x -= cardProps.config.primaryImageFormat[0] / 2;
        }
        return position;
    };

    const createPosition = (x: number = 0, y: number = 0) => {
        return {
            x, y
        };
    };

    const getBackgroundImagePosition = (iterator: number) => {
        const position = createPosition();
        const format = cardProps.config.format;

        const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);

        position.x = (columnNo - 1) * format[0];
        position.y = format[1] * (rowNo - 1);

        return position;
    };

    const getQrCodeImagePosition = (iterator: number) => {
        let { x, y } = getMainImagePosition(iterator);
        x += cardProps.config.primaryImageFormat[0] + 0.1;
        return { x, y };
    };

    const getMainTextPosition = (iterator: number) => {
        const position = createPosition();
        const format = cardsConfig[cardProps.type].format;
        const mainImagePosition = getMainImagePosition(iterator);
        const mainImageFormat = cardProps.config.primaryImageFormat[1];
        const relativeTextPosition = mainImagePosition.y + mainImageFormat;

        const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);

        position.x = columnNo * format[0] - (format[0] / 2);
        position.y = (relativeTextPosition + 0.25);
        return position;
    };

    const getSecondaryTextPosition = (iterator: number) => {
        const position = createPosition();
        const format = cardProps.config.format;

        const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);

        position.x = columnNo * format[0] - (format[0] / 2);
        position.y = rowNo * format[1] - 0.3;
        return position;
    };

    const getOverlayPosition = (iterator: number) => {
        const position = createPosition();
        const format = cardProps.config.format;

        const { rowNo, columnNo } = getRowAndColumnNo(iterator + 1);

        position.x = (columnNo - 1) * format[0] + 0.15;
        position.y = format[1] * (rowNo - 1) + 0.15;

        return position;
    };

    const downloadCardAsImage = async () => {
        const cardElement: HTMLElement = cardRef.current as unknown as HTMLElement;
        const cardCanvas = await html2canvas(cardElement);
        const image = cardCanvas.toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');

        const anchor = document.createElement('a');
        anchor.href = image;
        anchor.download = 'custom-card.png';
        anchor.click();
    };

    const uploadToNostrBuild = async () => {
        handleIsLoading(true);
        const cardElement: HTMLElement = cardRef.current as unknown as HTMLElement;
        const cardCanvas = await html2canvas(cardElement);

        cardCanvas.toBlob(async (blob: any) => {
            const imageFile = new File([blob], "fileName.png", { type: "image/png" });
            const formData = new FormData();
            formData.append('fileToUpload', imageFile);
            formData.append('submit', 'Upload Image');
            const response = await uploadImage(formData);

            const regExp = new RegExp(/(https?:\/\/[^ ]*)/, 'g');
            let imageUrl: string = response.match(regExp)[9];
            imageUrl = imageUrl.slice(0, imageUrl.indexOf('\"'));
            handleIsLoading(false);
            setSnackbarMessage('Upload successfull! Image URL: ' + imageUrl);
            setSnackbarOpen(true);
        }, 'image/png');

    };

    const downloadCardAsPDF = async () => {
        const cardFormat = getCardFormat();
        const card = new jsPDF({
            orientation: (cardProps.type === 'bookmark'
            && cardProps.copies > 2) || (cardProps.type === CardType.ChristmasCard && cardProps.copies > 1) ?
                'landscape' :
                cardsConfig[cardProps.type].orientation,
            unit: 'in',
            format: cardFormat
        });
        handleIsLoading(true);

        let backgroundImage = new Image();
        if (cardProps.backgroundImage) {
            // resize bg image begin
            const backgroundImageBase64 = cardProps.backgroundImage.src;
            const resizedImageBase64 = await resizeImage(
                backgroundImageBase64,
                cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.width,
                cardProps.backgroundImageSize / 100 * cardProps.backgroundImage.height
            );

            // resize bg image end

            if (resizedImageBase64) {
                // crop bg image begin
                const croppedImageBase64 = await cropImage(resizedImageBase64 as string, crop);
                if (croppedImageBase64) {
                    backgroundImage.src = croppedImageBase64 as string;
                }
            }
            // crop bg image end
        }

        for (let i = 0; i < cardProps.copies; i++) {
            if (cardProps.backgroundImage) {
                const backgroundImagePosition = getBackgroundImagePosition(i);
                card.addImage({
                    imageData: backgroundImage.src,
                    x: backgroundImagePosition.x,
                    y: backgroundImagePosition.y,
                    width: cardsConfig[cardProps.type].format[0],
                    height: cardsConfig[cardProps.type].format[1]
                });
            }

            if (cardProps.overlay) {
                const overlayPosition = getOverlayPosition(i);
                card.saveGraphicsState();
                // @ts-ignore
                card.setGState(new card.GState({opacity: 0.8}));
                card.setFillColor(255, 255, 255);
                card.rect(
                    overlayPosition.x,
                    overlayPosition.y,
                    cardsConfig[cardProps.type].format[0] - 0.3,
                    cardsConfig[cardProps.type].format[1] - 0.3,
                    'F'
                );
                card.restoreGraphicsState();
            }

            if (cardProps.mainImage) {
                const imageData = new Image();
                imageData.src = cardProps.mainImage as string;
                const imagePosition = getMainImagePosition(i);
                card.addImage({
                    imageData,
                    x: imagePosition.x,
                    y: imagePosition.y,
                    width: cardProps.config.primaryImageFormat[0],
                    height: cardProps.config.primaryImageFormat[1]
                });
            }

            if (includeLightningGift || (cardProps.receiveAddress && cardProps.receiveAddress !== '')) {
                const qrCodeElement: HTMLElement = qrCodeRefs[i].current as unknown as HTMLElement;
                const qrCodeCanvas = await html2canvas(qrCodeElement);
                const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

                const { x, y } = getQrCodeImagePosition(i);
                card.addImage({
                    imageData: qrCodeImage,
                    x,
                    y,
                    width: cardProps.config.secondaryImageFormat[0],
                    height: cardProps.config.secondaryImageFormat[1]
                });
            }

            const textPosition = getMainTextPosition(i);
            const secondaryTextPosition = getSecondaryTextPosition(i);

            card.saveGraphicsState();
            // @ts-ignore
            card.setGState(new card.GState({lineHeight: 0.75}));
            card.restoreGraphicsState();
            card.setFontSize(cardProps.sloganFontSize);
            card.setFont('Merriweather-Regular', 'normal');
            card.setTextColor(cardProps.sloganColor);
            card.text(
                cardProps.slogan,
                textPosition.x,
                textPosition.y,
                { align: 'center', maxWidth: cardsConfig[cardProps.type].format[0] - 0.5 }
                );


            card.setFontSize(cardProps.footerFontSize);
            card.setTextColor(cardProps.footerColor);
            card.text(
                cardProps.footer,
                secondaryTextPosition.x,
                secondaryTextPosition.y,
                { align: 'center' }
                );
        }

        handleIsLoading(false);
        card.save('custom-card.pdf')
    };

    return (
        <Box sx={{ width: '80%', margin: '1em auto' }}>
            <Helmet>
                <title>Bitcoin Artwork Creator: Cards, Bookmarks, Stickers - UselessShit.co</title>
            </Helmet>

            <img height="128" src={process.env.PUBLIC_URL + '/images/spread-the-bitcoin-vibes.png'} />
            <Badge badgeContent="beta" color="primary">
                <Typography variant="h3" component="div" gutterBottom>
                    Create Bitcoin Artwork
                </Typography>
            </Badge>
            <Typography sx={{ marginBottom: '3em' }} align="justify" gutterBottom>
                Spread bitcoin awareness with personalized business & greeting cards, bookmarks and stickers.
                With this little tool you can easily create unique graphics (in a print friendly format)
                without the need for an external software (like Gimp or Photoshop).
                <br/><br/>
                Additionally, business & greeting cards and bookmarks can be loaded with sats (fractions of bitcoin) through Lightning
                - create an item, top it up and gift them to your beloved ones!
            </Typography>

            {cardHTML()}

            <Typography gutterBottom component="div" variant="h6" sx={{ textAlign: 'left' }}>
                Create card
            </Typography>
            <form className="card-generator-form" onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                    <Item>
                        <FormControl>
                            <FormLabel id="cardTypeLabel">
                                Format
                                <Tooltip title="Pick a format for your graphic.">
                                    <IconButton>
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="card-type-label"
                                value={cardProps.type}
                                onChange={(event)  => {
                                    formik.handleChange(event);
                                    setCardProps({
                                        ...cardProps,
                                        type: event.target.value as CardType,
                                        copies: 1
                                    })
                                }}
                                name="cardType"
                                id="cardType"
                            >
                                <FormControlLabel value="banner-image" control={<Radio />} label={
                                    <FormLabel id="cardTypeLabel">
                                        <Badge badgeContent="new" color="primary">
                                            Banner Image &nbsp;&nbsp;&nbsp;
                                        </Badge>
                                    </FormLabel>
                                } />
                                <FormControlLabel value="christmas-card" control={<Radio />} label="Greeting Card" />
                                <FormControlLabel value="business-card" control={<Radio />} label="Business Card" />
                                <FormControlLabel value="bookmark" control={<Radio />} label="Bookmark" />
                                <FormControlLabel value="sticker" control={<Radio />} label="Sticker" />
                            </RadioGroup>
                        </FormControl>
                    </Item>
                    <Item>
                        <FormLabel id="cardPrimaryText">
                            Primary text
                            <Tooltip title="Enter the primary text. Up to 500 characters.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </FormLabel>
                    </Item>
                    <Item>
                        <TextField
                            id="slogan"
                            name="slogan"
                            type="text"
                            label="Enter text"
                            sx={{ width: '80%' }}
                            value={cardProps.slogan}
                            inputProps={{ maxLength: 500 }}
                            onChange={(event) => {
                                formik.handleChange(event);
                                setCardProps({
                                    ...cardProps,
                                    slogan: event.target.value
                                });
                            }} />
                    </Item>
                    <Item>
                        <FormLabel id="cardPrimaryTextSize">Primary text font size</FormLabel>
                    </Item>
                    <Item>
                        <Slider
                            aria-label="Primary Text Font Size"
                            value={cardProps.sloganFontSize}
                            valueLabelDisplay="auto"
                            onChange={(event, newSloganFontSize) => {
                            setCardProps({
                                ...cardProps,
                                sloganFontSize: newSloganFontSize as number
                            });
                        }} />
                    </Item>
                    <Item>
                        <FormLabel id="cardPrimaryTextColor">
                            Primary text color
                            <Tooltip title="Choose a color for the primary text.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </FormLabel>
                    </Item>
                    <Item>
                        <SketchPicker className="color-picker" color={cardProps.sloganColor} onChangeComplete={(color: any) => {
                            setCardProps({
                                ...cardProps,
                                sloganColor: color.hex
                            })
                        }} />
                    </Item>
                    <Item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkbox"
                                    checked={cardProps.sloganTextShadow}
                                    onChange={(_event) => {
                                        setCardProps({
                                            ...cardProps,
                                            sloganTextShadow: !cardProps.sloganTextShadow
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
                    { cardProps.sloganTextShadow &&
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
                                <SketchPicker className="color-picker" color={cardProps.sloganTextShadowColor} onChangeComplete={(color: any) => {
                                    setCardProps({
                                        ...cardProps,
                                        sloganTextShadowColor: color.hex
                                    })
                                }} />
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
                            value={cardProps.footer}
                            inputProps={{ maxLength: 100 }}
                            onChange={(event) => {
                                formik.handleChange(event);
                                setCardProps({
                                    ...cardProps,
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
                        <SketchPicker className="color-picker" color={cardProps.footerColor} onChangeComplete={(color: any) => {
                            setCardProps({
                                ...cardProps,
                                footerColor: color.hex
                            })
                        }} />
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
                    <Item>
                        <Input
                            id="mainImage"
                            name="mainImage"
                            key={mainImageInputKey || ''}
                            type="file"
                            onChange={(event) => {
                            const files = (event.currentTarget as HTMLInputElement).files;
                            if (FileReader && files && files.length > 0) {
                                const fileReader = new FileReader();
                                fileReader.onloadend = () => {
                                    setCardProps({
                                        ...cardProps,
                                        mainImage: fileReader.result
                                    })
                                };
                                fileReader.readAsDataURL(files[0])
                            }
                        }} />
                        <Button
                            variant="contained"
                            color="warning"
                            sx={{ marginLeft: '1em' }}
                            disabled={cardProps.mainImage === null}
                            onClick={() => {
                                setCardProps({
                                    ...cardProps,
                                    mainImage: null
                                });
                                setMainImageInputKey(getRandomInputKey());
                            }}
                        >
                            Reset Foreground Image
                        </Button>
                    </Item>
                    <Item>
                        <FormLabel sx={{ paddingRight: '0.5em' }} id="backgroundImageLabel">
                            Background image
                            <Tooltip title="Upload a background image.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </FormLabel>
                    </Item>
                    <Item>
                        <Input
                            id="cardBackgroundImage"
                            name="cardBackgroundImage"
                            key={backgroundImageInputKey || ''}
                            type="file"
                            onChange={(event) => {
                            const files = (event.currentTarget as HTMLInputElement).files;
                            if (FileReader && files && files.length > 0) {
                                const fileReader = new FileReader();
                                fileReader.onloadend = () => {
                                    const backgroundImage = new Image();
                                    backgroundImage.src = fileReader.result as string;
                                    setCardProps({
                                        ...cardProps,
                                        backgroundImage: backgroundImage
                                    });
                                };
                                fileReader.readAsDataURL(files[0])
                            }
                        }} />
                        <Button
                            sx={{ marginLeft: '1em' }}
                            variant="contained"
                            color="warning"
                            disabled={cardProps.backgroundImage === null}
                            onClick={() => {
                                setCardProps({
                                    ...cardProps,
                                    backgroundImage: null
                                });
                                setBackgroundImageInputKey(getRandomInputKey());
                            }}
                        >
                            Reset Background Image
                        </Button>
                    </Item>
                    <Item>
                        <FormLabel id="cardPrimaryTextSize">Background Image Size</FormLabel>
                    </Item>
                    <Item>
                        <Slider
                            aria-label="Background Image Size"
                            value={cardProps.backgroundImageSize}
                            valueLabelDisplay="auto"
                            defaultValue={100}
                            max={150}
                            onChange={(event, newBackgroundImageSize) => {
                                const backgroundImageSize = newBackgroundImageSize as number;
                                setCardProps({
                                    ...cardProps,
                                    backgroundImageSize
                                });
                            }} />
                    </Item>
                    <Item>
                        <ReactCrop crop={crop} onChange={c => {
                            setCrop(c);
                        }} locked={true}>
                            <img
                                src={cardProps.backgroundImage && cardProps.backgroundImage.src}
                                width={cardProps.backgroundImage && cardProps.backgroundImage.naturalWidth * ((cardProps.backgroundImageSize && cardProps.backgroundImageSize / 100) || 100) || '100%'}
                                height={cardProps.backgroundImage && cardProps.backgroundImage.naturalHeight * ((cardProps.backgroundImageSize && cardProps.backgroundImageSize / 100) || 100) || '100%'} />
                        </ReactCrop>
                    </Item>
                    <Item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkbox"
                                    checked={cardProps.latestBlock}
                                    onChange={(_event) => {
                                        setCardProps({
                                            ...cardProps,
                                            latestBlock: !cardProps.latestBlock
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
                    <Item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkbox"
                                    checked={cardProps.overlay}
                                    onChange={(_event) => {
                                        setCardProps({
                                            ...cardProps,
                                            overlay: !cardProps.overlay
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
                    <Item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkbox"
                                    checked={includeLightningGift}
                                    onChange={toggleIncludeLightningGift}
                                />
                            }
                            label="Include Lightning Gift"
                            disabled={!!(cardProps.type === CardType.Sticker &&
                                (cardProps.receiveAddress || cardProps.receiveAddress !== ''))}
                        />
                        <Tooltip title="Add some sats to your creation and make it a gift card. Minimum 100 sats.">
                            <IconButton>
                                <Info />
                            </IconButton>
                        </Tooltip>
                    </Item>
                    {
                        includeLightningGift &&
                        <React.Fragment>
                            <Item>
                                <Input
                                    id="satsAmount"
                                    name="satsAmount"
                                    type="number"
                                    inputProps={{
                                        step: "1",
                                        min: 100
                                    }}
                                    startAdornment={
                                        <InputAdornment className="icon" position="start">
                                            <i className="fak fa-satoshisymbol-solidtilt" />
                                        </InputAdornment>
                                    }
                                    placeholder={'Enter amount in sats'}
                                    value={formik.values.satsAmount}
                                    onChange={formik.handleChange}
                                />
                            </Item>
                            <Item>
                                <LightningGift
                                    handleRedeemLnurl={(urls) => {
                                        setLnurls(urls);
                                    }}
                                    handleIsLoading={handleIsLoading}
                                    satsAmount={formik.values.satsAmount as unknown as number}
                                    numberOfGifts={cardProps.copies}
                                />
                            </Item>
                        </React.Fragment>
                    }
                    <Item>
                        { (cardProps.type === CardType.Sticker && !includeLightningGift) &&
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
                                            value={cardProps.receiveAddress}
                                            onChange={(event) => {
                                                formik.handleChange(event);
                                                setCardProps({
                                                    ...cardProps,
                                                    receiveAddress: event.target.value
                                                });
                                            }} />
                                    </Item>
                                </React.Fragment>
                        }
                    </Item>
                    <Item>
                        <FormLabel sx={{ paddingRight: '0.5em' }} id="copies-label">
                            No. of copies
                            <Tooltip title="Up to 9 business card copies per page & up to 5 bookmarks.">
                                <IconButton>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </FormLabel>
                    </Item>
                    <Item>
                        <Input
                            id="copies"
                            name="copies"
                            type="number"
                            inputProps={{
                                step: "1",
                                label: "Number of copies"
                            }}
                            placeholder="Number of copies"
                            value={cardProps.copies}
                            onChange={(event) => {
                                formik.handleChange(event);
                                handleSetCopies(event.target.value as unknown as number);
                            }}
                        />
                    </Item>
                    <Item>
                        <Button
                            sx={{ fontWeight: 'bold' }}
                            variant="contained"
                            onClick={() => {
                                downloadCardAsPDF()
                                    .then()
                                    .catch(error => console.error({error}))
                                ;
                            }}
                            disabled={includeLightningGift && lnurls.length === 0}
                        >
                            Download Print (PDF)
                        </Button>
                        <Button
                            sx={{ fontWeight: 'bold', marginLeft: '1em' }}
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                downloadCardAsImage()
                                    .then()
                                    .catch(error => console.error({error}))
                                ;
                            }}
                            disabled={includeLightningGift && lnurls.length === 0}
                        >
                            Download as image
                        </Button>
                        <Button
                            sx={{ fontWeight: 'bold', marginLeft: '1em' }}
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                uploadToNostrBuild()
                                    .then()
                                    .catch(error => console.error({error}))
                                ;
                            }}
                            disabled={includeLightningGift && lnurls.length === 0}
                        >
                            Upload to nostr.build
                        </Button>
                    </Item>

                </Stack>
            </form>
            <LoadingAnimation isLoading={isLoading} />
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};