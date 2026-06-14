import json
import os
import groq
import tempfile

def load_transcript(transcript_path: str) -> list:
    with open(transcript_path, "r") as f:
        return json.load(f)

def find_relevant_segments(transcript: list, keywords: list, window: int = 3) -> list:
    relevant = []
    for i, segment in enumerate(transcript):
        text_lower = segment["text"].lower()
        if any(kw.lower() in text_lower for kw in keywords):
            start = max(0, i - window)
            end = min(len(transcript), i + window + 1)
            context_segments = transcript[start:end]
            relevant.append({
                "matched_text": segment["text"],
                "timestamp": segment["timestamp_label"],
                "start_sec": segment["start"],
                "end_sec": transcript[min(i + window, len(transcript)-1)]["end"],
                "context": " ".join(s["text"] for s in context_segments)
            })
    return relevant

def get_chunks_from_transcript(transcript: list, product_id: str, video_id: str) -> list:
    chunks = []
    group_size = 5
    for i in range(0, len(transcript), group_size):
        group = transcript[i:i + group_size]
        text = " ".join(seg["text"] for seg in group)
        start_time = group[0]["timestamp_label"]
        end_time = group[-1]["timestamp_label"]
        chunks.append({
            "text": text,
            "metadata": {
                "product_id": product_id,
                "source_type": "video",
                "video_id": video_id,
                "timestamp_start": start_time,
                "timestamp_end": end_time,
                "start_sec": group[0]["start"]
            }
        })
    return chunks


groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_and_chunk(video_bytes: bytes, product_id: str, video_id: str) -> list:
    """
    Full pipeline: video bytes → transcribe → chunk
    """
    # Save to temp file
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        tmp.write(video_bytes)
        tmp_path = tmp.name

    try:
        # Transcribe using Groq Whisper
        with open(tmp_path, "rb") as f:
            transcription = groq_client.audio.transcriptions.create(
                file=(tmp_path, f.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
                timestamp_granularities=["segment"]
            )

        # Convert to your existing transcript format
        transcript = [
            {
                "text": seg.get("text", ""),
                "timestamp_label": f"{seg.get('start', 0):.0f}s",
                "start": seg.get("start", 0),
                "end": seg.get("end", 0)
            }
            for seg in transcription.segments
        ]

        # Use your existing chunking function
        return get_chunks_from_transcript(transcript, product_id, video_id)

    finally:
        os.unlink(tmp_path)
