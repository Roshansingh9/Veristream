// components/VideoProcessor.js
import React, { useState } from 'react';

const VideoProcessor = ({ videoUrl, onAnalysisComplete }) => {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const processVideo = async () => {
        try {
            setStatus('downloading');
            setProgress(10);

            // Step 1: Transcribe video
            const transcribeResponse = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl })
            });

            if (!transcribeResponse.ok) {
                throw new Error('Failed to transcribe video');
            }

            setProgress(50);
            setStatus('analyzing');

            const { transcript } = await transcribeResponse.json();

            // Step 2: Analyze transcript
            const analysisResponse = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript })
            });

            if (!analysisResponse.ok) {
                throw new Error('Failed to analyze transcript');
            }

            setProgress(100);
            setStatus('complete');

            const analysisResult = await analysisResponse.json();
            onAnalysisComplete(analysisResult);
        } catch (error) {
            setError(error.message);
            setStatus('error');
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'downloading':
                return 'Downloading video...';
            case 'analyzing':
                return 'Analyzing content...';
            case 'complete':
                return 'Analysis complete!';
            case 'error':
                return `Error: ${error}`;
            default:
                return 'Ready to process';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    {getStatusMessage()}
                </span>
                {status !== 'idle' && status !== 'error' && (
                    <span className="text-sm text-gray-500">
                        {progress}%
                    </span>
                )}
            </div>
            {status !== 'idle' && status !== 'error' && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            {status === 'error' && (
                <button
                    onClick={processVideo}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default VideoProcessor;