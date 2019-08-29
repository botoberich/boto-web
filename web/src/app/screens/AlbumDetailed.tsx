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
        // addToAlbum(['0f71540d-c51f-4630-8f15-275feeb1f3e2', '3e8a0fa0-1ba3-413a-8a48-8de32b841d48'], albumID);
        async function fetchThumbnails() {
            try {
                const res = await getAlbumById(albumID);
                console.log({ res });

                let skeletonThumbnails: { [date: string]: { [photoId: string]: IThumbnail } } = {};

                const photos = res.data.photos;
                console.log('photosp', photos);
                const thumbnails = await Promise.all(
                    photos.map(({ _id }) => {
                        return getThumbnail(_id);
                    })
                );

                console.log('thumbnails', thumbnails);
                const allMetadata = thumbnails.map(thumbnail => thumbnail.attr);
                console.log('allMetadata', allMetadata);

                // allMetadata.forEach(meta => {
                //     let photoId = meta._id;
                //     let dateString = new Date(meta.createdAt).toDateString();
                //     let thumbnail: IThumbnail = { b64: '', metaData: meta };
                //     skeletonThumbnails[dateString] = skeletonThumbnails[dateString]
                //         ? { ...skeletonThumbnails[dateString], ...{ [photoId]: thumbnail } }
                //         : { [photoId]: thumbnail };
                // });

                console.log('thumbanils', thumbnails);
                // setThumbnails(thumbnails);
            } catch (e) {
                console.error(e);
            }
        }

        fetchThumbnails();
    }, [albumID]);

    const notificationConfig = (msg: string): ArgsProps => ({
        // TODO: Refactor to use a global navigation singleton
        placement: 'bottomRight',
        bottom: 50,
        duration: 3,
        message: (
            <div>
                <Paragraph>{msg}</Paragraph>
            </div>
        ),
    });

    // React.useEffect(() => {
    //     // TODO: Need a more robust condition to refetch photos
    //     if (Object.entries(thumbnails).length > 0) return;

    //     let thumbnailCtr = 0;
    //     handleFetchThumbnails({
    //         onStart: (allMetadata: IPhotoMetadata[]) => {
    //             if (allMetadata === undefined) {
    //                 return;
    //             }

    //             let skeletonThumbnails: { [date: string]: { [photoId: string]: IThumbnail } } = {};
    //             allMetadata.forEach(meta => {
    //                 let photoId = meta._id;
    //                 let dateString = new Date(meta.createdAt).toDateString();
    //                 let thumbnail: IThumbnail = { b64: '', metaData: meta };
    //                 skeletonThumbnails[dateString] = skeletonThumbnails[dateString]
    //                     ? { ...skeletonThumbnails[dateString], ...{ [photoId]: thumbnail } }
    //                     : { [photoId]: thumbnail };
    //             });

    //             console.log({ skeletonThumbnails });

    //             setThumbnails(skeletonThumbnails);
    //         },
    //         onNext: res => {
    //             if (res === null || res === undefined) {
    //                 return;
    //             }
    //             thumbnailCtr++;

    //             /** hydrate the skeletons with b64 on each emission */
    //             setThumbnails(thumbnails => {
    //                 let dateString = new Date(res.metaData.createdAt).toDateString();
    //                 let copy = { ...thumbnails };
    //                 copy[dateString][res.metaData._id].b64 = res.b64;
    //                 return copy;
    //             });
    //         },
    //         onError: err => {
    //             notification.error(notificationConfig(`Unable to fetch photos. Please contact support.`));
    //         },
    //         onComplete: () => {
    //             setLoading(false);
    //             if (thumbnailCtr !== 0) {
    //                 notification.success(notificationConfig(`Successfully loaded all photos.`));
    //             }
    //         },
    //     });
    //     // eslint-disable-next-line
    // }, []);

    return (
        <>
            <h1>Detailed album screen: {albumID}</h1>
            <p>Here is where you view all the current photos in an album</p>
            {/* <PhotoGrid loading={loading} thumbnails={thumbnails} />; */}
        </>
    );
}

export default DetailedAlbumScreen;
