// utils/videoProcessing.js
import { spawn } from 'child_process';
import path from 'path';

export async function transcribeVideo(videoPath) {
    console.log('Starting transcription for video:', videoPath);

    return new Promise((resolve, reject) => {
        const pythonScript = path.join(process.cwd(), 'transcribe_video.py');
        const pythonProcess = spawn('python', [pythonScript, videoPath]);

        let transcriptData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            transcriptData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
            errorData += data.toString();
        });

        pythonProcess.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            reject(error);
        });

        pythonProcess.on('close', (code) => {
            console.log('Python process exited with code:', code);
            if (code === 0 && transcriptData.trim()) {
                resolve(transcriptData.trim());
            } else {
                reject(new Error(`Transcription failed: ${errorData || 'Unknown error'}`));
            }
        });
    });
}