"""
RAG (Retrieval-Augmented Generation) service.
Builds vector index over transcript chunks and enables semantic search.
"""

import logging
from pathlib import Path
from typing import Any

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings
from app.models.schemas import TranscriptChunk

logger = logging.getLogger(__name__)


class RagIndex:
    """
    Vector index for transcript chunks using FAISS.
    Supports semantic search over meeting transcripts.
    """

    def __init__(self, chunks: list[TranscriptChunk], embeddings: np.ndarray, index: Any):
        """
        Initialize RAG index.

        Args:
            chunks: List of transcript chunks
            embeddings: Embedding vectors for chunks
            index: FAISS index object
        """
        self.chunks = chunks
        self.embeddings = embeddings
        self.index = index

    def query(self, query_embedding: np.ndarray, top_k: int = 5) -> list[TranscriptChunk]:
        """
        Query the index for most relevant chunks.

        Args:
            query_embedding: Query vector
            top_k: Number of results to return

        Returns:
            List of most relevant transcript chunks
        """
        # Ensure query is 2D array
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)

        # Search the index
        distances, indices = self.index.search(query_embedding.astype("float32"), top_k)

        # Return corresponding chunks
        results = []
        for idx in indices[0]:
            if idx < len(self.chunks):
                results.append(self.chunks[idx])

        return results

    def save(self, path: Path):
        """Save the index to disk."""
        path.mkdir(parents=True, exist_ok=True)

        # Save FAISS index
        index_path = path / "faiss.index"
        faiss.write_index(self.index, str(index_path))

        # Save chunks as JSON
        import json

        chunks_path = path / "chunks.json"
        chunks_data = [chunk.model_dump() for chunk in self.chunks]
        with open(chunks_path, "w", encoding="utf-8") as f:
            json.dump(chunks_data, f, ensure_ascii=False, indent=2)

        logger.info(f"Saved RAG index to {path}")

    @classmethod
    def load(cls, path: Path, embedding_model: "SentenceTransformer") -> "RagIndex":
        """Load an index from disk."""
        import json

        # Load FAISS index
        index_path = path / "faiss.index"
        index = faiss.read_index(str(index_path))

        # Load chunks
        chunks_path = path / "chunks.json"
        with open(chunks_path, "r", encoding="utf-8") as f:
            chunks_data = json.load(f)
        chunks = [TranscriptChunk(**chunk) for chunk in chunks_data]

        # Regenerate embeddings (could also save/load these)
        texts = [chunk.text for chunk in chunks]
        embeddings = embedding_model.encode(texts, show_progress_bar=False)

        logger.info(f"Loaded RAG index from {path}")
        return cls(chunks, embeddings, index)


class RAGService:
    """Service for building and querying RAG indices over transcripts."""

    def __init__(self):
        self.embedding_model: SentenceTransformer | None = None
        self._initialized = False

    def initialize(self):
        """Load the embedding model."""
        if self._initialized:
            return

        logger.info(f"Loading embedding model: {settings.embedding_model}")
        try:
            self.embedding_model = SentenceTransformer(settings.embedding_model)
            self._initialized = True
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise

    def build_index(self, chunks: list[TranscriptChunk]) -> RagIndex:
        """
        Build a FAISS index from transcript chunks.

        Args:
            chunks: List of transcript chunks to index

        Returns:
            RagIndex object for querying
        """
        if not self._initialized:
            self.initialize()

        if not chunks:
            raise ValueError("Cannot build index from empty chunks list")

        logger.info(f"Building RAG index from {len(chunks)} chunks")

        # Extract text from chunks
        texts = [chunk.text for chunk in chunks]

        # Generate embeddings
        embeddings = self.embedding_model.encode(
            texts, show_progress_bar=True, convert_to_numpy=True
        )

        # Create FAISS index
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)  # L2 distance
        index.add(embeddings.astype("float32"))

        logger.info(f"RAG index built with {index.ntotal} vectors")

        return RagIndex(chunks, embeddings, index)

    def query_index(
        self, index: RagIndex, question: str, top_k: int = 5
    ) -> list[TranscriptChunk]:
        """
        Query the index for relevant chunks.

        Args:
            index: The RAG index to query
            question: The question to search for
            top_k: Number of results to return

        Returns:
            List of most relevant transcript chunks
        """
        if not self._initialized:
            self.initialize()

        logger.debug(f"Querying RAG index: {question[:50]}...")

        # Encode the question
        query_embedding = self.embedding_model.encode([question], convert_to_numpy=True)

        # Query the index
        results = index.query(query_embedding, top_k=top_k)

        logger.debug(f"Found {len(results)} relevant chunks")
        return results

    def embed_text(self, text: str) -> np.ndarray:
        """
        Generate embedding for a text string.

        Args:
            text: Text to embed

        Returns:
            Embedding vector
        """
        if not self._initialized:
            self.initialize()

        return self.embedding_model.encode([text], convert_to_numpy=True)[0]


# Global service instance
_rag_service: RAGService | None = None


def get_rag_service() -> RAGService:
    """Get or create the global RAG service instance."""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
        _rag_service.initialize()
    return _rag_service


def build_index(chunks: list[TranscriptChunk]) -> RagIndex:
    """
    Convenience function to build a RAG index.

    Args:
        chunks: List of transcript chunks

    Returns:
        RagIndex for querying
    """
    service = get_rag_service()
    return service.build_index(chunks)


def query_index(index: RagIndex, question: str, top_k: int = 5) -> list[TranscriptChunk]:
    """
    Convenience function to query a RAG index.

    Args:
        index: The index to query
        question: Question to search for
        top_k: Number of results

    Returns:
        List of relevant chunks
    """
    service = get_rag_service()
    return service.query_index(index, question, top_k)

