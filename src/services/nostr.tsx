import {getEventHash, Relay, relayInit, signEvent, Sub, getPublicKey, generatePrivateKey} from 'nostr-tools';
import { uniqBy } from 'lodash';
import {request} from "./request";
import {Filter, Mux, SubscriptionOptions} from "nostr-mux";

export interface NostrEvent {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content?: string;
    sig: string;
}

export const RELAYS = [
    'wss://nostr.uselessshit.co',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.damus.io',
    'wss://brb.io',
    'wss://nostr.v0l.io',
    'wss://nostr.milou.lol',
];

export enum StreamStatus {
    CLOSED = 'Closed',
    OPEN = 'Open',
    EOSE = 'Eose'
}

export type StreamName = 'metadata' | 'notes' | 'reactions';

export interface Stream {
    name: StreamName;
    status: StreamStatus;
}

export const STREAMS: Stream[] = [
    {
        name: 'metadata',
        status: StreamStatus.CLOSED
    },
    {
        name: 'notes',
        status: StreamStatus.CLOSED
    },
    {
        name: 'reactions',
        status: StreamStatus.CLOSED
    }
];

export const connectToRelay = async (socketUrl: string) => {
    // @ts-ignore
    const relay = relayInit(socketUrl);
    await relay.connect();
    return relay;
};

export const getSub = (relay: Relay, query: any[]) => {
    // @ts-ignore
    return relay && relay.sub(query);
};

export const getStream = (streams: Stream[], name: StreamName) => {
    return streams && streams.find(s => s.name === name) || { name: '', status: false };
};

export const handleSub = (
    sub: Sub,
    onEvent: (event: NostrEvent) => any,
    onEose: () => any, keepOpen?: boolean
) => {
    sub.on('event', (event: NostrEvent) => {
        onEvent && onEvent(event);
    });
    sub.on('eose', () => {
        if (!keepOpen) {
            sub.unsub();
        }
        onEose && onEose();
    });
};

export const getMetadataSub = (relay: Relay, pubkeys: string[]) => {
    // @ts-ignore
    return getSub(relay, [
        {
            kinds: [0],
            authors: pubkeys
        }
    ]);
};

export const getNotesWithRelatedNotesByIdsSub = (relay: Relay, ids: string[]) => {
    // @ts-ignore
    return getSub(relay, [
        {
            kinds: [1],
            ids
        },
        {
            kinds: [1],
            '#e': ids
        }
    ]);
};

export const getNotesReactionsSub = (relay: Relay, ids: string[]) => {
    // @ts-ignore
    return getSub(relay, [
        {
            kinds: [7],
            '#e': ids
        }
    ])
};

export const createEvent = (
    privkey: string,
    pubkey: string,
    kind: number,
    content: string,
    tags?: string[][]
): NostrEvent => {
    const event = {
        kind,
        created_at: Math.floor(Date.now() / 1000),
            ...({tags: tags || [] }),
        content,
        pubkey
    };

    return {
        ...event,
        id: getEventHash(event),
        sig: signEvent(event, privkey)
    };
};

export const findAllMetadata = (collection: NostrEvent[]) => {
    return [
        ...collection
            .filter(e => e.kind === 0)
    ];
};

export const findNotesByIds = (collection: NostrEvent[], ids: string[]) => {
    return [
        ...collection
            .filter(e => e.kind === 1)
            .filter(e => ids.includes(e.id))
    ];
};

export const findRelatedNotesByNoteId = (collection: NostrEvent[], noteId: string) => {
    return [
        ...collection
            .filter(e => e.kind === 1)
            .filter(e => {
                return !!e.tags.find((t) => t.includes('e') && t.includes(noteId));
            })
    ];
};

export const findReactionsByNoteId = (collection: NostrEvent[], noteId: string) => {
    return uniqBy([
        ...collection
            .filter(e => e.kind === 7)
            .filter(e => !!e.tags.find(t => t.includes('e') && t.includes(noteId)))
    ], 'pubkey')
};

export const createNostrKeyPair = () => {
    const privkey = generatePrivateKey();
    return [
        privkey,
        getPublicKey(privkey)
    ];
};

export const getNostrKeyPair = (): string[] => {
    return [];
    // const pair = localStorage.getItem('guest_KeyPair');
    // if (!pair) {
    //     const [privkey, pubkey] = createNostrKeyPair();
    //     saveNostrKeyPair(privkey, pubkey);
    //     return [privkey, pubkey];
    // }
    // return pair.split(',');
};

export const saveNostrKeyPair = (privkey: string, pubkey: string) => {
    localStorage.setItem('guest_KeyPair', [privkey, pubkey].join(','));
};

export const getRelays = async () => {
    const response = await request({
        url: 'https://nostrich.love/relays',
        method: 'GET'
    });
    return response.data;
};

// new

export const getSubscriptionOptions = (
    mux: Mux,
    filters: Filter[],
    onEvent: (event: any) => any,
    onEose: (subId: string) => any,
    keepOpen?: boolean
): SubscriptionOptions => {
    return {
        // @ts-ignore
        filters: [filters[0], ...filters.slice(1)],
        onEvent: (event: any) => {
            // console.log(`received event(from: ${event[0].relay.url}, kind: ${event[0].received.event.kind})`);
            onEvent && onEvent(event[0].received.event);
        },
        onEose: (subId) => {
            // console.log(`subscription(id: ${subId}) EOSE`);
            if (!keepOpen) {
                mux.unSubscribe(subId);
            }
            onEose && onEose(subId);
        },
        onRecovered: (relay) => {
            // console.log(`relay(${relay.url}) was added or recovered. It joins subscription`);
            return filters;
        },
    } as SubscriptionOptions;
};

export const getEventById = (events: any[], id: string) => {
    return events.find(e => e.id === id);
};

export const getRelatedEventsByEventId = (events: any[], id: string) => {
    return events.filter(e => !!e.tags.find((t: any) => t.length >= 2 && t[0] === 'e' && t[1] === id));
};

export const getEventsByKind = (events: any[], kind: number) => {
    return events.filter(e => e.kind === kind);
};

