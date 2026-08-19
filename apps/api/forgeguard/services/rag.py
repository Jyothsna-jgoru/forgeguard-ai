import math
import re
from collections import Counter
from dataclasses import dataclass

from forgeguard.demo_data import RAG_DOCUMENTS

TOKEN_PATTERN = re.compile(r"[a-z][a-z0-9_-]+")


@dataclass(frozen=True)
class RetrievedDocument:
    id: str
    source: str
    text: str
    score: float


class LocalVectorStore:
    """Small deterministic vector store for the seeded, offline demonstration."""

    def __init__(self) -> None:
        self._documents = RAG_DOCUMENTS
        self._vectors = [self._vector(document["text"]) for document in self._documents]

    @staticmethod
    def _vector(text: str) -> Counter[str]:
        return Counter(TOKEN_PATTERN.findall(text.lower()))

    @staticmethod
    def _cosine(left: Counter[str], right: Counter[str]) -> float:
        numerator = sum(left[token] * right[token] for token in left.keys() & right.keys())
        left_norm = math.sqrt(sum(value * value for value in left.values()))
        right_norm = math.sqrt(sum(value * value for value in right.values()))
        return numerator / (left_norm * right_norm) if left_norm and right_norm else 0.0

    def search(self, query: str, limit: int = 3) -> list[RetrievedDocument]:
        query_vector = self._vector(query)
        ranked = sorted(
            zip(self._documents, self._vectors, strict=True),
            key=lambda item: self._cosine(query_vector, item[1]),
            reverse=True,
        )
        return [
            RetrievedDocument(
                id=document["id"],
                source=document["source"],
                text=document["text"],
                score=round(self._cosine(query_vector, vector), 3),
            )
            for document, vector in ranked[:limit]
        ]

