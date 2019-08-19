import React from 'react';

interface PhotoContext {
    selectedThumbnails: any[];
    setSelectedThumbnails: React.Dispatch<React.SetStateAction<any[]>>;
    thumbnails: any[];
    setThumbnails: React.Dispatch<React.SetStateAction<any[]>>;
    loadingThumbnails: any[];
    setloadingThumbnails: React.Dispatch<React.SetStateAction<any[]>>;
    loadingLightBox: any[];
    setLoadingLightBox: React.Dispatch<React.SetStateAction<any[]>>;
}

const PhotoContext = React.createContext(null);

function usePhotoContext(): PhotoContext {
    const context = React.useContext(PhotoContext);
    if (!context) {
        throw new Error(`usePhoto must be used within a PhotoProvider`);
    }
    return context;
}

function PhotoProvider(props) {
    const [selectedThumbnails, setSelectedThumbnails] = React.useState([]);
    const [thumbnails, setThumbnails] = React.useState([]);
    const [loadingThumbnails, setloadingThumbnails] = React.useState([]);
    const [loadingLightBox, setLoadingLightBox] = React.useState(false);

    const value = {
        selectedThumbnails,
        setSelectedThumbnails,
        thumbnails,
        setThumbnails,
        loadingThumbnails,
        setloadingThumbnails,
        loadingLightBox,
        setLoadingLightBox,
    };
    return <PhotoContext.Provider value={value} {...props} />;
}

export { PhotoProvider, usePhotoContext };
export default PhotoContext;
