import React, { useState, useEffect } from 'react';
import { CustomSoftware, IndianLanguage } from './types';
import { getSavedSoftwares, saveSoftware, deleteSoftware } from './services/storage';
import { Header } from './components/Header';
import { ChatBuilder } from './components/ChatBuilder';
import { SoftwareHub } from './components/SoftwareHub';
import { MySoftware } from './components/MySoftware';
import { InspectModal } from './components/InspectModal';
import { getTranslation } from './i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'software' | 'my-software'>('chat');
  const [language, setLanguage] = useState<IndianLanguage>('hi');
  const [softwares, setSoftwares] = useState<CustomSoftware[]>([]);
  const [isOtgConnected, setIsOtgConnected] = useState<boolean>(true);
  const [inspectingSoftware, setInspectingSoftware] = useState<CustomSoftware | null>(null);

  // Deep linking between tabs
  const [softwareHubSubTab, setSoftwareHubSubTab] = useState<'flash' | 'install'>('flash');
  const [softwareHubPreselected, setSoftwareHubPreselected] = useState<CustomSoftware | null>(null);

  useEffect(() => {
    // Load saved softwares from storage
    const loaded = getSavedSoftwares();
    setSoftwares(loaded);

    // Load saved language if any
    const savedLang = localStorage.getItem('app_indian_lang') as IndianLanguage;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: IndianLanguage) => {
    setLanguage(lang);
    localStorage.setItem('app_indian_lang', lang);
  };

  const handleSoftwareCreated = (newSoftware: CustomSoftware) => {
    saveSoftware(newSoftware);
    setSoftwares(getSavedSoftwares());
  };

  const handleDeleteSoftware = (id: string) => {
    const updated = deleteSoftware(id);
    setSoftwares(updated);
  };

  const handleNavigateToInstall = (software: CustomSoftware) => {
    setSoftwareHubSubTab('install');
    setSoftwareHubPreselected(software);
    setCurrentTab('software');
  };

  const handleNavigateToFlash = (software: CustomSoftware) => {
    setSoftwareHubSubTab('flash');
    setSoftwareHubPreselected(software);
    setCurrentTab('software');
  };

  const handleRunEmulator = (software: CustomSoftware) => {
    setSoftwareHubPreselected(software);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSoftwareHubPreselected(null);
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        mySoftwareCount={softwares.length}
        isOtgConnected={isOtgConnected}
        onToggleOtg={() => setIsOtgConnected(prev => !prev)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'chat' && (
          <ChatBuilder
            language={language}
            onSoftwareCreated={handleSoftwareCreated}
            onNavigateToInstall={handleNavigateToInstall}
            onNavigateToFlash={handleNavigateToFlash}
            onOpenInspect={(sw) => setInspectingSoftware(sw)}
          />
        )}

        {currentTab === 'software' && (
          <SoftwareHub
            language={language}
            softwares={softwares}
            isOtgConnected={isOtgConnected}
            onToggleOtg={() => setIsOtgConnected(prev => !prev)}
            onOpenInspect={(sw) => setInspectingSoftware(sw)}
            onRunEmulator={handleRunEmulator}
            initialSubTab={softwareHubSubTab}
            preSelectedSoftware={softwareHubPreselected}
          />
        )}

        {currentTab === 'my-software' && (
          <MySoftware
            language={language}
            softwares={softwares}
            onDeleteSoftware={handleDeleteSoftware}
            onOpenInspect={(sw) => setInspectingSoftware(sw)}
            onRunEmulator={handleRunEmulator}
            onNavigateToInstall={handleNavigateToInstall}
            onNavigateToFlash={handleNavigateToFlash}
            onNavigateToChat={() => setCurrentTab('chat')}
          />
        )}
      </main>

      {/* Inspect / Check Modal */}
      {inspectingSoftware && (
        <InspectModal
          software={inspectingSoftware}
          onClose={() => setInspectingSoftware(null)}
          onInstall={handleNavigateToInstall}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Jio &amp; Smart AI OS Studio • Free Custom Firmware &amp; App Compiler
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>📱 Jio Keypad (KaiOS / J2ME)</span>
            <span>📲 Android Smartphone</span>
            <span>💻 PC Windows/Linux</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
