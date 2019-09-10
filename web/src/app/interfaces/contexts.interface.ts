export interface ISelectionContextValue {
    selectedThumbnails: string[];
    setSelectedThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    loadingThumbnails: string[];
    setloadingThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    loadingLightBox: boolean;
    setLoadingLightBox: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IServiceContextValue {
    service: string;
    toggleService: () => void;
    setServer: () => void;
    setClient: () => void;
    useServer: boolean;
}
