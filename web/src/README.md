The organization of this `src` folder is as follows:

Static landing page
- `src/pages` is a "special" folder that Gatsby will turn into static pages.
- `src/components` is not "special", it contains components for our landing page.

Photo app 
- `src/app` is not "special", it is re-exported by `src/pages/app.js` and contains all the clientside dynamic App pages that we dont want to be statically generated. `src/pages/app.js` skips the static generation process because of `gatsby-plugin-create-client-paths` configured in `gatsby-config.js`
- `src/images` is "special", it contains images for the static marketing site that are ingested by `gatsby-source-filesystem` in `gatsby-config.js` and processed by `gatsby-transformer-sharp` and `gatsby-plugin-sharp`
