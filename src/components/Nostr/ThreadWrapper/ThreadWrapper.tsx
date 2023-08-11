import {NostrNoteThreadContext} from "../../../contexts/NostrNoteThreadContext";
import {NoteThread} from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {Note} from "../Note/Note";
import {NostrNoteThreadContextProvider} from "../../../providers/NostrNoteThreadContextProvider";
import React from "react";

export const ThreadWrapper = () => {
    return (
        <NostrNoteThreadContextProvider>
            <NostrNoteThreadContext.Consumer>
                {
                    ({ nevent }) => (
                        <NoteThread
                            key={`${nevent}-thread`}
                            nevent={nevent}
                            expanded={true}
                        >
                            <NostrNoteContextProvider thread={true}>
                                <Note key={`${nevent}-content`} nevent={nevent} expanded={true}/>
                            </NostrNoteContextProvider>
                        </NoteThread>
                    )
                }
            </NostrNoteThreadContext.Consumer>
        </NostrNoteThreadContextProvider>
    );
};