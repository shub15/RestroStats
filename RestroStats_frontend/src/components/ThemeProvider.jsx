import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to false (light theme)
    const [darkTheme, setDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark-theme';
    });

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    useEffect(() => {
        // Update localStorage and body class when theme changes
        if (darkTheme) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.removeItem('theme', 'dark-theme');
        }
    }, [darkTheme]);

    return (
        <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);