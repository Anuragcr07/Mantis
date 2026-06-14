import whisper
import json
import sys
import os

def transcribe_video(video_path: str, output_name: str):
    print(f"Loading Whisper model...")
    model = whisper.load_model("base")
    
    print(f"Transcribing {video_path}...")
    result = model.transcribe(video_path, verbose=False)
    
    segments = []
    for segment in result["segments"]:
        segments.append({
            "start": segment["start"],
            "end": segment["end"],
            "text": segment["text"].strip(),
            "timestamp_label": f"{int(segment['start']//60)}:{int(segment['start']%60):02d}"
        })
    
    output_path = f"knowledge/transcripts/{output_name}.json"
    os.makedirs("knowledge/transcripts", exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(segments, f, indent=2)
    
    print(f"Saved {len(segments)} segments to {output_path}")
    return segments

if __name__ == "__main__":
    video_path = sys.argv[1]
    output_name = sys.argv[2]
    transcribe_video(video_path, output_name)