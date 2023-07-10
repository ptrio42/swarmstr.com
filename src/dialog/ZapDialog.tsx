import {Dialog} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import React, {useState} from "react";
import {nFormatter} from "../utils/utils";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {NostrEvent} from "@nostr-dev-kit/ndk";
import {useNostrNoteContext} from "../providers/NostrNoteContextProvider";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";

interface ZapDialogProps {
    open: boolean,
    event?: NostrEvent,
    onClose?: () => void,
    npub?: string,
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
    }
];

export const ZapDialog = ({ open, event, npub, onClose }: ZapDialogProps) => {

    const [selectedZapAmount, setSelectedZapAmount] = useState<number>(21);

    const { zap } = useNostrNoteContext();

    const handleClose = () => {
        onClose && onClose();
    };

    const handleSelectZapAmount = (amount: number) => {
        setSelectedZapAmount(amount);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ color: '#fff' }}>
                Choose zap amount
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ flexWrap: 'wrap' }} direction="row">
                    {
                        ZAP_AMOUNTS.map((item: any, index: number) =>
                            <React.Fragment>
                                <Button
                                    sx={{ background: selectedZapAmount === item.amount ? 'rgba(255,255,255,.33)!important' : 'transparent' }}
                                    onClick={() => { handleSelectZapAmount(+item.amount) }}
                                    startIcon={<React.Fragment>{item.emoji}</React.Fragment>}
                                >
                                    { nFormatter(item.amount, 0) }
                                </Button>
                                {
                                    index % 3 === 0 && <Divider component="div" />
                                }
                            </React.Fragment>

                        )
                    }
                    <Divider component="div" />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        event && zap(event!, selectedZapAmount, () => handleClose())
                    }}
                >
                    Zap { nFormatter(selectedZapAmount, 0) || '???' } sats!
                </Button>
            </DialogActions>
        </Dialog>
    );
};