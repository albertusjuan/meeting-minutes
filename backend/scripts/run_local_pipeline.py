#!/usr/bin/env python3
"""
CLI tool to test the meeting processing pipeline locally.
Process audio files without running the HTTP server.

Usage:
    python scripts/run_local_pipeline.py path/to/audio.wav
    python scripts/run_local_pipeline.py path/to/audio.wav --meeting-id my-meeting
    python scripts/run_local_pipeline.py path/to/audio.wav --no-summary
"""

import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.pipeline import get_pipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)


async def process_local_audio(
    audio_path: Path,
    meeting_id: str | None = None,
    save_results: bool = True,
    test_qa: bool = False,
):
    """
    Process an audio file through the meeting pipeline.

    Args:
        audio_path: Path to audio file
        meeting_id: Optional meeting ID
        save_results: Whether to save results to disk
        test_qa: Whether to run test Q&A
    """
    if not audio_path.exists():
        logger.error(f"Audio file not found: {audio_path}")
        return

    logger.info("=" * 80)
    logger.info(f"Processing audio file: {audio_path}")
    logger.info("=" * 80)

    try:
        # Get pipeline
        pipeline = get_pipeline()

        # Process meeting
        result, rag_index = await pipeline.process_meeting_audio(audio_path, meeting_id)

        logger.info("\n" + "=" * 80)
        logger.info("PROCESSING COMPLETE")
        logger.info("=" * 80)

        # Display results
        print("\n" + "=" * 80)
        print(f"Meeting ID: {result.meeting_id}")
        print(f"Duration: {result.transcript.duration:.1f} seconds")
        print(f"Speakers: {', '.join(result.transcript.speakers)}")
        print(f"Chunks: {len(result.transcript.chunks)}")
        print("=" * 80)

        # Display transcript preview
        print("\n📝 TRANSCRIPT PREVIEW (first 5 chunks):")
        print("-" * 80)
        for chunk in result.transcript.chunks[:5]:
            print(chunk.to_context_string())
        if len(result.transcript.chunks) > 5:
            print(f"... and {len(result.transcript.chunks) - 5} more chunks")

        # Display summary
        print("\n" + "=" * 80)
        print("📊 MEETING SUMMARY")
        print("=" * 80)
        print(f"\n{result.summary.summary}\n")

        if result.summary.action_items:
            print("✅ ACTION ITEMS:")
            for item in result.summary.action_items:
                print(f"  • {item}")

        if result.summary.key_decisions:
            print("\n🎯 KEY DECISIONS:")
            for decision in result.summary.key_decisions:
                print(f"  • {decision}")

        if result.summary.topics:
            print("\n💬 TOPICS DISCUSSED:")
            for topic in result.summary.topics:
                print(f"  • {topic}")

        # Save results
        if save_results:
            logger.info("\n" + "=" * 80)
            logger.info("SAVING RESULTS")
            logger.info("=" * 80)

            meeting_dir = pipeline.save_meeting_data(result.meeting_id, result, rag_index)
            print(f"\n✅ Results saved to: {meeting_dir}")

            # Save full transcript as text
            transcript_txt = meeting_dir / "transcript.txt"
            with open(transcript_txt, "w", encoding="utf-8") as f:
                f.write(result.transcript.get_full_text())
            print(f"✅ Full transcript: {transcript_txt}")

        # Test Q&A
        if test_qa:
            print("\n" + "=" * 80)
            print("🤔 TESTING Q&A")
            print("=" * 80)

            test_questions = [
                "What were the main topics discussed?",
                "What action items were identified?",
                "Who spoke the most?",
            ]

            for question in test_questions:
                print(f"\nQ: {question}")
                answer, chunks = await pipeline.answer_question(rag_index, question, top_k=3)
                print(f"A: {answer}\n")
                print(f"   (Based on {len(chunks)} transcript chunks)")

        print("\n" + "=" * 80)
        print("✅ ALL DONE!")
        print("=" * 80 + "\n")

    except Exception as e:
        logger.error(f"Pipeline failed: {e}", exc_info=True)
        sys.exit(1)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Process meeting audio files locally",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process a single audio file
  python scripts/run_local_pipeline.py audio.wav

  # Specify a custom meeting ID
  python scripts/run_local_pipeline.py audio.wav --meeting-id team-standup-2024

  # Process without saving results
  python scripts/run_local_pipeline.py audio.wav --no-save

  # Process and test Q&A
  python scripts/run_local_pipeline.py audio.wav --test-qa
        """,
    )

    parser.add_argument("audio_path", type=Path, help="Path to audio file")

    parser.add_argument(
        "--meeting-id",
        type=str,
        default=None,
        help="Optional meeting ID (auto-generated if not provided)",
    )

    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Don't save results to disk",
    )

    parser.add_argument(
        "--test-qa",
        action="store_true",
        help="Run test questions after processing",
    )

    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging",
    )

    args = parser.parse_args()

    # Set logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Run the pipeline
    asyncio.run(
        process_local_audio(
            audio_path=args.audio_path,
            meeting_id=args.meeting_id,
            save_results=not args.no_save,
            test_qa=args.test_qa,
        )
    )


if __name__ == "__main__":
    main()

