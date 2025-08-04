import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                Yatri<span className="text-purple-400">.au</span>
              </span>
            </div>
          </div>
          <div className="flex items-center">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;