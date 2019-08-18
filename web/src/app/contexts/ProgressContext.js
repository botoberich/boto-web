import React from 'react';

// UI
import { notification, Progress } from 'antd';

const ProgressContext = React.createContext();

function ProgressProvider(props) {
    const [inProgress, setInProgress] = React.useState(true);
    React.useEffect(() => {
        window.onbeforeunload = () => {
            if (inProgress) {
                return 'Changes you made may not be saved.';
            }
        };
    }, [inProgress]);

    const value = {
        notification,
    };

    return <ProgressContext.Provider value={value} {...props} />;
}

function usePhotoContext() {
    const context = React.useContext(ProgressContext);
    if (!context) {
        throw new Error(`usePhotoContext must be used within an ProgressProvider`);
    }
    return context;
}

export { ProgressProvider, usePhotoContext };
export default ProgressContext;
