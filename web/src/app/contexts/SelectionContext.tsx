import React from 'react';
import { ISelectionContextValue } from '../interfaces/contexts.interface';

const SelectionContext = React.createContext(null);

function useSelectonContext(): ISelectionContextValue {
    const context: ISelectionContextValue = React.useContext(SelectionContext);
    if (!context) {
        throw new Error(`useSelectonContext must be used within a SelectionProvider`);
    }
    return context;
}

function SelectionProvider(props) {
    const [selectedThumbnails, setSelectedThumbnails] = React.useState([]);
    const [loadingThumbnails, setloadingThumbnails] = React.useState([]);
    const [loadingLightBox, setLoadingLightBox] = React.useState(false);

    const value = {
        selectedThumbnails,
        setSelectedThumbnails,
        loadingThumbnails,
        setloadingThumbnails,
        loadingLightBox,
        setLoadingLightBox,
    };
    return <SelectionContext.Provider value={value} {...props} />;
}

export { SelectionProvider, useSelectonContext };
export default SelectionContext;
