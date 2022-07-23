import React, { useEffect } from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import {Footer, NavBar, PageContent} from "./components";

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
      <NavBar />
      <Routes>
        <Route path="/" element={<PageContent />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
