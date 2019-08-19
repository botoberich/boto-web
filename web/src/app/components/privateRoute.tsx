import React from 'react';
import { checkIsSignedIn } from '../services/auth.service';
import { navigate } from 'gatsby';

type RouteProps = {
    component: any;
    location?: any;
    path: string;
};

class PrivateRoute extends React.Component<RouteProps> {
    state = { checking: false, signedIn: false };

    componentDidMount = () => {
        const { location } = this.props;
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
            this.setState({ checking: false, signedIn });
        });
    };

    render() {
        const { location, ...rest } = this.props;
        const { checking, signedIn } = this.state;
        const Component = this.props.component;
        if (checking) {
            return <>...</>;
        } else {
            return signedIn ? <Component {...rest} /> : null;
        }
    }
}

export default PrivateRoute;
