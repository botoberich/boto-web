import React, { useRef, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

// UI
import { motion } from 'framer-motion';
import { Upload, Icon, Button } from 'antd';
import { OVERLAY_ROOT } from '../../app';
import styles from './UploadOverlay.module.css';

// State
import { getExif } from '../../utils/exif';
import { useOverlay } from '../../contexts/OverlayContext';
import { getBase64 } from '../../utils/encoding';
import { postPhotos } from '../../services/photo.service';

const { Dragger } = Upload;

export default function OverlayContainer() {
    const { overlayVisible, setOverlayVisible } = useOverlay();

    return overlayVisible && <UploadOverlay setOverlayVisible={setOverlayVisible}></UploadOverlay>;
}

function UploadOverlay({ setOverlayVisible }) {
    const overlayRef = useRef(document.getElementById(OVERLAY_ROOT));
    const [uploadingInProgress, setUploadInProgress] = useState(false);

    const handleOnChange = useCallback(
        async e => {
            console.log(e);
            const { status } = e.file;
            setUploadInProgress(true);
            if (status !== 'uploading') {
                console.log(e.file, e.fileList);
            }
            if (status === 'done') {
                const fileObj = e.file.originFile || e.file.originFileObj;
                const b64 = await getBase64(fileObj);
                console.log({ b64 });
                const exifData = await getExif(b64);
                console.log({ exifData });

                const metaData = { title: fileObj.name, archived: false, trashed: false };
                let postRes = await postPhotos([{ metaData, b64 }]);
                console.log({ postRes });
                if (postRes.status === 'success') {
                    let $postPhotos = postRes.data.$postPhotos;
                    let photoIds = postRes.data.photoIds;
                    console.log('UPLOADING PHOTO IDS: ', photoIds);
                    $postPhotos.subscribe({
                        next: res => {
                            console.log('PHOTO UPLOADED: ', res.photoId);
                        },
                        complete: () => {
                            console.log('ALL PHOTOS UPLOADED!');
                            setOverlayVisible(false);
                        },
                    });
                }
            } else if (status === 'error') {
                console.error(`${e.file.name} file upload failed.`);
                setOverlayVisible(false);
            }
        },
        [uploadingInProgress]
    );

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <Dragger name="file" multiple onChange={handleOnChange}>
                <motion.div
                    animate={
                        uploadingInProgress
                            ? {
                                  y: [0, -10, 0],
                              }
                            : {}
                    }
                    transition={{ loop: Infinity }}>
                    <p className="ant-upload-drag-icon" style={{ margin: '0 auto', width: 'fit-content' }}>
                        <Icon type="inbox" />
                    </p>
                </motion.div>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other band
                    files
                </p>

                <div className={styles.closeOverlayButton}>
                    <Icon
                        aria-label="Close overlay"
                        type="close-circle"
                        onClick={e => {
                            e.stopPropagation();
                            setOverlayVisible(false);
                        }}
                    />
                </div>
            </Dragger>
        </div>,
        overlayRef.current
    );
}
