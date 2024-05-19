import {ClickAwayListener, List} from "@mui/material";
import React, {useEffect, useState} from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import {Search as SearchIcon, Cancel as CancelIcon} from '@mui/icons-material';
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import './SearchBar.css';
import {Config} from "../../resources/Config";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {Link} from "react-router-dom";
import { Metadata } from '../Nostr/Metadata/Metadata';

interface SearchBarProps {
    query: string;
    resultsCount?: number;
    filteredResultsCount?: number;
    onQueryChange?: (event?: any) => void,
    onSilentQueryChange?: (event?: any) => void,
    isQuerying?: boolean,
    searchSuggestions?: any[],
    placeholder?: string,
    tags?: string[],
    showSearchBarOptions?: boolean
}

export const SearchBar = ({
  showSearchBarOptions = true, resultsCount, filteredResultsCount, onQueryChange = () => {},
  onSilentQueryChange = () => {}, isQuerying, searchSuggestions = [], ...props }: SearchBarProps
) => {

    const [query, setQuery] = useState<string>(props.query);
    const { tags, addTag, removeTag } = useNostrContext();
    const [searchOptionsOpen, setSearchOptionsOpen] = useState(false);

    const toggleSearchOptions = () => {
      setSearchOptionsOpen(!searchOptionsOpen);
    };

    useEffect(() => {
        setQuery(props.query);
    }, [props.query]);

    const handleKeyDown = (event: any): void => {
        if (event.key === 'Enter') {
            if (searchOptionsOpen) toggleSearchOptions();
            onQueryChange({ target: { value: query } });
        } else {
            if (!searchOptionsOpen) toggleSearchOptions();
            onSilentQueryChange({ target: {value: query }});
        }
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
                    onClick={(event: any) => { !searchOptionsOpen ? toggleSearchOptions() : null }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus={true}
                    endAdornment={
                        <InputAdornment position="end">
                            {
                                query !== '' && <IconButton onClick={() => { setQuery('') }}>
                                    <CancelIcon />
                                </IconButton>
                            }
                            <IconButton color="warning" onClick={(event: any) => {
                                event.preventDefault();
                                if (searchOptionsOpen) toggleSearchOptions();
                                onQueryChange({ target: { value: query } })
                            }}
                            >
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </ListItem>
            {
                showSearchBarOptions && searchOptionsOpen && <ClickAwayListener
                    onClickAway={() => {
                        if (searchOptionsOpen) toggleSearchOptions();
                    }}
                >
                    <Box className="searchOptions">
                        <MenuItem
                            sx={{ justifyContent: 'space-between'
                            }}
                        >
                            <Box sx={{ fontSize: '14px', fontStyle: 'italic' }}>
                                or search hashtag <Link to={`/recent/${query.trim()}`}>#{query.trim()}</Link>
                            </Box>
                            <CancelIcon
                                sx={{ fontSize: 18 }}
                                onClick={() => {
                                    toggleSearchOptions();
                                }}
                            />
                        </MenuItem>
                        {
                            searchSuggestions && searchSuggestions.map((suggestion: any) => <MenuItem>
                                <Metadata pubkey={suggestion} variant={'link'} />
                            </MenuItem>)
                        }
                        {
                            // @ts-ignore
                            Config.NOSTR_TAGS
                                .map((tag) => <MenuItem>
                                    <Checkbox
                                        onChange={() => {
                                            !!tags && tags.includes(tag) ? removeTag(tag) : addTag(tag)
                                        }}
                                        // @ts-ignore
                                        checked={!!tags && tags.includes(tag) ? 'checked': ''}
                                    />
                                    {tag}
                                </MenuItem>)
                        }
                </Box></ClickAwayListener>
            }
        </List>
    );
};