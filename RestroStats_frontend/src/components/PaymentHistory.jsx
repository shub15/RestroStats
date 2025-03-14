import React, { useState } from "react";
import logoDark from "../assets/LOGO 1 1024 dark.jpg";
import menuLogoDark from "../assets/LOGO 1 1024 menu-dark.jpg";

export default function PaymentHistory() {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark-theme"
  );
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Toggle theme mode
  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light-theme" : "dark-theme";
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle("dark-theme", !isDarkTheme);
    document.body.classList.toggle("light-theme", isDarkTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Toggle account dropdown
  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <>
     
    </>
  );
}
