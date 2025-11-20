"""
Speaker diarization service using pyannote.audio.
Identifies who is speaking when in an audio file.
"""

import logging
from pathlib import Path

from pyannote.audio import Pipeline

from app.config import settings
from app.models.schemas import SpeakerSegment

logger = logging.getLogger(__name__)


class DiarizationService:
    """Service for speaker diarization using pyannote/speaker-diarization-3.1."""

    def __init__(self):
        self.pipeline: Pipeline | None = None
        self._initialized = False

    def initialize(self):
        """Load and initialize the diarization pipeline."""
        if self._initialized:
            return

        logger.info(f"Loading diarization model: {settings.diarization_model}")
        try:
            # Load the diarization pipeline with authentication
            self.pipeline = Pipeline.from_pretrained(
                settings.diarization_model,
                use_auth_token=settings.huggingface_token,
            )

            # Move to appropriate device
            if settings.device == "cuda":
                import torch

                self.pipeline.to(torch.device(settings.torch_device))

            self._initialized = True
            logger.info("Diarization pipeline loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load diarization pipeline: {e}")
            raise

    def run_diarization(self, audio_path: str | Path) -> list[SpeakerSegment]:
        """
        Run speaker diarization on an audio file.

        Args:
            audio_path: Path to the audio file

        Returns:
            List of SpeakerSegment objects with speaker labels and timestamps
        """
        if not self._initialized:
            self.initialize()

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        logger.info(f"Running diarization on: {audio_path}")

        try:
            # Run the diarization pipeline
            diarization = self.pipeline(str(audio_path))

            # Convert to list of SpeakerSegment
            segments = []
            for turn, _, speaker in diarization.itertracks(yield_label=True):
                segment = SpeakerSegment(
                    speaker_label=speaker,
                    start_time=turn.start,
                    end_time=turn.end,
                )
                segments.append(segment)

            logger.info(f"Diarization complete: found {len(segments)} segments")
            return segments

        except Exception as e:
            logger.error(f"Diarization failed: {e}")
            raise


# Global service instance
_diarization_service: DiarizationService | None = None


def get_diarization_service() -> DiarizationService:
    """Get or create the global diarization service instance."""
    global _diarization_service
    if _diarization_service is None:
        _diarization_service = DiarizationService()
        _diarization_service.initialize()
    return _diarization_service


def run_diarization(audio_path: str | Path) -> list[SpeakerSegment]:
    """
    Convenience function to run diarization.

    Args:
        audio_path: Path to audio file

    Returns:
        List of speaker segments with timestamps
    """
    service = get_diarization_service()
    return service.run_diarization(audio_path)

