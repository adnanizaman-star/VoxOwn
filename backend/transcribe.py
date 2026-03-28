import os
import logging
from faster_whisper import WhisperModel

logger = logging.getLogger("voxown")

MODEL_PATH = "/home/node/voxown/models/large-v3"
os.makedirs(MODEL_PATH, exist_ok=True)


def download_model() -> WhisperModel:
    logger.info("Loading Whisper Large-V3 model...")
    model = WhisperModel(
        "large-v3",
        download_root=MODEL_PATH,
        device="cpu",
        compute_type="int8",
    )
    return model


def transcribe(audio_path: str, model: WhisperModel | None = None) -> tuple[str, str]:
    """
    Transcribe an audio file using Whisper.

    Returns:
        (transcribed_text, language)
    """
    if model is None:
        model = download_model()

    segments, info = model.transcribe(audio_path, beam_size=5)
    text = " ".join(seg.text for seg in segments)
    return text, info.language
