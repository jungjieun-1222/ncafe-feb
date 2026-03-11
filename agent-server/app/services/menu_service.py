import httpx
from app.services import gemini
import logging

logger = logging.getLogger(__name__)

BACKEND_URL = "http://backend:8081"

async def load_menu_data():
    """Fetch menu data from backend API and inject into gemini module."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_URL}/menus", timeout=10.0)
            if response.status_code == 200:
                menus = response.json()
                gemini.MENU_DATA = menus
                logger.info(f"✅ Loaded {len(menus)} menu items from backend")
                return menus
            else:
                logger.warning(f"⚠️ Failed to load menus: status {response.status_code}")
                return []
    except Exception as e:
        logger.warning(f"⚠️ Could not connect to backend for menus: {e}")
        return []


def get_menu_by_name(name: str):
    """Find a menu item by Korean name."""
    for menu in gemini.MENU_DATA:
        if menu.get("korName") == name:
            return menu
    return None
