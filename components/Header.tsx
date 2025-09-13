
import React, { useState } from 'react';
import { ProfileDropdown } from './ProfileDropdown';

const NavButton: React.FC<{ children: React.ReactNode; active?: boolean; onClick: () => void }> = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}>
    {children}
  </button>
);

const ProTag: React.FC = () => (
    <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">PRO</span>
);

const NewTag: React.FC = () => (
    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">NEW</span>
);

export const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const mainTabs = ['Home', 'Updates', 'Descriptive', 'SEO Boosted', 'Clickbait'];
  
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-white tracking-wider">MATANEST</h1>
        <nav className="hidden md:flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
          {mainTabs.map(tab => (
            <NavButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </NavButton>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">MetaGen</a>
        <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">History</a>
        <div className="relative">
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">Tools</a>
            <NewTag />
        </div>
        <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">Upgrade to Pro</a>
        <ProfileDropdown />
      </div>
    </header>
  );
};
