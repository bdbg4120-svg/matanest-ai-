
import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon } from './icons';

export const ProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 rounded-full p-1"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <UserCircleIcon className="w-8 h-8" />
                <span className="hidden sm:inline">bg.ai</span>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600"
                        role="menuitem"
                    >
                        Your Profile
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600"
                        role="menuitem"
                    >
                        Settings
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600"
                        role="menuitem"
                    >
                        Sign out
                    </a>
                </div>
            )}
        </div>
    );
};
