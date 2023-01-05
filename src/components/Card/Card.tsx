import React, {useRef, useState} from "react";
import {CardActionArea} from "@mui/material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import QRCode from "react-qr-code";
import {LatestBitcoinBlock} from "../LatestBitcoinBlock/LatestBitcoinBlock";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";

export enum CardType {
    BusinessCard = 'business-card',
    Bookmark = 'bookmark',
    Sticker = 'sticker',
    ChristmasCard = 'christmas-card'
}

export interface CardProps {
    name?: string;
    slogan: string;
    sloganColor: string;
    sloganFontSize: number;
    sloganTextShadow: boolean;
    sloganTextShadowColor: string;
    mainImage: any;
    backgroundImage?: any;
    backgroundImageSize: number;
    satsAmount?: number;
    type: CardType;
    footer: string;
    footerColor: string;
    footerFontSize: number;
    overlay?: boolean;
    overlayColor?: string;
    latestBlock?: number;
    latestBlockColor?: string;
    cardWidth: number;
    cardHeight: number;
    backgroundPositionX: number;
    backgroundPositionY: number;
    primaryImageFormatWidth: number;
    primaryImageFormatHeight: number;
    secondaryImageFormatWidth: number;
    secondaryImageFormatHeight: number;
    includeLightningGift?: boolean;
    qrCodeSize?: number;
    lnurl?: string;
    lineHeight?: number;
}
export const SocialCard = ({ slogan, sloganColor, sloganFontSize, sloganTextShadow, sloganTextShadowColor, mainImage,
                         backgroundImage, backgroundImageSize, satsAmount, type, footer,
                         footerColor, footerFontSize, overlay, overlayColor, latestBlock = undefined, latestBlockColor,
                         cardWidth, cardHeight, backgroundPositionX, backgroundPositionY,
                         primaryImageFormatWidth, primaryImageFormatHeight, includeLightningGift = false,
                         secondaryImageFormatWidth, secondaryImageFormatHeight, qrCodeSize = 72, lnurl = '', lineHeight = 1 }: CardProps) => {

    const qrCodeRef = useRef();

    const [open, setOpen] = useState(false);

    const getCardPreviewBackgroundSize = () => {
        if (backgroundImage) {
            const image = new Image();
            image.src = backgroundImage;
            return backgroundImageSize / 100 * image.naturalWidth + 'px'
                + ' ' + backgroundImageSize / 100 * image.naturalHeight + 'px';
        }
        return '100% 100%';
    };

    return (
        <React.Fragment>
            <Backdrop
                sx={{ color: '#fff', background: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <Card sx={{
                    marginTop: '2em !important',
                    width: `${cardWidth}in`,
                    height: `${cardHeight}in`,
                    margin: '0 auto 3em auto',
                    background: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: getCardPreviewBackgroundSize(),
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionY: type === CardType.Bookmark ? '2in' : '0',
                    backgroundPosition: `${-backgroundPositionX}px ${-backgroundPositionY}px`,
                    borderRadius: '33px',
                }}>
                    <CardActionArea sx={{
                        width: overlay ? '90%' : '100%',
                        height: overlay ? '90%' : '100%',
                        background: overlay ? overlayColor : 'transparent',
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: type === CardType.BusinessCard ? 'center' : 'flex-start' }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: type === CardType.BusinessCard ? 'center' : 'flex-start' }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    width: `${primaryImageFormatWidth}in`,
                                    height: `${primaryImageFormatHeight}in`,
                                    objectFit: 'fill',
                                    marginTop: '0.15in',
                                    borderRadius: '50%',
                                    border: '4px solid #000'
                                }}
                                image={mainImage}
                            />
                            {
                                (includeLightningGift || (type === CardType.Sticker && lnurl !== '')) &&
                                <Box
                                    sx={{
                                        width: `${secondaryImageFormatWidth}in`,
                                        height: `${secondaryImageFormatHeight}in`,
                                        marginLeft: '0.1in',
                                        marginTop: '0.15in',
                                        overflow: 'hidden',
                                        border: '4px solid #000'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(lnurl);
                                        setOpen(true);
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: `${secondaryImageFormatWidth}in`,
                                            height: `${secondaryImageFormatHeight}in`,
                                            margin: '0',
                                            padding: '0'
                                        }}
                                        ref={qrCodeRef}
                                    >
                                        <QRCode size={qrCodeSize} value={lnurl} />
                                    </Box>
                                </Box>

                            }
                            { latestBlock &&
                            <Box sx={{
                                position: 'absolute',
                                top: '0.05in',
                                left: '0.05in',
                                fontWeight: 'bold',
                                color: latestBlockColor
                            }}>
                                <LatestBitcoinBlock />
                            </Box>
                            }
                        </Box>
                        <CardContent sx={{ padding: '0px', paddingTop: '8px' }}>
                            <Typography
                                sx={{
                                    fontSize: `${sloganFontSize}pt`,
                                    color: sloganColor,
                                    maxWidth: `${cardWidth - 0.5}in`,
                                    overflow: 'hidden', overflowWrap: 'break-word',
                                    textShadow: sloganTextShadow ? `1px 1px ${sloganTextShadowColor}` : 'none',
                                    lineHeight,
                                    padding: '8px'
                                }}
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {slogan}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Typography sx={{ fontSize: `${footerFontSize}pt`, color: footerColor, marginTop: '-1em' }}>
                                { footer }
                            </Typography>
                        </CardActions>
                    </CardActionArea>
                </Card>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message="Lightning URL copied to clipboard!"
                />
            </Backdrop>
        </React.Fragment>
    );
};