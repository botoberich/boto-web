import React, { useRef, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

// UI
import { motion } from 'framer-motion';
import { Upload, Icon } from 'antd';
import { OVERLAY_ROOT } from '../../app';
import styles from './UploadOverlay.module.css';

// State
import { useOverlay } from '../../contexts/OverlayContext';
import { getBase64, chunkB64 } from '../../utils/encoding';
import { postPhoto } from '../../services/photo.ts';

const { Dragger } = Upload;

export default function OverlayContainer() {
    const { overlayVisible, setOverlayVisible } = useOverlay();

    return overlayVisible && <UploadOverlay setOverlayVisible={setOverlayVisible}></UploadOverlay>;
}

function UploadOverlay({ setOverlayVisible }) {
    const overlayRef = useRef(document.getElementById(OVERLAY_ROOT));
    const [uploadingInProgress, setUploadInProgress] = useState(false);

    const handleOnChange = useCallback(async e => {
        const { status } = e.file;
        setUploadInProgress(true);
        if (status !== 'uploading') {
            console.log(e.file, e.fileList);
        }
        if (status === 'done') {
            const fileObj = e.file.originFile || e.file.originFileObj;
            const b64 = await getBase64(fileObj);
            let postResults = await postPhoto({ title: fileObj.name, archived: false, trashed: false }, b64);
            console.log({ chunkedb64: chunkB64(b64, 12582912) });
            console.log({ length: b64.length });
            console.log({ postResults });
            console.log(`${e.file.name} file uploaded successfully.`);
            setOverlayVisible(false);
        } else if (status === 'error') {
            console.error(`${e.file.name} file upload failed.`);
            setOverlayVisible(false);
        }
    }, []);

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <Dragger name="file" multiple onChange={handleOnChange}>
                <motion.div
                    animate={
                        uploadingInProgress
                            ? {}
                            : {
                                  y: [0, -10, 0],
                              }
                    }
                    transition={{ loop: Infinity }}
                >
                    <p className="ant-upload-drag-icon" style={{ margin: '0 auto', width: 'fit-content' }}>
                        <Icon type="inbox" />
                    </p>
                </motion.div>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other band
                    files
                </p>
                {uploadingInProgress && (
                    <div className={styles.loadingIcon}>
                        <Icon type="loading-3-quarters" spin />
                    </div>
                )}
            </Dragger>
        </div>,
        overlayRef.current
    );
}
