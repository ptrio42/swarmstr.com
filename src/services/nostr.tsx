import {request} from "./request";

export const getRelays = async () => {
    const response = await request({
        url: 'https://nostrich.love/relays',
        method: 'GET'
    });
    return response.data;
};

export const getRelayInformationDocument = async (url: string) => {
    const response = await request({
        url
    }, { 'Accept': 'application/nostr+json' });
    return response.data;
};
