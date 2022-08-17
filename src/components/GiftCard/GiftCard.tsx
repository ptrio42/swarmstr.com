import React, {useState} from 'react';
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

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const GiftCard = () => {
    const card = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2]
    });

    const [cardContent, setCardContent] = useState<{ text: string, image: any }>({
        text: 'UselessShit.co',
        image: new Image().src = process.env.PUBLIC_URL + '/images/sign.png'
    });

    const formik = useFormik({
        initialValues: {
            cardText: cardContent.text,
            cardImage: null
        },
        onSubmit: (values) => {
            setCardContent({
                ...cardContent,
                text: values.cardText
            });
        }
    });

    const cardHTML = () => (
        <React.Fragment>
            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'left' }}>
                Card Preview
            </Typography>
            <Card sx={{ width: '3.5in', height: '2in', margin: '0 auto 3em auto' }}>
                <CardActionArea sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: '0.5in', height: '0.5in', objectFit: 'fill' }}
                        image={cardContent.image}
                    />
                    <CardContent>
                        <Typography sx={{ fontSize: '12pt' }} gutterBottom variant="h5" component="div">
                            {cardContent.text}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </React.Fragment>
    );

    const downloadCard = () => {
        const imageData = new Image();
        imageData.src = cardContent.image;
        card.setFontSize(12);
        card.addImage({
            imageData,
            x: 1.5,
            y: 0.5,
            width: 0.5,
            height: 0.5,

        });
        card.text(cardContent.text, 1.75, 1.25, { align: 'center', maxWidth: 3 });
        card.save('card.pdf')
    };

    return (
        <Box sx={{ width: '80%', margin: '1em auto' }}>
            {cardHTML()}
            <Typography gutterBottom component="div" variant="h6" sx={{ textAlign: 'left' }}>
                Create card
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                    <Item>
                        <TextField
                            id="cardText"
                            name="cardText"
                            type="text"
                            label="Enter text"
                            sx={{ width: '80%' }}
                            value={formik.values.cardText}
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
                        <Button sx={{ fontWeight: 'bold' }} variant="contained" onClick={downloadCard}>Download Card!</Button>
                    </Item>
                </Stack>
            </form>
        </Box>

    )
};