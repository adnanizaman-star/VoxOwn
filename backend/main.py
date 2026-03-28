import os
import logging
from contextlib import asynccontextmanager
from pathlib import Path

import aiofiles
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField, Session, create_engine, select

# ---------------------------------------------------------------------------
# Imports moved to top (were at bottom — bug #1)
# ---------------------------------------------------------------------------
from faster_whisper import WhisperModel

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("voxown")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
MODEL_PATH = Path("/home/node/voxown/models/large-v3")
UPLOAD_DIR = Path("./storage/uploads")
OUTPUT_DIR = Path("./storage/outputs")
DB_DIR = Path("./storage/database")
DATABASE_URL = f"sqlite:///{DB_DIR / 'voxown.db'}"
MODEL_PATH.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Database engine
# ---------------------------------------------------------------------------
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class TranscriptionJob(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    filename: str
    status: str = "pending"
    result: str | None = None
    error: str | None = None


# ---------------------------------------------------------------------------
# Pydantic request/response models
# ---------------------------------------------------------------------------
class CreateJobRequest(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)


class CreateJobResponse(BaseModel):
    job_id: int
    status: str


class JobStatusResponse(BaseModel):
    job_id: int
    status: str
    result: str | None
    error: str | None


# ---------------------------------------------------------------------------
# Whisper model (lazy-loaded on first transcription request)
# ---------------------------------------------------------------------------
_model: WhisperModel | None = None


def get_model() -> WhisperModel:
    global _model
    if _model is None:
        logger.info("Loading Whisper Large-V3 model (first transcription only)...")
        _model = WhisperModel("large-v3", download_root=str(MODEL_PATH), device="cpu", compute_type="int8")
        logger.info("Whisper model loaded successfully.")
    return _model


# ---------------------------------------------------------------------------
# Lifespan — startup / shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("VoxOwn API starting up...")
    for d in [DB_DIR, UPLOAD_DIR, OUTPUT_DIR]:
        d.mkdir(parents=True, exist_ok=True)
        logger.info(f"Directory ensured: {d}")

    # Validate DB connection
    try:
        SQLModel.metadata.create_all(engine)
        with Session(engine) as session:
            session.execute(select(1))
        logger.info("Database connection verified.")
    except Exception as exc:
        logger.error(f"Database connection failed: {exc}")
        raise

    yield  # shutdown

    # Shutdown
    logger.info("VoxOwn API shutting down.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="VoxOwn API", version="1.0.0", lifespan=lifespan)

# CORS — allow credentials requires explicit origin list; fixed from wildcard "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup event (backup — lifespan handles most)
# ---------------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    pass  # Lifespan handles everything now


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _safe_filename(filename: str) -> str:
    """Sanitize user-supplied filename to prevent path traversal."""
    filename = os.path.basename(filename)  # Remove any path components
    # Remove any remaining null bytes or control characters
    filename = "".join(c for c in filename if c.isprintable() or c in "._-")
    if not filename or filename.startswith("."):
        filename = f"file_{os.urandom(4).hex()}"
    return filename


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health", response_model=dict)
def health_check():
    """
    Health check — verifies DB and storage directories are accessible.
    """
    issues: list[str] = []

    # DB check
    try:
        with Session(engine) as session:
            session.execute(select(1))
    except Exception as exc:
        logger.error(f"Health check — DB failed: {exc}")
        issues.append("database")

    # Directory checks
    for d in [UPLOAD_DIR, OUTPUT_DIR]:
        if not d.exists():
            issues.append(f"directory:{d}")

    if issues:
        raise HTTPException(
            status_code=503,
            detail={"status": "degraded", "issues": issues},
        )
    return {"status": "ok", "service": "VoxOwn API", "version": "1.0.0"}


@app.post("/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a media file for transcription.
    Enforces a 500 MB limit.
    """
    MAX_SIZE = 500 * 1024 * 1024

    try:
        content = await file.read()
    except Exception as exc:
        logger.error(f"Failed to read uploaded file: {exc}")
        raise HTTPException(status_code=400, detail="Failed to read uploaded file.")

    size = len(content)
    if size > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_SIZE // (1024*1024)} MB.",
        )
    if size == 0:
        raise HTTPException(status_code=400, detail="Empty file.")

    safe_name = _safe_filename(file.filename)
    file_path = UPLOAD_DIR / safe_name

    try:
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
    except Exception as exc:
        logger.error(f"Failed to write file {file_path}: {exc}")
        raise HTTPException(status_code=500, detail="Failed to save file.")

    logger.info(f"File uploaded: {safe_name} ({size} bytes)")
    return {"filename": safe_name, "size": size, "path": str(file_path)}


@app.post("/transcribe", response_model=CreateJobResponse, status_code=201)
def create_transcribe_job(body: CreateJobRequest):
    """
    Create a new transcription job.
    The filename should match an already-uploaded file in storage/uploads.
    """
    safe_name = _safe_filename(body.filename)
    upload_path = UPLOAD_DIR / safe_name
    if not upload_path.exists():
        raise HTTPException(status_code=404, detail="File not found in storage.")

    with Session(engine) as session:
        job = TranscriptionJob(filename=safe_name, status="pending")
        session.add(job)
        session.commit()
        session.refresh(job)
        logger.info(f"Transcription job created: id={job.id}, filename={safe_name}")
        return CreateJobResponse(job_id=job.id, status=job.status)


@app.get("/transcribe/{job_id}", response_model=JobStatusResponse)
def get_transcribe_job(job_id: int):
    """Retrieve the status/result of a transcription job."""
    with Session(engine) as session:
        job = session.get(TranscriptionJob, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return JobStatusResponse(
            job_id=job.id,
            status=job.status,
            result=job.result,
            error=job.error,
        )


@app.post("/transcribe/{job_id}/run", response_model=JobStatusResponse)
def run_transcribe_job(job_id: int):
    """
    Trigger the actual Whisper transcription for a job.
    Updates job status to 'processing', then 'done' or 'error'.
    """
    with Session(engine) as session:
        job = session.get(TranscriptionJob, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        if job.status not in ("pending", "error"):
            raise HTTPException(status_code=409, detail=f"Job is already {job.status}")

        job.status = "processing"
        session.add(job)
        session.commit()

    audio_path = UPLOAD_DIR / job.filename
    try:
        logger.info(f"Starting transcription for job {job_id}: {job.filename}")
        model = get_model()
        segments, info = model.transcribe(str(audio_path), beam_size=5)
        text = " ".join(seg.text for seg in segments)

        with Session(engine) as session:
            job = session.get(TranscriptionJob, job_id)
            job.status = "done"
            job.result = text
            session.add(job)
            session.commit()

        logger.info(f"Transcription complete for job {job_id}")
        return JobStatusResponse(job_id=job.id, status="done", result=text, error=None)

    except Exception as exc:
        logger.error(f"Transcription failed for job {job_id}: {exc}")
        with Session(engine) as session:
            job = session.get(TranscriptionJob, job_id)
            job.status = "error"
            job.error = str(exc)
            session.add(job)
            session.commit()
        raise HTTPException(status_code=500, detail=f"Transcription failed: {exc}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
