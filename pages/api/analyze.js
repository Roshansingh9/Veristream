// pages/api/analyze.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({ error: "No transcript provided." });
        }

        // Split transcript into sentences
        const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);

        // Construct the path to analyze_text.py
        const scriptPath = path.join(__dirname, '..', '..', 'model', 'analyze_text.py');
        console.log("Script path:", scriptPath); // For debugging

        // Call Python script for each sentence
        const results = await Promise.all(
            sentences.map(async (sentence) => {
                return new Promise((resolve, reject) => {
                    const pythonProcess = spawn('python', [
                        scriptPath,
                        sentence.trim()
                    ]);

                    let result = '';
                    let error = '';

                    pythonProcess.stdout.on('data', (data) => {
                        result += data.toString();
                    });

                    pythonProcess.stderr.on('data', (data) => {
                        error += data.toString();
                    });

                    pythonProcess.on('close', (code) => {
                        if (code !== 0) {
                            console.error("Python script error:", error);
                            reject(new Error(`Analysis failed: ${error}`));
                            return;
                        }

                        try {
                            const analysis = JSON.parse(result);
                            resolve({
                                text: sentence.trim(),
                                isFake: analysis.alert === "Misleading",
                                confidence: analysis.confidence,
                                summary: analysis.summary,
                                source: analysis.source
                            });
                        } catch (e) {
                            console.error("Failed to parse analysis results:", e);
                            reject(new Error('Failed to parse analysis results'));
                        }
                    });
                });
            })
        );

        return res.status(200).json({ lines: results });
    } catch (error) {
        console.error("Error during analysis:", error);
        return res.status(500).json({ error: error.message });
    }
}
