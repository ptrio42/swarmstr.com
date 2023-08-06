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
import Typography from "@mui/material/Typography";

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
       const events = await db.notes
           .where({ referencedEventId: id })
           // filter spam notes
           .filter(({ content }) => !content.toLowerCase().includes('airdrop is live') && !content.toLowerCase().includes('claim your free $'))
           .toArray();
       return events;
    }, [id]);

    useEffect(() => {
        subscribe(filter);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Thread ${ nevent } - Swarmstr.com`}</title>
                {/*<meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}
                {/*<meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />*/}

                <meta property="og:url" content={process.env.BASE_URL + '/e/' + nevent } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Thread ${ nevent } - Swarmstr.com`} />
                {/*<meta property="og:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />*/}
                {/*<meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}

                <meta itemProp="name" content={`${ nevent } - Swarmstr.com`} />
                {/*<meta itemProp="image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />*/}

                <meta name="twitter:title" content={`${ nevent } - Swarmstr.com`} />
                {/*<meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />*/}
                {/*<meta name="twitter:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />*/}

            </Helmet>

            <List>

                {
                    expanded && <ListItem key={'nostr-resources-nav-back'}>
                        <Button sx={{ textTransform: 'capitalize', fontSize: '16px', borderRadius: '18px' }} color="secondary" variant="outlined" onClick={() =>
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
                        { !events && <Typography component="div" variant="body1">Loading answers...</Typography> }
                        { (events && events.length === 0) && <Typography component="div" variant="body1">No answers yet...</Typography> }
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