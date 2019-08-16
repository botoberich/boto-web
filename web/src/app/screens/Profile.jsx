import React from 'react';

// State
import { getUser } from '../services/auth.service';

// UI
import { Typography } from 'antd';

const { Title, Text } = Typography;

const ProfileScreen = () => {
    const user = getUser();
    return (
        <>
            <Title>Your profile</Title>
            <Text>Name: {user.username && user.profile.name}</Text>
            <br></br>
            <Text>Email: {user.email}</Text>
        </>
    );
};

export default ProfileScreen;
