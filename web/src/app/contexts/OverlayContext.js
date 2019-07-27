import React from 'react';

const OverlayContext = React.createContext();

function useOverlay() {
    const context = React.useContext(OverlayContext);
    if (!context) {
        throw new Error(`useOverlay must be used within a CountProvider`);
    }
    return context;
}

function OverlayProvider(props) {
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const value = React.useMemo(() => ({ overlayVisible, setOverlayVisible }), [overlayVisible]);

    return <OverlayContext.Provider value={value} {...props} />;
}

export { OverlayProvider, useOverlay };
export default OverlayContext;
