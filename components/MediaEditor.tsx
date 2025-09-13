
import React, { useState, useEffect } from 'react';
import { MediaFile } from '../types';
import { TrashIcon, CopyIcon, EditIcon, CheckCircleIcon } from './icons';

const ProTag: React.FC = () => (
    <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">PRO</span>
);
const BetaTag: React.FC = () => (
    <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">BETA</span>
);

interface MediaEditorProps {
    mediaFile: MediaFile;
    onUpdateMetadata: (id: string, newMetadata: MediaFile['metadata']) => void;
    onDelete: (id: string) => void;
}

export const MediaEditor: React.FC<MediaEditorProps> = ({ mediaFile, onUpdateMetadata, onDelete }) => {
    const [title, setTitle] = useState(mediaFile.metadata?.title || '');
    const [description, setDescription] = useState(mediaFile.metadata?.description || '');
    const [keywords, setKeywords] = useState<string[]>(mediaFile.metadata?.keywords || []);
    const [newKeyword, setNewKeyword] = useState('');

    const [copied, setCopied] = useState<'title' | 'description' | 'keywords' | null>(null);

    useEffect(() => {
        setTitle(mediaFile.metadata?.title || '');
        setDescription(mediaFile.metadata?.description || '');
        setKeywords(mediaFile.metadata?.keywords || []);
    }, [mediaFile.metadata]);

    const handleUpdate = () => {
        if (mediaFile.metadata) {
            onUpdateMetadata(mediaFile.id, { title, description, keywords });
        }
    };
    
    const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newKeyword.trim() !== '') {
            e.preventDefault();
            const updatedKeywords = [...keywords, newKeyword.trim()];
            setKeywords(updatedKeywords);
            // Instantly update parent state on keyword change
            if (mediaFile.metadata) {
                onUpdateMetadata(mediaFile.id, { title, description, keywords: updatedKeywords });
            }
            setNewKeyword('');
        }
    };
    
    const handleKeywordRemove = (indexToRemove: number) => {
        const updatedKeywords = keywords.filter((_, index) => index !== indexToRemove);
        setKeywords(updatedKeywords);
        // Instantly update parent state on keyword change
        if (mediaFile.metadata) {
            onUpdateMetadata(mediaFile.id, { title, description, keywords: updatedKeywords });
        }
    };

    const handleCopy = (text: string, type: 'title' | 'description' | 'keywords') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };
    
    if (mediaFile.status === 'pending' || mediaFile.status === 'processing') {
        return (
             <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center gap-4 animate-pulse">
                <div className="w-36 h-36 bg-slate-700 rounded-md flex-shrink-0"></div>
                <div className="text-center">
                    <p className="font-semibold text-white">Generating metadata for</p>
                    <p className="text-sm text-gray-400 truncate">{mediaFile.file.name}</p>
                </div>
            </div>
        );
    }

     if (mediaFile.status === 'error') {
        return (
            <div className="bg-slate-800 rounded-lg p-6 flex gap-6 border border-red-500/50">
                <img src={mediaFile.previewUrl} alt={mediaFile.file.name} className="w-36 h-36 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                     <p className="font-semibold text-red-400">Metadata Generation Failed</p>
                     <p className="text-sm text-gray-400 truncate max-w-md">{mediaFile.error}</p>
                     <button onClick={() => onDelete(mediaFile.id)} className="text-red-500 hover:text-red-400 mt-4 self-start">
                        <TrashIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        );
     }

    return (
        <div className="bg-slate-800 rounded-lg p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex-shrink-0">
                <img src={mediaFile.previewUrl} alt={mediaFile.file.name} className="w-full h-auto object-cover rounded-md" />
            </div>
            <div className="flex-1 space-y-4">
                <button className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition text-sm">
                    Search & Add Tags <BetaTag />
                </button>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center">
                        Title: <ProTag />
                        <button onClick={() => handleCopy(title, 'title')} className="ml-auto text-gray-400 hover:text-white">
                           {copied === 'title' ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                        </button>
                    </label>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-md border border-slate-700">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleUpdate}
                            className="w-full bg-transparent text-white focus:outline-none"
                        />
                         <button onClick={() => alert('Editing is a PRO feature')} className="text-gray-400 hover:text-white"><EditIcon className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center">
                        Description:
                        <button onClick={() => handleCopy(description, 'description')} className="ml-auto text-gray-400 hover:text-white">
                            {copied === 'description' ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                        </button>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={handleUpdate}
                        rows={4}
                        className="w-full bg-slate-900/50 p-3 rounded-md border border-slate-700 text-white focus:outline-none resize-y focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center">Keywords:</label>
                    <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                        <div className="flex flex-wrap gap-2">
                             {keywords.map((kw, i) => (
                                <div key={i} className="bg-slate-700 text-sm text-white px-3 py-1 rounded-full flex items-center gap-2">
                                    <span>{kw}</span>
                                    <button onClick={() => handleKeywordRemove(i)} className="text-gray-400 hover:text-white font-bold leading-none">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center border-t border-slate-700 pt-3">
                             <ProTag />
                             <input 
                                type="text"
                                value={newKeyword}
                                onChange={e => setNewKeyword(e.target.value)}
                                onKeyDown={handleKeywordAdd}
                                placeholder="Add keyword"
                                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none ml-2"
                             />
                        </div>
                    </div>
                </div>

                 <div className="flex justify-end pt-2">
                    <button onClick={() => onDelete(mediaFile.id)} className="text-red-500 hover:text-red-400" aria-label="Delete item">
                        <TrashIcon className="w-6 h-6"/>
                    </button>
                 </div>
            </div>
        </div>
    );
};
