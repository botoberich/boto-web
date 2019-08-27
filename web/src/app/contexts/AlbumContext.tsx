import React from 'react';

interface AlbumContext {}

type AlbumState = {
    albums: any[];
    loading: boolean;
    completed: boolean;
    error: boolean | Error;
};

type AlbumAction = {
    payload?: {
        albums: any[];
    };
    error?: any;
    type: 'fetch_success' | 'fetching' | 'fetch_error';
};

const AlbumContext = React.createContext(null);

function useAlbumContext() {
    const context: AlbumContext = React.useContext(AlbumContext);
    if (!context) {
        throw new Error(`useAlbum must be used within a AlbumProvider`);
    }
    return context;
}

const initialAlbum: AlbumState = {
    albums: [],
    loading: false,
    completed: false,
    error: null,
};

function albumReducer(state: AlbumState, action: AlbumAction) {
    switch (action.type) {
        case 'fetching': {
            return {
                ...state,
                loading: true,
            };
        }
        case 'fetch_success':
            return {
                ...state,
                loading: false,
                error: null,
                albums: action.payload.albums,
            };
        case 'fetch_error':
            return {
                ...state,
                error: action.error,
            };
        default:
            throw new Error(`Album reducer: "${action.type}" is not a valid type.`);
    }
}

function AlbumProvider(props) {
    const [albumState, albumDispatch] = React.useReducer(albumReducer, initialAlbum);

    const value = { albumState, albumDispatch };

    return <AlbumContext.Provider value={value} {...props} />;
}

export { AlbumProvider, useAlbumContext };
export default AlbumContext;
