export type PlatformType = 'jio' | 'smartphone' | 'pc';

export interface SourceCodeFile {
  name: string;
  language: string;
  content: string;
}

export interface KeypadControls {
  center: string;
  up: string;
  down: string;
  left: string;
  right: string;
  call: string;
  endCall: string;
  star: string;
  hash: string;
}

export interface FlashingSpecs {
  supportedChips: string;
  otgSupport: boolean;
  baudRate: string;
  partitions: string[];
  steps: string[];
}

export interface CustomSoftware {
  id: string;
  name: string;
  tagline: string;
  platform: PlatformType;
  version: string;
  fileFormat: string;
  estimatedSize: string;
  category: string;
  description: string;
  features: string[];
  keypadControls?: KeypadControls;
  flashingSpecs: FlashingSpecs;
  installationSteps: string[];
  sourceCodeFiles: SourceCodeFile[];
  demoHtml?: string;
  createdAt: number;
  isAiGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  softwareRef?: CustomSoftware;
}

export type IndianLanguage = 
  | 'hi' // Hindi
  | 'en' // English
  | 'hinglish' // Hinglish
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'pa' // Punjabi
  | 'ur' // Urdu
  | 'ml' // Malayalam
  | 'or'; // Odia
