document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-btn');
    const body = document.body;
    const logo = document.getElementById('logo');
    const menu_logo = document.getElementById('menu-logo');
    const mode_icon = document.getElementById('mode-icon');

    const toggleTheme = () => {
        const isDark = body.classList.contains('dark-theme');
        
        // Remove both theme classes first before toggling
        body.classList.remove('dark-theme', 'light-theme');
        
        // Now, apply the new theme class
        body.classList.add(isDark ? 'light-theme' : 'dark-theme');
        
        logo.src = `../assets/LOGO 1 1024 ${isDark ? 'light' : 'dark'}.jpg`;
        menu_logo.src = `../assets/LOGO 1 1024 ${isDark ? 'light' : 'menu-dark'}.jpg`;
        mode_icon.textContent = `${isDark ? 'dark_mode' : 'light_mode'}`;
        
        localStorage.setItem('theme', isDark ? 'light-theme' : 'dark-theme');
    };

    // Set the initial theme based on localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';

    // Remove any conflicting theme classes before adding the saved theme
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(savedTheme);

    logo.src = `../assets/LOGO 1 1024 ${savedTheme === 'dark-theme' ? 'dark' : 'light'}.jpg`;
    menu_logo.src = `../assets/LOGO 1 1024 ${savedTheme === 'dark-theme' ? 'menu-dark' : 'light'}.jpg`;

    // Ensure the element exists before trying to set textContent
    if (mode_icon) {
        mode_icon.textContent = savedTheme === 'dark-theme' ? 'dark_mode' : 'light_mode';
    }

    themeButton.addEventListener('click', toggleTheme);
});
