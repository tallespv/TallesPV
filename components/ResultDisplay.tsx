import React, { useState } from 'react';
import { Copy, Check, Share2, Hash, MessageCircle, Sparkles, Download, ImageIcon } from 'lucide-react';
import { LoadingState } from '../types';

interface ResultDisplayProps {
  caption: string;
  generatedImage: string | null;
  loadingState: LoadingState;
  onRetry: () => void;
  labels: {
    idleTitle: string;
    idleSubtitle: string;
    loadingTitle: string;
    loadingSubtitle: string;
    errorTitle: string;
    errorButton: string;
    resultTitle: string;
    copy: string;
    copied: string;
    downloadImage: string;
    badgeEngagement: string;
    badgeSeo: string;
    badgeViral: string;
  };
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ caption, generatedImage, loadingState, onRetry, labels }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `social-creative-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loadingState === LoadingState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-slate-700/50 rounded-2xl bg-slate-900/30 min-h-[400px]">
        <Sparkles size={48} className="mb-4 text-slate-600 opacity-50" />
        <p className="text-center">{labels.idleTitle}</p>
        <p className="text-sm text-slate-600 mt-2">{labels.idleSubtitle}</p>
      </div>
    );
  }

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border border-slate-700/50 rounded-2xl bg-slate-900/30 min-h-[400px]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-300 font-medium animate-pulse">{labels.loadingTitle}</p>
        <p className="text-xs text-slate-500 mt-2">{labels.loadingSubtitle}</p>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border border-red-500/20 rounded-2xl bg-red-900/10 min-h-[400px]">
        <div className="w-12 h-12 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center mb-4">
          <MessageCircle size={24} />
        </div>
        <p className="text-red-200 font-medium mb-4">{labels.errorTitle}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {labels.errorButton}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 z-10">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles size={18} />
          <span className="font-semibold text-sm uppercase tracking-wide">{labels.resultTitle}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Generated Image Section */}
        {generatedImage && (
          <div className="relative group w-full aspect-square sm:aspect-video bg-slate-950 border-b border-slate-700/50">
            <img 
              src={generatedImage} 
              alt="Generated Creative" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={handleDownloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all transform hover:scale-105"
              >
                <Download size={18} />
                {labels.downloadImage}
              </button>
            </div>
             <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-white/80 flex items-center gap-1">
               <ImageIcon size={12} /> Creative
             </div>
          </div>
        )}

        {/* Caption Section */}
        {caption && (
          <div className="p-6 relative">
             <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg
                    ${copied 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? labels.copied : labels.copy}
                </button>
             </div>
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-light text-lg pt-2">
              {caption}
            </div>
            
            {/* Badges */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-wrap gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <MessageCircle size={12} /> {labels.badgeEngagement}
                </div>
                 <div className="flex items-center gap-1">
                    <Hash size={12} /> {labels.badgeSeo}
                </div>
                 <div className="flex items-center gap-1">
                    <Share2 size={12} /> {labels.badgeViral}
                </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 pointer-events-none"></div>
    </div>
  );
};
