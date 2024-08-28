import React, {useCallback, useMemo} from "react";
import {NostrEvent} from "nostr-tools";

import {Loop} from "@mui/icons-material";
import {Button} from "@mui/material";
import Badge from "@mui/material/Badge";

import {useNostrContext} from "../../../providers/NostrContextProvider";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";

interface BoostButtonProps {
    id?: string;
    event: NostrEvent;
}

export const BoostButton = ({ id, event }: BoostButtonProps) => {

    const { user, setLoginDialogOpen, boost } = useNostrContext();

    const {events} = useNostrNoteThreadContext();

    const boosts = useMemo(() => (events || []).filter(({kind}: NostrEvent) => kind === 6), [events]);
    const totalBoosts = useMemo(() => boosts?.length || 0, [boosts]);

    const boosted = useCallback(() => {
        return user && boosts
            .find(({pubkey}: NostrEvent) => pubkey === user!.pubkey);
    }, [boosts, user]);

    return <Button
        sx={{
            minWidth: 'unset',
            padding: 0,
            '&:hover': { color: '#3db645' },
            ...(boosted() ? {color: '#3db645'} : {color: '#909090' })
        }} onClick={() => {
        // console.log('boost', {event});
        if (user) {
            boost(event);
        } else {
            setLoginDialogOpen(true);
        }
    }}>
        {/*{*/}
            {/*totalBoosts >= 1 && <React.Fragment>*/}
                {/*<Badge className="reposts-count"*/}
                       {/*sx={{ opacity: boosted() ? 1 : 0.5 }}*/}
                       {/*color="primary"*/}
                       {/*badgeContent={totalBoosts}>*/}
                    <Loop sx={{ fontSize: 27 }} />
        {totalBoosts}
                {/*</Badge>*/}
            {/*</React.Fragment>*/}
        {/*}*/}
        {/*{*/}
            {/*totalBoosts === 0 && <Loop sx={{ fontSize: 27, opacity: boosted() ? 1 : 0.5 }} />*/}
        {/*}*/}
    </Button>
};