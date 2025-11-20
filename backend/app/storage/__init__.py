"""
Storage layer for meetings and indices.
Provides in-memory storage for Stage 1 (can be replaced with DB later).
"""

import logging
from typing import Dict

from app.models.schemas import MeetingResult
from app.services.rag import RagIndex

logger = logging.getLogger(__name__)


class MeetingStorage:
    """
    In-memory storage for meeting results and RAG indices.
    For Stage 1 local development.
    """

    def __init__(self):
        self._meetings: Dict[str, MeetingResult] = {}
        self._indices: Dict[str, RagIndex] = {}

    def store_meeting(self, meeting_id: str, result: MeetingResult, index: RagIndex):
        """Store a meeting result and its RAG index."""
        self._meetings[meeting_id] = result
        self._indices[meeting_id] = index
        logger.info(f"Stored meeting {meeting_id} in memory")

    def get_meeting(self, meeting_id: str) -> MeetingResult | None:
        """Retrieve a meeting result."""
        return self._meetings.get(meeting_id)

    def get_index(self, meeting_id: str) -> RagIndex | None:
        """Retrieve a RAG index."""
        return self._indices.get(meeting_id)

    def list_meetings(self) -> list[str]:
        """List all stored meeting IDs."""
        return list(self._meetings.keys())

    def has_meeting(self, meeting_id: str) -> bool:
        """Check if a meeting exists."""
        return meeting_id in self._meetings


# Global storage instance
_storage: MeetingStorage | None = None


def get_storage() -> MeetingStorage:
    """Get or create the global storage instance."""
    global _storage
    if _storage is None:
        _storage = MeetingStorage()
    return _storage

