import { IThumbnail } from './photos.interface';

export interface IPhotoContextValue {
    selectedThumbnails: string[];
    setSelectedThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    thumbnails: { [date: string]: { [photoId: string]: IThumbnail } };
    setThumbnails: React.Dispatch<React.SetStateAction<{ [date: string]: { [photoId: string]: IThumbnail } }>>;
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
    isServer: boolean;
}
