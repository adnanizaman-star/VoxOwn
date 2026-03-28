from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, SQLModel, create_engine, select
from typing import Optional
import os
import aiofiles

app = FastAPI(title="VoxOwn API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
DATABASE_URL = "sqlite:///./storage/database/voxown.db"
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    os.makedirs("./storage/database", exist_ok=True)
    os.makedirs("./storage/uploads", exist_ok=True)
    os.makedirs("./storage/outputs", exist_ok=True)
    create_db_and_tables()

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "VoxOwn API", "version": "1.0.0"}

# File upload
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    upload_dir = "./storage/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    return {"filename": file.filename, "size": len(content), "path": file_path}

# Transcription job model
class TranscriptionJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    status: str = "pending"  # pending, processing, done, error
    result: Optional[str] = None
    error: Optional[str] = None

@app.post("/transcribe")
async def create_transcribe_job(filename: str):
    with Session(engine) as session:
        job = TranscriptionJob(filename=filename, status="pending")
        session.add(job)
        session.commit()
        session.refresh(job)
        return {"job_id": job.id, "status": job.status}

@app.get("/transcribe/{job_id}")
def get_transcribe_job(job_id: int):
    with Session(engine) as session:
        job = session.get(TranscriptionJob, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"job_id": job.id, "status": job.status, "result": job.result, "error": job.error}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
