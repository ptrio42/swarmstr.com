import {useEffect, useState} from "react";
import {ThemeContext, themes} from "../contexts/ThemeContext";
import React from 'react';

interface ThemeContextWrapperProps {
    children: any;
}

export const ThemeContextWrapper = ({ children }: ThemeContextWrapperProps) => {
    const [theme, setTheme] = useState(themes.light);

    const toggleTheme = (theme: string) => {
        localStorage.setItem('theme', theme);
        setTheme(theme);
    };

    useEffect(() => {
       const selectedTheme = localStorage.getItem('theme');
        if (selectedTheme === null) {
            setTheme(themes.dark);
        }
        if (selectedTheme) {
           setTheme(selectedTheme);
        }
    }, []);

    useEffect(() => {
        switch (theme) {
            case themes.dark: {
                document.body.classList.add(themes.dark);
                break;
            }
            case themes.light:
            default: {
               document.body.classList.remove(themes.dark);
               break;
            }
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};