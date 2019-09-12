import React from 'react';
import { notification, Typography } from 'antd';
import { ArgsProps } from 'antd/lib/notification';

const { Paragraph } = Typography;

const DEFAULT_DURATION = 4;
const DEFAULT_PLACEMENT = 'bottomRight';
const DEFAULT_OFFSET = 50;

const notificationConfig = (msg, options: ArgsProps): ArgsProps => ({
    ...options,
    bottom: DEFAULT_OFFSET,
    placement: options.placement || DEFAULT_PLACEMENT,
    duration: options.duration || DEFAULT_DURATION,
    message: (
        <div>
            <Paragraph>{msg}</Paragraph>
        </div>
    ),
});

export function notifyDestroy() {
    notification.destroy();
}

export function notifySuccess(msg, options: ArgsProps = { message: '' }) {
    notification.success(notificationConfig(msg, options));
}

export function notifyError(msg, options: ArgsProps = { message: '' }) {
    notification.error(notificationConfig(msg, options));
}

export function notifyInfo(msg, options: ArgsProps = { message: '' }) {
    notification.info(notificationConfig(msg, options));
}
