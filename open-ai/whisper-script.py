import whisper
import argparse
import sys
import os

def main():
    parser = argparse.ArgumentParser(description="Transcribe audio to text using Whisper.")
    parser.add_argument("audio_path", help="Path to the audio file.")
    parser.add_argument("output_path", help="Path to save the output text file.")
    parser.add_argument("--model", default="medium", help="Whisper model to use (tiny, base, small, medium, large).")
    args = parser.parse_args()
    
    if not os.path.isfile(args.audio_path):
        print(f"Error: File '{args.audio_path}' not found.", file=sys.stderr)
        sys.exit(1)
    
    try:
        model = whisper.load_model(args.model)
    except Exception as e:
        print(f"Error loading Whisper model: {e}", file=sys.stderr)
        sys.exit(1)

    print("Transcribing audio...")
    result = model.transcribe(args.audio_path, language="en")

    # Save full transcription
    with open(args.output_path, "w", encoding="utf-8") as f:
        f.write(result["text"])
    print(f"Transcription saved: {args.output_path}")

    # Generate timestamped output file (with numeric timestamps)
    base, ext = os.path.splitext(args.output_path)
    timestamp_output_path = f"{base}_timestamps{ext}"

    with open(timestamp_output_path, "w", encoding="utf-8") as f:
        for segment in result["segments"]:
            start = segment["start"]  # Numeric seconds
            end = segment["end"]      # Numeric seconds
            text = segment["text"].strip()
            f.write(f"[{start:.3f} --> {end:.3f}] {text}\n")
    
    print(f"Timestamped transcription saved: {timestamp_output_path}")

if __name__ == "_main_":
    main()