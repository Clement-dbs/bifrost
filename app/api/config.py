from dataclasses import dataclass
from abc import ABC


@dataclass
class BaseAPIConfig(ABC):
    delay: float = 0.5
    timeout: int = 30
    max_retries: int = 3




