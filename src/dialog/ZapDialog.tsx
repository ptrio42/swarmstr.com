import {Dialog} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import React, {useState} from "react";
import {nFormatter} from "../utils/utils";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {NostrEvent} from "@nostr-dev-kit/ndk";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import {useNostrContext} from "../providers/NostrContextProvider";
import {Cancel as CancelIcon, Comment} from "@mui/icons-material";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import './ZapDialog.css';

interface ZapDialogProps {
    open: boolean,
    event?: NostrEvent,
    onClose?: () => void,
}

const ZAP_AMOUNTS = [
    {
        amount: 21,
        emoji: '🤙'
    },
    {
        amount: 69,
        emoji: '💥'
    },
    {
        amount: 121,
        emoji: '♨️'
    },
    {
        amount: 420,
        emoji: '🌱'
    },
    {
        amount: 1000,
        emoji: '💜'
    },
    {
        amount: 5000,
        emoji: '⚡️'
    },
    {
        amount: 10000,
        emoji: '🫂'
    },
    {
        amount: 20000,
        emoji: '💥'
    },
    {
        amount: 0,
        emoji: '🟠'
    }
];

export const ZapDialog = ({ open, event, onClose }: ZapDialogProps) => {

    const [selectedZapAmount, setSelectedZapAmount] = useState<number>(21);

    const { zap } = useNostrContext();

    const [zapComment, setZapComment] = useState<string>('');

    const handleClose = () => {
        onClose && onClose();
    };

    const handleSelectZapAmount = (amount: number) => {
        setSelectedZapAmount(amount);
    };

    if (!event) {
        return null;
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ color: '#fff' }}>
                Choose zap amount
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }} direction="row">
                    {
                        ZAP_AMOUNTS.map((item: any, index: number) =>
                            <React.Fragment>
                                <Button
                                    sx={{
                                        background: selectedZapAmount === item.amount ? 'rgba(152, 149, 0, 0.3)!important' : 'transparent',
                                        margin: '3px',
                                        width: item.amount === 0 ? '200px' : '100px',
                                    }}
                                    {...(item.amount === 0 && { className: 'customZapAmountBtn' })}
                                    onClick={() => { handleSelectZapAmount(+item.amount) }}
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<React.Fragment>{item.emoji}</React.Fragment>}
                                >
                                    { item.amount === 0 ?
                                        ((selectedZapAmount === 0 || !ZAP_AMOUNTS.map(({amount}) => amount).includes(selectedZapAmount)) ?
                                            <Input value={selectedZapAmount} inputProps={{ type: 'number', min: 1 }} onChange={(event: any) => { setSelectedZapAmount(+event.target.value) }} /> : 'Custom') :
                                        nFormatter(item.amount, 0) }
                                </Button>
                                {
                                    // index % 3 === 0 && <Divider component="div" />
                                }
                            </React.Fragment>

                        )
                    }
                    {/*<Divider component="div" />*/}
                    <Box sx={{ width: '100%', marginTop: '1em' }}>
                        <Input
                            sx={{ width: '100%' }}
                            id="zapComment"
                            name="zapComment"
                            placeholder={'Leave a note...'}
                            value={zapComment}
                            onChange={(event: any) => {
                                setZapComment(event.target.value);
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Comment />
                                </InputAdornment>
                            }
                            {...(zapComment !== '' && { endAdornment:
                                    <InputAdornment position="end" onClick={() => { setZapComment('') }}>
                                        <CancelIcon />
                                    </InputAdornment>
                            })}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        console.log('zapDialog', {event});
                        event && zap(event!, selectedZapAmount, () => handleClose(), zapComment)
                    }}
                >
                    Zap { nFormatter(selectedZapAmount, 0) || '???' } sats!
                </Button>
            </DialogActions>
        </Dialog>
    );
};