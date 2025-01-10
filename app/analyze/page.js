'use client'
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';

const AnalyzePage = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setError(null);
            setAnalysisResults(null);
            setStatus('idle');
        } else {
            setError('Please select a valid video file');
        }
    };

    const processVideo = async () => {
        if (!file) {
            setError('Please select a video file');
            return;
        }

        setStatus('uploading');
        setProgress(0);
        setError(null);

        try {
            // Create FormData and append the video file
            const formData = new FormData();
            formData.append('video', file);

            // Upload and transcribe video
            setStatus('transcribing');
            setProgress(33);
            const transcribeResponse = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!transcribeResponse.ok) {
                const errorData = await transcribeResponse.json();
                throw new Error(errorData.error || 'Failed to transcribe video');
            }

            const { transcript } = await transcribeResponse.json();
            setProgress(66);

            // Analyze transcript
            setStatus('analyzing');
            const analyzeResponse = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript }),
            });

            if (!analyzeResponse.ok) {
                const errorData = await analyzeResponse.json();
                throw new Error(errorData.error || 'Failed to analyze transcript');
            }

            const results = await analyzeResponse.json();
            setAnalysisResults(results);
            setStatus('complete');
            setProgress(100);
        } catch (err) {
            console.error('Error processing video:', err);
            setError(err.message);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            Video Analysis
                        </h1>

                        {/* Upload Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="video-upload"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-12 h-12 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">MP4, MOV, or AVI (MAX. 500MB)</p>
                                    </div>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected file: {file.name} ({Math.round(file.size / 1024 / 1024)}MB)
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Status Display */}
                        {status !== 'idle' && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    {status === 'uploading' && 'Uploading video...'}
                                    {status === 'transcribing' && 'Transcribing video...'}
                                    {status === 'analyzing' && 'Analyzing content...'}
                                    {status === 'complete' && 'Analysis complete!'}
                                    {status === 'error' && 'Error occurred'}
                                </p>
                                {status !== 'error' && status !== 'complete' && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analyze Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={processVideo}
                                disabled={!file || status === 'uploading' || status === 'transcribing' || status === 'analyzing'}
                                className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors ${(!file || status === 'uploading' || status === 'transcribing' || status === 'analyzing')
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                    }`}
                            >
                                {status === 'idle' ? 'Analyze Video' : 'Processing...'}
                            </button>
                        </div>

                        {/* Analysis Results */}
                        {analysisResults && analysisResults.lines && (
                            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                    Analysis Results
                                </h2>
                                <div className="space-y-4">
                                    {analysisResults.lines.map((result, index) => (
                                        <div key={index} className="border-b pb-4">
                                            <p className="text-sm font-medium text-gray-600">
                                                Statement {index + 1}:
                                            </p>
                                            <p className={`text-lg font-bold ${result.isFake ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {result.isFake ? 'False Information' : 'True Information'}
                                            </p>
                                            <p className="text-sm text-gray-600">{result.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Confidence: {result.confidence.toFixed(1)}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyzePage;