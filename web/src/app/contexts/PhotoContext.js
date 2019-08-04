import React from 'react';

const PhotoContext = React.createContext();

const initialState = {}

function usePhotos() {
    const context = React.useContext(PhotoContext);
    if (!context) {
        throw new Error(`usePhotos must be used within an PhotoProvider`);
    }
    return context;
}

function PhotoProvider(props) {
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const value = React.useMemo(() => ({ overlayVisible, setOverlayVisible }), [overlayVisible]);

    return <PhotoContext.Provider value={value} {...props} />;
}

export { PhotoProvider, usePhotos };
export default PhotoContext;
