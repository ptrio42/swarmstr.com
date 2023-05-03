import { Card } from "@mui/material";
import React, {useEffect, useState} from "react";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import './Team.css';
import { last } from 'lodash';

interface TeamProps {
    pubkeys: string[];
    name: string;
    badgeUrl: string;
    zaps: any[];
    members: { pubkey: string, name: string }[];
    signatureZap: number;
    onZap: (zap: any, team: string, member: string) => void;
}

const LIGHTNING_IMAGES: string[] = [
    'https://uselessshit.co/images/lightning-left.png',
    'https://uselessshit.co/images/lightning-right.png'
];

export const Team = ({ pubkeys = [], name, badgeUrl, zaps = [], members = [], signatureZap, onZap }: TeamProps) => {

    const [lightning, setLightning] = useState<boolean>(false);

    useEffect(() => {
        const latestZap = last(zaps);
        if (latestZap && !latestZap.counted && pubkeys.includes(latestZap.pubkey)) {
            const zapper = members.find((n: any) => n.pubkey === latestZap.pubkey);
            if (zapper) {
                setLightning(true);
                onZap && onZap({
                    ...latestZap,
                    counted: true
                }, name, zapper.name);
                setTimeout(() => {
                    setLightning(false);
                }, 1000);
            }
        }
    }, [zaps]);

    const getZapsQuantity = () => {
        return zaps
            .filter((z: any) => pubkeys.includes(z.pubkey))
            .length;
    };

    const getZapsTotalAmount = () => {
        return (zaps
            .filter((z: any) => pubkeys.includes(z.pubkey)).length * signatureZap)
            .toLocaleString('en-US')
    };

    return (
        <Card className="zaps team" sx={{ maxWidth: 180 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="180"
                    image={badgeUrl}
                    alt={name}
                />
                {
                    lightning && <CardMedia
                        sx={{ position: 'absolute', top: 0 }}
                        component="img"
                        height="180"
                        image={LIGHTNING_IMAGES[Math.floor(Math.random())]}
                        alt={`${name} lightning`}
                        className="lightning"
                    />
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        🫂 Members: {pubkeys.length}<br/>
                        ⚡️ Zaps: {getZapsQuantity()}<br/>
                        <i className="fak fa-satoshisymbol-solidtilt" /> Total: {getZapsTotalAmount()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};