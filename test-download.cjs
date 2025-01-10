// test-download.cjs
const path = require('path');
const { fileURLToPath } = require('url');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');

async function downloadVideo(videoUrl, outputPath) {
    try {
        console.log('Starting video download:', videoUrl);

        // Ensure the temp directory exists
        const tempDir = path.dirname(outputPath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download video using youtube-dl
        await youtubedl(videoUrl, {
            output: outputPath,
            format: 'best[ext=mp4]', // Force MP4 format
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ]
        });

        // Verify the file was downloaded
        if (!fs.existsSync(outputPath)) {
            throw new Error('Video file was not created');
        }

        const stats = fs.statSync(outputPath);
        if (stats.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        console.log('Video downloaded successfully to:', outputPath);
        return true;
    } catch (error) {
        console.error('Download error:', error);
        throw new Error(`Failed to download video: ${error.message}`);
    }
}

async function testDownload() {
    try {
        const outputPath = path.join(process.cwd(), 'temp', 'test-video.mp4');
        console.log('Attempting to download to:', outputPath);

        await downloadVideo('https://www.youtube.com/watch?v=r_ahZOgPTsk', outputPath);

        console.log('Download successful!');
        console.log('File exists:', fs.existsSync(outputPath));
        console.log('File size:', fs.statSync(outputPath).size, 'bytes');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testDownload();