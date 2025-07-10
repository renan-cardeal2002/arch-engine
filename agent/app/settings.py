from typing import TypedDict, List, Dict

class ConfigField(TypedDict):
    key: str
    value: str
    encrypted: bool

# In-memory storage for tool settings
_tool_settings_db: Dict[str, List[ConfigField]] = {}


def save_tool_settings(tool_name: str, fields: List[ConfigField]) -> None:
    """Save settings for a tool."""
    _tool_settings_db[tool_name] = fields


def get_tool_settings(tool_name: str) -> List[ConfigField]:
    """Get settings for a tool."""
    return _tool_settings_db.get(tool_name, [])
