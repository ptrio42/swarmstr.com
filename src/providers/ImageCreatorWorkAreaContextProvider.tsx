import React, {useContext, useState} from "react";
import {
    DEFAULT_ITEM_COLOR,
    DEFAULT_ITEM_FONT_SIZE,
    DEFAULT_ITEM_TEXT, DEFAULT_ITEM_TEXT_SHADOW_COLOR,
    ImageCreatorWorkItem, ImageCreatorWorkItemPosition, ImageCreatorWorkItemType
} from "../components/ImageCreator/ImageCreatorWorkArea/ImageCreatorWorkArea";
import {ImageCreatorWorkAreaContext} from "../contexts/ImageCreatorWorkAreaContext";

interface ImageCreatorWorkAreaContextProviderProps {
    children: any;
    onSaveImage?: () => void
}

export const ImageCreatorWorkAreaContextProvider = ({ children, onSaveImage = () => {} }: ImageCreatorWorkAreaContextProviderProps) => {
    const [workItems, setWorkItems] = useState<ImageCreatorWorkItem[]>([]);

    const selectedWorkItem = workItems.find((workItem: ImageCreatorWorkItem) => workItem.selected);

    const addOrEditWorkItem = (workItem: ImageCreatorWorkItem) => {
        console.log('addOrEditWorkItem', {workItem}, {workItems});
        if (workItems.findIndex(({id}) => id === workItem.id) > -1) {
            setWorkItems([
                ...workItems.map((item: ImageCreatorWorkItem) => item.id === workItem.id ?
                    ({...workItem}) :
                    (workItem.selected ? { ...item, selected: false } : item)
            )] as ImageCreatorWorkItem[]);
        } else {
            setWorkItems([
                ...workItems,
                workItem
            ]);
        }
    };

    const selectWorkItem = (workItem: ImageCreatorWorkItem) => {
        const _workItem = workItems.find(({id}) => id === workItem.id);
        if (_workItem) addOrEditWorkItem({
            ..._workItem,
            selected: true
        });
    };

    const removeWorkItem = (workItem: ImageCreatorWorkItem) => {
        setWorkItems([
            ...workItems.filter(({id}: ImageCreatorWorkItem) => workItem.id !== id)
        ]);
    };

    const getRandomInputKey = (length: number = 36 ) => {
        return Math.random().toString(length);
    };

    const createNewWorkItem = (position: ImageCreatorWorkItemPosition, type?: ImageCreatorWorkItemType, styles?: any): ImageCreatorWorkItem => ({
        id: getRandomInputKey(12),
        type: type || 'text',
        content: type === 'text' ? `${DEFAULT_ITEM_TEXT} #${workItems?.length || 0}` : type === 'image' ? `` : '',
        position,
        ...(styles && {styles})
    });

    return <ImageCreatorWorkAreaContext.Provider value={{
        workItems, setWorkItems, selectedWorkItem, selectWorkItem, createNewWorkItem, addOrEditWorkItem,
        removeWorkItem
    }}>
        { children }
    </ImageCreatorWorkAreaContext.Provider>
};

export const useImageCreatorWorkAreaContext = () => useContext(ImageCreatorWorkAreaContext);