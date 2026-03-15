from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from the root of the project (one level up from app/)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Database settings
DB_USER = os.getenv("SPRING_DATASOURCE_USERNAME", "ncafe")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST", "db")
DB_NAME = os.getenv("POSTGRES_DB", "ncafedb")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

if not GEMINI_API_KEY:
    print(f"DEBUG: GEMINI_API_KEY not found at {env_path.absolute()}")
else:
    # Print partially masked key for debugging
    masked = GEMINI_API_KEY[:6] + "..." + GEMINI_API_KEY[-4:] if len(GEMINI_API_KEY) > 10 else "***"
    print(f"DEBUG: GEMINI_API_KEY loaded: {masked}")
    print(f"DEBUG: GEMINI_MODEL set to: {GEMINI_MODEL}")
