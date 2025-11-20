"""
LLM client abstraction and implementations.
Provides a generic interface for calling various LLM providers.
"""

import logging
from abc import ABC, abstractmethod
from typing import Protocol

from openai import AsyncOpenAI

from app.config import settings
from app.models.schemas import MeetingTranscript, SummaryResponse

logger = logging.getLogger(__name__)


class LLMClient(Protocol):
    """Protocol defining the LLM client interface."""

    async def summarize_meeting(self, transcript: MeetingTranscript) -> SummaryResponse:
        """Generate a comprehensive summary of the meeting."""
        ...

    async def answer_question(self, transcript_context: str, question: str) -> str:
        """Answer a question based on provided transcript context."""
        ...


class OpenAILLMClient:
    """
    LLM client implementation using OpenAI's API.
    Supports GPT-4 and other OpenAI models.
    """

    def __init__(self, api_key: str | None = None, model: str | None = None):
        """
        Initialize OpenAI client.

        Args:
            api_key: OpenAI API key (defaults to settings)
            model: Model name (defaults to settings)
        """
        self.api_key = api_key or settings.openai_api_key
        if not self.api_key:
            raise ValueError("OpenAI API key not provided")

        self.model = model or settings.llm_model
        self.client = AsyncOpenAI(api_key=self.api_key)
        logger.info(f"Initialized OpenAI client with model: {self.model}")

    async def summarize_meeting(self, transcript: MeetingTranscript) -> SummaryResponse:
        """
        Generate a comprehensive meeting summary using LLM.

        Args:
            transcript: The meeting transcript to summarize

        Returns:
            SummaryResponse with summary, action items, and key decisions
        """
        logger.info(f"Generating summary for meeting: {transcript.meeting_id}")

        # Prepare the transcript text
        full_text = transcript.get_full_text()
        speaker_info = transcript.get_speaker_turns()

        # Build the prompt
        prompt = self._build_summary_prompt(full_text, speaker_info, transcript.duration)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert meeting analyst. Your task is to analyze "
                            "meeting transcripts and provide clear, actionable summaries. "
                            "The transcript may contain multiple languages including "
                            "Cantonese and English."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=2000,
            )

            # Parse the response
            content = response.choices[0].message.content
            summary = self._parse_summary_response(content)

            logger.info("Summary generated successfully")
            return summary

        except Exception as e:
            logger.error(f"Failed to generate summary: {e}")
            raise

    async def answer_question(self, transcript_context: str, question: str) -> str:
        """
        Answer a question based on transcript context using RAG.

        Args:
            transcript_context: Relevant transcript chunks as context
            question: User's question

        Returns:
            Generated answer
        """
        logger.info(f"Answering question: {question[:50]}...")

        prompt = self._build_qa_prompt(transcript_context, question)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful assistant that answers questions about "
                            "meeting transcripts. Base your answers strictly on the "
                            "provided context. If the answer is not in the context, "
                            "say so. The transcript may contain Cantonese and English."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=1000,
            )

            answer = response.choices[0].message.content or "No answer generated."
            logger.info("Question answered successfully")
            return answer

        except Exception as e:
            logger.error(f"Failed to answer question: {e}")
            raise

    def _build_summary_prompt(
        self, transcript: str, speaker_info: dict[str, int], duration: float
    ) -> str:
        """Build the prompt for meeting summarization."""
        duration_min = duration / 60

        speaker_list = ", ".join(
            f"{speaker} ({turns} turns)" for speaker, turns in speaker_info.items()
        )

        return f"""Please analyze the following meeting transcript and provide:

1. **Summary**: A concise 1-2 paragraph overview of the meeting
2. **Action Items**: A bulleted list of specific action items and who should do them
3. **Key Decisions**: A bulleted list of important decisions made
4. **Topics**: Main topics or themes discussed

**Meeting Info:**
- Duration: {duration_min:.1f} minutes
- Speakers: {speaker_list}

**Transcript:**
{transcript}

**Format your response as:**

SUMMARY:
[Your summary here]

ACTION ITEMS:
- [Action item 1]
- [Action item 2]
...

KEY DECISIONS:
- [Decision 1]
- [Decision 2]
...

TOPICS:
- [Topic 1]
- [Topic 2]
...
"""

    def _build_qa_prompt(self, context: str, question: str) -> str:
        """Build the prompt for question answering."""
        return f"""Based on the following meeting transcript context, please answer the question.

**Context:**
{context}

**Question:**
{question}

**Instructions:**
- Answer based only on the provided context
- If the answer is not in the context, clearly state that
- Be concise and specific
- Include relevant timestamps or speaker names if applicable

**Answer:**"""

    def _parse_summary_response(self, content: str) -> SummaryResponse:
        """Parse the LLM response into a structured SummaryResponse."""
        # Simple parsing logic - can be enhanced with more robust parsing
        lines = content.strip().split("\n")

        summary = ""
        action_items = []
        key_decisions = []
        topics = []

        current_section = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Detect section headers
            if line.startswith("SUMMARY:"):
                current_section = "summary"
                continue
            elif line.startswith("ACTION ITEMS:"):
                current_section = "action_items"
                continue
            elif line.startswith("KEY DECISIONS:"):
                current_section = "key_decisions"
                continue
            elif line.startswith("TOPICS:"):
                current_section = "topics"
                continue

            # Add content to appropriate section
            if current_section == "summary":
                summary += line + " "
            elif current_section == "action_items" and line.startswith("-"):
                action_items.append(line[1:].strip())
            elif current_section == "key_decisions" and line.startswith("-"):
                key_decisions.append(line[1:].strip())
            elif current_section == "topics" and line.startswith("-"):
                topics.append(line[1:].strip())

        return SummaryResponse(
            summary=summary.strip() or "Summary not available.",
            action_items=action_items,
            key_decisions=key_decisions,
            topics=topics,
        )


# Global client instance
_llm_client: LLMClient | None = None


def get_llm_client() -> LLMClient:
    """Get or create the global LLM client instance."""
    global _llm_client
    if _llm_client is None:
        # Choose provider based on settings
        if settings.llm_provider == "openai":
            _llm_client = OpenAILLMClient()
        else:
            raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")
    return _llm_client

