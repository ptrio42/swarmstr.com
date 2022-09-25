import React, {useRef, useState} from 'react';
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

enum CardType {
    BusinessCard = 'business-card',
    Bookmark = 'bookmark'
}

interface CardProps {
    slogan: string;
    sloganColor: string;
    mainImage: any;
    backgroundImage?: any;
    satsAmount?: number;
    copies: number;
    type: CardType;
    url: string;
    urlColor: string;
}

const initialCardProps: CardProps = {
    slogan: 'UselessShit.co',
    sloganColor: '#000000',
    mainImage: new Image().src = process.env.PUBLIC_URL + '/images/sign.png',
    satsAmount: 0,
    copies: 1,
    backgroundImage: null,
    type: CardType.BusinessCard,
    url: 'https://uselessshit.co/#were-handed-a-card',
    urlColor: '#1B3D2F'
};

interface CardsConfig {
    [key: string]: {
        format: number[],
        orientation: 'p' | 'l' | 'portrait' | 'landscape'
    }
}

const cardsConfig: CardsConfig = {
    [CardType.BusinessCard]: {
        format: [3.5, 2],
        orientation: 'landscape'
    },
    [CardType.Bookmark]: {
        format: [2, 6],
        orientation: 'portrait'
    }
};

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const CardGenerator = () => {
    const [cardProps, setCardProps] = useState<CardProps>({ ...initialCardProps });

    const [includeLightningGift, setIncludeLightningGift] = useState(false);

    const [redeemLnurl, setRedeemLnurl] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const qrCodeRef = useRef();

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

    const handleRedeemLnurl = (lnurl: string) => {
        setRedeemLnurl(lnurl);
    };

    const handleIsLoading = (isLoading: boolean) => {
        setIsLoading(isLoading);
    };

    const handleSetCopies = (copies: number) => {
        if (copies === 0) {
            copies = 1;
        }
        if (cardProps.type === CardType.BusinessCard && copies > 9) {
            copies = 9;
        }
        if (cardProps.type === CardType.Bookmark && copies > 5) {
            copies = 5;
        }
        if (copies > 1) {
            setIncludeLightningGift(false);
        }

        setCardProps({
            ...cardProps,
            copies
        });
    };

    const cardHTML = () => (
        <React.Fragment>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'left' }}>
                Card Preview
            </Typography>
            <Card sx={{
                width: `${cardsConfig[cardProps.type].format[0]}in`,
                height: `${cardsConfig[cardProps.type].format[1]}in`,
                margin: '0 auto 3em auto',
                background: cardProps.backgroundImage ? `url(${cardProps.backgroundImage})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPositionY: cardProps.type === CardType.Bookmark ? '2in' : '0'
            }}>
                <CardActionArea sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: cardProps.type === CardType.BusinessCard ? 'center' : 'flex-start' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: cardProps.type === CardType.BusinessCard ? 'center' : 'flex-start' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: '0.75in', height: '0.75in', objectFit: 'fill', marginTop: cardProps.type === CardType.BusinessCard ? 0 : '0.15in' }}
                            image={cardProps.mainImage}
                        />
                        {
                            includeLightningGift &&
                            <Box sx={{ width: '0.75in', height: '0.75in', marginLeft: '0.1in', marginTop: cardProps.type === CardType.BusinessCard ? 0 : '0.15in' }} ref={qrCodeRef}>
                                <QRCode size={72} value={redeemLnurl} />
                            </Box>
                        }
                    </Box>
                    <CardContent>
                        <Typography sx={{ fontSize: '14px', color: cardProps.sloganColor }} gutterBottom variant="h5" component="div">
                            {cardProps.slogan}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Typography sx={{ fontSize: '10px', color: cardProps.urlColor }}>
                            { cardProps.url }
                        </Typography>
                    </CardActions>
                </CardActionArea>
            </Card>
        </React.Fragment>
    );

    const getCardFormat = () => {
        const format = cardsConfig[cardProps.type].format;

        switch (cardProps.type) {
            case CardType.BusinessCard: {
                if (cardProps.copies > 3) {
                    return [
                        format[0] * 3,
                        format[1] * Math.ceil(cardProps.copies / 3)
                    ];
                } else {
                    return [
                        format[0] * cardProps.copies,
                        format[1]
                    ];
                }
            }
            case CardType.Bookmark: {
                return [
                    format[0] * cardProps.copies,
                    format[1]
                ];
            }
        }

    };

    const getMainImagePosition = (iterator: number) => {
        const position = {
            x: 0,
            y: 0
        };
        const format = cardsConfig[cardProps.type].format;

        switch (cardProps.type) {
            case CardType.BusinessCard: {
                if (iterator > 2) {
                    position.x = (format[0] / 2) + (((iterator + 1) % 3) * format[0]);
                    position.y = 0.375 + ((Math.floor(iterator / 3)) * format[1]);
                } else {
                    position.x = (format[0] / 2) + (iterator * format[0]);
                    position.y = 0.375;
                }
                break;
            }

            case CardType.Bookmark: {
                position.x = (format[0] / 2) + (iterator * format[0]);
                position.y = 0.375;
                break;
            }
        }

        if (includeLightningGift) {
            position.x -= 0.8;
        } else {
            position.x -= 0.375;
        }
        return position;
    };

    const getBackgroundImagePosition = (iterator: number) => {
        const position = {
            x: 0,
            y: 0
        };
        if (iterator > 2) {
            position.x = (((iterator + 1) % 3) * cardsConfig[cardProps.type].format[0]);
            position.y = (cardsConfig[cardProps.type].format[1] * (Math.floor(iterator / 3)));
        } else {
            position.x = (iterator * cardsConfig[cardProps.type].format[0]);
            position.y = 0;
        }
        return position;
    };

    const getQrCodeImagePosition = (iterator: number) => {
        let { x, y } = getMainImagePosition(iterator);
        x += 0.85;
        return { x, y };
    };

    const getMainTextPosition = (iterator: number) => {
        const position = {
            x: 0,
            y: 0
        };
        const format = cardsConfig[cardProps.type].format;

        switch (cardProps.type) {
            case CardType.BusinessCard: {
                if (iterator > 2) {
                    position.x = (format[0] / 2) + (((iterator + 1) % 3) * format[0]);
                    position.y = 1.35 + ((Math.floor(iterator / 3)) * format[1]);
                } else {
                    position.x = (format[0] / 2) + iterator * format[0];
                    position.y = 1.35;
                }
                break;
            }

            case CardType.Bookmark: {
                position.x = (format[0] / 2) + iterator * format[0];
                position.y = 1.35;
            }
                break;
        }
        return position;
    };

    const getSecondaryTextPosition = (iterator: number) => {
        let { x, y } = getMainTextPosition(iterator);
        y += 0.6;
        return { x, y };
    };

    const downloadCard = async () => {
        const cardFormat = getCardFormat();
        const card = new jsPDF({
            orientation: cardProps.type === 'bookmark'
            && cardProps.copies > 2 ?
                'landscape' :
                cardsConfig[cardProps.type].orientation,
            unit: 'in',
            format: cardFormat
        });
        handleIsLoading(true);

        if (cardProps.type === CardType.BusinessCard && cardProps.backgroundImage) {
            for (let i = 0; i < cardProps.copies; i++) {
                const backgroundImagePosition = getBackgroundImagePosition(i);
                card.addImage({
                    imageData: new Image().src = cardProps.backgroundImage as string,
                    x: backgroundImagePosition.x,
                    y: backgroundImagePosition.y,
                    width: 3.5,
                    height: 2
                });
            }
        }

        for (let i = 0; i < cardProps.copies; i++) {
            const imageData = new Image();
            imageData.src = cardProps.mainImage as string;
            card.setFontSize(14);
            card.setFont('Merriweather');

            const imagePosition = getMainImagePosition(i);
            card.addImage({
                imageData,
                x: imagePosition.x,
                y: imagePosition.y,
                width: 0.75,
                height: 0.75
            });

            if (includeLightningGift) {
                const qrCodeElement: HTMLElement = qrCodeRef.current as unknown as HTMLElement;
                const qrCodeCanvas = await html2canvas(qrCodeElement);
                const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

                const { x, y } = getQrCodeImagePosition(i);
                card.addImage({
                    imageData: qrCodeImage,
                    x,
                    y,
                    width: 0.75,
                    height: 0.75
                });
            }

            const textPosition = getMainTextPosition(i);
            const secondaryTextPosition = getSecondaryTextPosition(i);

            card.setTextColor(cardProps.sloganColor);
            card.text(
                cardProps.slogan,
                textPosition.x,
                textPosition.y,
                { align: 'center', maxWidth: cardsConfig[cardProps.type].format[0] - 0.5 }
                );

            card.setFontSize(10);
            card.setTextColor(cardProps.urlColor);
            card.text(
                cardProps.url,
                secondaryTextPosition.x,
                secondaryTextPosition.y,
                { align: 'center' }
                );

            if (cardProps.type === CardType.Bookmark) {
                if (!cardProps.backgroundImage) {
                    card.addImage({
                        imageData: new Image().src = process.env.PUBLIC_URL + '/images/bookmark-bottom.png',
                        x: (i * cardsConfig[cardProps.type].format[0]),
                        y: cardsConfig[cardProps.type].format[1] - 0.5,
                        width: 2,
                        height: 0.5
                    });
                } else {
                    card.addImage({
                        imageData: new Image().src = cardProps.backgroundImage as string,
                        x: (i * cardsConfig[cardProps.type].format[0]),
                        y: cardsConfig[cardProps.type].format[1] - 4,
                        width: 2,
                        height: 4
                    });
                }
            }
        }

        handleIsLoading(false);
        card.save('custom-card.pdf')
    };

    return (
        <Box sx={{ width: '80%', margin: '1em auto' }}>
            <Helmet>
                <title>Useless Shit - Card Generator</title>
            </Helmet>

            {cardHTML()}

            <Typography gutterBottom component="div" variant="h6" sx={{ textAlign: 'left' }}>
                Create card
            </Typography>
            <form className="card-generator-form" onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                    <Item>
                        <FormControl>
                            <FormLabel id="cardTypeLabel">Format</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="card-type-label"
                                value={cardProps.type}
                                onChange={(event)  => {
                                    formik.handleChange(event);
                                    setCardProps({
                                        ...cardProps,
                                        type: event.target.value as CardType,
                                        copies: 1,
                                        url: cardProps.type === CardType.Bookmark ? 'https://uselessshit.co/#were-handed-a-card' : 'https://uselessshit.co'
                                    })
                                }}
                                name="cardType"
                                id="cardType"
                            >
                                <FormControlLabel value="business-card" control={<Radio />} label="Business Card" />
                                <FormControlLabel value="bookmark" control={<Radio />} label="Bookmark" />
                            </RadioGroup>
                        </FormControl>
                    </Item>
                    <Item>
                        <FormLabel sx={{ paddingRight: '0.5em' }} id="copies-label">No. of copies</FormLabel>
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
                        <TextField
                            id="slogan"
                            name="slogan"
                            type="text"
                            label="Enter text"
                            sx={{ width: '80%' }}
                            value={cardProps.slogan}
                            inputProps={{ maxLength: 74 }}
                            onChange={(event) => {
                                formik.handleChange(event);
                                setCardProps({
                                    ...cardProps,
                                    slogan: event.target.value
                                });
                            }} />
                    </Item>
                    <Item>
                        <FormLabel id="cardPrimaryTextColor">Primary text color</FormLabel>
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
                        <FormLabel id="cardSecondaryTextColor">Secondary text color</FormLabel>
                    </Item>
                    <Item>
                        <SketchPicker className="color-picker" color={cardProps.urlColor} onChangeComplete={(color: any) => {
                            setCardProps({
                                ...cardProps,
                                urlColor: color.hex
                            })
                        }} />
                    </Item>
                    <Item>
                        <FormLabel sx={{ paddingRight: '0.5em' }} id="imageLabel">Image</FormLabel>
                    </Item>
                    <Item>
                        <Input id="mainImage" name="mainImage" type="file" onChange={(event) => {
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
                    </Item>
                    <Item>
                        <FormLabel sx={{ paddingRight: '0.5em' }} id="backgroundImageLabel">Background image</FormLabel>
                    </Item>
                    <Item>
                        <Input id="cardBackgroundImage" name="cardBackgroundImage" type="file" onChange={(event) => {
                            const files = (event.currentTarget as HTMLInputElement).files;
                            if (FileReader && files && files.length > 0) {
                                const fileReader = new FileReader();
                                fileReader.onloadend = () => {
                                    setCardProps({
                                        ...cardProps,
                                        backgroundImage: fileReader.result
                                    })
                                };
                                fileReader.readAsDataURL(files[0])
                            }
                        }} />
                    </Item>
                    <Item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="checkbox"
                                    checked={includeLightningGift}
                                    onChange={toggleIncludeLightningGift}
                                    disabled={cardProps.copies > 1}
                                />
                            }
                            label="Include Lightning Gift"
                        />
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
                                        <InputAdornment className="icon" position="start">₿</InputAdornment>
                                    }
                                    placeholder={'Enter amount in sats'}
                                    value={formik.values.satsAmount}
                                    onChange={formik.handleChange}
                                />
                            </Item>
                            <Item>
                                <LightningGift
                                    handleRedeemLnurl={handleRedeemLnurl}
                                    handleIsLoading={handleIsLoading}
                                    satsAmount={formik.values.satsAmount as unknown as number} />
                            </Item>
                        </React.Fragment>
                    }
                    <Item>
                        <Button
                            sx={{ fontWeight: 'bold' }}
                            variant="contained"
                            onClick={downloadCard}
                            disabled={includeLightningGift && redeemLnurl === ''}
                        >
                            Download Card!
                        </Button>
                    </Item>
                </Stack>
            </form>
            <LoadingAnimation isLoading={isLoading} />
        </Box>
    );
};