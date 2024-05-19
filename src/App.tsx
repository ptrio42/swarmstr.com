import React, {useEffect, useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import {Footer, NavBar} from "./components";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import {Box} from "@mui/material";
import {styled} from "@mui/material";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {ThemeContext, themes} from "./contexts/ThemeContext";
import {Nip05} from "./components/Nostr/Nip05/Nip05";
import {ThemeContextWrapper} from "./theme/ThemeContextWrapper";
import {Search} from "./components/Nostr/Search/Search";
import {NostrFeedContextProvider} from "./providers/NostrFeedContextProvider";
import {NostrContextProvider} from "./providers/NostrContextProvider";
import {ThreadWrapper} from "./components/Nostr/ThreadWrapper/ThreadWrapper";
import {RecentNotes} from "./components/Nostr/RecentNotes/RecentNotes";
import {Nostr} from "./components/Nostr/Nostr";
import {List} from "./components/Nostr/List/List";
import {Profile} from "./components/Nostr/Profile/Profile";
import {Home} from "./components/Nostr/Home/Home";
import {ImageCreator} from "./components/ImageCreator/ImageCreator";
import {ImageCreatorDialog} from "./dialog/ImageCreatorDialog";

const theme = createTheme({
    typography: {
    fontFamily: [
        'Merriweather',
        'Roboto',
        'Oxygen',
        'sans-serif'
    ].join(',')
    },
    palette: {
        primary: {
            main: '#F0E68C'
        },
        secondary: {
            main: '#989500'
        }
    },
    shape: {
        borderRadius: 16,
    }
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

function App() {
  const { pathname, hash, key } = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (hash === '') {
        return;
      // window.scrollTo(0, 0);
    }
    else {
      // setTimeout(() => {
      //   const id = hash.replace('#', '');
      //   const element = document.getElementById(id);
      //   if (element) {
      //     element.scrollIntoView();
      //   }
      // }, 500);
    }
  }, [pathname, hash, key]);

  return (
      <React.Fragment>
          <NostrContextProvider>
      <ThemeContextWrapper>
    <div className="App">
        <ThemeProvider theme={theme}>
            <NavBar />
            <Box className="AppContent" sx={{ maxWidth: '640px', margin: '0 auto' }}>
                <Routes>
                    <Route path="/" element={<Nostr/>}>
                        <Route path="/" element={<Home/>} />
                        <Route path="/search/:searchString?" element={<NostrFeedContextProvider><Search/></NostrFeedContextProvider>}/>
                        <Route path="/recent/:explicitTag?" element={<RecentNotes/>} />
                        <Route path="/e/:nevent" element={<ThreadWrapper/>} />
                        <Route path="/d/:listName" element={<List/>} />
                        <Route path="/p/:npub" element={<Profile/>} />
                        {/*<Route path="/image-creator" element={<ImageCreator/>} />*/}

                    </Route>
                    <Route path="/nostr-address" element={<Nip05/>} />
                </Routes>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThemeContext.Consumer>
                    {
                        ({ toggleTheme, theme }) => (
                            <FormGroup>
                                <FormControlLabel
                                    control={<MaterialUISwitch sx={{ m: 1 }} checked={theme === themes.dark} />}
                                    label="Dark mode"
                                    onChange={
                                        () => {
                                            setDarkMode(!darkMode);
                                            toggleTheme(darkMode ? themes.light : themes.dark);
                                        }
                                    }
                                />
                            </FormGroup>
                        )
                    }
                </ThemeContext.Consumer>
            </Box>
            <Footer />
         </ThemeProvider>
    </div>
    </ThemeContextWrapper>
          </NostrContextProvider>
      </React.Fragment>
  );
}

export default App;
