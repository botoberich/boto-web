import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

// State
// import { useTheme } from '../../contexts/ThemeContext';

// UI
import './index.css';
import { Affix, Layout } from 'antd';
import Sidebar from './sideNav';
import Header from './Header/Header.tsx';
import styles from './layout.module.css';

const { Content } = Layout;

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
                    <Sidebar></Sidebar>
                    <Layout className={styles.layout}>
                        <Affix>
                            <Header siteTitle={data.site.siteMetadata.title} />
                        </Affix>
                        <Content className={styles.content}>
                            <div className={styles.children}>{children}</div>
                        </Content>
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
