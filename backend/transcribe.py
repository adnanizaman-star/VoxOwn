import os
from faster_whisper import WhisperModel

MODEL_PATH = "/home/node/voxown/models/large-v3"
os.makedirs(MODEL_PATH, exist_ok=True)

def download_model():
    print("Loading Whisper Large-V3 model (will download on first run)...")
    model = WhisperModel("large-v3", download_root=MODEL_PATH, device="cpu", compute_type="int8")
    return model

def transcribe(audio_path: str, model=None):
    if model is None:
        model = download_model()
    segments, info = model.transcribe(audio_path, beam_size=5)
    text = " ".join([seg.text for seg in segments])
    return text, info.language

if __name__ == "__main__":
    model = download_model()
    print("Whisper model loaded successfully!")
