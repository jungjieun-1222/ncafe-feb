from sentence_transformers import SentenceTransformer
import torch

class EmbeddingService:
    def __init__(self, model_name="intfloat/multilingual-e5-small"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer(model_name, device=self.device)

    def get_embedding(self, text: str, is_query: bool = False):
        # E5 model suggests "query: " prefix for queries and "passage: " for documents
        prefix = "query: " if is_query else "passage: "
        full_text = prefix + text
        
        # multilingual-e5-small produces 384 dimensional embeddings
        embedding = self.model.encode(full_text)
        return embedding.tolist()

# Singleton instance to avoid reloading model on each request
embedding_service = EmbeddingService()
