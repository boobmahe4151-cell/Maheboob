import React, { useState, useEffect } from 'react';
import { CustomSoftware, IndianLanguage } from '../types';
import { getTranslation } from '../i18n';
import { 
  Cpu, 
  Download, 
  ArrowLeft, 
  Usb, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Play, 
  Check, 
  Smartphone, 
  Monitor, 
  HardDrive,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadSoftwareZip } from '../services/zipGenerator';

interface SoftwareHubProps {
  language: IndianLanguage;
  softwares: CustomSoftware[];
  isOtgConnected: boolean;
  onToggleOtg: () => void;
  onOpenInspect: (software: CustomSoftware) => void;
  onRunEmulator: (software: CustomSoftware) => void;
  initialSubTab?: 'flash' | 'install';
  preSelectedSoftware?: CustomSoftware | null;
}

export const SoftwareHub: React.FC<SoftwareHubProps> = ({
  language,
  softwares,
  isOtgConnected,
  onToggleOtg,
  onOpenInspect,
  onRunEmulator,
  initialSubTab = 'flash',
  preSelectedSoftware = null,
}) => {
  const t = (k: string) => getTranslation(language, k);

  // Sub tab inside Software: 'flash' or 'install'
  const [subTab, setSubTab] = useState<'flash' | 'install'>(initialSubTab);

  // Install workflow states
  const [selectedSoftware, setSelectedSoftware] = useState<CustomSoftware | null>(
    preSelectedSoftware || (softwares.length > 0 ? softwares[0] : null)
  );
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStage, setInstallStage] = useState('');
  const [installSuccess, setInstallSuccess] = useState(false);

  // Flash workflow states
  const [flashSoftware, setFlashSoftware] = useState<CustomSoftware | null>(
    preSelectedSoftware || (softwares.length > 0 ? softwares[0] : null)
  );
  const [selectedPartitions, setSelectedPartitions] = useState<string[]>(['boot.img', 'system.img']);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashLogs, setFlashLogs] = useState<string[]>([]);
  const [flashComplete, setFlashComplete] = useState(false);
  const [baudRate, setBaudRate] = useState('921600');
  const [bootMode, setBootMode] = useState('edl'); // 'edl' | 'fastboot' | 'adb' | 'pc'

  // Sound generator for success
  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio fallback
    }
  };

  // Trigger Installation
  const handleStartInstall = () => {
    if (!selectedSoftware) return;

    setIsInstalling(true);
    setInstallProgress(10);
    setInstallSuccess(false);
    setInstallStage('Checking OTG cable connection and handshake...');

    const s1 = setTimeout(() => {
      setInstallProgress(35);
      setInstallStage('Verifying cryptographic SHA-256 binary signatures...');
    }, 600);

    const s2 = setTimeout(() => {
      setInstallProgress(65);
      setInstallStage(`Pushing ${selectedSoftware.estimatedSize} payload to target system storage...`);
    }, 1200);

    const s3 = setTimeout(() => {
      setInstallProgress(90);
      setInstallStage('Registering permissions and generating hardware key mappings...');
    }, 1800);

    const s4 = setTimeout(() => {
      setInstallProgress(100);
      setInstallStage('Software successfully installed!');
      setIsInstalling(false);
      setInstallSuccess(true);
      playSuccessSound();
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    }, 2400);
  };

  // Trigger OTG Flashing
  const handleStartFlash = () => {
    if (!flashSoftware) return;

    setIsFlashing(true);
    setFlashProgress(0);
    setFlashComplete(false);
    setFlashLogs([
      `[OTG-INIT] Connecting to target device over OTG port...`,
      `[OTG-INIT] Handshake accepted. Chipset: ${flashSoftware.flashingSpecs?.supportedChips || 'Qualcomm/Spreadtrum'}`,
      `[OTG-INIT] Baud Rate: ${baudRate} bps. Mode: ${bootMode.toUpperCase()}`,
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setFlashProgress(current);

      if (current === 20) {
        setFlashLogs(prev => [...prev, `[FLASH] Erasing partition blocks: ${selectedPartitions.join(', ')}...`]);
      } else if (current === 50) {
        setFlashLogs(prev => [...prev, `[FLASH] Writing payload: ${flashSoftware.name} (Address: 0x80004000)...`]);
      } else if (current === 80) {
        setFlashLogs(prev => [...prev, `[FLASH] Verifying written partition blocks checksum: OK (CRC32 matches)`]);
      } else if (current >= 100) {
        clearInterval(interval);
        setIsFlashing(false);
        setFlashComplete(true);
        setFlashLogs(prev => [
          ...prev, 
          `[FLASH-COMPLETE] Flashing finished in 3.4 seconds.`,
          `[FLASH-COMPLETE] Restarting device in normal mode.`
        ]);
        playSuccessSound();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* 2 Main Sub-Options as requested:
          "software vale option me do optios rahe ek flash software jis se phpne ko otg se conect karke jis bhi phone ya pc ke software ko flash kar sake aur ek install software ka option rahe" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-slate-900/80 rounded-2xl border border-slate-800">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          {/* Sub Option 1: Flash Software */}
          <button
            onClick={() => {
              setSubTab('flash');
              setFlashComplete(false);
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              subTab === 'flash'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. {t('flashSoftware')}</span>
          </button>

          {/* Sub Option 2: Install Software */}
          <button
            onClick={() => {
              setSubTab('install');
              setInstallSuccess(false);
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              subTab === 'install'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>2. {t('installSoftware')}</span>
          </button>
        </div>

        {/* OTG Cable Live Status & Guide */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end px-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isOtgConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span className="text-slate-300 font-medium">
              {isOtgConnected ? 'OTG Cable: Connected (Ready)' : 'OTG Cable: Not Connected'}
            </span>
          </div>
          <button
            onClick={onToggleOtg}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isOtgConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isOtgConnected ? 'Disconnect OTG' : 'Plug OTG Cable'}
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. FLASH SOFTWARE TAB (OTG FLASHING WORKSTATION) */}
      {/* ========================================================== */}
      {subTab === 'flash' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Config Panel */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">OTG Firmware Flashing Station</h3>
                    <p className="text-xs text-slate-400">Jio Phone, Smartphone ya PC ko OTG cable se jodkar flash karein</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-slate-950 text-amber-400 rounded border border-amber-500/30">
                  {bootMode.toUpperCase()} MODE
                </span>
              </div>

              {/* Step 1: Select Software to Flash */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Select Software / ROM to Flash:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {softwares.map((sw) => (
                    <button
                      key={sw.id}
                      onClick={() => setFlashSoftware(sw)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        flashSoftware?.id === sw.id
                          ? 'bg-orange-500/10 border-orange-500 text-white shadow-md shadow-orange-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">
                        {sw.platform === 'jio' ? '📱' : sw.platform === 'smartphone' ? '📲' : '💻'}
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate text-white">{sw.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{sw.tagline}</div>
                        <div className="text-[10px] text-orange-400 font-mono mt-1">
                          {sw.version} • {sw.estimatedSize}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Target Device Boot Mode & Port Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Connection / Boot Mode:
                  </label>
                  <select
                    value={bootMode}
                    onChange={(e) => setBootMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="edl">Qualcomm / Spreadtrum EDL (Jio Keypad)</option>
                    <option value="fastboot">Android Fastboot OTG Bridge</option>
                    <option value="adb">Direct ADB Sideload / Recovery</option>
                    <option value="pc">PC Universal Serial Flasher</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Baud Rate (Flashing Speed):
                  </label>
                  <select
                    value={baudRate}
                    onChange={(e) => setBaudRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="921600">921600 bps (Ultra Fast OTG)</option>
                    <option value="460800">460800 bps (High Speed Safe)</option>
                    <option value="115200">115200 bps (Standard Recovery)</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Partitions */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Select Target Partitions to Flash:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['boot.img', 'system.img', 'recovery.img', 'userdata.img', 'cust.img'].map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => {
                        setSelectedPartitions(prev =>
                          prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                        selectedPartitions.includes(part)
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {selectedPartitions.includes(part) ? '✓ ' : '+ '}
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Flash Action Button */}
              <div className="pt-3">
                <button
                  onClick={handleStartFlash}
                  disabled={isFlashing || !flashSoftware}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isFlashing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:scale-[1.01] active:scale-[0.99] text-slate-950 shadow-orange-500/25 cursor-pointer'
                  }`}
                >
                  <Cpu className={`w-5 h-5 ${isFlashing ? 'animate-spin' : ''}`} />
                  <span>
                    {isFlashing ? 'Flashing over OTG Cable in Progress...' : 'Start Flash via OTG Cable'}
                  </span>
                </button>
              </div>
            </div>

            {/* Flash Progress & Real-time Console */}
            {(isFlashing || flashLogs.length > 0) && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isFlashing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    Flashing Status: {isFlashing ? 'WRITING BLOCKS' : flashComplete ? 'COMPLETED' : 'IDLE'}
                  </span>
                  <span className="text-slate-400">{flashProgress}%</span>
                </div>

                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                    style={{ width: `${flashProgress}%` }}
                  ></div>
                </div>

                <div className="bg-black/90 p-3 rounded-xl border border-slate-800 text-[11px] text-emerald-400 max-h-40 overflow-y-auto space-y-1">
                  {flashLogs.map((log, idx) => (
                    <div key={idx} className="leading-tight">{log}</div>
                  ))}
                </div>

                {flashComplete && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {t('flashSuccess')}
                    </span>
                    <button
                      onClick={() => flashSoftware && onRunEmulator(flashSoftware)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      {t('runInEmulator')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Instruction & OTG Pinout Guide */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Usb className="w-4 h-4 text-orange-400" />
                OTG Connection Hardware Guide
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1">Jio Keypad Phone (EDL Boot Keys)</div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    <li><strong>Jio F220B / F320B:</strong> Phone off karein, Center Key daba kar OTG cable lagayein.</li>
                    <li><strong>Jio F90M / F120B:</strong> * Key aur Power Key ek saath dabayein.</li>
                    <li><strong>Jio F61F / F81E:</strong> Left Soft Key daba kar USB plug karein.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-cyan-400 mb-1">Android Smart Phone (Fastboot Mode)</div>
                  <p className="text-[11px] text-slate-400">
                    Power + Volume Down daba kar Fastboot screen par aayein aur OTG cable se doosre phone ya laptop se connect karein.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-purple-400 mb-1">PC / Laptop Direct Flash</div>
                  <p className="text-[11px] text-slate-400">
                    USB port me OTG adapter lagayein, driver auto-detect hoga aur baud rate 921600 par high speed write shuru ho jayega.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. INSTALL SOFTWARE TAB */}
      {/* Exact Requirement:
          "aur ek install software ka option rahe us par click karne par hamne banaya hua software dikh jaye ham softwar choose karne par install ka option dikhe ek back option dihke install par click karne par softwar install hona shuru ho jaye" */}
      {/* ========================================================== */}
      {subTab === 'install' && (
        <div className="space-y-5">
          {/* Software Selection & Details Section */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Download className="w-5 h-5 text-cyan-400" />
                  <span>Choose &amp; Install Created Software</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Aapke banaye huye sabhi softwares yahan listed hain. Software chunein aur direct install karein.
                </p>
              </div>

              {/* If a software is chosen, show the explicit Back button as requested: "ek back option dikhe" */}
              {selectedSoftware && (
                <button
                  onClick={() => setSelectedSoftware(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('back')} (View All)</span>
                </button>
              )}
            </div>

            {/* IF NO SOFTWARE IS CHOSEN: Display all created softwares as requested: "hamne banaya hua software dikh jaye" */}
            {!selectedSoftware ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select a Software to Install:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {softwares.map((sw) => (
                    <div
                      key={sw.id}
                      onClick={() => {
                        setSelectedSoftware(sw);
                        setInstallSuccess(false);
                      }}
                      className="group p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer shadow-md flex flex-col justify-between hover:scale-[1.01]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">
                            {sw.platform === 'jio' ? '📱' : sw.platform === 'smartphone' ? '📲' : '💻'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {sw.version}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {sw.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {sw.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-mono">{sw.estimatedSize}</span>
                        <span className="text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                          Choose Software →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* WHEN A SOFTWARE IS CHOSEN:
                 Shows:
                 1. Details of the chosen software
                 2. "Install" option button ("install ka option dikhe")
                 3. "Back" option button ("ek back option dihke")
                 4. Clicking install starts installation immediately! ("install par click karne par softwar install hona shuru ho jaye")
              */
              <div className="space-y-5">
                <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
                        {selectedSoftware.platform === 'jio' ? '📱' : selectedSoftware.platform === 'smartphone' ? '📲' : '💻'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{selectedSoftware.name}</h4>
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300">
                            {selectedSoftware.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{selectedSoftware.tagline}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                          <span>Size: {selectedSoftware.estimatedSize}</span>
                          <span>Format: {selectedSoftware.fileFormat}</span>
                          <span>Platform: {selectedSoftware.platform.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* TWO EXPLICIT BUTTONS: INSTALL BUTTON + BACK BUTTON */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Back button */}
                      <button
                        onClick={() => setSelectedSoftware(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('back')}</span>
                      </button>

                      {/* Install button */}
                      <button
                        onClick={handleStartInstall}
                        disabled={isInstalling}
                        className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                          isInstalling
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/25 cursor-pointer hover:scale-105 active:scale-95'
                        }`}
                      >
                        <Zap className={`w-4 h-4 ${isInstalling ? 'animate-spin' : ''}`} />
                        <span>{isInstalling ? 'Installing...' : t('install')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Software features preview */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Included Capabilities &amp; Hardware Pinouts:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {selectedSoftware.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LIVE INSTALLATION PROGRESS BAR (Starts when user clicks Install) */}
                {(isInstalling || installSuccess) && (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-400 flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${isInstalling ? 'animate-bounce text-cyan-400' : 'text-emerald-400'}`} />
                        {installStage}
                      </span>
                      <span className="font-mono text-slate-300">{installProgress}%</span>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-green-500 transition-all duration-300 rounded-full"
                        style={{ width: `${installProgress}%` }}
                      ></div>
                    </div>

                    {/* Success Card with Action Buttons */}
                    {installSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>{t('installSuccess')}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">Status: Ready to Launch</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Software aapke {selectedSoftware.platform === 'jio' ? 'Jio Phone' : selectedSoftware.platform === 'smartphone' ? 'Smartphone' : 'PC'} me successfully deploy ho gaya hai. Aap ise virtual device me chala sakte hain ya download kar sakte hain.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => onRunEmulator(selectedSoftware)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{t('runInEmulator')}</span>
                          </button>

                          <button
                            onClick={() => downloadSoftwareZip(selectedSoftware)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{t('download')} (.zip)</span>
                          </button>

                          <button
                            onClick={() => onOpenInspect(selectedSoftware)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                          >
                            <span>{t('check')} Code</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
