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

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const CardGenerator = () => {
    const formats: { [key: string]: any } = {
        'business-card': {
            format: [3.5, 2],
            orientation: 'landscape'
        },
        'bookmark': {
            format: [2, 6],
            orientation: 'portrait'
        }
    };

    const [selectedFormat, setSelectedFormat] = useState('business-card');

    const [cardContent, setCardContent] = useState<{ text: string, image: any }>({
        text: 'UselessShit.co',
        image: new Image().src = process.env.PUBLIC_URL + '/images/sign.png'
    });

    const [includeLightningGift, setIncludeLightningGift] = useState(false);

    const [redeemLnurl, setRedeemLnurl] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const qrCodeRef = useRef();

    const formik = useFormik({
        initialValues: {
            cardText: cardContent.text,
            cardImage: null,
            satsAmount: 0
        },
        onSubmit: (values) => {
            setCardContent({
                ...cardContent,
                text: values.cardText
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

    const handleSelectedFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFormat((event.target as HTMLInputElement).value);
    };

    const cardHTML = () => (
        <React.Fragment>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'left' }}>
                Card Preview
            </Typography>
            <Card sx={{
                width: `${formats[selectedFormat].format[0]}in`,
                height: `${formats[selectedFormat].format[1]}in`,
                margin: '0 auto 3em auto' }}
            >
                <CardActionArea sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: selectedFormat === 'business-card' ? 'center' : 'flex-start' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: selectedFormat === 'business-card' ? 'center' : 'flex-start' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: '0.75in', height: '0.75in', objectFit: 'fill', marginTop: selectedFormat === 'business-card' ? 0 : '0.15in' }}
                            image={cardContent.image}
                        />
                        {
                            includeLightningGift &&
                            <Box sx={{ width: '0.75in', height: '0.75in', marginLeft: '0.1in', marginTop: selectedFormat === 'business-card' ? 0 : '0.15in' }} ref={qrCodeRef}>
                                <QRCode size={72} value={redeemLnurl} />
                            </Box>
                        }
                    </Box>
                    <CardContent>
                        <Typography sx={{ fontSize: '14px' }} gutterBottom variant="h5" component="div">
                            {cardContent.text}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Typography sx={{ fontSize: '10px', color: '#1B3D2F' }}>
                            { selectedFormat === 'business-card' ? 'https://uselessshit.co/#were-handed-a-card' : 'https://uselessshit.co' }
                        </Typography>
                    </CardActions>
                </CardActionArea>
            </Card>
        </React.Fragment>
    );

    const downloadCard = async () => {
        const card = new jsPDF({
            orientation: formats[selectedFormat].orientation,
            unit: 'in',
            format: formats[selectedFormat].format
        });
        handleIsLoading(true);
        const imageData = new Image();
        imageData.src = cardContent.image;
        card.setFontSize(14);
        card.setFont('Merriweather');

        if (includeLightningGift) {
            card.addImage({
                imageData,
                x: (formats[selectedFormat].format[0] / 2) - 0.8,
                y: 0.375,
                width: 0.75,
                height: 0.75,

            });

            const qrCodeElement: HTMLElement = qrCodeRef.current as unknown as HTMLElement;
            const qrCodeCanvas = await html2canvas(qrCodeElement);
            const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

            card.addImage({
                imageData: qrCodeImage,
                x: (formats[selectedFormat].format[0] / 2) + 0.05,
                y: 0.375,
                width: 0.75,
                height: 0.75
            });
        } else {
            card.addImage({
                imageData,
                x: (formats[selectedFormat].format[0] / 2) - 0.375,
                y: 0.375,
                width: 0.75,
                height: 0.75
            });
        }

        card.text(cardContent.text, formats[selectedFormat].format[0] / 2, 1.35, { align: 'center', maxWidth: formats[selectedFormat].format[0] - 0.5 });

        card.setFontSize(10);
        card.setTextColor('#1B3D2F');
        card.text(selectedFormat === 'business-card' ? 'https://uselessshit.co/#were-handed-a-card' : 'https://uselessshit.co', formats[selectedFormat].format[0] / 2, 1.95, { align: 'center' });

        if (selectedFormat === 'bookmark') {
            card.addImage({
                imageData: new Image().src = process.env.PUBLIC_URL + '/images/bookmark-bottom.png',
                x: 0,
                y: formats[selectedFormat].format[1] - 0.5,
                width: 2,
                height: 0.5
            })
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
                            <FormLabel id="card-format-label">Format</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="card-format-label"
                                value={selectedFormat}
                                onChange={handleSelectedFormatChange}
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="business-card" control={<Radio />} label="Business Card" />
                                <FormControlLabel value="bookmark" control={<Radio />} label="Bookmark" />
                            </RadioGroup>
                        </FormControl>
                    </Item>
                    <Item>
                        <TextField
                            id="cardText"
                            name="cardText"
                            type="text"
                            label="Enter text"
                            sx={{ width: '80%' }}
                            value={formik.values.cardText}
                            inputProps={{ maxLength: 74 }}
                            onChange={(event) => {
                                formik.handleChange(event);
                                setCardContent({
                                    ...cardContent,
                                    text: event.target.value
                                });
                            }} />
                    </Item>
                    <Item>
                        <Input id="cardImage" name="cardImage" type="file" onChange={(event) => {
                            const files = (event.currentTarget as HTMLInputElement).files;
                            if (FileReader && files && files.length > 0) {
                                const fileReader = new FileReader();
                                fileReader.onloadend = () => {
                                    setCardContent({
                                        ...cardContent,
                                        image: fileReader.result
                                    })
                                };
                                fileReader.readAsDataURL(files[0])
                            }
                        }} />
                    </Item>
                    <Item>
                        <FormControlLabel
                            control={<Checkbox className="checkbox" checked={includeLightningGift} onChange={toggleIncludeLightningGift} />}
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
                                    satsAmount={formik.values.satsAmount} />
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