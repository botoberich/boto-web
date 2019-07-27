import React from 'react';
import { Link } from 'gatsby';
import SEO from '../components/seo';
import styles from '../components/404.module.css';

const NotFoundPage = () => (
    <div className={styles.exception}>
        <SEO title="Page Not Found" />
        <img src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" alt="404 Page"></img>
        <div className={styles.description}>
            <h1>404</h1>
            <p>Sorry, the page you visited does not exist</p>
            <Link to="/">Back to home</Link>
        </div>
    </div>
);

export default NotFoundPage;


