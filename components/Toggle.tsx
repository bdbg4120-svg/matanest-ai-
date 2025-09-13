
import React from 'react';

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ id, checked, onChange }) => {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} 
      />
      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
    </label>
  );
};
