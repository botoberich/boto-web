import React from 'react';

// UI
import { notification, Progress } from 'antd';
import { NotificationApi } from 'antd/lib/notification';

// types
type ProgressContextValue = {
    notify: NotificationApi['open'];
    inProgress: boolean;
};

const ProgressContext = React.createContext(null);

function ProgressProvider(props) {
    const [inProgress, setInProgress] = React.useState(false);
    const stopProgress = React.useCallback(() => setInProgress(false), []);
    const startProgress = React.useCallback(() => setInProgress(true), []);

    React.useEffect(() => {
        window.onbeforeunload = () => {
            if (inProgress) {
                return 'Changes you made may not be saved.';
            }
        };
    }, [inProgress]);

    const value: ProgressContextValue = {
        notify: notification.open,
        inProgress,
    };

    return <ProgressContext.Provider value={value} {...props} />;
}

function useProgressContext() {
    const context: ProgressContextValue = React.useContext(ProgressContext);
    if (!context) {
        throw new Error(`useProgressContext must be used within an ProgressProvider`);
    }
    return context;
}

export { ProgressProvider, useProgressContext };
export default ProgressContext;
