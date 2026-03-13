FROM python:3.12-slim

WORKDIR /app

# 시스템 라이브러리 최소 설치 (필요한 경우만)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
# 1. pip 업데이트 및 CPU 전용 torch 먼저 설치
# 이 한 줄이 1GB가 넘는 NVIDIA 패키지 설치를 원천 차단합니다.
COPY requirements.txt .
#RUN pip install --no-cache-dir -U pip && \
#    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 2. 나머지 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
