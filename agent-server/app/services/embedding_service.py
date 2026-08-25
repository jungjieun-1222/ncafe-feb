import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name="intfloat/multilingual-e5-small"):
        self.model_name = model_name
        self.model = None

    def _load_model(self):
        if self.model is None:
            try:
                logger.info(f"Loading embedding model: {self.model_name}...")
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name, device="cpu")
                logger.info("Embedding model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")

    def get_embedding(self, text: str, is_query: bool = False):
        try:
            self._load_model()
            if self.model:
                prefix = "query: " if is_query else "passage: "
                full_text = prefix + text
                embedding = self.model.encode(full_text)
                return embedding.tolist()
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            
        # Fallback: return 384-dimensional zeros vector
        return [0.0] * 384

# Singleton instance with lazy loading
embedding_service = EmbeddingService()
