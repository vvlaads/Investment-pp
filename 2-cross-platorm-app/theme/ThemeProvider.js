import { createContext, useContext, useState } from "react";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const theme = isDark ? darkTheme : lightTheme;

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);