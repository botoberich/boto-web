import React from 'react';
import { checkIsSignedIn } from '../services/auth.service';
import { navigate } from 'gatsby';

type Props = {
    component: any;
    location?: any;
    path: string;
};

function PrivateRoute(props: Props) {
    const [checking, setChecking] = React.useState(false);
    const [signedIn, setSignedIn] = React.useState(false);

    const { location } = props;
    const Component = props.component;

    React.useEffect(() => {
        checkIsSignedIn().then(signedIn => {
            if (location.pathname !== `/`) {
                if (!signedIn) {
                    // If the user is not logged in, redirect to the login page.
                    navigate(`/`);
                    return null;
                } else {
                    if (location.search && location.search.startsWith('?authResponse=')) {
                        navigate(`/app`);
                    }
                }
            }
            setSignedIn(signedIn);
            setChecking(false);
        });
    }, []);

    if (checking) {
        return <>...</>;
    } else {
        return signedIn ? <Component {...props} /> : null;
    }
}

export default PrivateRoute;
