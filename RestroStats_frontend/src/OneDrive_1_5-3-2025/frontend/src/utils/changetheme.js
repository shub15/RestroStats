const themeButton = document.getElementById('theme-btn');
const body = document.body;
const logo = document.getElementById('logo');

const toggleTheme = () => {
    const isDark = body.classList.contains('dark-theme');
    body.classList.toggle('dark-theme', !isDark);
    body.classList.toggle('light-theme', isDark);
    logo.src = `../assets/LOGO 1 1024 ${isDark ? 'dark' : 'light'}.jpg`;
    localStorage.setItem('theme', isDark ? 'light-theme' : 'dark-theme');
};

themeButton.addEventListener('click', toggleTheme);

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
body.classList.add(savedTheme);
logo.src = `../assets/LOGO 1 1024 ${savedTheme === 'dark-theme' ? 'dark' : 'light'}.jpg`;