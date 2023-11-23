import {List} from "@mui/material";
import React, {useEffect, useState} from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { Search as SearchIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {Link} from "react-router-dom";
import {sortBy} from 'lodash';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import './SearchBar.css';

interface SearchBarProps {
    query: string;
    resultsCount?: number;
    filteredResultsCount?: number;
    onQueryChange?: (event?: any) => void,
    isQuerying?: boolean,
    searchSuggestions?: any[],
    placeholder?: string,
}

export const SearchBar = ({ resultsCount, filteredResultsCount, onQueryChange = () => {}, isQuerying, searchSuggestions = [], ...props }: SearchBarProps) => {

    const [query, setQuery] = useState<string>(props.query);

    useEffect(() => {
        console.log({props})
        setQuery(props.query)
    }, [props.query]);

    const handleKeyDown = (event: any): void => {
        if (event.key === 'Enter') onQueryChange({ target: { value: query } });
    };

    return (
        <List sx={{ width: '100%', paddingBottom: 0 }}>
            <ListItem key={'search-box'} className="guide-search">
                <Input
                    sx={{ width: '100%' }}
                    id="searchQuery"
                    name="searchQuery"
                    placeholder={props.placeholder || 'Search...'}
                    value={query}
                    onChange={(event: any) => { setQuery(event.target.value) }}
                    onKeyDown={handleKeyDown}
                    startAdornment={
                        <InputAdornment position="start">
                            {
                                !isQuerying && <SearchIcon sx={{ fontSize: 21 }} />
                            }
                            {
                                isQuerying && <CircularProgress sx={{ width: '18px!important', height: '18px!important', marginLeft: '3px' }} />
                            }
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            {
                                query !== '' && <IconButton onClick={() => { setQuery('') }}>
                                    <CancelIcon />
                                </IconButton>
                            }
                            <IconButton color="warning" onClick={() => onQueryChange({ target: { value: query } })}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </ListItem>
            {/*{*/}
                {/*searchSuggestions.length > 0 && <ListItem sx={{ justifyContent: 'center' }}>*/}
                    {/*Similar searches:*/}
                    {/*{ sortBy(searchSuggestions, 'hits').reverse()*/}
                        {/*.slice(0, 3)*/}
                        {/*.map(({query}) => <Button color="secondary" sx={{ textTransform: 'none' }} component={Link} to={`/search/${query}`}>{ query }</Button>) }*/}
                {/*</ListItem>*/}
            {/*}*/}
            {/*{*/}
                {/*query && <ListItem key={'results-count'} sx={{ justifyContent: 'center' }}>*/}
                    {/*{ filteredResultsCount && `${filteredResultsCount}/` }{ resultsCount || 0 } results*/}
                    {/*{*/}
                        {/*query && isQuerying && <Box>*/}
                            {/*<CircularProgress sx={{ width: '21px!important', height: '21px!important', marginLeft: '3px' }} />*/}
                        {/*</Box>*/}
                    {/*}*/}
                {/*</ListItem>*/}
            {/*}*/}
        </List>
    );
};