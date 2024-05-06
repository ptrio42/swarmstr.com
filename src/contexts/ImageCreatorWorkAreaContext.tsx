import {
    DEFAULT_ITEM_POSITION,
    ImageCreatorWorkItem,
    ImageCreatorWorkItemPosition
} from "../components/ImageCreator/ImageCreatorWorkArea/ImageCreatorWorkArea";
import {createContext, SetStateAction} from "react";

type ImageCreatorWorkAreaContextType = {
    workItems: ImageCreatorWorkItem[];
    setWorkItems: (workItems: SetStateAction<ImageCreatorWorkItem[]>) => void;
    selectedWorkItem?: ImageCreatorWorkItem;
    selectWorkItem: (workItem: ImageCreatorWorkItem) => void;
    createNewWorkItem: (position: ImageCreatorWorkItemPosition) => ImageCreatorWorkItem;
    addOrEditWorkItem: (workItem: ImageCreatorWorkItem) => void;
    removeWorkItem: (workItem: ImageCreatorWorkItem) => void;
    mousePosition?: ImageCreatorWorkItemPosition;
};

export const ImageCreatorWorkAreaContext = createContext<ImageCreatorWorkAreaContextType>({
    workItems: [],
    setWorkItems: () => {},
    selectWorkItem: () => {},
    createNewWorkItem: () => ({'id': '', type: 'text', content: '', position: DEFAULT_ITEM_POSITION}),
    addOrEditWorkItem: () => {},
    removeWorkItem: () => {}
});