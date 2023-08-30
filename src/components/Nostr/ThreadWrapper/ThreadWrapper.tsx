import {NostrNoteThreadContext} from "../../../contexts/NostrNoteThreadContext";
import {NoteThread} from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import {Note} from "../Note/Note";
import {NostrNoteThreadContextProvider} from "../../../providers/NostrNoteThreadContextProvider";
import React, {useEffect, useState} from "react";
import {Backdrop} from "../../Backdrop/Backdrop";

export const ThreadWrapper = () => {
    const [showPreloader, setShowPreloader] = useState<boolean>(true);

    useEffect(() => {
        setShowPreloader(false);
    });

    return (
        <NostrNoteThreadContextProvider>
            <NostrNoteThreadContext.Consumer>
                {
                    ({ nevent }) => (
                        <NoteThread
                            key={`${nevent}-thread`}
                            nevent={nevent}
                            expanded={true}
                            floating={false}
                        >
                            <NostrNoteContextProvider thread={true}>
                                <Note key={`${nevent}-content`} nevent={nevent} expanded={true}/>
                            </NostrNoteContextProvider>
                        </NoteThread>
                    )
                }
            </NostrNoteThreadContext.Consumer>
            <Backdrop open={showPreloader} />
        </NostrNoteThreadContextProvider>
    );
};