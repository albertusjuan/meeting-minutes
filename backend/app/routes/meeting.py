"""
API routes for file upload.
"""

import logging
import shutil
import uuid
from typing import Annotated
from datetime import datetime

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.models.schemas import UploadResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/", response_model=UploadResponse)
async def upload_file(
    file: Annotated[UploadFile, File(description="Audio file to upload")],
):
    """
    Upload an audio file.

    This endpoint:
    1. Validates the uploaded file
    2. Saves it to the uploads directory
    3. Returns file information

    Args:
        file: Audio file to upload

    Returns the file ID, filename, size, and upload path.
    """
    logger.info(f"========================================")
    logger.info(f"📤 RECEIVED UPLOAD REQUEST")
    logger.info(f"File: {file.filename}")
    logger.info(f"Content-Type: {file.content_type}")
    
    # Log file size
    try:
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        logger.info(f"File Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")
        
        # Check file size limit
        max_size = settings.max_file_size_mb * 1024 * 1024
        if file_size > max_size:
            raise HTTPException(
                status_code=400, 
                detail=f"File size exceeds maximum allowed size of {settings.max_file_size_mb}MB"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Could not determine file size: {e}")
        file_size = 0
    
    logger.info(f"========================================")

    # Validate file type
    if not file.filename:
        logger.error("❌ No filename provided")
        raise HTTPException(status_code=400, detail="Filename is required")

    # Validate file extension
    allowed_extensions = ['.wav', '.mp3', '.m4a', '.flac']
    file_ext = None
    for ext in allowed_extensions:
        if file.filename.lower().endswith(ext):
            file_ext = ext
            break
    
    if not file_ext:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )

    # Generate unique file ID
    file_id = f"file_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
    
    # Save uploaded file with unique name
    safe_filename = f"{file_id}{file_ext}"
    upload_path = settings.upload_dir / safe_filename
    
    try:
        logger.info(f"💾 Saving file to {upload_path}...")
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"✅ File saved successfully: {upload_path}")

        return UploadResponse(
            file_id=file_id,
            filename=file.filename,
            file_size=file_size,
            message="File uploaded successfully",
            upload_path=str(upload_path),
        )

    except Exception as e:
        logger.error(f"Failed to save upload: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


@router.get("/files")
async def list_files():
    """
    List all uploaded files.
    """
    try:
        files = []
        if settings.upload_dir.exists():
            for file_path in settings.upload_dir.iterdir():
                if file_path.is_file():
                    files.append({
                        "filename": file_path.name,
                        "size": file_path.stat().st_size,
                        "uploaded_at": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                    })
        
        return {
            "total": len(files),
            "files": sorted(files, key=lambda x: x['uploaded_at'], reverse=True),
        }
    except Exception as e:
        logger.error(f"Failed to list files: {e}")
        raise HTTPException(status_code=500, detail="Failed to list files")

