const menuToggle = document.getElementById('menu-btn');
const mainMenu = document.getElementById('main-menu');
const submenus = document.querySelectorAll('.has-submenu');

const toggleMenu = () => mainMenu.classList.toggle('active');
const closeMenu = () => mainMenu.classList.remove('active');

menuToggle.addEventListener('click', toggleMenu);

submenus.forEach(item => {
    item.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            item.querySelector('.submenu').classList.toggle('active');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
        document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('active'));
    }
});