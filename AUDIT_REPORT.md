# VoxOwn Security & Code Quality Audit Report

**Date:** 2026-03-28
**Auditor:** voxown-auditor (subagent)
**Scope:** Backend code (`/home/node/voxown/backend/`)

---

## Executive Summary

The backend is a minimal FastAPI app with file upload and a placeholder transcription job system. It has **no actual transcription integration**, significant security gaps, and architectural limitations that prevent it from functioning as a production async job processing system.

---

## Backend Findings

### 🔴 CRITICAL

#### 1. Path Traversal in File Upload
- **File:** `backend/main.py`, line ~37
- **Description:** `os.path.join(upload_dir, file.filename)` does NOT sanitize filenames. A malicious filename like `../../../etc/passwd` or `../../app.py` could overwrite system files.
- **Recommended Fix:**
  ```python
  # Sanitize filename — strip path components, keep only basename
  safe_filename = os.path.basename(file.filename)
  if not safe_filename:
      raise HTTPException(status_code=400, detail="Invalid filename")
  file_path = os.path.join(upload_dir, safe_filename)
  ```

---

### 🟠 HIGH

#### 2. No File Type / MIME Validation on Upload
- **File:** `backend/main.py`, line ~35-42
- **Description:** Any file type can be uploaded. An attacker could upload executables, scripts, or malware. No content-type validation, no magic byte checking, no extension allowlist.
- **Recommended Fix:** Validate MIME type and/or check file magic bytes. Maintain an allowlist of permitted audio types (`.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg`, `.webm`).

#### 3. Transcription Never Executes
- **File:** `backend/main.py`, lines ~53-76; `backend/transcribe.py`
- **Description:** `create_transcribe_job()` creates a DB record with `status="pending"` but **never actually calls the transcription logic**. `transcribe.py` defines a `transcribe()` function but it is never imported or invoked by the API. The entire Whisper integration is dead code.
- **Recommended Fix:** Integrate `transcribe.py` via a proper task queue (Celery/Redis) or BackgroundTasks. Do NOT run transcription synchronously in the request handler.

#### 4. No Authentication / Authorization
- **File:** `backend/main.py` (entire API)
- **Description:** All endpoints (`/upload`, `/transcribe`, `/transcribe/{job_id}`) are completely unauthenticated. Anyone can upload files, create jobs, or read results.
- **Recommended Fix:** Add API key auth, JWT tokens, or session-based auth. At minimum, add an API key middleware.

#### 5. No File Size Limit
- **File:** `backend/main.py`, line ~40
- **Description:** `content = await file.read()` reads the entire uploaded file into memory with no size cap. A large file upload could cause OOM.
- **Recommended Fix:** Use `fastapi.UploadFile` with explicit `max_size` or stream to disk with a size limit:
  ```python
  MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB
  content = await file.read()
  if len(content) > MAX_FILE_SIZE:
      raise HTTPException(status_code=413, detail="File too large")
  ```

---

### 🟡 MEDIUM

#### 6. Synchronous DB Operations Block Async Event Loop
- **File:** `backend/main.py`, lines ~57-65, ~68-76
- **Description:** `with Session(engine)` and `session.get()` are synchronous SQLAlchemy calls inside `async` FastAPI handlers. This blocks the event loop.
- **Recommended Fix:** Use `run_in_thread_pool()` wrapper or switch to an async database driver (e.g., `asyncpg` + `SQLModel` async session, or `databases`).

#### 7. No Rate Limiting
- **File:** `backend/main.py`
- **Description:** No rate limiting on any endpoint. `/upload` and `/transcribe` are vulnerable to DoS/abuse.
- **Recommended Fix:** Add `slowapi` or similar rate limiter (e.g., 10 uploads/min per IP).

#### 8. SQLite with `check_same_thread=False` — Concurrency Risk
- **File:** `backend/main.py`, line ~17
- **Description:** `connect_args={"check_same_thread": False}` disables SQLite's thread safety check. With async workers, this can cause database locking errors or corruption under concurrent load.
- **Recommended Fix:** Use a proper production database (PostgreSQL) for concurrent access. If SQLite is required for local-first, use a connection pool and proper locking.

#### 9. CORS Restricts to localhost Only (Not Production-Ready)
- **File:** `backend/main.py`, lines ~10-14
- **Description:** CORS is hardcoded to `localhost:3000` only. Once deployed, the frontend URL will differ. This will break production deployments.
- **Recommended Fix:** Make `allow_origins` configurable via environment variable.

#### 10. No Error Handling in File Write
- **File:** `backend/main.py`, lines ~36-42
- **Description:** If `aiofiles.open()` or `f.write()` fails, there is no try/except, no cleanup of partial files, and the user gets a 500 error with no useful info.
- **Recommended Fix:** Wrap in try/except, clean up on failure.

