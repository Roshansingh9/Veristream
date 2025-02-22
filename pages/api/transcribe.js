// pages/api/transcribe.js
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { transcribeVideo } from '../../utils/videoProcessing';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Ensure temp directory exists
        const uploadDir = path.join(process.cwd(), 'temp');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Parse the incoming form data
        const form = new IncomingForm({
            uploadDir: uploadDir,
            keepExtensions: true,
            maxFileSize: 500 * 1024 * 1024, // 500MB
        });

        // Parse the form
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        // Access the video file - in latest formidable versions, files.video is an array
        const videoFile = files.video?.[0] || files.video;

        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        console.log('Received file:', videoFile);

        // The uploaded file is already in the temp directory, so we can use its path directly
        const videoPath = videoFile.filepath;
        console.log('Processing video at path:', videoPath);

        // Transcribe the video
        const transcript = await transcribeVideo(videoPath);
        console.log('Transcription completed');

        // Clean up: delete the video file after processing
        try {
            await fs.unlink(videoPath);
            console.log('Cleaned up temporary file');
        } catch (cleanupError) {
            console.error('Error cleaning up video file:', cleanupError);
        }

        return res.status(200).json({ transcript });
    } catch (error) {
        console.error('Error in transcribe API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}