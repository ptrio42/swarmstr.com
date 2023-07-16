import {List} from "@mui/material";
import React from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { Search as SearchIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ListItem from "@mui/material/ListItem";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

interface SearchProps {
    query: string;
    resultsCount?: number;
    onQueryChange?: (event?: any) => void,
    isQuerying: boolean
}

export const Search = ({ query, resultsCount, onQueryChange = () => {}, isQuerying }: SearchProps) => {
    return (
        <List sx={{ width: '100%', paddingBottom: 0 }}>
            <ListItem key={'search-box'} className="guide-search">
                <Input
                    sx={{ width: '80%' }}
                    id="searchQuery"
                    name="searchQuery"
                    placeholder={'Search...'}
                    value={query}
                    onChange={onQueryChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    {...(query !== '' && { endAdornment:
                        <InputAdornment position="end" onClick={() => onQueryChange({ target: { value: '' } })}>
                        <CancelIcon />
                        </InputAdornment>
                    })}
                />
            </ListItem>
            {
                query && <ListItem key={'results-count'} sx={{ justifyContent: 'center' }}>
                    { resultsCount || 0 } results
                </ListItem>
            }
            <ListItem key={'is-querying'} sx={{ height: '4px', padding: 0 }}>
                {
                    query && isQuerying && <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
            </ListItem>
        </List>
    );
};