import React from 'react';

function DetailedAlbumScreen({ albumID }) {
    // Refactor PhotoGrid to take a series of photos
    // Move the fetching to the screen themselves
    // 1. Fetch album photos here
    return (
        <>
            <h1>Detailed album screen: {albumID}</h1>
            <p>Here is where you view all the current photos in an album</p>
        </>
    );
}

export default DetailedAlbumScreen;
