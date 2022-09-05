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

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const CardGenerator = () => {
    const card = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2]
    });

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

    const cardHTML = () => (
        <React.Fragment>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'left' }}>
                Card Preview
            </Typography>
            <Card sx={{ width: '3.5in', height: '2in', margin: '0 auto 3em auto' }}>
                <CardActionArea sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: '0.75in', height: '0.75in', objectFit: 'fill' }}
                            image={cardContent.image}
                        />
                        {
                            includeLightningGift &&
                            <Box sx={{ width: '0.75in', height: '0.75in', marginLeft: '0.1in' }} ref={qrCodeRef}>
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
                            https://uselessshit.co/#were-handed-a-card
                        </Typography>
                    </CardActions>
                </CardActionArea>
            </Card>
        </React.Fragment>
    );

    const downloadCard = async () => {
        handleIsLoading(true);
        const imageData = new Image();
        imageData.src = cardContent.image;
        card.setFontSize(14);
        card.setFont('Merriweather');
        if (includeLightningGift) {
            card.addImage({
                imageData,
                x: 0.95,
                y: 0.375,
                width: 0.75,
                height: 0.75,

            });

            const qrCodeElement: HTMLElement = qrCodeRef.current as unknown as HTMLElement;
            const qrCodeCanvas = await html2canvas(qrCodeElement);
            const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

            card.addImage({
                imageData: qrCodeImage,
                x: 1.8,
                y: 0.375,
                width: 0.75,
                height: 0.75
            });
        } else {
            card.addImage({
                imageData,
                x: 1.375,
                y: 0.375,
                width: 0.75,
                height: 0.75,

            });
        }

        card.text(cardContent.text, 1.75, 1.35, { align: 'center', maxWidth: 3 });

        card.setFontSize(10);
        card.setTextColor('#1B3D2F');
        card.text('https://uselessshit.co/#were-handed-a-card', 1.75, 1.95, { align: 'center' });
        handleIsLoading(false);
        card.save('custom-card.pdf')
    };

    return (
        <Box sx={{ width: '80%', margin: '1em auto' }}>
            {cardHTML()}
            <Typography gutterBottom component="div" variant="h6" sx={{ textAlign: 'left' }}>
                Create card
            </Typography>
            <form className="card-generator-form" onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
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