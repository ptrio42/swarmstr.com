import {createContext} from "react";

export const themes = {
    light: 'theme--light',
    dark: 'theme--dark'
};

export const ThemeContext = createContext({
    theme: themes.light,
    toggleTheme: (theme: string) => {}
});