import {Note} from "../Note/Note";
import React, {createRef, RefObject, useEffect, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {
    getEventById,
    getSubscriptionOptions
} from "../../../services/nostr";
import {Filter, Mux, SubscriptionOptions, Event as NostrEvent, Relay} from "nostr-mux";
import {GUIDES} from "../../../stubs/nostrResources";
import {useParams} from "react-router-dom";
import {DEFAULT_RELAYS} from "../NostrResources/NostrResources";
import { nip19 } from 'nostr-tools';
import {Helmet} from "react-helmet";

interface ThreadProps {
    metadata?: any[];
    handleNoteToggle?: (expanded: boolean, guideId?: string) => void;
    noteExpandedOnInit?: boolean;

    data?: {
        note?: any;
        parentEvent?: NostrEvent;
    }
}

const mux = new Mux();

export const NoteThread = ({ data = {}, handleNoteToggle, noteExpandedOnInit = true }: ThreadProps) => {

    const [events, setEvents] = useState<NostrEvent[]>([]);
    const [parentEvent, setParentEvent] = useState<NostrEvent | undefined>(data.parentEvent);
    const { noteId } = useParams();
    const [note, setNote] = useState(data.note);

    const [expanded, setExpanded] = useState(false);
    const [noteExpanded, setNoteExpanded] = useState(noteExpandedOnInit);

    const [noteRefs, setNoteRefs] = useState<{ [id: string]: RefObject<any> }>({});

    useEffect(() => {
        // try getting event id from router
        if (noteId) {
            const hex = nip19.decode(noteId);
            let newNote = {
                ...note,
                id: hex && hex.data || undefined
            };

            // if this was a new mux instance, add relays
            if (mux.allRelays.length < DEFAULT_RELAYS.length) {
                DEFAULT_RELAYS.forEach((url: string) => {
                    mux.addRelay(new Relay(url));
                });
                console.log({relays: mux.allRelays})
            }

            // get guide entry for given note id
            const guide = GUIDES.find(g => g.attachedNoteId === newNote.id);
            if (guide) {
                newNote = {
                    ...newNote,
                    guideId: guide.id,
                    title: guide.issue,
                    content: guide.fix,
                    bulletPoints: guide.bulletPoints,
                    imageUrls: guide.imageUrls,
                    urls: guide.urls,
                    updatedAt: guide.updatedAt,
                    guideTags: guide.tags,
                    isRead: guide.isRead
                };
            }
            setNote(newNote);

            // related notes subscription
            // Subscription filters
            const filters = [
                // related notes (comments)
                {
                    kinds: [1],
                    '#e': [newNote.id]
                }
            ] as Filter[];
            if (newNote.id && !parentEvent) {
                filters.push(
                    {
                        kinds: [1],
                        ids: [newNote.id as string]
                    } as Filter
                );
            }

            console.log(`Opening new subscription...`);

            // Get subscription options
            const options: SubscriptionOptions = getSubscriptionOptions(
                mux,
                filters,
                (event: any) => {
                    console.log('received an event');
                    setEvents((state) => ([
                        ...state
                            .filter((e: NostrEvent) => e.id !== event.id),
                        { ...event }
                    ]));
                },
                (subId: string) => {
                    console.log(`Closing ${subId} subscription...`);
                },
                true
            );

            // Subscribe
            mux
                .waitRelayBecomesHealthy(1, 5000)
                .then(ok => {
                    if (!ok) {
                        console.error('no healthy relays');
                        return;
                    }
                    mux.subscribe(options);
                });
        }
    }, []);

    useEffect(() => () => {
        DEFAULT_RELAYS.forEach(relay => {
            mux.removeRelay(relay);
        });
    }, []);

    useEffect(() => {
        if (note && note.id && !parentEvent) {
            const event = events.find(e => e.id === note.id);
            if (event) {
                setParentEvent(event);
            }
        }
    }, [events]);

    useEffect(() => {
        // console.log({noteRefs: noteRefs.length}, {noteRefs})
    }, [noteRefs]);

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${ note && note.title } - UseLessShit.co`}</title>
                <meta property="description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta property="keywords" content="nostr guide, nostr resources, nostr most common questions, getting started on nostr, what is nostr" />

                <meta property="og:url" content={'https://uselessshit.co/resources/nostr/' + noteId } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={note && note.title +  ' - UseLessShit.co' } />
                <meta property="og:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />
                <meta property="og:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />

                <meta itemProp="name" content={note && note.title +  ' - UseLessShit.co' } />
                <meta itemProp="image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

                <meta name="twitter:title" content={ note && note.title + ' - UseLessShit.co' } />
                <meta name="twitter:description" content="Basic guides for Nostr newcomers. Find answers to the most common questions." />
                <meta name="twitter:image" content="https://uselessshit.co/images/new-nostr-guide-cover.png" />

            </Helmet>
            <List>
                <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} id={note && note.guideId}>
                    {
                        note && <Note
                            id={note && note.id}
                            guideId={note && note.guideId}
                            title={note && note.title || 'Discussion ' + '(' + (events && events.length || 0) + ')'}
                            content={note && note.content}
                            updatedAt={note && note.updatedAt || (note && new Date(note.created_at*1000).toDateString())}
                            pubkeys={note && note.pubkey && [note.pubkey] || []}
                            author={note && note.pubkey}
                            isExpanded={noteExpanded}
                            isCollapsable={!noteId}
                            handleThreadToggle={(exp: boolean) => {
                                setExpanded(exp);
                            }}
                            handleNoteToggle={(exp: boolean) => {
                                handleNoteToggle && handleNoteToggle(exp, note.guideId);
                                setNoteExpanded(exp);
                            }}
                            tags={note && note.tags}
                            isThreadExpanded={expanded}
                            bulletPoints={note && note.bulletPoints}
                            urls={note && note.urls}
                            guideTags={note && note.guideTags}
                            imageUrls={note && note.imageUrls}
                            isRead={note && note.isRead}
                            event={parentEvent}
                        />
                    }
                </ListItem>
                {
                    expanded &&
                    <ListItem>
                        <List>
                            { events // TODO: sort the events by most up reactions
                                .map(n =>
                                    <ListItem>
                                        <Note
                                            id={n.id}
                                            title={'Note Replies'}
                                            content={n.content}
                                            updatedAt={new Date(n.created_at*1000).toDateString()}
                                            pubkeys={n.pubkey && [n.pubkey] || []}
                                            author={n.pubkey}
                                            pinned={false}
                                            isExpanded={true}
                                            isCollapsable={true}
                                            tags={n.tags}
                                            isRead={true}
                                            event={getEventById(events, n.id)}
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