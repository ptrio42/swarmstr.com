import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import { hydrateRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

const domNode = document.getElementById('root') as HTMLElement;
const reactNode =
    <BrowserRouter>
        <App/>
    </BrowserRouter>;

hydrateRoot(domNode, reactNode);
