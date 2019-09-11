import React from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon, Button, Spin } from 'antd';
import styles from './PhotoGridItem.module.css';

// State
import { getPhotoById } from '../../services/photo.service';
import { useSelectonContext } from '../../contexts/SelectionContext';

const TIME_TO_DOWNLOAD = 1000;

function PhotoGridItem({ id, src }) {
    const [open, setOpen] = React.useState(false);
    const [photoDownloading, setPhotoDownloading] = React.useState(false);
    const editButton = React.useRef(null);
    const originalSrc = React.useRef('');
    const timeoutId = React.useRef(null);

    const { selectedThumbnails, setSelectedThumbnails, loadingThumbnails, setLoadingLightBox } = useSelectonContext();

    const handlePhotoDownload = React.useCallback(
        async e => {
            e.persist();
            // We don't want to download the photo if the user is only selecting the photo
            if ((editButton.current !== null && editButton.current.buttonNode === e.target) || loadingThumbnails.indexOf(id) === -1) {
                return;
            }
            // This fetch can be triggered on click or on mouse hover. Make sure it's only ever triggered once
            if (originalSrc.current === '' && photoDownloading === false) {
                setPhotoDownloading(true);
                setLoadingLightBox(true);
                const photo = await getPhotoById(id);
                if (photo.status === 'success') {
                    // eslint-disable-next-line
                    originalSrc.current = `data:image/png;base64,${photo.data.b64}`;
                }
                setPhotoDownloading(false);
                setLoadingLightBox(false);
            }
        },
        [id, photoDownloading, setLoadingLightBox]
    );

    const handleInitiateDownload = React.useCallback(
        e => {
            timeoutId.current = setTimeout(() => {
                handlePhotoDownload(e);
            }, TIME_TO_DOWNLOAD);
        },
        [handlePhotoDownload]
    );

    return (
        <div
            className={`${styles.editableContainer} 
                ${selectedThumbnails.indexOf(id) !== -1 ? styles.editing : ''}`}
            key={id}
            onClick={handlePhotoDownload}
            onMouseLeave={() => clearTimeout(timeoutId.current)}
            onTouchCancel={() => clearTimeout(timeoutId.current)}
            onTouchStart={handleInitiateDownload}>
            <Button
                aria-checked={selectedThumbnails.indexOf(id) !== -1}
                className={`${styles.triggerBox} checkbox`}
                onClick={() => {
                    let selectIndex = selectedThumbnails.indexOf(id);
                    if (selectIndex === -1) {
                        setSelectedThumbnails([...selectedThumbnails, id]);
                    } else {
                        let copy = [...selectedThumbnails];
                        copy.splice(selectIndex, 1);
                        setSelectedThumbnails(copy);
                    }
                }}
                ref={editButton}
                role="checkbox"
                type="link">
                <Icon type="check-circle" theme={selectedThumbnails.indexOf(id) !== -1 ? 'twoTone' : 'filled'}></Icon>
            </Button>
            <div className={styles.topOverlay}></div>
            <div
                onClick={() => {
                    loadingThumbnails.indexOf(id) === -1 && setOpen(true);
                }}
                className={`${selectedThumbnails.indexOf(id) !== -1 ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                <div
                    aria-label={`PhotoId: ${id}`}
                    className={`${styles.img} ${loadingThumbnails.indexOf(id) !== -1 ? styles.thumbnailLoading : ''}`}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
                />
                {open && <Lightbox mainSrc={originalSrc.current} onCloseRequest={() => setOpen(false)} />}
            </div>
            {loadingThumbnails.indexOf(id) !== -1 && (
                <div className={styles.spinner}>
                    <Icon type="loading" style={{ fontSize: 35 }} spin />
                </div>
            )}
            <div className={styles.hoverOverlay} />
        </div>
    );
}

export default PhotoGridItem;
