import React, {useCallback} from "react";
import {ElectricBolt} from "@mui/icons-material";
import {Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {ZapEvent} from "../../../models/commons";
import {nFormatter} from "../../../utils/utils";
import {nip19} from "nostr-tools";
import {useNostrContext} from "../../../providers/NostrContextProvider";
import CircularProgress from "@mui/material/CircularProgress";
import {NostrEvent} from "@nostr-dev-kit/ndk";

interface ZapButtonProps {
    // id: string;
    event: NostrEvent;
}

export const ZapButton = ({ event }: ZapButtonProps) => {

    const { id } = event;

    const { user, setLoginDialogOpen, setZapDialogOpen, setEvent } = useNostrContext();

    const zaps = useLiveQuery(async () =>
        await db.zaps
            .where({ zappedNote: id })
            .toArray()
        , [id]);

    const zapsTotal = useCallback(() => {
        const totalZaps = zaps && zaps
            .map((zapEvent: ZapEvent) => zapEvent.amount)
            .reduce((total: number, current: number) => total + current / 1000, 0);
        return totalZaps && nFormatter(totalZaps, 1);
    }, [zaps]);

    const userZaps = useCallback(() => {
        return user && zaps?.filter(({ zapper }) => zapper === nip19.decode(user.npub).data)
    }, [zaps]);

    const zapped = useCallback(() => {
        const zap = user && zaps && zaps
            .find((zapEvent: ZapEvent) => zapEvent.zapper === nip19.decode(user.npub).data);
        return zap;
    }, [user, userZaps()]);

    if (!zaps) {
        return <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />;
    }

    return <Tooltip title={`${zaps.length} zaps!`}>
        <Button
            sx={{ ...(zapped() && { color: '#ffdf00' }) }}
            color="secondary"
            onClick={() => {
                console.log('zap', {event});
                if (user) {
                    setEvent(event);
                    setZapDialogOpen(true);
                } else {
                    setLoginDialogOpen(true);
                }
            }}
        >
            <React.Fragment>
                <ElectricBolt sx={{ fontSize: 18 }} />
                { zapsTotal() }
            </React.Fragment>
        </Button>
    </Tooltip>
};