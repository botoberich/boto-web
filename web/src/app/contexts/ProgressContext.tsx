import React from 'react';

// UI
import { notification, Progress, Typography } from 'antd';
import { NotificationApi } from 'antd/lib/notification';

const { Paragraph } = Typography;

// types
type ProgressState = {
    complete: boolean;
    current: number;
    loading: boolean;
    total: number;
};

type ProgressAction = {
    payload?: any;
    type: 'START' | 'END' | 'NEXT' | 'TOTAL';
};

type ProgressValue = {
    inProgress: boolean;
    notify: () => void;
    progressDispatch: React.Dispatch<ProgressAction>;
};

type ProgressContextValue = ProgressState & ProgressValue;

// Sets global config for all notifications
notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: null,
});

// Progress State
const ProgressContext = React.createContext(null);
const initialProgress: ProgressState = {
    complete: false,
    current: 0,
    loading: false,
    total: 1,
};
function progressReducer(state: ProgressState, action: ProgressAction) {
    console.log('action', action);
    switch (action.type) {
        case 'START': {
            return {
                ...state,
                loading: true,
            };
        }
        case 'END': {
            return {
                ...state,
                loading: false,
                complete: true,
            };
        }
        case 'NEXT': {
            if (state.current + 1 === state.total) {
                return {
                    ...state,
                    current: state.total,
                    complete: true,
                };
            }
            return {
                ...state,
                current: state.current + 1,
            };
        }
        case 'TOTAL':
            return {
                ...state,
                total: action.payload,
            };
        default:
            throw new Error(`${action.type} is not a valid type in progressReducer`);
    }
}

function ProgressProvider(props) {
    const [progressState, progressDispatch] = React.useReducer(progressReducer, initialProgress);

    const notify = React.useCallback(() => {
        const current = progressState.current;
        const total = progressState.total;
        const percentage = Math.floor(current + 1 / total) * 100;
        notification.open({
            message: (
                <div>
                    <Paragraph>
                        Uploading file {current + 1} of {total}
                    </Paragraph>
                </div>
            ),
            description: (
                <div>
                    <Progress percent={percentage}></Progress>
                </div>
            ),
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }, [progressState.current, progressState.total]);

    React.useEffect(() => {
        if (progressState.complete) {
            notification.destroy();
        }
    }, [progressState.complete]);

    React.useEffect(() => {
        window.onbeforeunload = () => {
            if (progressState.loading) {
                return 'Changes you made may not be saved.';
            }
        };
    }, [progressState.loading]);

    const value: ProgressValue = {
        notify,
        inProgress: progressState.loading,
        progressDispatch,
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
