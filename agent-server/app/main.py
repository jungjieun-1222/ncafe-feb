from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import chat, knowledge
from app.services.menu_service import load_menu_data
from app.services.db_service import init_db
import logging

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and load menu data from backend
    try:
        init_db()
    except Exception as e:
        logging.error(f"DB initialization failed: {e}")
    
    await load_menu_data()
    yield

app = FastAPI(title="AI Chat Server", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(knowledge.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/reload-menus")
async def reload_menus():
    """Manually reload menu data from backend."""
    menus = await load_menu_data()
    return {"message": f"Loaded {len(menus)} menus"}
