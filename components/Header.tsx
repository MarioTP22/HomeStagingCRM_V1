
import React from 'react';

interface HeaderProps {
    onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const logoClass = onLogoClick ? 'cursor-pointer' : '';

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 
            className={`text-2xl font-bold text-gray-800 ${logoClass}`}
            onClick={onLogoClick}
          >
            HomeStaging<span className="text-blue-400">CRM</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
