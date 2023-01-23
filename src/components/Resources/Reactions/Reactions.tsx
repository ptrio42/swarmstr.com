import {ClickAwayListener} from "@mui/material";
import React, {useRef} from "react";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { uniqBy } from 'lodash';

export enum ReactionType {
    UP = 'Up',
    DOWN = 'Down'
}

export const REACTIONS = [
    {
        name: 'thumbsup',
        content: '👍',
        type: ReactionType.UP
    },
    {
        name: 'fire',
        content: '🔥',
        type: ReactionType.UP
    },
    {
        name: 'purple_heart',
        content: '💜',
        type: ReactionType.UP
    },
    {
        name: 'orange_heart',
        content: '🧡',
        type: ReactionType.UP
    },
    {
        name: 'thumbsdown',
        content: '👎',
        type: ReactionType.DOWN
    },
    {
        name: 'unamused',
        content: '😒',
        type: ReactionType.DOWN
    },
    {
        name: 'plus',
        content: '+',
        type: ReactionType.UP
    },
    {
        name: 'shaka',
        content: '🤙',
        type: ReactionType.UP
    }
];

export interface Reaction {
    id: string;
    content: string;
    tags?: string[][];
    pubkey: string;
}

interface ReactionsProps {
    reactions: Reaction[];
    type?: ReactionType;
    handleReaction?: (reaction: string) => void;
    placeholder?: any;
    reacted?: boolean;
}

export const Reactions = ({ reactions, handleReaction, type, placeholder, reacted }: ReactionsProps) => {

    const [open, setOpen] = React.useState(false);

    const reactionsRef = useRef(null);

    return <IconButton
        sx={{ fontSize: 18 }}
        {...reacted && {color: 'success'}}
        onClick={() => {
            setOpen(!open);
        }}
    >
        <Badge ref={reactionsRef} badgeContent={reactions.length} color="primary">
            { uniqBy(reactions, 'content').map(r => r.content.replace('+', REACTIONS[2].content)) }
            {
                reactions.length === 0 && placeholder
            }
        </Badge>
        <Popper
            sx={{
                zIndex: 10000,
                marginBottom: '-41px!important'
            }}
            open={open}
            anchorEl={reactionsRef.current}
            role={undefined}
            transition
            placement="bottom"
            disablePortal
        >
            {({ TransitionProps }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: 'center bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={(event: Event) => {
                            if (
                                reactionsRef.current &&
                                // @ts-ignore
                                reactionsRef.current.contains(event.target as HTMLElement)
                            ) {
                                return;
                            }

                            setOpen(false);
                        }}>
                            <MenuList id="split-button-menu" autoFocusItem>
                                <MenuItem
                                    onClick={() => {}}
                                >
                                    { REACTIONS
                                        .filter(r => !!type ? r.type === type : true )
                                        .map(r => (
                                            <IconButton
                                                sx={{ fontSize: 18 }}
                                                onClick={(event: any) => {
                                                    handleReaction && handleReaction(event.target.innerText);
                                                    setOpen(!open);
                                                }}
                                            >
                                                {r.content}
                                            </IconButton>
                                        )) }
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </IconButton>
};