import React from 'react';
import { IndianLanguage, PlatformType } from '../types';
import { INDIAN_LANGUAGES, getTranslation } from '../i18n';
import { MessageSquareCode, Cpu, FolderDown, Globe, Usb, Zap } from 'lucide-react';

interface HeaderProps {
  currentTab: 'chat' | 'software' | 'my-software';
  onSelectTab: (tab: 'chat' | 'software' | 'my-software') => void;
  language: IndianLanguage;
  onLanguageChange: (lang: IndianLanguage) => void;
  mySoftwareCount: number;
  isOtgConnected: boolean;
  onToggleOtg: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  mySoftwareCount,
  isOtgConnected,
  onToggleOtg,
}) => {
  const t = (k: string) => getTranslation(language, k);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-400/50 shadow-lg shadow-cyan-500/20 shrink-0 bg-slate-950">
            <img
              src="/assets/aistudio/file_0000000059908211977ff765841869b6_d37bf98c.png"
              alt="AI Software Maker"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Jio & Smart</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI OS Studio</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FREE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Top 3 Navigation Options as requested */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          {/* 1. Chat (AI Builder) */}
          <button
            onClick={() => onSelectTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'chat'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>{t('tabChat')}</span>
          </button>

          {/* 2. Software (Flash & Install) */}
          <button
            onClick={() => onSelectTab('software')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'software'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{t('tabSoftware')}</span>
          </button>

          {/* 3. My Software (Library & Download) */}
          <button
            onClick={() => onSelectTab('my-software')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              currentTab === 'my-software'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>{t('tabMySoftware')}</span>
            {mySoftwareCount > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                currentTab === 'my-software' ? 'bg-white text-blue-700' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {mySoftwareCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right tools: Indian Language Selector & OTG Status */}
        <div className="flex items-center gap-2.5">
          {/* OTG Cable Status pill */}
          <button
            onClick={onToggleOtg}
            title={isOtgConnected ? "OTG Cable Connected (Click to disconnect)" : "Click to connect OTG Cable"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOtgConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Usb className={`w-3.5 h-3.5 ${isOtgConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">OTG:</span>
            <span>{isOtgConnected ? 'Connected' : 'Connect'}</span>
          </button>

          {/* Indian Language Selector */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as IndianLanguage)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select Indian Language"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
