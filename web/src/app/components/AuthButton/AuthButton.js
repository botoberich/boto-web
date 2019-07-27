import React from 'react';
import { navigate, Link } from 'gatsby';
import { logout } from '../../services/auth';
import { Button } from 'antd';

function AuthButton({ signedIn, className }) {
    if (signedIn) {
        return (
            <Button type="danger" className={className}>
                <Link
                    to="/"
                    onClick={async event => {
                        event.preventDefault();
                        logout(() => navigate(`/app/login`));
                    }}
                >
                    Logout
                </Link>
            </Button>
        );
    }

    return (
        <Button type="primary" className={className}>
            <Link to="/app/login">Login</Link>
        </Button>
    );
}

export default AuthButton;
