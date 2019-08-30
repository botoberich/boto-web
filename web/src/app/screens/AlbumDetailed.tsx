import React from 'react';

// UI
import PhotoGrid from '../components/PhotoGrid';
import { notification, Typography } from 'antd';
import 'react-image-lightbox/style.css';

// State
import { getAlbumById } from '../services/album.service';
import { getThumbnail } from '../services/photo.service';
// import { handleFetchThumbnails } from '../components/PhotoGrid/photos.hooks';
import { usePhotoContext } from '../contexts/PhotoContext';

// Types
import { ArgsProps } from 'antd/lib/notification';
import { IThumbnail } from '../interfaces/photos.interface';

const { Paragraph } = Typography;

function DetailedAlbumScreen({ albumID }) {
    const { thumbnails, setThumbnails } = usePhotoContext();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // async function fetchThumbnails() {
        //     try {
        //         const res = await getAlbumById(albumID);
        //         console.log({ res });
        //         let thumbnailsByDate: { [date: string]: { [photoId: string]: IThumbnail } } = {};
        //         const photos = res.data.photos;
        //         console.log('photosp', photos);
        //         const thumbnailIDs = photos.map(photo => photo._id);
        //         const thu
        //         console.log('thumbnailIDs', thumbnailIDs);
        //     } catch (e) {
        //         console.error(e);
        //     }
        // }
        // fetchThumbnails();
    }, [albumID]);

    return (
        <>
            <h1>Detailed album screen: {albumID}</h1>
            <p>Here is where you view all the current photos in an album</p>
        </>
    );
}

export default DetailedAlbumScreen;
