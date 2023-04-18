import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.hydrate(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    rootElement);
