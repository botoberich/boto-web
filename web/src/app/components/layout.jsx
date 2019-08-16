import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

// State
// import { useTheme } from '../../contexts/ThemeContext';

// UI
import { Affix, Layout } from 'antd';
import Siderbar from './sidebar';
import PageHeader from './Header';
import './index.css';
import styles from './layout.module.css';

const { Content, Footer } = Layout;

const PageLayout = ({ children }) => {
    // const { toggleTheme, theme } = useTheme();

    return (
        <StaticQuery
            query={graphql`
                query SiteTitleQuery {
                    site {
                        siteMetadata {
                            title
                        }
                    }
                }
            `}
            render={data => (
                <Layout className={styles.layout} hasSider>
                    <Siderbar></Siderbar>
                    <Layout className={styles.layout}>
                        <Affix>
                            <PageHeader siteTitle={data.site.siteMetadata.title} />
                        </Affix>
                        <Content className={styles.content}>
                            <div className={styles.children}>{children}</div>
                        </Content>
                        <Footer className={styles.footer}>© {new Date().getFullYear()}, Built for you</Footer>
                    </Layout>
                </Layout>
            )}
        />
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageLayout;
