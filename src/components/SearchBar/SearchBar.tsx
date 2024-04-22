import {ClickAwayListener, List} from "@mui/material";
import React, {useEffect, useState} from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import {Search as SearchIcon, Cancel as CancelIcon, PsychologyAlt} from '@mui/icons-material';
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {Link} from "react-router-dom";
import {sortBy} from 'lodash';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import './SearchBar.css';
import {Config} from "../../resources/Config";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import {useNostrContext} from "../../providers/NostrContextProvider";

interface SearchBarProps {
    query: string;
    resultsCount?: number;
    filteredResultsCount?: number;
    onQueryChange?: (event?: any) => void,
    isQuerying?: boolean,
    searchSuggestions?: any[],
    placeholder?: string,
    tags?: string[]
}

export const SearchBar = ({ resultsCount, filteredResultsCount, onQueryChange = () => {}, isQuerying, searchSuggestions = [], ...props }: SearchBarProps) => {

    const [query, setQuery] = useState<string>(props.query);

    const { tags, addTag, removeTag } = useNostrContext();

    // const [tagsMenuAnchorEl, setTagsMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    // const tagsMenuOpen = Boolean(tagsMenuAnchorEl);
    const [searchOptionsOpen, setSearchOptionsOpen] = useState(false);

    const toggleSearchOptions = () => {
      setSearchOptionsOpen(!searchOptionsOpen);
    };

    // const handleTagsMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setTagsMenuAnchorEl(event.currentTarget);
    // };
    // const handleTagsMenuClose = () => {
    //     setTagsMenuAnchorEl(null);
    // };

    useEffect(() => {
        console.log({props})
        setQuery(props.query)
    }, [props.query]);

    const handleKeyDown = (event: any): void => {
        // if (!tagsMenuOpen) handleTagsMenuOpen(event);
        if (event.key === 'Enter') {
            toggleSearchOptions();
            onQueryChange({ target: { value: query } });
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
                    startAdornment={
                        <InputAdornment position="start">
                            {
                                !isQuerying && <PsychologyAlt sx={{ fontSize: 21 }} />
                            }
                            {
                                isQuerying && <CircularProgress sx={{ width: '18px!important', height: '18px!important', marginLeft: '3px' }} />
                            }
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            {
                                query !== '' && <IconButton>
                                    <Link to={`/search`}><CancelIcon /></Link>
                                </IconButton>
                            }
                            <IconButton color="warning" onClick={(event: any) => { event.preventDefault(); toggleSearchOptions(); onQueryChange({ target: { value: query } }) }}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </ListItem>
            {
                searchOptionsOpen && <ClickAwayListener onClickAway={() => { toggleSearchOptions(); }}><Box className="searchOptions">
                    <MenuItem sx={{ justifyContent: 'right' }}><CancelIcon sx={{ fontSize: 18 }} onClick={() => { toggleSearchOptions(); }} /></MenuItem>
                    {
                        // @ts-ignore
                        Config.NOSTR_TAGS.map((tag) => <MenuItem><Checkbox onChange={() => { !!tags && tags.includes(tag) ? removeTag(tag) : addTag(tag) }} checked={!!tags && tags.includes(tag) ? 'checked': ''}/>{tag}</MenuItem>)
                    }
                </Box></ClickAwayListener>
            }
        </List>
    );
};