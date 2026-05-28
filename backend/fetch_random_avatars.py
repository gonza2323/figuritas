import requests
from pathlib import Path

AVATARS_PATH = "src/main/resources/users/avatars"


Path(AVATARS_PATH).mkdir(exist_ok=True)

for i in range(1, 201):
    url = f"https://api.dicebear.com/9.x/adventurer/png?seed=user{i}"
    img = requests.get(url).content

    with open(f"{PATH}/user{i}.png", "wb") as f:
        f.write(img)