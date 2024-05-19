import {Dialog} from "@mui/material";
import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {ImageCreator} from "../components/ImageCreator/ImageCreator";
import {ImageCreatorWorkAreaContextProvider} from "../providers/ImageCreatorWorkAreaContextProvider";
import DialogActions from "@mui/material/DialogActions";
import {uploadToNostrCheckMe} from "../services/uploadImage";
import Badge from "@mui/material/Badge";

interface ImageCreatorDialogProps {
    open: boolean;
    onClose: (image?: any, formik?: any) => void,
    formik: any
}

export const ImageCreatorDialog = ({ open, onClose = () => {}, formik = {} }: ImageCreatorDialogProps) => {

    const handleClose = () => {
        onClose();
    };

    return <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle><Badge badgeContent="BETA">Create image</Badge></DialogTitle>
        <DialogContent>
            <ImageCreatorWorkAreaContextProvider>
                <ImageCreator
                    onSaveImage={(imageData: string) => {
                        const anchor = document.createElement('a');
                        // anchor.className = 'downloaded-image';
                        anchor.href = imageData;
                        anchor.download = 'new-image.png';
                        anchor.click();
                        // setTimeout(() => {
                        //     setIsProcessing(false);
                        // });
                    }}
                    onAddImageToNote={(image: any) => {
                        // const image = new Image();
                        // image.src = imageData;
                        // uploadToNostrCheckMe(image)
                        //     .then((url: string) => {
                        //         console.log('uploaded', url);
                        //         setTimeout(() => {
                                    onClose(image, formik);
                                // })
                            // });
                    }}
                    onClose={() => {
                        onClose();
                    }}
                />
            </ImageCreatorWorkAreaContextProvider>
        </DialogContent>
        <DialogActions>

        </DialogActions>
    </Dialog>
};