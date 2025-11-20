"""
API routes for meeting upload and question answering.
"""

import logging
import shutil
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.models.schemas import QARequest, QAResponse, UploadResponse
from app.services.pipeline import get_pipeline
from app.storage import get_storage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("/upload", response_model=UploadResponse)
async def upload_meeting(
    file: Annotated[UploadFile, File(description="Meeting audio file")],
):
    """
    Upload and process a meeting audio file.

    This endpoint:
    1. Saves the uploaded audio file
    2. Runs diarization to identify speakers
    3. Transcribes each segment with language detection (Cantonese/English)
    4. Builds a RAG index over the transcript
    5. Generates an AI summary with action items and key decisions

    Returns the meeting ID, transcript preview, and summary.
    """
    logger.info(f"Received upload: {file.filename}")

    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    # Save uploaded file
    try:
        upload_path = settings.upload_dir / file.filename
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"Saved upload to {upload_path}")

    except Exception as e:
        logger.error(f"Failed to save upload: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Process the meeting
    try:
        pipeline = get_pipeline()
        result, rag_index = await pipeline.process_meeting_audio(upload_path)

        # Store in memory
        storage = get_storage()
        storage.store_meeting(result.meeting_id, result, rag_index)

        # Also save to disk
        pipeline.save_meeting_data(result.meeting_id, result, rag_index)

        # Generate preview (first 3 chunks)
        preview_chunks = result.transcript.chunks[:3]
        preview = "\n".join(chunk.to_context_string() for chunk in preview_chunks)
        if len(result.transcript.chunks) > 3:
            preview += f"\n... ({len(result.transcript.chunks) - 3} more chunks)"

        return UploadResponse(
            meeting_id=result.meeting_id,
            message="Meeting processed successfully",
            transcript_preview=preview,
            summary=result.summary,
        )

    except Exception as e:
        logger.error(f"Failed to process meeting: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to process meeting: {str(e)}"
        )


@router.post("/qa/{meeting_id}", response_model=QAResponse)
async def ask_question(meeting_id: str, request: QARequest):
    """
    Ask a question about a specific meeting using RAG.

    The system will:
    1. Find the most relevant parts of the transcript
    2. Use an LLM to generate an answer based on that context

    The answer will cite relevant transcript chunks with timestamps.
    """
    logger.info(f"Question for meeting {meeting_id}: {request.question}")

    # Get meeting from storage
    storage = get_storage()

    # Try memory first
    meeting = storage.get_meeting(meeting_id)
    rag_index = storage.get_index(meeting_id)

    # If not in memory, try loading from disk
    if meeting is None or rag_index is None:
        try:
            pipeline = get_pipeline()
            meeting, rag_index = pipeline.load_meeting_data(meeting_id)
            # Store in memory for future queries
            storage.store_meeting(meeting_id, meeting, rag_index)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail=f"Meeting {meeting_id} not found")
        except Exception as e:
            logger.error(f"Failed to load meeting: {e}")
            raise HTTPException(status_code=500, detail="Failed to load meeting data")

    # Answer the question
    try:
        pipeline = get_pipeline()
        top_k = request.top_k or settings.rag_top_k

        answer, context_chunks = await pipeline.answer_question(
            rag_index, request.question, top_k=top_k
        )

        return QAResponse(
            question=request.question,
            answer=answer,
            context_chunks=context_chunks,
        )

    except Exception as e:
        logger.error(f"Failed to answer question: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")


@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str):
    """
    Get meeting details including transcript and summary.
    """
    storage = get_storage()
    meeting = storage.get_meeting(meeting_id)

    if meeting is None:
        # Try loading from disk
        try:
            pipeline = get_pipeline()
            meeting, rag_index = pipeline.load_meeting_data(meeting_id)
            storage.store_meeting(meeting_id, meeting, rag_index)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail=f"Meeting {meeting_id} not found")

    return {
        "meeting_id": meeting.meeting_id,
        "transcript": meeting.transcript,
        "summary": meeting.summary,
        "processed_at": meeting.processed_at,
    }


@router.get("/")
async def list_meetings():
    """
    List all processed meetings.
    """
    storage = get_storage()
    meeting_ids = storage.list_meetings()

    # Also check disk for meetings not in memory
    disk_meetings = []
    if settings.storage_dir.exists():
        for meeting_dir in settings.storage_dir.iterdir():
            if meeting_dir.is_dir() and meeting_dir.name.startswith("meeting_"):
                if meeting_dir.name not in meeting_ids:
                    disk_meetings.append(meeting_dir.name)

    all_meetings = meeting_ids + disk_meetings

    return {
        "total": len(all_meetings),
        "meetings": all_meetings,
    }

