import React, {useState} from "react";
import {FormControl} from "@mui/material";
import Button from "@mui/material/Button";
import {Info} from "@mui/icons-material";
import FormLabel from "@mui/material/FormLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Slider from "@mui/material/Slider";
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const DEFAULT_IMAGE_SIZE = 100;

interface NewImageDialogProps {
    label?: string;
    inputKey?: string;
    onImageUpload?: (image: any) => void,
    onImageReset?: (event: any) => void,
    open: boolean,
    onClose: () => void,
    onSizeChange?: (size: number) => void
}

export const NewImageDialog = ({
    open,
    label = 'new-image',
    inputKey = '',
    onImageUpload = (image: any) => {},
    onImageReset = (event: any) => {},
    onClose = () => {},
    onSizeChange = (size: number) => {}
}: NewImageDialogProps) => {
    const [image, setImage] = useState<any>(null);
    const [size, setSize] = useState<number>(DEFAULT_IMAGE_SIZE);
    const [scale, setScale] = useState(1);
    const [crop, setCrop] = useState<Crop|undefined>();

    const handleImageChange = (event: any) => {
        const files = (event.currentTarget as HTMLInputElement).files;
        if (FileReader && files && files.length > 0) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                const _image = new Image();
                _image.src = fileReader.result as string;
                setImage(_image);
                onImageUpload(_image)
            };
            fileReader.readAsDataURL(files[0])
        }
    };

    const handleImageReset = (event: any) => {
        setImage(null);
        onImageReset(event);
    };

    const handleSizeChange = (event: any, size: number) => {
        setSize(size);
        onSizeChange(size);
    };

    const handleClose = () => {
        onClose();
    };

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Upload a ${label} image.`}</DialogTitle>
        <DialogContent>
            <FormControl>
                <FormLabel sx={{ paddingRight: '0.5em', textTransform: 'capitalize' }} id={`image-${label}-label`}>
                    { label } image
                    <Tooltip title={`Upload a ${label} image.`}>
                        <IconButton>
                            <Info />
                        </IconButton>
                    </Tooltip>
                </FormLabel>
                <Input
                    id={`image-${label}`}
                    name={`image-${label}`}
                    aria-labelledby={`image-${label}-label`}
                    key={inputKey}
                    type="file"
                    onChange={handleImageChange} />
                <Button
                    sx={{ marginLeft: '1em' }}
                    variant="contained"
                    color="warning"
                    disabled={image === null}
                    onClick={handleImageReset}
                >
                    Reset Image
                </Button>
            </FormControl>
            {
                image && <React.Fragment>
                    <FormControl>
                        <FormLabel id={`image-${label}-size-label`}>Image Size</FormLabel>
                        <Slider
                            aria-label="Image Size"
                            value={size}
                            valueLabelDisplay="auto"
                            defaultValue={DEFAULT_IMAGE_SIZE}
                            max={DEFAULT_IMAGE_SIZE + 50}
                            onChange={(event: any, value: number | number[], activeThumb: number) => { handleSizeChange(event, value as number) }} />
                    </FormControl>
                    <FormControl>
                        <ReactCrop crop={crop} onChange={c => {
                            setCrop(c);
                        }} locked={true}>
                            <img
                                alt={`${label} image workarea`}
                                src={image.src}
                                width={image.naturalWidth * ((size / 100) * scale || 100) || '100%'}
                                height={image.naturalHeight * ((size / 100) * scale || 100) || '100%'} />
                        </ReactCrop>
                    </FormControl>
                </React.Fragment>
            }
        </DialogContent>
    </Dialog>
};