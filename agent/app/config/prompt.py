import os
from pathlib import Path

DEFAULT_PROMPT_PATH = Path(__file__).resolve().parents[2] / "instructions.txt"
prompt_path = os.getenv("SYSTEM_PROMPT_PATH", str(DEFAULT_PROMPT_PATH))
prompt_path = Path(prompt_path)
if not prompt_path.is_absolute():
    prompt_path = Path(__file__).resolve().parents[2] / prompt_path
SYSTEM_PROMPT = prompt_path.read_text().strip() if prompt_path.exists() else None