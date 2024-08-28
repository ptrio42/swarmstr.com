import {Dialog} from "@mui/material";
import {LoadingAnimation} from "../components/LoadingAnimation/LoadingAnimation";
import React from "react";
import Box from "@mui/material/Box";
import "./LoadingDialog.css";

interface LoadingDialogProps {
    open: boolean;
}

export const LoadingDialog = ({ open }: LoadingDialogProps) => {
    const handleClose = (event: any, reason: string) => {
        if (reason && reason === 'backdropClick') return;
    };

    return <Dialog open={open} onClose={handleClose}>
        <Box
            className="dialogAnimation-container"
            sx={{
                width: '128px',
                height: '112px',
                display: 'flex',
                justifyContent: 'center',
                marginLeft: '-16px',
                marginTop: '-27px',
                overflow: 'visible'
            }}
        >
            <LoadingAnimation isLoading={true}/>
        </Box>
    </Dialog>
};