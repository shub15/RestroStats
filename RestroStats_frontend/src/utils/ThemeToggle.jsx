import { useEffect, useState } from "react";
import logoLight from "../assets/LOGO 1 1024 light.jpg";
import logoDark from "../assets/LOGO 1 1024 dark.jpg";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark-theme");
    
    useEffect(() => {
        document.body.classList.add(theme);
        return () => {
            document.body.classList.remove(theme);
        };
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <div>
            <button id="theme-btn" onClick={toggleTheme}>Toggle Theme</button>
            <img id="logo" src={theme === "dark-theme" ? logoDark : logoLight} alt="Logo" />
        </div>
    );
};

export default ThemeToggle;
