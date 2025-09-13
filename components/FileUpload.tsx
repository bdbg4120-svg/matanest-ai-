
import React, { useState, useRef, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploadProps {
    onFileChange: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pcMode, setPcMode] = useState<'low' | 'high'>('low');

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files && files.length > 0) {
            onFileChange(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files && files.length > 0) {
            onFileChange(files);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <div className="w-full text-center space-y-6">
            <h2 className="text-xl font-bold text-white">Upload Media</h2>
            <p className="text-gray-400">Upload up to 500 images or videos for processing.</p>

            <div className="w-full max-w-md mx-auto bg-slate-900 rounded-lg p-2 flex border border-slate-700">
                <button
                    onClick={() => setPcMode('low')}
                    className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${pcMode === 'low' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                    Low-PC Mode
                </button>
                <button
                    onClick={() => setPcMode('high')}
                    className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${pcMode === 'high' ? 'bg-slate-700 text-white' : 'text-gray-400'}`}
                >
                    High-PC Mode
                </button>
            </div>

            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${isDragging ? 'border-orange-500 bg-slate-700/50' : 'border-slate-600 hover:border-orange-500'}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/svg+xml,image/gif,video/mp4,video/quicktime"
                />
                <div className="flex flex-col items-center justify-center space-y-4 text-gray-400">
                    <div className="bg-slate-700 rounded-full p-4">
                        <UploadCloudIcon className="w-10 h-10 text-orange-500" />
                    </div>
                    <p className="text-lg">
                        <span className="font-semibold text-orange-500">Drag & drop</span> or click to browse
                    </p>
                    <p className="text-xs">
                        Max 500 files - JPG, PNG, SVG, GIF, MP4, MOV - Max 50MB
                    </p>
                </div>
            </div>
        </div>
    );
};
