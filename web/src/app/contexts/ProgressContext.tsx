import React from 'react';

// UI
import { notification, Progress, Typography } from 'antd';
import { ConfigProps } from 'antd/lib/notification';

const { Paragraph } = Typography;

// types
type ProgressState = {
    complete: boolean;
    current: number;
    loading: boolean;
    total: number;
    cmd: 'Upload' | 'Delete' | 'Download' | 'Update' | 'None';
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
const notificationProgressConfig: ConfigProps = {
    placement: 'bottomRight',
    bottom: 50,
    duration: null,
};

const notificationCompleteConfig: ConfigProps = {
    placement: 'bottomRight',
    bottom: 50,
    duration: 2,
};

// Progress State
const ProgressContext = React.createContext(null);
const initialProgress: ProgressState = {
    complete: false,
    current: 0,
    loading: false,
    total: 1,
    cmd: 'None',
};
function progressReducer(state: ProgressState, action: ProgressAction) {
    console.log('action', action);
    switch (action.type) {
        case 'START': {
            return {
                ...state,
                loading: true,
                complete: false,
                total: action.payload.length,
                cmd: action.payload.cmd,
            };
        }
        case 'NEXT': {
            return {
                ...state,
                loading: true,
                current: state.current + 1,
            };
        }
        case 'END': {
            return {
                ...state,
                current: 0,
                loading: false,
                complete: true,
            };
        }
        default:
            throw new Error(`${action.type} is not a valid type in progressReducer`);
    }
}

const cmdVerbageMap = {
    Upload: ['Uploading', 'uploaded'],
    Delete: ['Deleting', 'deleted'],
    Download: ['Downloading', 'downloaded'],
    Update: ['Updating', 'updated'],
};

function ProgressProvider(props) {
    const [progressState, progressDispatch] = React.useReducer(progressReducer, initialProgress);

    React.useEffect(() => {
        if (progressState.loading && progressState.current !== progressState.total) {
            const current = progressState.current;
            const total = progressState.total;
            const percentage = Math.floor(((current + 1) / total) * 100);
            notification.open({
                ...notificationProgressConfig,
                key: 'ProgressNotificationKey',
                message: (
                    <div>
                        <Paragraph>
                            {cmdVerbageMap[progressState.cmd][0]} file {current + 1} of {total}
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
            notification.success({
                ...notificationCompleteConfig,
                message: (
                    <div>
                        <Paragraph>
                            Successfully {cmdVerbageMap[progressState.cmd][1]} {progressState.total}{' '}
                            {progressState.total > 1 ? 'files' : 'file'}.
                        </Paragraph>
                    </div>
                ),
            });
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
