import React from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon, Button } from 'antd';
import styles from './PhotoGridItem.module.css';

// state
import { getPhotoById } from '../../../services/photo.service';
import { usePhotoContext } from '../../../contexts/PhotoContext';

const TIME_TO_DOWNLOAD = 1000;

function PhotoGridItem({ id, src }) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(false);
    const [photoDownloading, setPhotoDownloading] = React.useState(false);
    const editButton = React.useRef(null);
    const originalSrc = React.useRef('');
    const timeoutId = React.useRef(null);

    const { selectedThumbnails, setSelectedThumbnails, loadingThumbnails } = usePhotoContext();

    const handlePhotoDownload = React.useCallback(
        async e => {
            e.persist();
            // We don't want to download the photo if the user is only selecting the photo
            if (editButton.current !== null && editButton.current.buttonNode === e.target) {
                return;
            }
            // This fetch can be triggered on click or on mouse hover. Make sure it's only ever triggered once
            if (originalSrc.current === '' && photoDownloading === false) {
                setPhotoDownloading(true);
                const photo = await getPhotoById(id);
                if (photo.status === 'success') {
                    // eslint-disable-next-line
                    originalSrc.current = `data:image/png;base64,${photo.data.b64}`;
                }
                setPhotoDownloading(false);
            }
        },
        [id, photoDownloading]
    );

    const handleInitiateDownload = React.useCallback(
        e => {
            timeoutId.current = setTimeout(() => {
                handlePhotoDownload(e);
            }, TIME_TO_DOWNLOAD);
        },
        [timeoutId.current]
    );

    return (
        <div
            className={`${styles.editableContainer} 
                ${selected ? styles.editing : ''}`}
            key={id}
            onClick={handlePhotoDownload}
            onMouseLeave={() => clearTimeout(timeoutId.current)}
            onTouchCancel={() => clearTimeout(timeoutId.current)}
            onTouchStart={handleInitiateDownload}>
            <Button
                aria-checked={selected}
                className={styles.triggerBox}
                icon="check-circle"
                onClick={() => {
                    setSelected(!selected);
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
                shape="circle"
                type="link"></Button>
            <div
                onClick={() => setOpen(true)}
                className={`${selected ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                <div
                    aria-label={`PhotoId: ${id}`}
                    className={styles.img}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
                />
                {open && <Lightbox mainSrc={originalSrc.current} onCloseRequest={() => setOpen(false)} />}
            </div>
            {loadingThumbnails.indexOf(id) !== -1 && (
                <div className={styles.inProgress}>
                    <Icon type="loading" spin />
                </div>
            )}
            <div className={styles.hoverOverlay} />
        </div>
    );
}

export default PhotoGridItem;
