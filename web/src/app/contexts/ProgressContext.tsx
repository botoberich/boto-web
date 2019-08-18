import React from 'react';

// UI
import { notification, Progress, Typography } from 'antd';

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
                total: action.payload,
            };
        }
        case 'NEXT': {
            // const current = state.current;
            // const total = state.total;
            // const percentage = Math.floor(((current + 1) / total) * 100);
            // notification.open({
            //     key: 'ProgressNotificationKey',
            //     message: (
            //         <div>
            //             <Paragraph>
            //                 Uploading file {current + 1} of {total}
            //             </Paragraph>
            //         </div>
            //     ),
            //     description: (
            //         <div>
            //             <Progress
            //                 percent={percentage}
            //                 strokeColor={{
            //                     '0%': '#108ee9',
            //                     '100%': '#87d068',
            //                 }}></Progress>
            //         </div>
            //     ),
            // });
            return {
                ...state,
                loading: true,
                current: state.current + 1,
            };
        }
        case 'END': {
            return {
                ...state,
                loading: false,
                complete: true,
            };
        }
        default:
            throw new Error(`${action.type} is not a valid type in progressReducer`);
    }
}

function ProgressProvider(props) {
    const [progressState, progressDispatch] = React.useReducer(progressReducer, initialProgress);

    React.useEffect(() => {
        if (progressState.loading) {
            const current = progressState.current;
            const total = progressState.total;
            const percentage = Math.floor(((current + 1) / total) * 100);
            notification.open({
                key: 'ProgressNotificationKey',
                message: (
                    <div>
                        <Paragraph>
                            Uploading file {current + 1} of {total}
                        </Paragraph>
                    </div>
                ),
                description: (
                    <div>
                        <Progress
                            status={progressState.loading ? 'active' : 'normal'}
                            percent={percentage}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}></Progress>
                    </div>
                ),
            });
        }
    }, [progressState.current, progressState.total, progressState.loading]);

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
