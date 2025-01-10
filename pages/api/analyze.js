// pages/api/analyze.js
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({ error: "No transcript provided." });
        }

        // Clean and split the transcript into lines
        const lines = transcript
            .split(/[.!?]+/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const scriptPath = path.join(process.cwd(), "model", "model_handler.py");
        const inputPath = path.join(process.cwd(), "model", "input.txt");
        const resultPath = path.join(process.cwd(), "model", "result.json");

        // Write the lines to input file
        fs.writeFileSync(inputPath, lines.join('\n'), "utf-8");

        // Run the Python model handler script
        await new Promise((resolve, reject) => {
            const process = spawn("python", [scriptPath, inputPath, resultPath]);

            let errorOutput = '';

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on("close", (code) => {
                if (code !== 0) {
                    return reject(new Error(`Model analysis failed: ${errorOutput}`));
                }
                resolve();
            });
        });

        // Read and parse the results
        const results = JSON.parse(fs.readFileSync(resultPath, "utf-8"));

        // Transform results into the expected format
        const analysisResults = {
            lines: results.map(result => ({
                text: result.text,
                isFake: result.label === "False",
                confidence: Math.max(...result.probabilities) * 100
            }))
        };

        return res.status(200).json(analysisResults);
    } catch (error) {
        console.error("Error during analysis:", error);
        return res.status(500).json({ error: error.message });
    }
}