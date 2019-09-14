import { ICreateAlbumFormData } from './albums.interface';

export interface ISelectionContextValue {
    selectedThumbnails: string[];
    setSelectedThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    loadingThumbnails: string[];
    setLoadingThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
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

export interface IFormContextValue {
    albumForm: ICreateAlbumFormData;
    setAlbumForm: ({ description, title }) => void;
}

export interface IHeaderContextValue {
    headerTitle: string;
    setHeaderTitle: (string) => void;
}
