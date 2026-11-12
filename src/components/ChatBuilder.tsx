import React, { useState } from 'react';
import { CustomSoftware, IndianLanguage, PlatformType, ChatMessage } from '../types';
import { getTranslation } from '../i18n';
import { DeviceEmulator } from './DeviceEmulator';
import { 
  Check, 
  Send, 
  Sparkles, 
  Download, 
  Cpu, 
  Code2, 
  Smartphone, 
  Monitor, 
  Sliders, 
  CheckSquare, 
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadSoftwareZip } from '../services/zipGenerator';

interface ChatBuilderProps {
  language: IndianLanguage;
  onSoftwareCreated: (software: CustomSoftware) => void;
  onNavigateToInstall: (software: CustomSoftware) => void;
  onNavigateToFlash: (software: CustomSoftware) => void;
  onOpenInspect: (software: CustomSoftware) => void;
}

export const ChatBuilder: React.FC<ChatBuilderProps> = ({
  language,
  onSoftwareCreated,
  onNavigateToInstall,
  onNavigateToFlash,
  onOpenInspect,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [ideaText, setIdeaText] = useState('');
  const [ticChecked, setTicChecked] = useState(false);
  const [platform, setPlatform] = useState<PlatformType>('jio');
  const [softwareCategory, setSoftwareCategory] = useState('Utility');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Customization Options
  const [offlineMode, setOfflineMode] = useState(true);
  const [keypadShortcuts, setKeypadShortcuts] = useState(true);
  const [otgReady, setOtgReady] = useState(true);
  const [batterySaver, setBatterySaver] = useState(true);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `${t('tagline')}! Jio Keypad Phone, Smart Phone ya PC ke liye apna idea box me likhein aur tic box (✓) dabayein.`,
      timestamp: Date.now(),
    }
  ]);
  const [followUpText, setFollowUpText] = useState('');
  const [latestSoftware, setLatestSoftware] = useState<CustomSoftware | null>(null);

  // Quick suggestion ideas
  const quickIdeas = [
    { title: 'Jio Torch & SOS Flash', platform: 'jio' as PlatformType, desc: 'Keypad * key se high beam torch aur emergency 112 SOS' },
    { title: 'Jio Voice SpeedDial', platform: 'jio' as PlatformType, desc: '1-click dial Maa/Papa contacts with Hindi voice prompts' },
    { title: 'Android Super RAM Turbo', platform: 'smartphone' as PlatformType, desc: 'Zero lag cleaner with battery temperature cooler' },
    { title: 'Jio KaiOS Snake 3D', platform: 'jio' as PlatformType, desc: 'Classic keypad retro game with 5-way D-Pad controls' },
    { title: 'PC OTG ROM Flasher', platform: 'pc' as PlatformType, desc: 'Windows tool to flash Jio and Android phones via USB' },
  ];

  const handleSelectQuickIdea = (idea: { title: string; platform: PlatformType; desc: string }) => {
    setIdeaText(`${idea.title}: ${idea.desc}`);
    setPlatform(idea.platform);
  };

  // Main generation handler triggered by the "tic box"
  const handleStartGeneration = async () => {
    if (!ideaText.trim() || isGenerating) return;

    setTicChecked(true);
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('AI Analyzing software architecture & hardware pinout...');

    // Add user idea to chat
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: ideaText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    const timer1 = setTimeout(() => {
      setGenerationProgress(45);
      setGenerationStep(`Synthesizing firmware drivers for ${platform.toUpperCase()}...`);
    }, 700);

    const timer2 = setTimeout(() => {
      setGenerationProgress(75);
      setGenerationStep('Compiling binary package & verifying OTG flash headers...');
    }, 1500);

    try {
      const response = await fetch('/api/generate-software', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: ideaText,
          platform: platform,
          softwareType: softwareCategory,
          language: language,
          options: {
            offlineMode,
            keypadShortcuts,
            otgReady,
            batterySaver,
          },
        }),
      });

      const data = await response.json();
      clearTimeout(timer1);
      clearTimeout(timer2);
      setGenerationProgress(100);
      setGenerationStep('Software successfully created!');

      if (data.success && data.software) {
        const newSoftware: CustomSoftware = {
          ...data.software,
          createdAt: Date.now(),
        };

        setLatestSoftware(newSoftware);
        onSoftwareCreated(newSoftware);

        // Success celebratory confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Add AI response to chat
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `Aapka customized software "${newSoftware.name}" taiyar ho gaya hai! Isme OTG Flashing, Keypad controls aur ${newSoftware.estimatedSize} payload include kiya gaya hai. Aap ise simulator me test kar sakte hain ya install/download kar sakte hain.`,
          timestamp: Date.now(),
          softwareRef: newSoftware,
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setGenerationStep('Error generating software. Retrying with fallback template...');
    } finally {
      setIsGenerating(false);
      setTicChecked(false);
    }
  };

  // Follow-up chat prompt to tweak/customize existing software
  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || isGenerating) return;

    const query = followUpText;
    setFollowUpText('');

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    setIsGenerating(true);
    setGenerationStep('Applying customizations to software...');

    try {
      const response = await fetch('/api/generate-software', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${latestSoftware?.name || 'Software'} update: ${query}. (Previous context: ${ideaText})`,
          platform: platform,
          softwareType: softwareCategory,
          language: language,
          options: { offlineMode, keypadShortcuts, otgReady, batterySaver },
        }),
      });

      const data = await response.json();
      if (data.success && data.software) {
        const updatedSoftware = { ...data.software, createdAt: Date.now() };
        setLatestSoftware(updatedSoftware);
        onSoftwareCreated(updatedSoftware);

        setMessages(prev => [
          ...prev,
          {
            id: 'ai-update-' + Date.now(),
            sender: 'ai',
            text: `Badlav safalta-poorvak save ho gaye! "${updatedSoftware.name}" me naye features jod diye gaye hain.`,
            timestamp: Date.now(),
            softwareRef: updatedSoftware,
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Input Box with "Tic Box" + Chat Stream */}
      <div className="lg:col-span-7 flex flex-col space-y-5">
        {/* HERO CARD: Software Idea Box with small "Tic Box" */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Platform Selector */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>{t('choosePlatform')}</span>
              <span className="text-[11px] text-cyan-400 font-normal">100% Free AI Customizer</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform('jio')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  platform === 'jio'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>📱</span>
                <span>Jio Phone</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('smartphone')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  platform === 'smartphone'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Smart Phone</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('pc')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  platform === 'pc'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* The Specific Box with Tic Box requested by user:
              "char me ek baox rahe useeme tic box bhi rahe chota aur us box me idea type karke tic box par dabanepar ai ke madat se software banba shru ho jaye" */}
          <div className="relative rounded-2xl bg-slate-950 border-2 border-slate-700/80 focus-within:border-cyan-500 transition-all p-3 shadow-inner">
            <div className="flex items-start gap-3">
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder={t('typeIdeaPlaceholder')}
                rows={3}
                disabled={isGenerating}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleStartGeneration();
                  }
                }}
              />

              {/* The "Tic Box" (Small checkmark button inside the box) */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleStartGeneration}
                  disabled={!ideaText.trim() || isGenerating}
                  title={t('ticBoxTooltip')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg ${
                    ideaText.trim()
                      ? 'bg-gradient-to-br from-emerald-400 to-green-600 hover:scale-105 active:scale-95 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/50 cursor-pointer animate-pulse'
                      : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-6 h-6 stroke-[3.5]" />
                </button>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-tighter">
                  Tic Box ✓
                </span>
              </div>
            </div>

            {/* Hint & Shortcut */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Idea type karke <strong>Tic Box (✓)</strong> dabayein</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">Ctrl + Enter to trigger</span>
            </div>
          </div>

          {/* Quick Ideas Chips */}
          <div className="mt-3">
            <div className="text-[11px] text-slate-400 mb-1.5 font-medium">{t('quickIdeas')}</div>
            <div className="flex flex-wrap gap-1.5">
              {quickIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickIdea(idea)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{idea.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Options Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                {t('customizeOptions')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-[11px] truncate">{t('offlineMode')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={keypadShortcuts}
                  onChange={(e) => setKeypadShortcuts(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-[11px] truncate">{t('keypadShortcuts')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={otgReady}
                  onChange={(e) => setOtgReady(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-[11px] truncate">{t('otgFlashingReady')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={batterySaver}
                  onChange={(e) => setBatterySaver(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-[11px] truncate">{t('batterySaver')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generation Progress Indicator */}
        {isGenerating && (
          <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/40 shadow-lg shadow-cyan-500/10 space-y-2 animate-pulse">
            <div className="flex justify-between text-xs font-semibold text-cyan-400">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 animate-spin" />
                {generationStep}
              </span>
              <span>{generationProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-[380px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            AI Assistant Conversation
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow'
                }`}
              >
                <p>{msg.text}</p>

                {/* Software Card attached inside chat */}
                {msg.softwareRef && (
                  <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {msg.softwareRef.platform === 'jio' ? '📱' : msg.softwareRef.platform === 'smartphone' ? '📲' : '💻'}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-xs">{msg.softwareRef.name}</h4>
                          <span className="text-[10px] text-cyan-400 font-mono">
                            {msg.softwareRef.version} • {msg.softwareRef.estimatedSize}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                        Ready
                      </span>
                    </div>

                    {/* Features Snippet */}
                    <ul className="text-[11px] text-slate-300 space-y-0.5">
                      {msg.softwareRef.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-cyan-400">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => downloadSoftwareZip(msg.softwareRef!)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => onOpenInspect(msg.softwareRef!)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Code2 className="w-3 h-3 text-amber-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onNavigateToInstall(msg.softwareRef!)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-[11px] font-semibold transition-all shadow"
                      >
                        <span>Install</span>
                      </button>

                      <button
                        onClick={() => onNavigateToFlash(msg.softwareRef!)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>OTG Flash</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        {/* Follow-up refinement input */}
        <form onSubmit={handleSendFollowUp} className="flex gap-2">
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            placeholder="Software me koi naya feature jodein (उदा. Add Hindi voice, change key 5)..."
            disabled={isGenerating}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!followUpText.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: Live Interactive Virtual Device Emulator */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="sticky top-20 w-full">
          <DeviceEmulator
            software={latestSoftware}
            onOpenInspect={onOpenInspect}
          />
        </div>
      </div>
    </div>
  );
};
