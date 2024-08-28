import {NostrEvent} from "nostr-tools";
import ReplyButton from "../ReplyButton/ReplyButton";
import {DoneOutline, ElectricBolt, ExpandLess, ExpandMore, Loop, Mood, ThumbsUpDown} from "@mui/icons-material";
import ZapButton from "../ZapButton/ZapButton";
import {BoostButton} from "../BoostButton/BoostButton";
import {ReactionButton} from "../ReactionButton/ReactionButton";
import {EventMenu} from "../EventMenu/EventMenu";
import React, {useMemo, useState} from "react";
import {CardActions} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag, nFormatter, valueFromTag} from "../../../utils/utils";
import {LabelEvent, ReactionEvent, RepostEvent, ZapEvent} from "../../../models/commons";
import Box from "@mui/material/Box";
import { Metadata } from '../Metadata/Metadata';
import {REACTIONS} from "../Reactions/Reactions";
import Button from "@mui/material/Button";
import {nip19} from "nostr-tools";
import {useNostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import {useNostrNoteThreadContext} from "../../../providers/NostrNoteThreadContextProvider";
import {getZapper, getZapTotal, zapAmountFromEvent} from "../../../services/nostr/zap";

interface NoteActionsProps {
    nevent?: string;
    event: NostrEvent;
    pinned?: boolean;
}

const NoteActions = ({ event, pinned, nevent }: NoteActionsProps) => {
    if (!event && !nevent) {
        return null;
    }

    const [noteEngagementsVisible, setNoteEngagementsVisible] = useState<boolean>(false);

    const {events} = useNostrNoteThreadContext();

    const zaps = useMemo(() => events?.filter(({kind}) => kind === 9735), [events]);
    const reactions = useMemo(() => events?.filter(({kind}) => kind === 7), [events]);
    const boosts = useMemo(() => events?.filter(({kind}) => kind === 6), [events]);
    const replies = useMemo(() => events?.filter(({kind}) => kind === 1 || kind === 30023), [events]);

    // const noteBoosts = useLiveQuery(() => db.reposts.where({ repostedEventId: event.id }).toArray(), [event]);
    // const noteReactions = useLiveQuery(() => db.reactions.where({ reactedToEventId: event.id }).toArray(), [event]);
    // const noteZaps = useLiveQuery(() => db.zaps.where({ zappedNote: event.id }).toArray(), [event]);
    // const noteReviews = useLiveQuery(() => db.labels
    //     .where({ referencedNoteId: event.id })
    //     .and(({ tags }: LabelEvent) => containsTag(tags, ['l', 'note/useful', '#e']) || containsTag(tags, ['l', 'note/not_useful', '#e'])), [event]);
    // const noteComments = useLiveQuery(() => db.notes
    //     .where('referencedEventsIds').equals(event.id!).toArray(), [event], [])

    const zapsMemo = useMemo(() => zaps && <ZapButton events={zaps!}/>, [zaps?.length]);
    const reactionsMemo = useMemo(() => <ReactionButton event={event!}/>, [event, reactions?.length]);

    const noteZapsMemo = useMemo(() => <React.Fragment>
        {
            zaps && zaps.length > 0 && <Stack sx={{width: '100%', marginBottom: '0.5em'}} direction="row">
                <Box sx={{ minWidth: '50px', textAlign: 'center' }}><ElectricBolt sx={{ fontSize: 27, color: '#fba32b' }}/></Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        zaps
                            ?.map((event: NostrEvent) => <Metadata variant="avatar" pubkey={getZapper(event!)} badge={<Box sx={{color: '#ffdf00', textShadow: '1px 1px #000'}}>{zapAmountFromEvent(event)}</Box>}/>)
                    }
                </Box>
            </Stack>
        }
    </React.Fragment>, [event, zaps?.length || 0]);

    const noteBoostsMemo = useMemo(() => <React.Fragment>
        {
            boosts && boosts.length > 0 && <Stack sx={{width: '100%', marginBottom: '0.5em'}} direction="row">
                <Box sx={{ minWidth: '50px', textAlign: 'center' }}><Loop sx={{ fontSize: 27, color: '#3db645' }} /></Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        boosts
                            ?.map((event: NostrEvent) => <Metadata variant="avatar" pubkey={event!.pubkey}/>)
                    }
                </Box>
            </Stack>
        }
    </React.Fragment>, [event, boosts?.length || 0]);

    const noteReactionsMemo = useMemo(() => <React.Fragment>
        {
            reactions && reactions.length > 0 && <Stack sx={{width: '100%'}} direction="row">
                <Box sx={{ minWidth: '50px', textAlign: 'center' }}><Mood sx={{ color: '#9231aa', fontSize: 27 }} /></Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        reactions
                            ?.map((event: NostrEvent) => <Metadata variant="avatar" pubkey={event!.pubkey} badge={event.content}/>)
                    }
                </Box>
            </Stack>
        }
    </React.Fragment>, [event, reactions?.length || 0])

    // const {events} = useNostrEventListContextProvider();

    return <CardActions sx={{ display: 'flex', flexDirection: 'column', padding: '2px 0' }}>
        <Typography sx={{ width: '100%' }} variant="body2" component="div">
            <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }} direction="row" spacing={1}>
                <Typography component="div" sx={{ fontSize: 14, display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                </Typography>
                <Typography component="div" sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-around', alignItems: 'center', minWidth: '270px' }}>
                    { pinned && <DoneOutline color="success" /> }
                    { zapsMemo }
                    <BoostButton id={event!.id!} event={event!}/>
                    <ReplyButton event={event} totalReplies={replies?.length} />
                    { reactionsMemo }
                    <EventMenu nevent={nevent} event={event}/>
                    <Button sx={{ minWidth: 'unset', padding: 0, color: '#909090', '&:hover': { color: '#000' }, border: '1px #909090 solid' }} variant="outlined" onClick={() => {
                        noteEngagementsVisible ? setNoteEngagementsVisible(false) : setNoteEngagementsVisible(true);
                    }}>
                        {
                            noteEngagementsVisible ? <ExpandLess/> : <ExpandMore/>
                        }
                    </Button>
                </Typography>
            </Stack>
        </Typography>
        {
            noteEngagementsVisible && <Typography sx={{ width: '100%' }} variant="body2" component="div">
                <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 0, paddingBottom: '8px' }} direction="column" spacing={1}>

                    {noteZapsMemo}

                    {noteBoostsMemo}

                    {noteReactionsMemo}
                </Stack>
            </Typography>
        }
    </CardActions>
};

export default React.memo(NoteActions);