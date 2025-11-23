
import React from 'react';
import { TranscriptSegment } from '../types';
import { Copy, Download, Clock, User, Loader2 } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
  onCopy: () => void;
  onDownload: () => void;
  isProcessing?: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, onCopy, onDownload, isProcessing = false }) => {
  if (!transcript || transcript.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col max-h-[600px]">
      
      {/* Header Actions */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
            {isProcessing ? 'Live Transcript Preview' : 'Generated Transcript'}
        </h3>
        <div className="flex gap-2">
            <button 
                onClick={onCopy}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                title="Copy to Clipboard"
            >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
            </button>
            <button 
                onClick={onDownload}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                title="Download Text"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
            </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
        {transcript.map((segment, index) => (
            <div key={index} className="group flex gap-4 hover:bg-slate-700/30 p-2 rounded-lg transition-colors -mx-2">
                {/* Timestamp */}
                <div className="flex-shrink-0 w-16 pt-1">
                    <div className="flex items-center gap-1 text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30 w-fit">
                        <Clock className="w-3 h-3" />
                        {segment.timestamp}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <User className="w-3 h-3" />
                        {segment.speaker}
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                        {segment.text}
                    </p>
                </div>
            </div>
        ))}
        
        {isProcessing && (
             <div className="flex items-center justify-center py-4 border-t border-slate-700/50 mt-4 border-dashed">
                <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing next segment...
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
