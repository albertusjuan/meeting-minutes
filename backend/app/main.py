"""
FastAPI application entry point.
Main application setup with routes and middleware.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import meeting

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("Starting File Upload API...")
    logger.info(f"Upload directory: {settings.upload_dir}")
    logger.info(f"Max file size: {settings.max_file_size_mb}MB")

    yield

    # Shutdown
    logger.info("Shutting down File Upload API...")


# Create FastAPI app
app = FastAPI(
    title="File Upload API",
    description="Simple file upload system for audio files.",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meeting.router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "File Upload API",
        "version": "0.1.0",
        "status": "running",
        "endpoints": {
            "upload": "/upload/",
            "list_files": "/upload/files",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )

