import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Box} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { NDKRelay } from '@nostr-dev-kit/ndk';
import {CloudOff, CloudUpload} from "@mui/icons-material";
import React from 'react';

export const Relays = () => {
    const { ndk } = useNostrContext();

    return <Box>
        <List id="relay-list">
            {
                ndk.pool.urls().map((url: string) => <ListItem>
                    { url } &nbsp;&nbsp; { ndk.pool.connectedRelays().findIndex((relay: NDKRelay) => relay.url === url) > -1 ? <CloudUpload color="success"/> : <CloudOff color="error"/> }
                </ListItem>)
            }
        </List>
    </Box>
};