import React, { useEffect } from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import {BitcoinResources, Footer, GiftCard, NavBar, PageContent, SpreadTheWord} from "./components";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

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

function App() {
  const { pathname, hash, key } = useLocation();

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
            <Routes>
                <Route path="/" element={<PageContent />} />
                <Route path="/spread-the-word" element={<SpreadTheWord />} />
                <Route path="/bitcoin-resources" element={<BitcoinResources />} />
                <Route path="/gift-card" element={<GiftCard />} />
            </Routes>
            <Footer />
        </ThemeProvider>
    </div>
  );
}

export default App;
