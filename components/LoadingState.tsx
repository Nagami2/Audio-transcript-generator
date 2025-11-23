
import React from 'react';
import { Loader2, Cpu, UploadCloud, FileAudio, Layers } from 'lucide-react';
import { TranscriptionStatus } from '../types';

interface LoadingStateProps {
  status: TranscriptionStatus;
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ status, message }) => {
  
  const renderIcon = () => {
    switch(status) {
        case TranscriptionStatus.UPLOADING:
            return <UploadCloud className="w-6 h-6 text-blue-400 animate-bounce" />;
        case TranscriptionStatus.PROCESSING_MEDIA:
            return <FileAudio className="w-6 h-6 text-purple-400 animate-pulse" />;
        case TranscriptionStatus.PROCESSING_CHUNKS:
            return <Layers className="w-6 h-6 text-indigo-400 animate-pulse" />;
        case TranscriptionStatus.GENERATING:
            return <Cpu className="w-6 h-6 text-green-400 animate-pulse" />;
        default:
            return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
    }
  };

  const renderText = () => {
    // If we have a specific message (e.g. from chunking), use it as title
    if (status === TranscriptionStatus.PROCESSING_CHUNKS && message) {
        return {
            title: message,
            desc: 'Analyzing large file in segments to ensure accuracy.'
        };
    }

    switch(status) {
        case TranscriptionStatus.UPLOADING:
            return {
                title: 'Uploading Media...',
                desc: 'Sending your file securely to Gemini. Large files may take a moment.'
            };
        case TranscriptionStatus.PROCESSING_MEDIA:
            return {
                title: 'Processing Media...',
                desc: 'Gemini is analyzing the audio and visual data. Please wait.'
            };
        case TranscriptionStatus.GENERATING:
            return {
                title: 'Generating Transcript...',
                desc: 'Transcribing speech and describing events.'
            };
        default:
            return { title: 'Loading...', desc: 'Please wait.' };
    }
  };

  const { title, desc } = renderText();

  return (
    <div className="w-full max-w-xl mx-auto text-center p-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700/50 border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            {renderIcon()}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-100 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-400">
        {desc}
      </p>

      <div className="mt-6 flex justify-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default LoadingState;
