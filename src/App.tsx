import React, {useEffect, useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import {BitcoinResources, Footer, CardGenerator, NavBar, PageContent, SpreadTheWord} from "./components";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {Box} from "@mui/material";
import styled from "@mui/material/styles/styled";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {ThemeContext, themes} from "./contexts/ThemeContext";
import {NostrResources} from "./components/Resources/NostrResources/NostrResources";
import {Resources} from "./components/Resources/Resources";
import {TipJar} from "./components/TipJar/TipJar";
import {Nostr} from "./components/Nostr/Nostr";
import {Nip05} from "./components/Nostr/Nip05/Nip05";
import {Zaps} from "./components/Nostr/Zaps/Zaps";

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
      window.scrollTo(0, 0);
    }
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <NavBar />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThemeContext.Consumer>
                    {
                        ({ toggleTheme, theme }) => (
                            <FormGroup>
                                <FormControlLabel
                                    control={<MaterialUISwitch sx={{ m: 1 }} checked={theme === themes.dark} />}
                                    label="Toggle dark mode"
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
            <Routes>
                <Route path="/" element={<PageContent />} />
                <Route path="/spread-the-word" element={<SpreadTheWord />} />
                <Route path="resources" element={<Resources />}>
                    <Route path="bitcoin" element={<BitcoinResources />} />
                    <Route path="nostr" element={<NostrResources/>} />
                </Route>
                <Route path="/card-generator" element={<CardGenerator />} />
                <Route path="/tip-jar/:username" element={<TipJar />} />
                <Route path="/nostr" element={<Nostr/>}>
                    <Route path="nip-05" element={<Nip05/>} />
                    <Route path="zaps" element={<Zaps/>} />
                </Route>
            </Routes>
            <Footer />
        </ThemeProvider>
    </div>
  );
}

export default App;
