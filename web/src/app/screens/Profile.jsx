import React from 'react';
import { getUser } from '../services/auth';

const Profile = () => {
    const user = getUser();
    console.log({ profileUser: user });
    return (
        <>
            <h1>Your profile</h1>
            <ul>
                <li>Name: {user.username && user.profile.name}</li>
                <li>E-mail: {user.email}</li>
            </ul>
        </>
    );
};

export default Profile;
