import {Note} from "../Note/Note";
import React, {useEffect} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {Link, useNavigate} from "react-router-dom";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";
import Button from "@mui/material/Button";
import {ArrowBack} from "@mui/icons-material";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";

interface ThreadProps {
    nevent?: string;
    children?: any;
    expanded?: boolean;
    render?: boolean;

    data?: {
        noteId?: string
        events?: any[];
        event?: any;
    }
}

export const NoteThread = ({ nevent, data = {}, children, expanded }: ThreadProps) => {
    const { id } = nevent && nip19.decode(nevent).data;

    const filter: NDKFilter = { kinds: [1], '#e': [id] };

    const { subscribe } = useNostrNoteThreadContext();

    const navigate = useNavigate();

    const events = useLiveQuery(async () => {
       const events = await db.events
           .where('kind').equals(1)
           .filter(({ tags }) => containsTag(tags, ['e', id || '']))
           // filter spam notes
           .filter(({ content }) => !content.toLowerCase().includes('airdrop is live'))
           .toArray();
       return events;
    }, [id]);

    useEffect(() => {
        subscribe(filter);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Thread ${ nevent } - UseLessShit.co`}</title>
                <meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content={process.env.BASE_URL + '/swarmstr/e/' + nevent } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Thread ${ nevent } - UseLessShit.co`} />
                <meta property="og:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />
                <meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content={`${ nevent } - UseLessShit.co`} />
                <meta itemProp="image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

                <meta name="twitter:title" content={`${ nevent } - UseLessShit.co`} />
                <meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

            </Helmet>

            <List>

                {
                    expanded && <ListItem key={'nostr-resources-nav-back'}>
                        <Button variant="text" onClick={() =>
                            // @ts-ignore
                            navigate(-1, { replace: false })
                        }>
                            <ArrowBack sx={{ fontSize: 18, marginRight: 1 }} />
                            Back
                        </Button>
                    </ListItem>
                }
                <ListItem key={`${id}-container`} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                    {children}
                </ListItem>
                {
                    expanded && <List key={`${nevent}-answers`} sx={{ width: '90%', margin: 'auto' }}>
                        {
                            (events || [])
                                .map(({ id, ..._ }: NostrEvent) => nip19.neventEncode({ id }))
                                .map((_nevent: string) => (
                                    <NostrNoteContextProvider thread={true}>
                                        <Note key={`${_nevent}-content`} nevent={_nevent}/>
                                    </NostrNoteContextProvider>
                                ))
                        }
                    </List>
                }
            </List>
        </React.Fragment>
    );
};