#### 11. Duplicate Import
- **File:** `backend/main.py`, line ~4
- **Description:** `SQLModel` is imported twice: `from sqlmodel import SQLModel, Field, Session, SQLModel, create_engine, select` — `SQLModel` appears twice.
- **Recommended Fix:** Remove duplicate.

---

### 🟢 LOW

#### 12. No Background Job Processing Architecture
- **File:** `backend/main.py` (overall architecture)
- **Description:** The transcription pipeline has no worker process. Jobs stay `pending` forever. The architecture cannot scale to async job processing without significant refactoring.
- **Recommended Fix:** Add Celery + Redis. `create_transcribe_job` should enqueue a task, a Celery worker should call `transcribe.py:transcribe()`, and update job status via result backend.

#### 13. No `requirements.txt`
- **File:** `backend/` (missing file)
- **Description:** No `requirements.txt` or `pyproject.toml` exists. Dependencies are untracked and unpinned.
- **Recommended Fix:** Create `requirements.txt` with pinned versions:
  ```
  fastapi>=0.109.0
  uvicorn[standard]>=0.27.0
  sqlmodel>=0.0.14
  aiofiles>=23.0.0
  faster-whisper>=1.0.0
  ```

#### 14. Redundant `if __name__ == "__main__"` Block in main.py
- **File:** `backend/main.py`, line ~78
- **Description:** The `if __name__ == "__main__"` block loads the Whisper model and prints, but this code is unreachable when running via `uvicorn.run()` because the imports at the top already load `faster_whisper`. The model download/transcribe code is dead code in this file.
- **Recommended Fix:** Remove the second `if __name__ == "__main__"` block (the first one at line ~78 exits before reaching this). Or better, move Whisper logic entirely to `transcribe.py` and import it.

#### 15. Model Downloaded at Import Time
- **File:** `backend/main.py`, lines ~79-85
- **Description:** `from faster_whisper import WhisperModel` at the module level causes model download on first import, even if transcription endpoints are never called. This blocks startup and is wasteful.
- **Recommended Fix:** Lazy-load the model inside the transcription function only, not at module import time.

#### 16. `device="cpu"` — Not Leveraging GPU
- **File:** `backend/transcribe.py`, line ~11; `backend/main.py` not applicable (transcribe not integrated)
- **Description:** `device="cpu"` ignores GPU acceleration. Whisper on CPU is significantly slower than on CUDA.
- **Recommended Fix:** Make device configurable. Default to CUDA if available, fall back to CPU.

---

## Frontend Findings

**Status:** Frontend directory exists (`/home/node/voxown/frontend/`) but contains only `SPEC.md` — no source code committed yet. Full frontend audit will be performed once `voxown-ux` commits source files.

**Preliminary Concern:** The `SPEC.md` notes the frontend will make API calls. Once committed, must verify:
- No hardcoded API keys or secrets in client-side code
- XSS sanitization for any user-facing transcription results
- CORS-compatible API base URL configuration

---

## Severity Summary

| # | Severity | Issue |
|---|----------|-------|
| 1 | 🔴 Critical | Path traversal in file upload |
| 2 | 🟠 High | No file type validation |
| 3 | 🟠 High | Transcription never executes |
| 4 | 🟠 High | No authentication |
| 5 | 🟠 High | No file size limit |
| 6 | 🟡 Medium | Sync DB in async handler |
| 7 | 🟡 Medium | No rate limiting |
| 8 | 🟡 Medium | SQLite concurrency issues |
| 9 | 🟡 Medium | Hardcoded CORS origins |
| 10 | 🟡 Medium | No error handling in file write |
| 11 | 🟡 Medium | Duplicate import |
| 12 | 🟢 Low | No async job architecture |
| 13 | 🟢 Low | No requirements.txt |
| 14 | 🟢 Low | Dead code in main.py |
| 15 | 🟢 Low | Model loaded at import time |
| 16 | 🟢 Low | CPU-only transcription |

---

## Recommended Priority Fix Order

1. **Fix path traversal** (Critical — security)
2. **Add authentication** (High — security)
3. **Add file type + size validation** (High — security + DoS)
4. **Integrate actual transcription via Celery/Redis** (High — missing functionality)
5. **Create requirements.txt** (Medium — dependency hygiene)
6. **Fix sync DB in async handlers** (Medium — stability)
7. **Add error handling** (Medium — robustness)
8. **Add rate limiting** (Medium — DoS protection)
9. **Externalize CORS origins** (Medium — deployability)
10. **Add frontend security audit** (once frontend is committed)
