var proxy = require('http-proxy-middleware');

module.exports = {
    siteMetadata: {
        title: 'Boto',
        description: `Next-generation private photo storage system`,
        author: `@boto`,
    },
    plugins: [
        `gatsby-plugin-antd`,
        `gatsby-plugin-typescript`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-create-client-paths`,
            options: {
                prefixes: [`/app/*`],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `boto-photos`,
                short_name: `boto`,
                start_url: `/`,
                background_color: `#1890ff`,
                theme_color: `#1890ff`,
                display: `minimal-ui`,
                icon: `src/images/favicon-32x32.png`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        'gatsby-plugin-offline',
    ],
};
