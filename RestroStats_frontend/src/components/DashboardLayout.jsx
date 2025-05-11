import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import VerticalNavbar from './VerticalNavbar';
import { useTheme } from './ThemeProvider.jsx';
import logo from '../assets/LOGO 1 1024 light.jpg';
import darkLogo from '../assets/LOGO 1 1024 dark.jpg';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkTheme } = useTheme();
  const location = useLocation();

  // Breadcrumb logic
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <div className={`flex min-h-screen ${darkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 h-full z-50`}>
        {sidebarOpen && <VerticalNavbar />}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <header className={`
          flex items-center justify-between px-8 h-20 border-b shadow-sm
          ${darkTheme ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}
        `}>
          {/* Left: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className={`
                p-2 rounded-lg transition flex items-center justify-center
                ${darkTheme ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100'}
              `}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined text-2xl">
                {sidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
            {/* Logo */}
            <Link to="/dashboard" className='text-blue-900 dark:text-blue-500 text-2xl font-bold '>
              <span>RestroStats</span>
            </Link>
          </div>
          {/* Center: Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link to="/dashboard" className={`${darkTheme ? 'text-gray-300' : 'text-gray-600'} hover:underline`}>Dashboard</Link>
            {pathnames.map((name, idx) => {
              const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
              const pretty = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return (
                <React.Fragment key={routeTo}>
                  <span className="mx-2 text-gray-400">/</span>
                  {idx === pathnames.length - 1 ? (
                    <span className={`${darkTheme ? 'text-white' : 'text-gray-900'}`}>{pretty}</span>
                  ) : (
                    <Link to={routeTo} className={`${darkTheme ? 'text-gray-300' : 'text-gray-600'} hover:underline`}>{pretty}</Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
          {/* Right: (optional profile/account dropdown) */}
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      {/* Google Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    </div>
  );
}
