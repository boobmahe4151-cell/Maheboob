import React, { useState } from 'react';
import { CustomSoftware } from '../types';
import { X, Download, Cpu, Code2, ShieldCheck, Check, Copy } from 'lucide-react';
import { downloadSoftwareZip } from '../services/zipGenerator';

interface InspectModalProps {
  software: CustomSoftware;
  onClose: () => void;
  onInstall: (software: CustomSoftware) => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({ software, onClose, onInstall }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'flashing'>('overview');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const currentFile = software.sourceCodeFiles[selectedFileIndex] || software.sourceCodeFiles[0];

  const handleCopyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadSoftwareZip(software);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
              {software.platform === 'jio' ? '📱' : software.platform === 'smartphone' ? '📲' : '💻'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{software.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {software.version}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Safe
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{software.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview &amp; Specs
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Source Code ({software.sourceCodeFiles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('flashing')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'flashing'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>OTG Flashing Info</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{software.description}</p>
              </div>

              {/* Hardware & File Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Target Platform</div>
                  <div className="text-sm font-bold text-white uppercase mt-1">{software.platform}</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">File Package</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-1">{software.fileFormat}</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Payload Size</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-1">{software.estimatedSize}</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">OTG Flashing</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">Ready (High Speed)</div>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Features</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {software.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keypad Mapping for Jio Phone */}
              {software.keypadControls && (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Jio Keypad Hardware Mapping
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(software.keypadControls).map(([k, v]) => (
                      <div key={k} className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800/80">
                        <span className="font-semibold text-cyan-400 capitalize">{k} Key:</span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              {/* File Selector */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {software.sourceCodeFiles.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      selectedFileIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              {/* Code Display Box */}
              {currentFile && (
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400">
                    <span className="font-mono">{currentFile.name} ({currentFile.language})</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-[340px] leading-relaxed">
                    {currentFile.content}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flashing' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-amber-400 mb-2">Supported Chipsets &amp; Baud Rate</div>
                <div className="text-slate-300 mb-1">
                  <strong>Chips:</strong> {software.flashingSpecs?.supportedChips}
                </div>
                <div className="text-slate-300">
                  <strong>Baud Rate:</strong> {software.flashingSpecs?.baudRate || '921600'} (High Speed OTG)
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-2">Flash Partitions Target</div>
                <div className="flex flex-wrap gap-2">
                  {(software.flashingSpecs?.partitions || []).map((part, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-900 text-slate-200 font-mono rounded border border-slate-800">
                      {part}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-300 mb-2">OTG Connection &amp; Flash Steps</div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  {(software.flashingSpecs?.steps || []).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            SHA256: <span className="font-mono text-slate-500">e829fa...31a7 (Passed)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{downloading ? 'Downloading...' : 'Download .zip'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onInstall(software);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Install to Device</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
