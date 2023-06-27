import {GUIDES} from "../stubs/nostrResources";

export interface Guide {
    id: string;
    issue: string;
    fix: string;
    urls?: string[];
    createdAt?: string;
    updatedAt: string;
    imageUrls?: string[];
    tags?: string[];
    bulletPoints?: string[];
    isRead?: boolean;
    attachedNoteId?: string;
}

export const getReadGuides = (): string[] => {
    return (localStorage.getItem('readGuides') || '')
        .split(',');
};

export const saveReadGuides = (readGuides: string[]) => {
    localStorage.setItem('readGuides', readGuides.join(','));
};

export const isGuideRead = (guideId: string) => {
    return getReadGuides().indexOf(guideId) > -1;
};

export const findGuideById = (guideId: string): Guide | undefined => {
    return GUIDES.find(g => g.id === guideId);
};

export const findGuideByRelatedNostrEventId = (hex: string): Guide | undefined => {
    return GUIDES.find(g => g.attachedNoteId === hex);
};