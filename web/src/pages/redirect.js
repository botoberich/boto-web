import React from 'react';
import { Link } from 'gatsby';
import SEO from '../components/seo';
import styles from '../components/redirect.module.css';

const MobileAuthRedirect = () => {
    React.useEffect(() => {
        function getParameterByName(name) {
            const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
          }
       
        const authResponse = getParameterByName('authResponse')
        window.location="botophotos://?authResponse=" + authResponse
    })
    
    return (
        <div className={styles.container}>
            <SEO title="Mobile Auth Redirect" />
            <div className={styles.description}>
                <h1>Welcome to Boto Photos</h1>
                <p>You will be redirected back to Boto soon</p>
            </div>
        </div>
    )
};

export default MobileAuthRedirect;
