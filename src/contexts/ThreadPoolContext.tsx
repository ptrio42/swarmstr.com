import {createContext} from "react";

type ThreadPoolContextType = {
    highlightedNote?: { id: string, depth: number },
    setHighlightedNote: (noteRef: any) => void
}

export const ThreadPoolContext = createContext<ThreadPoolContextType>({
    setHighlightedNote: () => {}
});