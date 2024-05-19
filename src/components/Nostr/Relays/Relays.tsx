import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Box} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { NDKRelay } from '@nostr-dev-kit/ndk';
import {CloudOff, CloudUpload} from "@mui/icons-material";
import React, {useState} from 'react';
import {NDKFilter, NDKSubscription} from "@nostr-dev-kit/ndk";
import Badge from "@mui/material/Badge";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {noteContentToHtml} from "../../../services/note2html";
import "./Relays.css";

interface RelayTableItem {
    url: string;
    connected?: boolean;
    noOfSubs?: number;
    filters?: NDKFilter[];

}

const RelayTableRow = ({ row, relay } : { row: RelayTableItem, relay?: NDKRelay}) => {
    const [open, setOpen] = useState<boolean>();
    const { ndk } = useNostrContext();
    // const { connectedRelays } = ndk.pool;

    if (!relay) return <TableRow>
        <TableCell>{ row.url }</TableCell>
        <TableCell><CloudOff color="error"/></TableCell>
        <TableCell colSpan={2}>Not connected</TableCell>
    </TableRow>;

    return <React.Fragment>
        <TableRow>
            <TableCell>{ relay.url }</TableCell>
            <TableCell>{ ndk.pool.connectedRelays()
                .findIndex((r: NDKRelay) => r.url === relay.url) > -1 ?
                <CloudUpload color="success"/> :
                <CloudOff color="error"/>
            }</TableCell>
            <TableCell>
                <Tooltip title="Active subscriptions">
                    <Badge
                        color="warning"
                        badgeContent={row.noOfSubs}
                        showZero>
                        <SubscriptionsIcon/>
                    </Badge>
                </Tooltip>
            </TableCell>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        {
            open && <TableRow>
                <TableCell colSpan={4}>
                    Subscriptions
                    <List className={"relaySubscriptions"} id={`${relay.url}-subscriptions`}>
                        {
                            [...relay.activeSubscriptions().entries()].map(([filters, subscriptions]: any) =>
                                <ListItem>
                                    <Box sx={{ color: '#0f0f0f', maxWidth: '400px' }}>{ noteContentToHtml('```' + JSON.stringify(filters) + '```') }</Box>
                                    {/*filter: {JSON.stringify(filter)}*/}
                                    {/*subId: {subscription.subId}*/}
                                </ListItem>
                            )
                        }
                    </List>
                </TableCell>
            </TableRow>
        }
    </React.Fragment>

};

export const Relays = () => {
    const { ndk } = useNostrContext();

    return <Box>
        <TableContainer component={Box}>
            <Table sx={{ minWidth: 400 }} aria-label="relay table">
                <TableHead>
                    <TableRow>
                        <TableCell>Relay</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Subs</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        ndk.pool.urls().map((url: string) => <RelayTableRow relay={ndk.pool
                            .connectedRelays()
                            .find((relay: NDKRelay) => relay.url === url)} row={{
                            url,
                            connected: ndk.pool.connectedRelays()
                                .findIndex((relay: NDKRelay) => relay.url === url) > -1,
                            noOfSubs: [
                                // @ts-ignore
                                ...ndk.pool
                                    .connectedRelays()
                                    .find((relay: NDKRelay) => relay.url === url)
                                    ?.activeSubscriptions().entries() || []
                            ].filter((sub: any) => !!sub).length,
                            // @ts-ignore
                            // filters: [...ndk.pool
                            //     .connectedRelays()
                            //     .find((relay: NDKRelay) => relay.url === url)
                            //     ?.activeSubscriptions().entries()]
                            //     .map(([filters, subscriptions]: any) => JSON.stringify(filters)).join(',')
                        }}/>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
        {/*<List id="relay-list">*/}
            {/**/}
        {/*</List>*/}
        <List id="relay-subscriptions">
            {
                false && ndk.pool.connectedRelays().map((relay: NDKRelay) =>
                    <ListItem>
                        {relay.url}
                        <List id={`${relay.url}-subscriptions`}>
                            {
                                [...relay.activeSubscriptions().entries()].map(([filters, subscriptions]: any) =>
                                    <ListItem>
                                        <Box sx={{ color: '#0f0f0f' }}>{JSON.stringify(filters)}</Box>
                                        <Box>Subscriptions: {subscriptions.length}</Box>
                                        {/*filter: {JSON.stringify(filter)}*/}
                                        {/*subId: {subscription.subId}*/}
                                    </ListItem>
                                )
                            }
                        </List>
                    </ListItem>
                )
            }
        </List>
    </Box>
};