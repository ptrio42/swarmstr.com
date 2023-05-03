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

