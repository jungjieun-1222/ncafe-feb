import shutil
import os

src = "/home/mochijj/.gemini/antigravity/brain/ea16f7fd-ec99-49af-b64d-29457379351f/mysterious_cherry_blossom_hanok_1772809117110.png"
dest = "/home/mochijj/workspace/ncafe-feb/frontend/public/images/mysterious_hanok.png"

os.makedirs(os.path.dirname(dest), exist_ok=True)
shutil.copy(src, dest)
print(f"Copied {src} to {dest}")
