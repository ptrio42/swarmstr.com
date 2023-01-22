import React from "react";
import {Bolt, CopyAll} from "@mui/icons-material";
import {ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export interface Metadata {
    nip05: string;
    lud06: string;
    lud16: string;
    about: string;
    picture: string;
    pubkey: string;
    name: string;
}

interface MetadataProps {
    picture?: string;
    lud06?: string;
    lud16?: string;
    npub?: string;
    nip05?: string;
    name?: string;
    supposedName?: string;
    about?: string;
    handleCopyNpub?: (value: string) => any;
    variant?: 'full' | 'simplified'
}

export const Metadata = ({ picture, lud06, lud16, nip05, name, npub, about, handleCopyNpub, supposedName, variant = 'full' }: MetadataProps) => {

    const getProfileDisplayedName = () => {
        return nip05 || name || supposedName || (npub && npub.slice(4, 12) + ':' + npub.slice(npub.length - 8));
    };

    return (
        <React.Fragment>
            <ListItemAvatar>
                <Avatar alt="" src={picture} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {getProfileDisplayedName()}
                            {
                                (lud06 || lud16) &&
                                <React.Fragment>
                                    <a href={'lightning:' + lud06 || lud16}>
                                        <IconButton>
                                            <Bolt sx={{ fontSize: 18 }} color="secondary"/>
                                        </IconButton>
                                    </a>
                                </React.Fragment>
                            }
                            <IconButton onClick={() => {
                                navigator.clipboard.writeText(npub || '');
                                handleCopyNpub && handleCopyNpub(npub || '');
                            }}>
                                <CopyAll sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Typography>
                    </React.Fragment>
                }
                { ...(variant === 'full' && {'secondary':
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            { about }
                        </Typography>
                    </React.Fragment>
                }) }
            />
        </React.Fragment>
    );
};