import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import { useMousePosition } from "../../../utils/utils"
import "./ImageCreatorWorkArea.css";
import {nip19} from "nostr-tools";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {NewImageDialog} from "../NewImageDialog/NewImageDialog";
import {NewTextDialog} from "../NewTextDialog/NewTextDialog";
import {useImageCreatorWorkAreaContext} from "../../../providers/ImageCreatorWorkAreaContextProvider";
import {ImageCreatorTextEdit} from "../ImageCreatorTextEdit/ImageCreatorTextEdit";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {Cancel} from "@mui/icons-material";

export interface ImageCreatorWorkItemPosition {
    x: number;
    y: number;
}

interface ImageCreatorWorkItemSize {
    width: number;
    height: number;
}

export const DEFAULT_ITEM_TEXT = 'new text';
export const DEFAULT_ITEM_POSITION = { x: 50, y: 50 };
export const DEFAULT_ITEM_FONT_SIZE = 27;
export const DEFAULT_ITEM_COLOR = '#fff';
export const DEFAULT_ITEM_TEXT_SHADOW_COLOR = '#000';

export type ImageCreatorWorkItemType = 'text' | 'image';

export interface ImageCreatorWorkItem {
    id: string;
    type: ImageCreatorWorkItemType;
    content: string;
    position: ImageCreatorWorkItemPosition;
    size?: ImageCreatorWorkItemSize;
    inputKey?: string;
    styles?: any;
    selected?: boolean;
}

interface ImageCreatorWorkAreaProps {
    children?: any;
    onAddText?: (event: any, item: ImageCreatorWorkItem) => void,
    onAddImage?: (event: any, item: ImageCreatorWorkItem) => void,
    onImageReset: () => void
}

