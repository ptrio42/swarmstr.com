import {Note} from "../Note/Note";
import React, {useEffect, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {Event as NostrEvent} from 'nostr-tools';
import {Link, useParams} from "react-router-dom";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";
import {sortBy} from 'lodash';
import {useSubscribe} from "nostr-hooks";
import {Config} from "nostr-hooks/dist/types";
import Button from "@mui/material/Button";
import {ArrowBack, CopyAll} from "@mui/icons-material";
import {DEFAULT_EVENTS} from "../../../stubs/events";
import {DEFAULT_RELAYS} from "../../../resources/Config";
import axios from "axios";

interface ThreadProps {
    data?: {
        noteId?: string
        events?: NostrEvent[];
        event?: NostrEvent;
    }
}

export const NoteThread = ({ data = {} }: ThreadProps) => {
    const { noteId } = useParams();
    const [expanded, setExpanded] = useState(false);

    // gets note id in hex
    const getNoteId = () => {
        return data.noteId || noteId && nip19.decode(noteId)?.data;
    };

    const { events: _event } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [1],
            // @ts-ignore
            ids: [getNoteId()]
        }],
        options: {
            enabled: !data.event && noteId && noteId !== '',
            closeAfterEose: true
        }
    } as Config);
    const event = data.event || _event && _event[0] || DEFAULT_EVENTS.find((e: NostrEvent) => e.id === (noteId && nip19.decode(noteId)?.data));

    const { events: commentEvents } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [1],
            // @ts-ignore
            '#e': [getNoteId()]
        }],
        options: {
            enabled: true
        }
    } as Config);

    const { events: reactionEvents } = useSubscribe({
        relays: [...DEFAULT_RELAYS],
        filters: [{
            kinds: [7],
            // @ts-ignore
            '#e': [getNoteId()]
        }],
        options: {
            enabled: true
        }
    } as Config);

    const [offlineEvents, setOfflineEvents] = useState([]);

    useEffect(() => {
        // fetch events from json
        // temp solution
        axios
            .get('../../events.json')
            .then((response) => {
                setOfflineEvents(response.data);
            });

        // expand the thread when viewing note details
        const isExpanded = !(!noteId || noteId === '');
        setExpanded(isExpanded);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${ event && event.content } - UseLessShit.co`}</title>
                <meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content={'https://uselessshit.co/resources/nostr/' + noteId } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${ event && event.content } - UseLessShit.co`} />
                <meta property="og:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />
                <meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content={`${ event && event.content } - UseLessShit.co`} />
                <meta itemProp="image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

                <meta name="twitter:title" content={`${ event && event.content } - UseLessShit.co`} />
                <meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

            </Helmet>

            <List>

                {
                    !(!noteId || noteId === '') && <ListItem>
                        <Button variant="text" component={Link} to="/resources/nostr">
                            <ArrowBack sx={{ fontSize: 18, marginRight: 1 }} />
                            Nostr Resources
                        </Button>
                    </ListItem>
                }
                <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} id={event && event.id}>
                    {
                        <Note
                            // @ts-ignore
                            noteId={data.noteId || nip19.decode(noteId)?.data || ''}
                            isCollapsable={!noteId}
                            handleThreadToggle={(exp: boolean) => {
                                setExpanded(exp);
                            }}
                            isThreadExpanded={expanded}
                            // TODO: is read
                            isRead={true}
                            data={{ event }}
                            threadView={(!noteId || noteId === '')}
                        />
                    }
                </ListItem>
                {
                    expanded &&
                    <ListItem>
                        <List sx={{ maxWidth: '100%' }}>
                            {
                                sortBy(
                                    // @ts-ignore
                                    [...offlineEvents, ...commentEvents]
                                        .filter((e1: NostrEvent) =>
                                            e1.kind === 1 &&
                                            e1.tags.findIndex((t: string[]) => t[0] === 'e' && t[1] === getNoteId()) > -1
                                        ),
                                    (e: NostrEvent) => {
                                    return [...offlineEvents, ...reactionEvents]
                                        .filter((e2: NostrEvent) =>
                                            e2.kind === 7 &&
                                            e2.tags.findIndex((t: string[]) => t[0] === 'e' && t[1] === e.id) > -1)
                                        .length
                                })
                                .reverse()
                                .map((n, i) =>
                                    <ListItem>
                                        <Note
                                            // @ts-ignore
                                            noteId={n.id}
                                            pinned={i === 0}
                                            isCollapsable={true}
                                            isRead={true}
                                            data={{
                                                event: n
                                            }}
                                        />
                                    </ListItem>
                                )
                            }
                        </List>
                    </ListItem>
                }
            </List>
        </React.Fragment>
    );
};