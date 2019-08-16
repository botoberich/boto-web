import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

// State
// import { useTheme } from '../../contexts/ThemeContext';

// UI
import './index.css';
import { Affix, Layout } from 'antd';
import SideNav from './sideNav';
import Header from './Header';
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
                    <SideNav></SideNav>
                    <Layout className={styles.layout}>
                        <Affix>
                            <Header siteTitle={data.site.siteMetadata.title} />
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
