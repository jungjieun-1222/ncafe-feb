import os
import shutil

src_dir = "/home/mochijj/.gemini/antigravity/brain/ea16f7fd-ec99-49af-b64d-29457379351f"
dest_dir = "/home/mochijj/workspace/ncafe-feb/frontend/public/images"

os.makedirs(dest_dir, exist_ok=True)

# Look at list_dir output:
# media__1772799359773.png = male
# media__1772799372477.png = female
shutil.copyfile(os.path.join(src_dir, "media__1772799359773.png"), os.path.join(dest_dir, "user_male.png"))
shutil.copyfile(os.path.join(src_dir, "media__1772799372477.png"), os.path.join(dest_dir, "user_female.png"))

print("Images copied successfully!")
