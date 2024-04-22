import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import React, {useCallback} from "react";
import {Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import {nip19} from "nostr-tools";

import {useNostrContext} from "../../../providers/NostrContextProvider";
import {CircularProgress} from "@mui/material";

interface ReactionButtonProps {
    id: string;
}

export const ReactionButton = ({ id }: ReactionButtonProps) => {

    const { user, setLoginDialogOpen, addReaction } = useNostrContext();

    const reactions = useLiveQuery(async () =>
        await db.reactions
            .where({ reactedToEventId: id })
            .toArray()
        , [id]);

    const reacted = useCallback((type: ReactionType) => {
        // @ts-ignore
        return user && reactions && reactions
        // @ts-ignore
            .filter(r => REACTIONS.filter(r3 => r3.type === type)
            // @ts-ignore
                .map(r2 => r2.content).includes(r.content))
            .find((r1: any) => r1.pubkey && r1.pubkey === nip19.decode(user.npub).data);
    }, [user, reactions]);

    const upReactions = useCallback(() => reactions && reactions
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.UP)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            .map((r3: any) => ({ type: ReactionType.UP, event: r3 }))|| []
        , [reactions]);

    const downReactions = useCallback(() => reactions && reactions
            .filter((r: any) => REACTIONS
                .filter((r1: any) => r1.type === ReactionType.DOWN)
                .map((r2: any) => r2.content)
                .includes(r.content)
            )
            // @ts-ignore
            .map((r3: any) => ({ type: ReactionType.DOWN, event: r3 })) || []
        , [reactions]);

    if (!reactions) {
        return <CircularProgress sx={{ width: '18px!important', height: '18px!important' }} />;
    }

    return <React.Fragment>
        <Reactions
            reactions={upReactions()}
            type={ReactionType.UP}
            handleReaction={(reaction: string) => {
                if (user) {
                    addReaction(id, reaction);
                } else {
                    setLoginDialogOpen(true);
                }
            }}
            placeholder={REACTIONS[0].content}
            reacted={!!reacted(ReactionType.UP)}
        />
        <Reactions reactions={downReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {
            if (user) {
                addReaction(id, reaction);
            } else {
                setLoginDialogOpen(true);
            }
        }} placeholder={REACTIONS[4].content.replace('-', '👎')} reacted={!!reacted(ReactionType.DOWN)} />
    </React.Fragment>
};