import React from 'react';
import { FaHome, FaFire, FaCompass, FaHistory, FaThumbsUp } from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { icon: <FaHome />, label: 'Home' },
    { icon: <FaCompass />, label: 'Explore' },
    { icon: <FaFire />, label: 'Trending' },
    { icon: <FaHistory />, label: 'History' },
    { icon: <FaThumbsUp />, label: 'Liked' },
  ];

  return (
    <div className="h-screen w-20 hover:w-48 transition-all duration-300 bg-white dark:bg-gray-900 shadow-md flex flex-col items-center md:items-start p-2">
      {navItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center w-full text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-3 cursor-pointer transition-colors duration-200"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="ml-4 hidden md:block whitespace-nowrap">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
