import {Helmet} from "react-helmet-async";
import {Config} from "../../resources/Config";
import {Box} from "@mui/material";
import React from "react";

interface HtmlHeadProps {
    title?: string;
    description?: string;
    url?: string;
    imageUrl?: string;
}

export const HtmlHead = ({title, description, url, imageUrl}: HtmlHeadProps) => {
    return <Helmet>
        <title>{ title || Config.APP_TITLE }</title>
        <meta name="twitter:title" content={title || Config.APP_TITLE} />
        <meta property="og:title" content={title || Config.APP_TITLE} />

        <meta name="description" content={description || Config.APP_DESCRIPTION} />
        <meta name="twitter:description" content={description || Config.APP_DESCRIPTION} />
        <meta property="og:description" content={description || Config.APP_DESCRIPTION} />

        <meta name="twitter:image:src" content={ imageUrl || Config.APP_IMAGE }  />
        <meta property="og:image" content={ imageUrl || Config.APP_IMAGE } />

        <meta name="hostname" content={process.env.BASE_URL} />

        {/*<meta property="keywords" content={ Config.APP_KEYWORDS } />*/}

        <meta property="og:url" content={ url || process.env.BASE_URL } />
        <meta property="og:type" content="website" />

        {/*<meta itemProp="name" content={`${listName?.replace('-', ' ')?.toUpperCase()} - ${Config.APP_TITLE}`} />*/}
        {/*<meta itemProp="image" content={ Config.APP_IMAGE }  />*/}

        <meta name="twitter:card" content="summary"  />
        <meta name="twitter:site" content="@pitiunited"  />

    </Helmet>
};