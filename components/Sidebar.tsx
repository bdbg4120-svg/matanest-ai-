
import React from 'react';
import { ApiKey } from '../types';
import { BetaTag } from './icons';

interface SidebarProps {
  apiKeys: ApiKey[];
  newApiKey: string;
  setNewApiKey: (key: string) => void;
  onAddApiKey: () => void;
  onRemoveApiKey: (id: string) => void;
  onGenerate: () => void;
  onExportCsv: () => void;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  apiKeys,
  newApiKey,
  setNewApiKey,
  onAddApiKey,
  onRemoveApiKey,
  onGenerate,
  onExportCsv,
  isGenerating,
}) => {

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-slate-800 rounded-lg p-6 space-y-8 self-start">
      {/* Gemini API Keys */}
       <div className="space-y-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">Gemini API Keys</h2>
          <BetaTag />
        </div>
        <p className="text-sm text-gray-400">
          Add one or more Gemini API keys. The app will automatically switch to the next key if one reaches its usage limit.
        </p>
        <p className="text-xs text-gray-500">
          Note: This UI is for demonstration. The app uses a secure key from environment variables.
        </p>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Get API Key
        </a>
        
        <div className="space-y-2">
            {apiKeys.map(key => (
                <div key={key.id} className="bg-slate-700 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="text-white font-mono text-sm truncate">{`••••••••••••••••••••${key.key.slice(-4)}`}</span>
                    <button onClick={() => onRemoveApiKey(key.id)} className="bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-xs" aria-label="Remove API key">
                        &times;
                    </button>
                </div>
            ))}
        </div>
        
        <div className="relative">
          <input
            type="password"
            placeholder="Enter your API key"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>

        <div className="flex gap-4">
            <button
              onClick={onAddApiKey}
              className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Key
            </button>
            <button
              onClick={() => alert('All keys are saved automatically!')}
              className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            >
              Save All Keys
            </button>
        </div>
      </div>
      
      {/* Actions */}
      <div className="space-y-3 pt-6 border-t border-slate-700">
        <button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-orange-600 text-white font-bold py-3 rounded-md hover:bg-orange-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
        <button 
          onClick={onExportCsv}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          Export CSV
        </button>
      </div>
    </aside>
  );
};
