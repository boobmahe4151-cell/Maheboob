import React, { useState, useEffect } from 'react';
import { CustomSoftware, PlatformType } from '../types';
import { Play, RotateCcw, Volume2, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface DeviceEmulatorProps {
  software: CustomSoftware | null;
  onOpenInspect?: (software: CustomSoftware) => void;
}

export const DeviceEmulator: React.FC<DeviceEmulatorProps> = ({ software }) => {
  const [torchActive, setTorchActive] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'app' | 'menu' | 'info'>('app');
  const [statusLog, setStatusLog] = useState<string>('Ready');
  const [currentTime, setCurrentTime] = useState<string>('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  const handleKeyPress = (key: string) => {
    playClickSound();
    setStatusLog(`Key: [${key}] pressed`);

    if (key === 'center' || key === '*' || key === '5') {
      setTorchActive(prev => !prev);
    } else if (key === 'call') {
      setStatusLog('Calling SpeedDial 1...');
    } else if (key === 'endCall') {
      setActiveScreen('menu');
      setStatusLog('Exited to Home');
    } else if (key === 'softLeft') {
      setActiveScreen('app');
    } else if (key === 'softRight') {
      setActiveScreen(prev => prev === 'info' ? 'app' : 'info');
    }
  };

  const platform = software?.platform || 'jio';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      {/* Emulator Header */}
      <div className="w-full flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Virtual Device Simulator ({platform.toUpperCase()})</span>
        </div>
        <button
          onClick={() => {
            setTorchActive(false);
            setActiveScreen('app');
            setStatusLog('Reset simulator');
          }}
          className="flex items-center gap-1 hover:text-slate-200"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* JIO KEYPAD PHONE HARDWARE EMULATION */}
      {platform === 'jio' && (
        <div className="relative w-[280px] bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 rounded-[36px] shadow-2xl border-4 border-slate-800 flex flex-col items-center select-none">
          {/* Top Torch Beam (Flashlight Simulation) */}
          <div className="relative -top-2 flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              torchActive
                ? 'bg-amber-300 shadow-[0_0_24px_10px_rgba(251,191,36,0.8)] ring-4 ring-amber-400/50'
                : 'bg-slate-700'
            }`} />
            {torchActive && (
              <span className="text-[9px] font-bold text-amber-300 tracking-wider mt-1 animate-pulse">
                🔦 TORCH ON
              </span>
            )}
          </div>

          {/* Jio Branding */}
          <div className="text-[13px] font-black tracking-widest text-slate-400 mb-2">
            Jio<span className="text-blue-500 font-extrabold text-[15px]">•</span>Phone
          </div>

          {/* Screen Bezel & Display */}
          <div className="w-full h-[210px] bg-black rounded-xl p-2 border-2 border-slate-800 shadow-inner flex flex-col overflow-hidden relative font-sans">
            {/* Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-300 border-b border-slate-800 pb-1 mb-1">
              <span className="font-semibold text-blue-400">Jio 4G VoLTE</span>
              <span>{currentTime}</span>
              <span className="flex items-center gap-1 font-mono">
                <span>100%</span>
                <span className="inline-block w-3.5 h-2 border border-slate-400 rounded-xs bg-emerald-500"></span>
              </span>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center text-center p-1">
              {software ? (
                activeScreen === 'app' ? (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 shadow">
                      <div className="text-xs font-bold text-cyan-400 truncate">
                        {software.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                        {software.tagline}
                      </div>
                    </div>

                    {/* App Core Display */}
                    <div className="my-auto py-2">
                      <div className={`text-3xl transition-transform ${torchActive ? 'scale-125' : 'scale-100'}`}>
                        {torchActive ? '💡' : '⚡'}
                      </div>
                      <div className={`text-xs font-bold mt-1 ${torchActive ? 'text-amber-300' : 'text-slate-300'}`}>
                        {torchActive ? 'HIGH BEAM ACTIVE' : 'RUNNING OS TASK'}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {statusLog}
                      </div>
                    </div>

                    {/* Bottom Softkeys labels */}
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 border-t border-slate-800 pt-1">
                      <span>Options</span>
                      <span className="text-cyan-400">SELECT</span>
                      <span>Details</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-left p-1 text-slate-300 space-y-1">
                    <div className="font-bold text-cyan-400">{software.name}</div>
                    <div className="text-[10px] text-slate-400">Ver: {software.version}</div>
                    <div className="text-[10px] text-emerald-400">Status: Installed & Verified</div>
                    <div className="text-[9px] text-slate-500 mt-2">D-Pad center dabayein wapas aane ke liye.</div>
                  </div>
                )
              ) : (
                <div className="text-slate-500 text-xs">
                  <p>Koi software select nahi hai.</p>
                  <p className="text-[10px] mt-1 text-slate-600">Chat se software banayein ya My Software se chunein.</p>
                </div>
              )}
            </div>
          </div>

          {/* PHYSICAL KEYPAD SECTION */}
          <div className="w-full mt-3 flex flex-col items-center gap-1.5">
            {/* Top Function Keys & 5-Way D-Pad */}
            <div className="w-full grid grid-cols-3 gap-1 items-center px-1">
              {/* Left Soft Key */}
              <button
                onClick={() => handleKeyPress('softLeft')}
                className="h-8 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 flex items-center justify-center shadow"
              >
                ──
              </button>

              {/* 5-WAY D-PAD */}
              <div className="relative w-16 h-16 mx-auto bg-slate-800 rounded-full border-2 border-slate-700 shadow flex items-center justify-center">
                {/* UP */}
                <button
                  onClick={() => handleKeyPress('up')}
                  className="absolute top-1 text-[9px] text-slate-300 active:text-cyan-400 w-8 h-4 flex items-center justify-center"
                >
                  ▲
                </button>
                {/* DOWN */}
                <button
                  onClick={() => handleKeyPress('down')}
                  className="absolute bottom-1 text-[9px] text-slate-300 active:text-cyan-400 w-8 h-4 flex items-center justify-center"
                >
                  ▼
                </button>
                {/* LEFT */}
                <button
                  onClick={() => handleKeyPress('left')}
                  className="absolute left-1 text-[9px] text-slate-300 active:text-cyan-400 h-8 w-4 flex items-center justify-center"
                >
                  ◀
                </button>
                {/* RIGHT */}
                <button
                  onClick={() => handleKeyPress('right')}
                  className="absolute right-1 text-[9px] text-slate-300 active:text-cyan-400 h-8 w-4 flex items-center justify-center"
                >
                  ▶
                </button>
                {/* CENTER OK BUTTON */}
                <button
                  onClick={() => handleKeyPress('center')}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 active:scale-90 text-white font-bold text-[10px] shadow-inner flex items-center justify-center"
                  title="OK / Torch Toggle"
                >
                  OK
                </button>
              </div>

              {/* Right Soft Key */}
              <button
                onClick={() => handleKeyPress('softRight')}
                className="h-8 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 flex items-center justify-center shadow"
              >
                ──
              </button>
            </div>

            {/* Call / End Call Buttons */}
            <div className="w-full grid grid-cols-2 gap-2 px-1">
              <button
                onClick={() => handleKeyPress('call')}
                className="h-7 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center justify-center shadow"
                title="Call / Turbo"
              >
                📞
              </button>
              <button
                onClick={() => handleKeyPress('endCall')}
                className="h-7 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center justify-center shadow"
                title="End Call / Exit"
              >
                ✕
              </button>
            </div>

            {/* Numeric Keypad Matrix 3x4 */}
            <div className="w-full grid grid-cols-3 gap-1 px-1 mt-1">
              {[
                { k: '1', sub: '.,' },
                { k: '2', sub: 'ABC' },
                { k: '3', sub: 'DEF' },
                { k: '4', sub: 'GHI' },
                { k: '5', sub: 'JKL' },
                { k: '6', sub: 'MNO' },
                { k: '7', sub: 'PQRS' },
                { k: '8', sub: 'TUV' },
                { k: '9', sub: 'WXYZ' },
                { k: '*', sub: '🔦 SOS' },
                { k: '0', sub: '␣' },
                { k: '#', sub: 'Aa' },
              ].map(({ k, sub }) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  className="h-7 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:scale-95 text-slate-200 rounded-md border border-slate-700/80 flex flex-col items-center justify-center shadow-xs"
                >
                  <span className="text-xs font-bold leading-none">{k}</span>
                  <span className="text-[7px] text-slate-400 leading-none">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SMARTPHONE / ANDROID SIMULATOR */}
      {platform === 'smartphone' && (
        <div className="w-[280px] bg-slate-950 p-3 rounded-[32px] border-4 border-slate-800 shadow-2xl flex flex-col items-center">
          {/* Notch / Camera */}
          <div className="w-16 h-3 bg-black rounded-b-lg mb-2"></div>
          {/* Touchscreen */}
          <div className="w-full h-[320px] bg-slate-900 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>9:41</span>
              <span>5G • 98%</span>
            </div>
            <div className="my-auto text-center p-2">
              <div className="text-4xl mb-2">🚀</div>
              <h4 className="text-sm font-bold text-white">{software?.name || 'Android Software'}</h4>
              <p className="text-xs text-slate-400 mt-1">{software?.tagline || 'Ready to run'}</p>
              <div className="mt-4 p-2 bg-slate-800/80 rounded-lg text-[11px] text-emerald-400 font-mono">
                OTG FASTBOOT BRIDGE: OK
              </div>
            </div>
            <div className="flex justify-around text-xs text-slate-500 border-t border-slate-800 pt-2">
              <span>◀</span>
              <span>●</span>
              <span>■</span>
            </div>
          </div>
        </div>
      )}

      {/* PC SIMULATOR */}
      {platform === 'pc' && (
        <div className="w-full max-w-[340px] bg-slate-950 rounded-xl border-2 border-slate-800 shadow-2xl overflow-hidden">
          {/* Windows Titlebar */}
          <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px] truncate">{software?.name || 'PC Desktop App'}</span>
            </div>
            <div className="flex gap-1.5 text-[10px]">
              <span className="cursor-pointer">─</span>
              <span className="cursor-pointer">□</span>
              <span className="cursor-pointer text-red-400">✕</span>
            </div>
          </div>
          {/* App Window Body */}
          <div className="p-4 bg-slate-900/60 min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-cyan-400">Portable Windows & Linux Tool</div>
              <div className="text-xs text-slate-300 mt-2">{software?.description}</div>
              <div className="mt-3 bg-black/60 rounded p-2 text-[10px] font-mono text-emerald-400">
                &gt; USB OTG Device: Detected<br />
                &gt; Status: Ready to Flash &amp; Transfer
              </div>
            </div>
            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 flex justify-between">
              <span>Arch: x86_64</span>
              <span>Memory: 18MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
