import React, {useMemo} from "react";
import {SelectChangeEvent} from "@mui/material";
import Typography from "@mui/material/Typography";

import {TagSelect} from "../TagSelect/TagSelect";
import {Sort} from "../EventList/EventList";
import {useNostrEventListContextProvider} from "../../../providers/NostrEventListContextProvider";
import Box from "@mui/material/Box";

const formatLabelFn = (text: string) => text.replace('_', ' ').toLowerCase();

export const EventListSort = () => {
    const {sort, setSort} = useNostrEventListContextProvider()
    const SORTS = useMemo(() => (() => {
        const result = [];
        for (const srt in Sort) {
            console.log('EventListSort: sort: ', {srt})
            result.push(srt);
        }
        return result;
    })(), []);

    return <Typography sx={{ display: 'flex', marginBottom: '0.5em', textAlign: 'left', justifyContent: 'space-between' }} component="div" variant="body1">
        <Box sx={{ width: '43%', display: 'flex', justifyContent: 'space-between' }}>
            <TagSelect
                displayHash={false}
                tags={SORTS}
                selectedTag={sort}
                onTagSelect={(event: SelectChangeEvent) => {
                    setSort(event.target.value as Sort);
                }}
                formatLabelFn={formatLabelFn}
            />
            {
                sort !== Sort.RECENT && <TagSelect
                    displayHash={false}
                    tags={['today', 'this week', 'last 2 weeks', 'last month']}
                    selectedTag={'this week'}
                    onTagSelect={(event: SelectChangeEvent) => {
                        // setSort(event.target.value as Sort);
                    }}
                />
            }
        </Box>
    </Typography>;
};