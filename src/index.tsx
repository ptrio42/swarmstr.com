import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import {ThemeContextWrapper} from "./theme/ThemeContextWrapper";
import {hydrate, render} from "react-dom";
import {getState, loadComponents} from "loadable-components";

const rootElement = document.getElementById('root') as HTMLElement;
// const root = ReactDOM.createRoot(rootElement);

(window as unknown as any).snapSaveState = () => getState();

loadComponents()
    .then(() => hydrate(
        <ThemeContextWrapper>
            <React.StrictMode>
                <Router>
                    <App />
                </Router>
            </React.StrictMode>
        </ThemeContextWrapper>, rootElement))
    .catch(() => render(
        <ThemeContextWrapper>
            <React.StrictMode>
                <Router>
                    <App />
                </Router>
            </React.StrictMode>
        </ThemeContextWrapper>, rootElement));

// if (rootElement.hasChildNodes()) {
//     hydrate(
//         <ThemeContextWrapper>
//             <React.StrictMode>
//                 <Router>
//                     <App />
//                 </Router>
//             </React.StrictMode>
//         </ThemeContextWrapper>, rootElement);
// } else {
//     render(
//         <ThemeContextWrapper>
//             <React.StrictMode>
//                 <Router>
//                     <App />
//                 </Router>
//             </React.StrictMode>
//         </ThemeContextWrapper>, rootElement);
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
