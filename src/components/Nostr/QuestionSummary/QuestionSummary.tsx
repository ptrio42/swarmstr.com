import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../../db";
import {containsTag} from "../../../utils/utils";
import {NoteSummary} from "../NoteSummary/NoteSummary";
import React from "react";

interface QuestionSummaryProps {
    id: string;
}

export const QuestionSummary = ({ id }: QuestionSummaryProps) => {
    const summary = useLiveQuery(
        async () => {
            const label = await db.labels
                .where({ referencedEventId: id })
                .and(({tags}) => containsTag(tags, ['l', 'question/summary', '#e']))
                .first();
            return label?.content || '';
        }
        , [id], '');

    if (summary === '') {
        return null;
    }

    return <NoteSummary content={summary} />
};