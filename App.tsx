
import React, { useState, useCallback } from 'react';
import { Sparkles, Github, AlertTriangle, Mic2, CheckCircle2 } from 'lucide-react';
import VideoInput from './components/VideoInput';
import TranscriptDisplay from './components/TranscriptDisplay';
import LoadingState from './components/LoadingState';
import { generateVideoTranscript } from './services/geminiService';
import { TranscriptSegment, TranscriptionStatus, ProcessingError } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<TranscriptionStatus>(TranscriptionStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleVideoSelected = useCallback(async (file: File) => {
    setStatus(TranscriptionStatus.UPLOADING);
    setStatusMessage('');
    setError(null);
    setTranscript([]);
    setFileName(file.name);

    try {
        const result = await generateVideoTranscript(
            file, 
            (newStatus) => {
                // Check if the status string matches a known enum value
                if (newStatus === "UPLOADING") {
                    setStatus(TranscriptionStatus.UPLOADING);
                    setStatusMessage('');
                } else if (newStatus === "PROCESSING_MEDIA") {
                    setStatus(TranscriptionStatus.PROCESSING_MEDIA);
                    setStatusMessage('');
                } else if (newStatus === "GENERATING") {
                    setStatus(TranscriptionStatus.GENERATING);
                    setStatusMessage('');
                } else {
                    // Assume it's a granular message like "Processing Part 1 of 4: Uploading"
                    setStatus(TranscriptionStatus.PROCESSING_CHUNKS);
                    setStatusMessage(newStatus);
                }
            },
            (partialTranscript) => {
                // Live update of the transcript state
                setTranscript(partialTranscript);
            }
        );
        
        setTranscript(result);
        setStatus(TranscriptionStatus.COMPLETED);
    } catch (err: any) {
        console.error(err);
        setError({ 
            message: "Processing Failed", 
            details: err.message || "Unknown error occurred during AI processing."
        });
        setStatus(TranscriptionStatus.ERROR);
    }
  }, []);

  const handleCopy = () => {
    if (!transcript.length) return;
    const text = transcript.map(s => `[${s.timestamp}] ${s.speaker}: ${s.text}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Transcript copied to clipboard!');
  };

  const handleDownload = () => {
    if (!transcript.length) return;
    const text = transcript.map(s => `[${s.timestamp}] ${s.speaker}: ${s.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStatus(TranscriptionStatus.IDLE);
    setTranscript([]);
    setFileName('');
    setError(null);
    setStatusMessage('');
  };

  const isLoading = [
      TranscriptionStatus.UPLOADING, 
      TranscriptionStatus.PROCESSING_MEDIA, 
      TranscriptionStatus.PROCESSING_CHUNKS,
      TranscriptionStatus.GENERATING
  ].includes(status);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full border-b border-slate-800/60 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                    <Mic2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-bold text-xl tracking-tight text-slate-200">Gemini Audio Scribe</h1>
            </div>
            <a 
                href="https://github.com/google-gemini/gemini-api-cookbook" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
            >
                <Github className="w-6 h-6" />
            </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        
        {/* Hero Text */}
        {status === TranscriptionStatus.IDLE && (
             <div className="text-center mb-16 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-300 text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by Gemini 2.5 Flash</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Turn Audio into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Perfect Transcripts
                    </span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Upload large audio files (podcast, meetings, lectures) and get accurate, 
                    timestamped transcripts in seconds. Supports files up to 2GB.
                </p>
            </div>
        )}

        {/* Dynamic State Rendering */}
        <div className="space-y-8">
            
            {/* ERROR STATE */}
            {status === TranscriptionStatus.ERROR && error && (
                <div className="max-w-3xl mx-auto bg-red-950/30 border border-red-900/50 rounded-xl p-6 flex items-start gap-4 shadow-xl">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="text-red-200 font-semibold text-lg">Transcription Failed</h3>
                        <p className="text-red-300/70 text-sm mt-1 leading-relaxed">{error.details}</p>
                        <button 
                            onClick={handleReset}
                            className="mt-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-sm font-medium rounded-lg transition-colors border border-red-800/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* INPUT STATE */}
            {(status === TranscriptionStatus.IDLE || status === TranscriptionStatus.ERROR) && (
                <div className="animate-fade-in">
                    <VideoInput 
                        onVideoSelected={handleVideoSelected} 
                        disabled={false} 
                    />
                </div>
            )}

            {/* LOADING STATE */}
            {isLoading && (
                <>
                    <LoadingState status={status} message={statusMessage} />
                    
                    {/* Live Preview Section */}
                    {transcript.length > 0 && (
                        <div className="mt-12 animate-fade-in">
                             <TranscriptDisplay 
                                transcript={transcript} 
                                onCopy={handleCopy}
                                onDownload={handleDownload}
                                isProcessing={true}
                             />
                        </div>
                    )}
                </>
            )}

            {/* COMPLETED STATE */}
            {status === TranscriptionStatus.COMPLETED && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 mb-4 border border-green-500/20">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Transcription Complete</h3>
                        <button 
                            onClick={handleReset}
                            className="mt-2 text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                        >
                            Transcribe another file
                        </button>
                    </div>
                    <TranscriptDisplay 
                        transcript={transcript} 
                        onCopy={handleCopy}
                        onDownload={handleDownload}
                        isProcessing={false}
                    />
                </div>
            )}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-700 text-sm border-t border-slate-800/50">
        <p>Built for the Gemini API Cookbook</p>
      </footer>

    </div>
  );
};

export default App;
