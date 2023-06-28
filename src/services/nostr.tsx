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

export const getRelays = async () => {
    const response = await request({
        url: 'https://nostrich.love/relays',
        method: 'GET'
    });
    return response.data;
};