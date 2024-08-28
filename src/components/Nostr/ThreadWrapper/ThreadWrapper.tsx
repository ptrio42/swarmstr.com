import {NostrNoteThreadContext} from "../../../contexts/NostrNoteThreadContext";
import NoteThread from "../Thread/Thread";
import {NostrNoteContextProvider} from "../../../providers/NostrNoteContextProvider";
import Note from "../Note/Note";
import NostrNoteThreadContextProvider from "../../../providers/NostrNoteThreadContextProvider";
import {ThreadPoolContext} from "../../../contexts/ThreadPoolContext";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {Backdrop} from "../../Backdrop/Backdrop";

export const ThreadWrapper = () => {
    const [showPreloader, setShowPreloader] = useState<boolean>(true);
    // const [highlightedNote, setHighlightedNote] = useState<{ id: string, depth: number }|undefined>();

    // const memoizedSetHighlightedNote = useCallback(setHighlightedNote, [])

    useEffect(() => {
        setShowPreloader(false);
    });

    return (
        <React.Fragment>
            {/*<ThreadPoolContext.Provider value={{ highlightedNote, setHighlightedNote }}>*/}
                <NostrNoteThreadContextProvider>
                    <NostrNoteThreadContext.Consumer>
                        {
                            ({ nevent }) => (
                                <NoteThread
                                    key={`${nevent}-thread`}
                                    nevent={nevent}
                                    expanded={true}
                                    floating={false}
                                    depth={1}
                                    showReplies={true}
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
            {/*</ThreadPoolContext.Provider>*/}
        </React.Fragment>
    );
};

export const useThreadPoolContext = () => useContext(ThreadPoolContext);