import whisper
import sys
import os
from pathlib import Path
import torch
import ffmpeg
import numpy as np

def extract_audio(video_path, output_path):
    try:
        stream = ffmpeg.input(video_path)
        stream = ffmpeg.output(stream, output_path, acodec='pcm_s16le', ac=1, ar='16k')
        ffmpeg.run(stream, overwrite_output=True, capture_stdout=True, capture_stderr=True)
        return True
    except ffmpeg.Error as e:
        print(f"Error extracting audio: {str(e.stderr.decode())}", file=sys.stderr)
        return False

def transcribe_video(video_path):
    try:
        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(os.path.dirname(video_path), "temp_audio")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Extract audio to WAV format
        audio_path = os.path.join(temp_dir, "temp_audio.wav")
        print(f"Extracting audio to {audio_path}...", file=sys.stderr)
        if not extract_audio(video_path, audio_path):
            raise Exception("Failed to extract audio from video")

        print("Loading Whisper model...", file=sys.stderr)
        # Use CPU device explicitly
        device = "cpu"
        model = whisper.load_model("base", device=device)

        print(f"Starting transcription...", file=sys.stderr)
        
        # Transcribe with specific options
        result = model.transcribe(
            audio_path,
            fp16=False,
            language='en',
            verbose=True
        )
        
        # Clean up temporary audio file
        try:
            os.remove(audio_path)
            os.rmdir(temp_dir)
        except Exception as e:
            print(f"Warning: Could not clean up temporary files: {str(e)}", file=sys.stderr)
        
        # Print the transcript to stdout
        print(result["text"])
        
        return True
    except Exception as e:
        print(f"Error in transcribe_video: {str(e)}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe_video.py <video_file_path>", file=sys.stderr)
        sys.exit(1)

    video_file = sys.argv[1]
    if not os.path.exists(video_file):
        print(f"Video file not found: {video_file}", file=sys.stderr)
        sys.exit(1)

    success = transcribe_video(video_file)
    sys.exit(0 if success else 1)