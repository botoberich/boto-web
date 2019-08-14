import React from 'react';
import { navigate, Link } from 'gatsby';

// UI
import { Button } from 'antd';

// State
import { logout } from '../../services/auth.service';
import { handleLogin } from '../../services/auth.service';

function AuthButton({ signedIn, className }) {
    if (signedIn) {
        return (
            <Button type="danger" className={className}>
                <Link
                    to="/"
                    onClick={async event => {
                        event.preventDefault();
                        logout(() => navigate(`/app/login`));
                    }}>
                    Logout
                </Link>
            </Button>
        );
    }

    return (
        <Button
            type="primary"
            className={className}
            onClick={() => {
                handleLogin(() => {
                    navigate(`/app/`);
                });
            }}>
            Login
        </Button>
    );
}

export default AuthButton;
