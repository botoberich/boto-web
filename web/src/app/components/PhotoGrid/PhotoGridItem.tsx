import React from 'react';

// UI
import Lightbox from 'react-image-lightbox';
import { Icon, Button } from 'antd';
import styles from './PhotoGridItem.module.css';

// State
import { getPhotoById } from '../../services/photo.service';
import { usePhotoContext } from '../../contexts/PhotoContext';

function PhotoGridItem({ id, src }) {
    const [openLightbox, setOpenLightbox] = React.useState(false);
    const [photoSelected, setPhotoSelected] = React.useState(false);
    const [photoDownloading, setPhotoDownloading] = React.useState(false);
    const editButton = React.useRef(null);
    const originalSrc = React.useRef('');

    const {
        selectedThumbnails,
        setSelectedThumbnails,
        loadingThumbnails,
        setLoadingLightBox,
    } = usePhotoContext();

    const handlePhotoDownload = React.useCallback(
        async e => {
            e.persist();
            // Prevent photo from being downloaded on selection
            if (editButton.current !== null && editButton.current.buttonNode === e.target) {
                return;
            }
            // Only fetch the original photo once
            if (originalSrc.current === '' && photoDownloading === false) {
                setPhotoDownloading(true);
                setLoadingLightBox(true);
                const photo = await getPhotoById(id);
                if (photo.status === 'success') {
                    // eslint-disable-next-line
                    originalSrc.current = `data:image/png;base64,${photo.data.b64}`;
                }
                setLoadingLightBox(false);
                setPhotoDownloading(false);
            }
        },
        [id, photoDownloading, setLoadingLightBox]
    );

    return (
        <div
            className={`${styles.editableContainer} 
                ${photoSelected ? styles.editing : ''}`}
            key={id}
            onClick={handlePhotoDownload}>
            <Button
                aria-checked={photoSelected}
                className={styles.triggerBox}
                icon="check-circle"
                onClick={() => {
                    setPhotoSelected(!photoSelected);
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
                onClick={() => setOpenLightbox(true)}
                className={`${photoSelected ? styles.scaleDown : ''} ${styles.imageContainer}`}>
                <div
                    aria-label={`PhotoId: ${id}`}
                    className={styles.img}
                    style={{
                        backgroundImage: `url("${src}")`,
                    }}
                />

                {openLightbox && (
                    <Lightbox mainSrc={originalSrc.current} onCloseRequest={() => setOpenLightbox(false)} />
                )}
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
