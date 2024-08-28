import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import React, {useCallback, useMemo} from "react";
import {Reactions, REACTIONS, ReactionType} from "../Reactions/Reactions";
import {nip19} from "nostr-tools";

import {useNostrContext} from "../../../providers/NostrContextProvider";
import {Button, CircularProgress} from "@mui/material";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {NostrEvent} from "nostr-tools";
import {uniqBy} from "lodash";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import {FavoriteBorder, Loop, Mood} from "@mui/icons-material";

interface ReactionButtonProps {
    event: NostrEvent;
}

export const ReactionButton = ({ event }: ReactionButtonProps) => {

    const { user, setLoginDialogOpen, addReaction } = useNostrContext();
    const {events} = useNostrNoteThreadContext();
    const reactions = useMemo(() => uniqBy((events || []).filter(({kind}: NostrEvent) => kind === 7), 'pubkey'), [events]);
    const totalReactions = useMemo(() => reactions.length, [reactions]);
    // const reactions = useLiveQuery(async () =>
    //     await db.reactions
    //         .where({ reactedToEventId: id })
    //         .toArray()
    //     , [id]);

    const reacted = useCallback(() => {
        // @ts-ignore
        return user && reactions
        // // @ts-ignore
        //     .filter(r => REACTIONS.filter(r3 => r3.type === type)
        //     // @ts-ignore
        //         .map(r2 => r2.content).includes(r.content))
            .find((r1: any) => r1.pubkey === user!.pubkey);
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

    const handleReaction = () => {
        if (!user) {
            setLoginDialogOpen(true);
        } else {
            addReaction(event, '+')
        }
    };

    return <React.Fragment>
        {/*<Badge badgeContent={totalReactions}><IconButton sx={{ padding: 0, minWidth: 'unset' }}><Mood sx={{ fontSize: 27 }} /></IconButton></Badge>*/}
        {/*<Reactions*/}
            {/*reactions={upReactions()}*/}
            {/*type={ReactionType.UP}*/}
            {/*handleReaction={(reaction: string) => {*/}
                {/*if (user) {*/}
                    {/*addReaction(id, reaction);*/}
                {/*} else {*/}
                    {/*setLoginDialogOpen(true);*/}
                {/*}*/}
            {/*}}*/}
            {/*placeholder={REACTIONS[0].content}*/}
            {/*reacted={!!reacted(ReactionType.UP)}*/}
        {/*/>*/}
        {/*<Reactions reactions={downReactions()} type={ReactionType.DOWN} handleReaction={(reaction: string) => {*/}
            {/*if (user) {*/}
                {/*addReaction(id, reaction);*/}
            {/*} else {*/}
                {/*setLoginDialogOpen(true);*/}
            {/*}*/}
        {/*}} placeholder={REACTIONS[4].content.replace('-', '👎')} reacted={!!reacted(ReactionType.DOWN)} />*/}
        <Button
            sx={{
                padding: 0,
                minWidth: 'unset',
                ...(reacted() ? {color: '#9231aa'} : {color: '#909090'}),
                '&:hover': { color: '#9231aa' }
            }}
            onClick={handleReaction}
        >
            {/*{*/}
                {/*// totalReactions >= 1 && <React.Fragment>*/}
                    {/*<Badge className="reposts-count"*/}
                           {/*sx={{ opacity: reacted() ? 1 : 0.5 }}*/}
                           {/*color="primary"*/}
                           {/*badgeContent={totalReactions}>*/}
                        <FavoriteBorder sx={{ fontSize: 27 }} />
            {totalReactions}
                {/*//     </Badge>*/}
                {/*// </React.Fragment>*/}
            {/*// }*/}
            {/*{*/}
                {/*totalReactions === 0 && <Mood sx={{ fontSize: 27, opacity: reacted() ? 1 : 0.5 }} />*/}
            {/*}*/}
        </Button>
    </React.Fragment>
};