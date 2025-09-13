
export interface ApiKey {
  id: string;
  key: string;
  isActive: boolean;
  usage: number;
}

export interface GenerationSettings {
  titleLength: number;
  keywordCount: number;
  customPrompt: string;
  prohibitedWords: string;
  transparentBackground: boolean;
}

export interface MediaFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  error?: string;
}
