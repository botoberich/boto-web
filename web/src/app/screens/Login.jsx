import React from 'react';
import { navigate } from 'gatsby';

// UI
import LoginForm from '../components/LoginForm';

function Login({ location }) {
    React.useEffect(() => {
        if (location && !!location.search) {
            navigate(`/app`);
        }
    }, []);

    return <LoginForm />;
}

export default Login;
