import React, { useState } from 'react';
import { CustomSoftware, IndianLanguage, PlatformType } from '../types';
import { getTranslation } from '../i18n';
import { 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  Play, 
  Cpu, 
  HardDrive, 
  FolderDown, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { downloadSoftwareZip } from '../services/zipGenerator';

interface MySoftwareProps {
  language: IndianLanguage;
  softwares: CustomSoftware[];
  onDeleteSoftware: (id: string) => void;
  onOpenInspect: (software: CustomSoftware) => void;
  onRunEmulator: (software: CustomSoftware) => void;
  onNavigateToInstall: (software: CustomSoftware) => void;
  onNavigateToFlash: (software: CustomSoftware) => void;
  onNavigateToChat: () => void;
}

export const MySoftware: React.FC<MySoftwareProps> = ({
  language,
  softwares,
  onDeleteSoftware,
  onOpenInspect,
  onRunEmulator,
  onNavigateToInstall,
  onNavigateToFlash,
  onNavigateToChat,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<PlatformType | 'all'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filtered = softwares.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || s.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleDownload = async (software: CustomSoftware) => {
    setDownloadingId(software.id);
    try {
      await downloadSoftwareZip(software);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderDown className="w-5 h-5 text-cyan-400" />
              <span>{t('tabMySoftware')}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {softwares.length} Packages
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('mySoftwareDesc')}
          </p>
        </div>

        {/* Search & Filter pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software name..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterPlatform('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterPlatform === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPlatform('jio')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterPlatform === 'jio' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jio
            </button>
            <button
              onClick={() => setFilterPlatform('smartphone')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterPlatform === 'smartphone' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Smart
            </button>
            <button
              onClick={() => setFilterPlatform('pc')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterPlatform === 'pc' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PC
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Softwares */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/40 p-12 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <div className="text-4xl">📦</div>
          <h3 className="text-base font-bold text-slate-300">
            {softwares.length === 0 ? t('noSoftwaresYet') : 'Koi software match nahi hua'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Chat option me jakar apna software idea likhein aur upar wale arrow (↑) par dabakar naya software banayein.
          </p>
          <button
            onClick={onNavigateToChat}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            + Create New Software in Chat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sw) => (
            <div
              key={sw.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {sw.platform === 'jio' ? '📱' : sw.platform === 'smartphone' ? '📲' : '💻'}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                        {sw.platform === 'jio' ? 'Jio Keypad Phone' : sw.platform === 'smartphone' ? 'Android Smart' : 'PC Desktop'}
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(sw.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-950 text-cyan-300 border border-slate-800">
                    {sw.version}
                  </span>
                </div>

                {/* Software Name & Tagline */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {sw.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {sw.tagline}
                  </p>
                </div>

                {/* Details pill row */}
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    💾 {sw.estimatedSize}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    📁 {sw.fileFormat}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ OTG Flash Ready
                  </span>
                </div>

                {/* Features Snippet */}
                <ul className="text-xs text-slate-300 space-y-1 pt-1">
                  {sw.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <span className="text-cyan-400 text-xs">✓</span>
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons as requested:
                  "unko vahan se download kiya ja sake aur asani se access mil sake chek bhi kar sake" */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                {/* 1. Download Button */}
                <button
                  onClick={() => handleDownload(sw)}
                  disabled={downloadingId === sw.id}
                  title="Download .zip package"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Download className={`w-3.5 h-3.5 text-cyan-400 ${downloadingId === sw.id ? 'animate-bounce' : ''}`} />
                  <span>{downloadingId === sw.id ? 'Downloading...' : t('download')}</span>
                </button>

                {/* 2. Check / Inspect Button ("chek bhi kar sake") */}
                <button
                  onClick={() => onOpenInspect(sw)}
                  title="Check / Inspect Code and Specs"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('check')}</span>
                </button>

                {/* 3. Run in Emulator Button */}
                <button
                  onClick={() => onRunEmulator(sw)}
                  title="Run in Virtual Device Simulator"
                  className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>

                {/* 4. Delete button */}
                <button
                  onClick={() => onDeleteSoftware(sw.id)}
                  title="Delete software"
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
