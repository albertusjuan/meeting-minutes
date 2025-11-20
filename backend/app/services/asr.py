"""
Automatic Speech Recognition (ASR) service using Whisper.
Supports multi-language transcription with Cantonese and English code-switching.
"""

import logging
from pathlib import Path

import librosa
import soundfile as sf
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

from app.config import settings

logger = logging.getLogger(__name__)


class ASRService:
    """
    ASR service using simonl0909/whisper-large-v2-cantonese.
    Handles Cantonese + English code-switching with automatic language detection.
    """

    def __init__(self):
        self.model = None
        self.processor = None
        self.pipe = None
        self._initialized = False

    def initialize(self):
        """Load and initialize the ASR model."""
        if self._initialized:
            return

        logger.info(f"Loading ASR model: {settings.asr_model}")
        try:
            device = settings.torch_device
            torch_dtype = torch.float16 if "cuda" in device else torch.float32

            # Load model and processor
            self.model = AutoModelForSpeechSeq2Seq.from_pretrained(
                settings.asr_model,
                torch_dtype=torch_dtype,
                low_cpu_mem_usage=True,
                use_safetensors=True,
                token=settings.huggingface_token,
            )
            self.model.to(device)

            self.processor = AutoProcessor.from_pretrained(
                settings.asr_model, token=settings.huggingface_token
            )

            # Create pipeline
            self.pipe = pipeline(
                "automatic-speech-recognition",
                model=self.model,
                tokenizer=self.processor.tokenizer,
                feature_extractor=self.processor.feature_extractor,
                torch_dtype=torch_dtype,
                device=device,
                return_timestamps=True,
            )

            self._initialized = True
            logger.info("ASR pipeline loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load ASR pipeline: {e}")
            raise

    def _extract_audio_segment(
        self, audio_path: str | Path, start: float, end: float, temp_dir: Path
    ) -> Path:
        """
        Extract a time segment from an audio file.

        Args:
            audio_path: Path to the full audio file
            start: Start time in seconds
            end: End time in seconds
            temp_dir: Directory to save temporary segment file

        Returns:
            Path to the extracted segment
        """
        audio_path = Path(audio_path)
        temp_dir.mkdir(parents=True, exist_ok=True)

        # Load audio with librosa
        y, sr = librosa.load(str(audio_path), sr=16000, mono=True)

        # Extract segment
        start_sample = int(start * sr)
        end_sample = int(end * sr)
        segment = y[start_sample:end_sample]

        # Save segment
        segment_path = temp_dir / f"segment_{start:.2f}_{end:.2f}.wav"
        sf.write(str(segment_path), segment, sr)

        return segment_path

    def transcribe_segment(
        self, audio_path: str | Path, start: float, end: float
    ) -> tuple[str, str]:
        """
        Transcribe a specific time segment from an audio file.
        Supports automatic language detection for Cantonese/English code-switching.

        Args:
            audio_path: Path to the audio file
            start: Start time in seconds
            end: End time in seconds

        Returns:
            Tuple of (transcribed_text, detected_language_code)
        """
        if not self._initialized:
            self.initialize()

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        try:
            # Extract the segment to a temporary file
            temp_dir = settings.storage_dir / "temp"
            segment_path = self._extract_audio_segment(audio_path, start, end, temp_dir)

            # Transcribe with automatic language detection
            # Setting language=None enables automatic detection
            result = self.pipe(
                str(segment_path),
                generate_kwargs={
                    "task": "transcribe",
                    "language": None,  # Auto-detect language
                },
                return_timestamps=False,
            )

            # Extract text
            text = result["text"].strip() if isinstance(result, dict) else result.strip()

            # Attempt to detect language from the result
            # Whisper may include language info in metadata
            detected_language = self._detect_language(text)

            # Clean up temporary file
            segment_path.unlink(missing_ok=True)

            logger.debug(
                f"Transcribed [{start:.1f}s - {end:.1f}s]: {text[:50]}... "
                f"(language: {detected_language})"
            )

            return text, detected_language

        except Exception as e:
            logger.error(f"Transcription failed for segment {start}-{end}: {e}")
            raise

    def transcribe_full_audio(self, audio_path: str | Path) -> dict:
        """
        Transcribe an entire audio file without segmentation.
        Useful for getting timestamps and language info.

        Args:
            audio_path: Path to the audio file

        Returns:
            Dictionary with transcription results including timestamps
        """
        if not self._initialized:
            self.initialize()

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        logger.info(f"Transcribing full audio: {audio_path}")

        try:
            result = self.pipe(
                str(audio_path),
                generate_kwargs={
                    "task": "transcribe",
                    "language": None,  # Auto-detect
                },
                return_timestamps=True,
            )

            return result

        except Exception as e:
            logger.error(f"Full audio transcription failed: {e}")
            raise

    def _detect_language(self, text: str) -> str:
        """
        Simple heuristic to detect if text is primarily Cantonese or English.

        Args:
            text: The transcribed text

        Returns:
            Language code: 'zh' for Cantonese, 'en' for English, 'mixed' for both
        """
        if not text:
            return "unknown"

        # Count Chinese characters vs ASCII
        chinese_chars = sum(1 for char in text if "\u4e00" <= char <= "\u9fff")
        ascii_chars = sum(1 for char in text if char.isascii() and char.isalpha())
        total_chars = chinese_chars + ascii_chars

        if total_chars == 0:
            return "unknown"

        chinese_ratio = chinese_chars / total_chars

        if chinese_ratio > 0.7:
            return "zh"  # Cantonese/Chinese
        elif chinese_ratio < 0.3:
            return "en"  # English
        else:
            return "mixed"  # Code-switching


# Global service instance
_asr_service: ASRService | None = None


def get_asr_service() -> ASRService:
    """Get or create the global ASR service instance."""
    global _asr_service
    if _asr_service is None:
        _asr_service = ASRService()
        _asr_service.initialize()
    return _asr_service


def transcribe_segment(audio_path: str | Path, start: float, end: float) -> tuple[str, str]:
    """
    Convenience function to transcribe a segment.

    Args:
        audio_path: Path to audio file
        start: Start time in seconds
        end: End time in seconds

    Returns:
        Tuple of (text, language_code)
    """
    service = get_asr_service()
    return service.transcribe_segment(audio_path, start, end)

