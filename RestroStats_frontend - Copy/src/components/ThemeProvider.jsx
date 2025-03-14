import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    useEffect(() => {
        if (darkTheme)
            document.body.classList.add('dark-theme');

        return () => {
            document.body.classList.remove('dark-theme');
        }
    }, [darkTheme])

    return (
        <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
