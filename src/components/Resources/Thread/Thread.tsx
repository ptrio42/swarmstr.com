import {Note} from "../Note/Note";
import React, {useEffect, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";

interface ThreadProps {
    note: any;
    comments?: any[];
    reactions?: any[];
    metadata?: any[];
}

export const NoteThread = ({ note, comments, metadata, reactions }: ThreadProps) => {

    const [expanded, setExpanded] = useState(false);

    const getCommentsSorted = () => {
        let commentsSorted = comments && [...comments] || [];
        if (commentsSorted) {
            commentsSorted = commentsSorted
                .map(c => ({...c, pinned: false}))
                .sort((a, b) => {
                    const aReactions = a.reactions && a.reactions.length || 0;
                    const bReactions = b.reactions && b.reactions.length || 0;
                    return bReactions - aReactions;
                });

            if (commentsSorted[0]) {
                commentsSorted[0].pinned = true;
                commentsSorted[0].title = 'Most Reactions'
            }
        }
        return commentsSorted;
    };

    return (
        <React.Fragment>
            <List>
                <ListItem>
                    <Note
                        id={note.id}
                        title={'Discussion ' + '(' + (comments && comments.length) + ')'}
                        content={note.content}
                        updatedAt={new Date(note.created_at*1000).toDateString()}
                        pubkeys={note.pubkey && [note.pubkey] || []}
                        metadata={metadata}
                        reactions={reactions}
                        comments={comments}
                        author={note.pubkey}
                        isExpanded={true}
                        isCollapsable={true}
                        handleClick={() => {
                            setExpanded(!expanded);
                        }}
                    />
                </ListItem>
                {
                    expanded &&
                    <ListItem>
                        <List>
                            { getCommentsSorted()
                                .map(n =>
                                    <ListItem>
                                        <Note
                                            id={n.id}
                                            title={n.title || 'Other Replies'}
                                            content={n.content}
                                            updatedAt={new Date(n.created_at*1000).toDateString()}
                                            pubkeys={n.pubkey && [n.pubkey] || []}
                                            metadata={metadata}
                                            reactions={n.reactions && Object.values(n.reactions)}
                                            author={n.pubkey}
                                            pinned={n.pinned}
                                            isExpanded={true}
                                            isCollapsable={true}
                                        />
                                    </ListItem>
                                )
                            }
                        </List>
                    </ListItem>
                }
            </List>
        </React.Fragment>
    );
};