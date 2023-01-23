import {Note} from "../Note/Note";
import React, {useEffect, useState} from "react";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";

interface ThreadProps {
    note: any;
    comments?: any[];
    reactions?: any[];
    metadata?: any[];
    handleUpReaction?: (noteId: string, reaction?: string) => void;
    handleDownReaction?: (noteId: string, reaction?: string) => void;
    handleNoteToggle?: (expanded: boolean, guideId?: string) => void;
    noteExpandedOnInit?: boolean;
}

export const NoteThread = ({ note, comments, metadata, reactions, handleUpReaction, handleDownReaction, handleNoteToggle, noteExpandedOnInit }: ThreadProps) => {

    const [expanded, setExpanded] = useState(false);
    const [noteExpanded, setNoteExpanded] = useState(noteExpandedOnInit);

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
                <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} id={note.guideId}>
                    <Note
                        id={note.id}
                        guideId={note.guideId}
                        title={note.title || 'Discussion ' + '(' + (comments && comments.length || 0) + ')'}
                        content={note.content}
                        updatedAt={note.updatedAt || new Date(note.created_at*1000).toDateString()}
                        pubkeys={note.pubkey && [note.pubkey] || []}
                        metadata={metadata}
                        reactions={reactions}
                        comments={comments}
                        author={note.pubkey}
                        isExpanded={noteExpanded}
                        isCollapsable={true}
                        handleThreadToggle={(exp: boolean) => {
                            setExpanded(exp);
                        }}
                        handleNoteToggle={(exp: boolean) => {
                            handleNoteToggle && handleNoteToggle(exp, note.guideId);
                            setNoteExpanded(exp);
                        }}
                        handleUpReaction={(noteId: string, reaction?: string) => {
                            handleUpReaction && handleUpReaction(noteId, reaction);
                        }}
                        handleDownReaction={(noteId: string, reaction?: string) => {
                            handleDownReaction && handleDownReaction(noteId, reaction);

                        }}
                        tags={note.tags}
                        isThreadExpanded={expanded}
                        bulletPoints={note.bulletPoints}
                        urls={note.urls}
                        guideTags={note.guideTags}
                        imageUrls={note.imageUrls}
                        isRead={note.isRead}
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
                                            handleUpReaction={(noteId: string, reaction?: string) => {
                                                handleUpReaction && handleUpReaction(noteId, reaction);
                                            }}
                                            handleDownReaction={(noteId: string, reaction?: string) => {
                                                handleDownReaction && handleDownReaction(noteId, reaction);
                                            }}
                                            tags={n.tags}
                                            isRead={true}
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