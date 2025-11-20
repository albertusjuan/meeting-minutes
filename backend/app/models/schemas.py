"""
Pydantic models for the File Upload application.
"""

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    """Response after uploading a file."""

    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    file_size: int = Field(..., description="File size in bytes")
    message: str = Field(..., description="Success message")
    upload_path: str = Field(..., description="Path where file was saved")

