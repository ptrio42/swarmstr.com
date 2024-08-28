import {Helmet} from "react-helmet-async";
import React from "react";
import {nip19, NostrEvent} from "nostr-tools";
import {Config} from "../../../resources/Config";

export const NoteMeta = ({ event }: { event: NostrEvent }) => {
    const { id, content } = event;
    let title = content.replace(/#\[([0-9]+)\]/g, '')
        .slice(0, content.indexOf('?') > -1 ? content.indexOf('?') + 1 : content.length);
    if (title.length > 150) title = `${title.slice(0, 150)}...`;

    return <Helmet>
        <title>{`${ title } - Swarmstr.com`}</title>
        <meta property="description" content={ Config.APP_DESCRIPTION } />
        <meta property="keywords" content={ Config.APP_KEYWORDS } />

        <meta property="og:url" content={process.env.BASE_URL + '/e/' + id && nip19.noteEncode(id!) } />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${ title } - Swarmstr.com`} />
        <meta property="og:image" content={ Config.APP_IMAGE } />
        <meta property="og:description" content={ Config.APP_DESCRIPTION } />

        <meta itemProp="name" content={`${ title } - Swarmstr.com`} />
        <meta itemProp="image" content={ Config.APP_IMAGE } />

        <meta name="twitter:title" content={`${ title } - Swarmstr.com`} />
        <meta name="twitter:description" content={ Config.APP_DESCRIPTION } />
        <meta name="twitter:image" content={ Config.APP_IMAGE } />

    </Helmet>
};