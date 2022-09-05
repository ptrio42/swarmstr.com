import {useEffect, useState} from "react";
import {ThemeContext, themes} from "../contexts/ThemeContext";

interface ThemeContextWrapperProps {
    children: any;
}

export const ThemeContextWrapper = ({ children }: ThemeContextWrapperProps) => {
    const [theme, setTheme] = useState(themes.light);

    const toggleTheme = (theme: string) => {
        localStorage.setItem('theme', theme);
        setTheme(theme);
        console.log('toggle')
    };

    useEffect(() => {
       const selectedTheme = localStorage.getItem('theme');
           console.log('ef', selectedTheme)
       if (selectedTheme) {
           console.log('t', selectedTheme)
           setTheme(selectedTheme);
       }
    }, []);

    // useEffect(() => {
    //     localStorage.setItem('theme', theme);
    //     console.log('setting', theme)
    // }, [theme]);

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