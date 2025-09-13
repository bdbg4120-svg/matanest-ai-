
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ApiKey, GenerationSettings, MediaFile } from './types';
import { generateMetadataForImage } from './services/geminiService';

const App: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState('');

  const [settings] = useState<GenerationSettings>({
    titleLength: 150,
    keywordCount: 20,
    customPrompt: '',
    prohibitedWords: '',
    transparentBackground: false,
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddApiKey = () => {
    if (newApiKey.trim() !== '') {
       const isFirstKey = apiKeys.length === 0;
      const keyToAdd: ApiKey = {
        id: new Date().toISOString(),
        key: newApiKey.trim(),
        isActive: isFirstKey,
        usage: 1500,
      };
      setApiKeys(prev => [...prev, keyToAdd]);
      setNewApiKey('');
    }
  };

  const handleRemoveApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };
  

  const handleFileChange = (files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map(file => ({
      id: `${file.name}-${new Date().toISOString()}`,
      file: file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    const filesToProcess = mediaFiles.filter(f => f.status === 'pending');

    for (const mediaFile of filesToProcess) {
       setMediaFiles(prev => prev.map(mf => mf.id === mediaFile.id ? { ...mf, status: 'processing' } : mf));
       try {
         const base64Data = await fileToBase64(mediaFile.file);
         const metadata = await generateMetadataForImage(base64Data, mediaFile.file.type, settings);
         setMediaFiles(prev => prev.map(mf => mf.id === mediaFile.id ? { ...mf, status: 'completed', metadata } : mf));
       } catch (error) {
         console.error('Error generating metadata:', error);
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
         setMediaFiles(prev => prev.map(mf => mf.id === mediaFile.id ? { ...mf, status: 'error', error: errorMessage } : mf));
       }
    }

    setIsGenerating(false);
  }, [mediaFiles, settings]);

  const handleExportCsv = () => {
    const filesToExport = mediaFiles.filter(
      (mf) => mf.status === 'completed' && mf.metadata
    );

    if (filesToExport.length === 0) {
      alert('No completed files with metadata to export.');
      return;
    }

    const escapeCsvField = (field: string | undefined): string => {
      if (field === null || field === undefined) {
        return '""';
      }
      return `"${String(field).replace(/"/g, '""')}"`;
    };

    const headers = ['Filename', 'Title', 'Keywords', 'Category', 'Releases'];
    const csvRows = [headers.join(',')];

    for (const mediaFile of filesToExport) {
      if (mediaFile.metadata) {
        const { file, metadata } = mediaFile;
        const row = [
          escapeCsvField(file.name),
          escapeCsvField(metadata.title),
          escapeCsvField(metadata.keywords.join(', ')),
          '', 
          '', 
        ].join(',');
        csvRows.push(row);
      }
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'matanest_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateMetadata = (id: string, newMetadata: MediaFile['metadata']) => {
    setMediaFiles(prev => prev.map(mf => 
      mf.id === id ? { ...mf, metadata: newMetadata } : mf
    ));
  };
  
  const handleDeleteMediaFile = (id: string) => {
    setMediaFiles(prev => prev.filter(mf => mf.id !== id));
  };
  
  const handleApplyToAllTitles = (startText: string, endText: string) => {
    setMediaFiles(prev => prev.map(mf => {
      if (mf.metadata && mf.status === 'completed') {
        const newTitle = `${startText}${mf.metadata.title}${endText}`;
        return {
          ...mf,
          metadata: {
            ...mf.metadata,
            title: newTitle,
          }
        };
      }
      return mf;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-300 font-sans">
      <Header />
      <div className="flex flex-col lg:flex-row p-4 gap-4">
        <Sidebar
          apiKeys={apiKeys}
          newApiKey={newApiKey}
          setNewApiKey={setNewApiKey}
          onAddApiKey={handleAddApiKey}
          onRemoveApiKey={handleRemoveApiKey}
          onGenerate={handleGenerate}
          onExportCsv={handleExportCsv}
          isGenerating={isGenerating}
        />
        <MainContent 
            onFileChange={handleFileChange}
            mediaFiles={mediaFiles}
            onUpdateMetadata={handleUpdateMetadata}
            onDeleteMediaFile={handleDeleteMediaFile}
            onApplyToAllTitles={handleApplyToAllTitles}
        />
      </div>
    </div>
  );
};

export default App;
