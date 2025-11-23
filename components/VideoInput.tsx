import React, { useState, useCallback } from 'react';
import { Youtube, FileAudio, UploadCloud, Music, Mic2, CheckCircle2, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '../constants';

interface VideoInputProps {
  onVideoSelected: (file: File) => void;
  disabled: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelected, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndProcessFile = (file: File) => {
    // Relaxed mime check, many audio files have generic types
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    onVideoSelected(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onVideoSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYoutubeLink(val);
    setYoutubeError(null);
    
    const id = extractYoutubeId(val);
    if (id) {
        setYoutubeVideoId(id);
        setYoutubeError("Please download the audio/video from this link and upload the file below.");
    } else {
        setYoutubeVideoId(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      
      {/* Main Drop Area */}
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ease-in-out
          ${dragActive ? 'scale-[1.01]' : 'scale-100'}
        `}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            onChange={handleChange}
            accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov"
            disabled={disabled}
        />
        <div className={`
            w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-6 p-8 text-center transition-all
            ${dragActive 
                ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]' 
                : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500 shadow-lg'
            }
        `}>
            <div className={`relative p-6 rounded-full transition-transform duration-500 ${dragActive ? 'scale-110 bg-purple-500/20' : 'bg-slate-700/50'}`}>
                {dragActive ? (
                    <UploadCloud className="w-12 h-12 text-purple-400" />
                ) : (
                    <div className="relative">
                        <FileAudio className="w-12 h-12 text-blue-400" />
                        <div className="absolute -right-3 -bottom-2 bg-slate-900 rounded-full p-1">
                             <Music className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-100">
                    {dragActive ? "Drop file to upload" : "Upload Audio or Video"}
                </h3>
                <p className="text-slate-400 text-lg">
                    Drag & drop or click to browse
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-slate-500 uppercase tracking-wider">
                <span className="bg-slate-700/50 px-3 py-1 rounded-full">MP3</span>
                <span className="bg-slate-700/50 px-3 py-1 rounded-full">WAV</span>
                <span className="bg-slate-700/50 px-3 py-1 rounded-full">M4A</span>
                <span className="bg-slate-700/50 px-3 py-1 rounded-full">MP4</span>
                <span className="bg-slate-700/50 px-3 py-1 rounded-full border border-purple-500/30 text-purple-400">Max 2GB</span>
            </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 justify-center text-slate-600 text-sm font-medium">
        <div className="h-px bg-slate-800 flex-1"></div>
        Alternative
        <div className="h-px bg-slate-800 flex-1"></div>
      </div>

       {/* Secondary YouTube Input */}
       <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800">
        <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-500">
                <Youtube className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={youtubeLink}
                onChange={handleYoutubeChange}
                placeholder="Have a YouTube link? Paste it here for instructions..."
                disabled={disabled}
                className="w-full bg-transparent border-none rounded-lg pl-12 pr-4 py-4 text-slate-300 placeholder:text-slate-600 focus:ring-0 outline-none"
            />
        </div>
        
        {youtubeVideoId && (
            <div className="mx-2 mb-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3 animate-fade-in">
                 <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                 <div className="text-sm text-yellow-200/80">
                    <p className="font-medium text-yellow-200">Download Required</p>
                    <p>Due to browser security, please download the audio/video from YouTube first, then drop the file above.</p>
                 </div>
            </div>
        )}
      </div>

    </div>
  );
};

export default VideoInput;
