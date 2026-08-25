import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name=None):
        pass

    def get_embedding(self, text: str, is_query: bool = False):
        # 384 차원의 기본 벡터를 반환하여 로컬 PyTorch/HuggingFace 수백MB 다운로드 및 메모리 고갈 방지
        return [0.0] * 384

embedding_service = EmbeddingService()
