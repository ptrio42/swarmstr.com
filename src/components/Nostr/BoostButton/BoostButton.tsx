import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {useCallback} from "react";
import {RepostEvent} from "../../../models/commons";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import React from "react";
import {Loop} from "@mui/icons-material";
import {Button} from "@mui/material";
import {NostrEvent} from "@nostr-dev-kit/ndk";
import Badge from "@mui/material/Badge";

interface BoostButtonProps {
    id: string;
    event: NostrEvent;
}

export const BoostButton = ({ id, event }: BoostButtonProps) => {

    const { user, setLoginDialogOpen, boost } = useNostrContext();

    const boosts = useLiveQuery(async () =>
        await db.reposts
            .where({ repostedEventId: id })
            .toArray()
        , [id], []);

    const boosted = useCallback(() => {
        return user && boosts
            .find(({pubkey}: RepostEvent) => pubkey === user!.pubkey);
    }, [boosts]);

    return <Button sx={{ minWidth: '21px' }} color="secondary" onClick={() => {
        // console.log('boost', {event});
        if (user) {
            boost(event);
        } else {
            setLoginDialogOpen(true);
        }
    }}>
        {
            boosts.length >= 1 && <React.Fragment>
                <Badge className="reposts-count"
                       sx={{ opacity: boosted() ? 1 : 0.5 }}
                       color="primary"
                       badgeContent={boosts.length}>
                    <Loop sx={{ fontSize: 18 }} />
                </Badge>
            </React.Fragment>
        }
        {
            boosts.length === 0 && <Loop sx={{ fontSize: 18, opacity: boosted() ? 1 : 0.5 }} />
        }
    </Button>
};