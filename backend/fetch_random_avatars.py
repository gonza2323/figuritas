import requests
from pathlib import Path

AVATARS_PATH = "src/main/resources/users/avatars"
NO_AVATARS = 20

Path(AVATARS_PATH).mkdir(exist_ok=True)

for i in range(0, NO_AVATARS):
    url = f"https://api.dicebear.com/9.x/adventurer/png?seed={i}"
    img = requests.get(url).content

    with open(f"{AVATARS_PATH}/avatar_{i:02d}.png", "wb") as f:
        f.write(img)