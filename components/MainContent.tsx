
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { MediaEditor } from './MediaEditor';
import { MediaFile } from '../types';

interface MainContentProps {
  onFileChange: (files: File[]) => void;
  mediaFiles: MediaFile[];
  onUpdateMetadata: (id: string, newMetadata: MediaFile['metadata']) => void;
  onDeleteMediaFile: (id: string) => void;
  onApplyToAllTitles: (startText: string, endText: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ 
    onFileChange, 
    mediaFiles,
    onUpdateMetadata,
    onDeleteMediaFile,
    onApplyToAllTitles,
}) => {
    const [startText, setStartText] = useState('');
    const [endText, setEndText] = useState('');
    
    const handleApplyClick = () => {
        onApplyToAllTitles(startText, endText);
        setStartText('');
        setEndText('');
    };

    if (mediaFiles.length === 0) {
        return (
          <main className="flex-1">
            <div className="bg-slate-800 rounded-lg p-6">
              <FileUpload onFileChange={onFileChange} />
            </div>
          </main>
        );
    }

    return (
        <main className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input 
                    type="text"
                    value={startText}
                    onChange={(e) => setStartText(e.target.value)}
                    placeholder="Add text to start of all titles"
                    className="w-full sm:flex-1 bg-slate-800 border border-slate-700 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                 <input 
                    type="text"
                    value={endText}
                    onChange={(e) => setEndText(e.target.value)}
                    placeholder="Add text to end of all titles"
                    className="w-full sm:flex-1 bg-slate-800 border border-slate-700 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                    onClick={handleApplyClick}
                    className="w-full sm:w-auto bg-orange-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-orange-700 transition"
                >
                    Apply to All Titles
                </button>
            </div>
            <div className="space-y-4">
                {mediaFiles.map(mf => (
                    <MediaEditor 
                        key={mf.id} 
                        mediaFile={mf} 
                        onUpdateMetadata={onUpdateMetadata}
                        onDelete={onDeleteMediaFile}
                    />
                ))}
            </div>
        </main>
    );
};