export const ImageCreatorWorkArea = ({
     children,
     onAddText = (event: any, item: ImageCreatorWorkItem) => {},
     onAddImage = (event: any, item: ImageCreatorWorkItem) => {},
     onImageReset = () => {}
}: ImageCreatorWorkAreaProps) => {
    const workAreaRef = useRef();
    const menuAnchorElRef = useRef<any|null|undefined>();
    const mousePosition = useMousePosition();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorEl);
    const [position, setPosition] = useState<ImageCreatorWorkItemPosition>(DEFAULT_ITEM_POSITION);
    const [menuPosition, setMenuPosition] = useState<ImageCreatorWorkItemPosition>(DEFAULT_ITEM_POSITION);
    // const [items, setItems] = useState<ImageCreatorWorkItem[]>([]);
    const [newImageDialogOpen, setNewImageDialogOpen] = useState<string>('');
    const [newTextDialogOpen, setNewTextDialogOpen] = useState<boolean>(false);

    const { workItems, setWorkItems, addOrEditWorkItem, createNewWorkItem, selectedWorkItem, removeWorkItem } = useImageCreatorWorkAreaContext();

    const textItem: ImageCreatorWorkItem = workItems?.filter(({ type }: ImageCreatorWorkItem) => type === 'text')[0];
    const imageItem: ImageCreatorWorkItem = workItems?.filter(({ type }: ImageCreatorWorkItem) => type === 'image')[0];

    const hasItemsOfType = (itemType: ImageCreatorWorkItemType) => workItems
        .findIndex(({ type }: ImageCreatorWorkItem) => type === itemType) > -1;

    const getRandomInputKey = (length: number = 36 ) => {
        return Math.random().toString(length);
    };

    const handleWorkAreaClick = (event: any) => {
        // console.log({mousePosition, event});

        if (!selectedWorkItem) {
            // const { x, y } = mousePosition;
            setMenuPosition(position);
            setMenuAnchorEl(menuAnchorElRef.current);
        }
    };

    // const handleTextChange = (event: any, size: number, color: string) => {
    //     // if (hasItemsOfType('text')) editTextItem();
    //     addTextItem(event, event.target.value, size, color);
    //     setNewImageDialogOpen(false);
    // };

    // const createNewWorkItem = (): ImageCreatorWorkItem => ({
    //         id: getRandomInputKey(12),
    //         type: 'text',
    //         content: DEFAULT_ITEM_TEXT,
    //         position,
    //         styles: {
    //             fontSize: DEFAULT_ITEM_FONT_SIZE,
    //             color: DEFAULT_ITEM_COLOR
    //         }
    // });

    // const handleTextItem = (workItem: ImageCreatorWorkItem) => {
    //     if (workItems.findIndex(({id}) => id === workItem.id) > -1) {
    //         setWorkItems([
    //             ...workItems.map((item: ImageCreatorWorkItem) => item.id === workItem.id ? ({...workItem}) : item)
    //         ] as ImageCreatorWorkItem[]);
    //     } else {
    //         setWorkItems([
    //             ...workItems,
    //             workItem
    //         ]);
    //     }
    // };

    // const editItem = (itemType: ImageCreatorWorkItemType) => {
    //     setItems([
    //         ...items.map((item: ImageCreatorWorkItem) => item.type === i.type ? ({...item}) : i)
    //     ])
    // };

    const handleImageChange = (image: any) => {
        // if (hasItemsOfType('image')) editItem();
        // if (!hasItemsOfType('image')) {
        addImageItem(image);
        // }
        // setNewImageDialogOpen(true)
        // onAddImage(event, position);
    };

    const handleItemsReset = (itemType?: ImageCreatorWorkItemType) => {
        setWorkItems([
            ...workItems.filter(({ type }: ImageCreatorWorkItem) => itemType ? itemType !== type : false)
        ] as ImageCreatorWorkItem[]);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // const handleChangeImagePosition = (event: any) => {
    //     const _position = mousePosition;
    //     onAddImage(event, _position);
    //     setPosition(_position);
    // };
    //
    // const handleChangeTextPosition = (event: any) => {
    //     const _position = mousePosition;
    //     onAddText(event, _position);
    //     setPosition(_position);
    // };

    const addImageItem = (image: any) => {
        const newItem: ImageCreatorWorkItem = {
            id: getRandomInputKey(12),
            type: 'image',
            content: image.src,
            position,
            inputKey: getRandomInputKey()
        };
        if (hasItemsOfType('image')) {
            setWorkItems([
                ...workItems.map((item: ImageCreatorWorkItem) => item.type === 'image' ? ({...newItem}) : item)
            ] as ImageCreatorWorkItem[]);
        } else {
            setWorkItems([
                ...workItems,
                newItem
            ]);
        }
        onAddImage({ target: { value: image.src } }, newItem);
    };

    // const handleNewTextDialogClose = (event: any, size: number, color: string) => {
    //     setNewTextDialogOpen(false);
    //     handleTextChange(event, size, color);
    // };

    const handleNewImageDialogClose = () => {
        setNewImageDialogOpen('');
        // handleImageChange({ src: imageItem.content });
    };

    useEffect(() => {
        // @ts-ignore
        const { left, top } = workAreaRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        setPosition({
            x: mousePosition.x - left,
            y: mousePosition.y - top
        })
    }, [mousePosition]);

    useEffect(() => {
        if (selectedWorkItem) {
            const { position: {x, y} } = selectedWorkItem;
            console.log('mouse position changed: ', {selectedWorkItem, position});
            if (x !== position.x || y !== position.y) {

                // console.log('updateMousePositon: event', {left, top, event: workAreaRef.current})
                addOrEditWorkItem({
                    ...selectedWorkItem,
                    position
                });
            }
        }
        // console.log({mousePosition})
    }, [selectedWorkItem, position]);

    return <React.Fragment>
        <Box sx={{ backgroundColor: 'rgba(255,238,81,.05)', display: 'flex', justifyContent: 'center', padding: '4px' }}>
            {
                selectedWorkItem && <Typography>Tap {selectedWorkItem.type} to drop it.</Typography>
            }
            {
                workItems.length > 0 && !selectedWorkItem && <Typography>Tap object to move it.</Typography>
            }
            {
                workItems.length > 0 &&
                workItems.some(({content}) => content === DEFAULT_ITEM_TEXT) &&
                <Typography><Link to="#text-options">Click for object options.</Link></Typography>
            }


        </Box>
        <Box ref={workAreaRef} className="imageCreator-workArea" >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    zIndex: 998
                }}
                onClick={handleWorkAreaClick}
            ></Box>
            {
                workItems.length === 0 && <Typography
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    component="div"
                    variant="body1"
                >
                    Tap this area to add text
                </Typography>
            }
            <Box className="workArea-anchorElement" sx={{ left: menuPosition.x, top: menuPosition.y }} ref={menuAnchorElRef}></Box>
            { children }
        </Box>
        {
            workItems.length > 0 && <Box id="text-options" className="workArea-itemsOptions">
                {
                    workItems
                        .filter(({type}) => type === 'text')
                        .map((item: ImageCreatorWorkItem) => <React.Fragment>
                        <ImageCreatorTextEdit
                            workItem={item}
                            onTextChange={(_item: ImageCreatorWorkItem) => {
                                console.log('onTextChange', {_item})
                                addOrEditWorkItem(_item);
                            }}
                            onRemoveTextItem={() => removeWorkItem(item)}
                        />
                        <Divider/>
                    </React.Fragment>)
                }
                {
                    workItems
                        .filter(({type}) => type === 'image')
                        .map((item: ImageCreatorWorkItem) => <Box sx={{ display: 'flex' }}>
                            <img width="64px" src={item.content} />
                            <Button color="secondary" onClick={() => { setNewImageDialogOpen(item.id) }}>Change image</Button>
                            <IconButton onClick={() => { removeWorkItem(item) }}><Cancel/></IconButton>
                            <NewImageDialog
                                open={newImageDialogOpen === item.id}
                                label={item.id}
                                inputKey={item.id}
                                onImageUpload={(image: any) => {
                                    addOrEditWorkItem({
                                        ...item,
                                        content: image.src
                                    });
                                    handleNewImageDialogClose();

                                }}
                                onSizeChange={(size: number) => {
                                    addOrEditWorkItem({
                                        ...item,
                                        styles: {
                                            ...item.styles,
                                            width: `${size}%`
                                        }
                                    })
                                }}
                                onImageReset={(_event: any) => {
                                    addOrEditWorkItem({
                                        ...item,
                                        content: ''
                                    })
                                }}
                                onClose={handleNewImageDialogClose}
                            />
                        </Box>)
                }
            </Box>
        }
        <Menu
            id="image-work-area-menu"
            anchorEl={menuAnchorEl}
            open={open}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                    // setNewTextDialogOpen(true); handleMenuClose()
                    addOrEditWorkItem(createNewWorkItem(position, 'text', {
                        fontSize: DEFAULT_ITEM_FONT_SIZE,
                        color: DEFAULT_ITEM_COLOR,
                        textShadow: `1px 1px 2px ${DEFAULT_ITEM_TEXT_SHADOW_COLOR}`,
                        background: 'transparent'
                    }));
                    handleMenuClose();
                }}
            >
                Add text</MenuItem>

            <MenuItem onClick={() => {
                addOrEditWorkItem(createNewWorkItem(position, 'image', {
                    width: '33%'
                }));
                // setNewImageDialogOpen(true);
                handleMenuClose();
            }}
            >Add image</MenuItem>

            {/*{ hasItemsOfType('image') && <MenuItem onClick={(event) => { handleMenuClose(); imageItem && addImageItem({ src: imageItem.content })}}>Move image here</MenuItem> }*/}
        </Menu>
        {/*<NewTextDialog*/}
            {/*label={'main'}*/}
            {/*// value={textItem?.content || ''}*/}
            {/*open={newTextDialogOpen}*/}
            {/*onClose={handleNewTextDialogClose}*/}
            {/*// onTextChange={handleTextChange}*/}
            {/*defaultTextSize={textItem?.styles?.fontSize}*/}
            {/*defaultTextColor={textItem?.styles?.color}*/}
        {/*/>*/}
    </React.Fragment>
};