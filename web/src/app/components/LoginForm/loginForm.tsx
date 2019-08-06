import React from 'react';
import { navigate } from 'gatsby';

// UI
import { Button } from 'antd';
import styles from './login.module.css';

// State
import { handleLogin } from '../../services/auth.service';

function LoginForm() {
    const handleSubmit = React.useCallback(() => {
        handleLogin(() => {
            navigate(`/app/`);
        });
    }, []);

    return (
        <div className={styles.container}>
            <Button className={styles.btn} onClick={handleSubmit} type="primary">
                Login
            </Button>
        </div>
    );
}

export default LoginForm;
