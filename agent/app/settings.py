from typing import TypedDict, List, Dict

class ConfigField(TypedDict):
    key: str
    value: str
    encrypted: bool

# In-memory storage for service settings
_service_settings_db: Dict[str, List[ConfigField]] = {}


def save_service_settings(service_id: str | int, fields: List[ConfigField]) -> None:
    """Save settings for a service."""
    _service_settings_db[str(service_id)] = fields


def get_service_settings(service_id: str | int) -> List[ConfigField]:
    """Get settings for a service."""
    return _service_settings_db.get(str(service_id), [])