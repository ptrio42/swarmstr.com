import {ContactListEvent} from "../../models/commons";
import {groupBy} from 'lodash';
import {Config} from "../../resources/Config";
import {DEFAULT_USER_RELAYS} from "./relays";

export const getUserRelays = (contactList: ContactListEvent) => {
    console.log({contactList})
    try {
        const relayList = JSON.parse(contactList.content);
        let relays: any = groupBy(Object.keys(relayList)
            .map((url: string) => ([
                {
                    url,
                    permission: {
                        key: 'read',
                        value: relayList[url]?.read
                    },
                },
                {
                    url,
                    permission: {
                        key: 'write',
                        value: relayList[url]?.write
                    },
                }
            ]))
            .flat(2)
            .filter((relay: any) => relay.permission.value), 'permission.key');
        const { read, write } = relays;
        relays = {
            readRelays: read.map((relay: any) => relay.url),
            writeRelays: write.map((relay: any) => `${relay.url}${relay.url[relay.url.length - 1] !== '/' ? '/' : ''}`)
        };
        return relays;
    } catch (error) {
        return DEFAULT_USER_RELAYS;
    }
};