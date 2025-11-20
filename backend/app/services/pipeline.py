"""
Main pipeline orchestration for meeting processing.
Coordinates diarization, ASR, RAG, and LLM services.
"""

import logging
import uuid
from datetime import datetime
from pathlib import Path

from app.config import settings
from app.models.schemas import (
    MeetingResult,
    MeetingTranscript,
    SummaryResponse,
    TranscriptChunk,
)
from app.services.asr import get_asr_service
from app.services.diarization import get_diarization_service
from app.services.llm import get_llm_client
from app.services.rag import RagIndex, get_rag_service

logger = logging.getLogger(__name__)


class MeetingPipeline:
    """
    Orchestrates the full meeting processing pipeline:
    1. Diarization (who spoke when)
    2. ASR (transcription with language detection)
    3. RAG index building
    4. LLM summarization
    """

    def __init__(self):
        self.diarization_service = None
        self.asr_service = None
        self.rag_service = None
        self.llm_client = None
        self._initialized = False

    def initialize(self):
        """Initialize all required services."""
        if self._initialized:
            return

        logger.info("Initializing meeting pipeline services...")
        self.diarization_service = get_diarization_service()
        self.asr_service = get_asr_service()
        self.rag_service = get_rag_service()
        self.llm_client = get_llm_client()
        self._initialized = True
        logger.info("Pipeline services initialized")

    async def process_meeting_audio(
        self, audio_path: str | Path, meeting_id: str | None = None
    ) -> tuple[MeetingResult, RagIndex]:
        """
        Process a meeting audio file through the complete pipeline.

        Args:
            audio_path: Path to the audio file
            meeting_id: Optional meeting ID (generated if not provided)

        Returns:
            Tuple of (MeetingResult, RagIndex)
        """
        if not self._initialized:
            self.initialize()

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        meeting_id = meeting_id or self._generate_meeting_id()
        logger.info(f"Processing meeting {meeting_id}: {audio_path}")

        # Step 1: Run diarization
        logger.info("Step 1/5: Running speaker diarization...")
        speaker_segments = self.diarization_service.run_diarization(audio_path)
        logger.info(f"Found {len(speaker_segments)} speaker segments")

        # Step 2: Transcribe each segment with language detection
        logger.info("Step 2/5: Transcribing segments with language detection...")
        transcript_chunks = await self._transcribe_segments(audio_path, speaker_segments)
        logger.info(f"Transcribed {len(transcript_chunks)} chunks")

        # Step 3: Build transcript structure
        logger.info("Step 3/5: Building structured transcript...")
        duration = max(segment.end_time for segment in speaker_segments)
        speakers = sorted(set(segment.speaker_label for segment in speaker_segments))

        transcript = MeetingTranscript(
            meeting_id=meeting_id,
            chunks=transcript_chunks,
            speakers=speakers,
            duration=duration,
            created_at=datetime.utcnow(),
        )

        # Step 4: Build RAG index
        logger.info("Step 4/5: Building RAG index...")
        rag_index = self.rag_service.build_index(transcript_chunks)

        # Step 5: Generate summary
        logger.info("Step 5/5: Generating AI summary...")
        summary = await self.llm_client.summarize_meeting(transcript)

        # Create result
        result = MeetingResult(
            meeting_id=meeting_id,
            transcript=transcript,
            summary=summary,
            processed_at=datetime.utcnow(),
        )

        logger.info(f"Meeting {meeting_id} processing complete!")
        return result, rag_index

    async def _transcribe_segments(
        self, audio_path: Path, speaker_segments: list
    ) -> list[TranscriptChunk]:
        """
        Transcribe all speaker segments with language detection.

        Args:
            audio_path: Path to audio file
            speaker_segments: List of SpeakerSegment objects

        Returns:
            List of TranscriptChunk objects
        """
        chunks = []

        for idx, segment in enumerate(speaker_segments):
            try:
                # Transcribe segment with language detection
                text, language = self.asr_service.transcribe_segment(
                    audio_path, segment.start_time, segment.end_time
                )

                # Create chunk
                chunk = TranscriptChunk(
                    chunk_id=f"chunk_{idx:04d}",
                    speaker_label=segment.speaker_label,
                    start_time=segment.start_time,
                    end_time=segment.end_time,
                    text=text,
                    language=language,
                )

                chunks.append(chunk)

                # Log progress periodically
                if (idx + 1) % 10 == 0:
                    logger.info(f"Transcribed {idx + 1}/{len(speaker_segments)} segments")

            except Exception as e:
                logger.warning(
                    f"Failed to transcribe segment {idx} "
                    f"[{segment.start_time:.1f}s - {segment.end_time:.1f}s]: {e}"
                )
                # Create empty chunk for failed transcription
                chunks.append(
                    TranscriptChunk(
                        chunk_id=f"chunk_{idx:04d}",
                        speaker_label=segment.speaker_label,
                        start_time=segment.start_time,
                        end_time=segment.end_time,
                        text="[Transcription failed]",
                        language=None,
                    )
                )

        return chunks

    async def answer_question(
        self, rag_index: RagIndex, question: str, top_k: int = 5
    ) -> tuple[str, list[TranscriptChunk]]:
        """
        Answer a question using RAG over the transcript.

        Args:
            rag_index: The RAG index to query
            question: User's question
            top_k: Number of context chunks to retrieve

        Returns:
            Tuple of (answer, relevant_chunks)
        """
        if not self._initialized:
            self.initialize()

        logger.info(f"Answering question: {question[:50]}...")

        # Query RAG index for relevant chunks
        relevant_chunks = self.rag_service.query_index(rag_index, question, top_k=top_k)

        # Build context string
        context = "\n\n".join(chunk.to_context_string() for chunk in relevant_chunks)

        # Get answer from LLM
        answer = await self.llm_client.answer_question(context, question)

        return answer, relevant_chunks

    def save_meeting_data(
        self, meeting_id: str, result: MeetingResult, rag_index: RagIndex
    ) -> Path:
        """
        Save meeting data to disk.

        Args:
            meeting_id: Meeting identifier
            result: Meeting result to save
            rag_index: RAG index to save

        Returns:
            Path to saved data directory
        """
        meeting_dir = settings.storage_dir / meeting_id
        meeting_dir.mkdir(parents=True, exist_ok=True)

        # Save transcript as JSON
        transcript_path = meeting_dir / "transcript.json"
        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(result.transcript.model_dump_json(indent=2))

        # Save summary
        summary_path = meeting_dir / "summary.json"
        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(result.summary.model_dump_json(indent=2))

        # Save RAG index
        rag_index.save(meeting_dir / "rag_index")

        logger.info(f"Saved meeting data to {meeting_dir}")
        return meeting_dir

    def load_meeting_data(self, meeting_id: str) -> tuple[MeetingResult, RagIndex]:
        """
        Load meeting data from disk.

        Args:
            meeting_id: Meeting identifier

        Returns:
            Tuple of (MeetingResult, RagIndex)
        """
        meeting_dir = settings.storage_dir / meeting_id
        if not meeting_dir.exists():
            raise FileNotFoundError(f"Meeting data not found: {meeting_id}")

        # Load transcript
        transcript_path = meeting_dir / "transcript.json"
        with open(transcript_path, "r", encoding="utf-8") as f:
            transcript = MeetingTranscript.model_validate_json(f.read())

        # Load summary
        summary_path = meeting_dir / "summary.json"
        with open(summary_path, "r", encoding="utf-8") as f:
            summary = SummaryResponse.model_validate_json(f.read())

        # Create result
        result = MeetingResult(
            meeting_id=meeting_id,
            transcript=transcript,
            summary=summary,
            processed_at=datetime.utcnow(),
        )

        # Load RAG index
        rag_index = RagIndex.load(meeting_dir / "rag_index", self.rag_service.embedding_model)

        logger.info(f"Loaded meeting data from {meeting_dir}")
        return result, rag_index

    def _generate_meeting_id(self) -> str:
        """Generate a unique meeting ID."""
        return f"meeting_{uuid.uuid4().hex[:12]}"


# Global pipeline instance
_pipeline: MeetingPipeline | None = None


def get_pipeline() -> MeetingPipeline:
    """Get or create the global pipeline instance."""
    global _pipeline
    if _pipeline is None:
        _pipeline = MeetingPipeline()
        _pipeline.initialize()
    return _pipeline


async def process_meeting_audio(
    audio_path: str | Path, meeting_id: str | None = None
) -> tuple[MeetingResult, RagIndex]:
    """
    Convenience function to process a meeting audio file.

    Args:
        audio_path: Path to audio file
        meeting_id: Optional meeting ID

    Returns:
        Tuple of (MeetingResult, RagIndex)
    """
    pipeline = get_pipeline()
    return await pipeline.process_meeting_audio(audio_path, meeting_id)

