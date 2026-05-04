import os
from dataclasses import dataclass
from dotenv import load_dotenv
from abc import ABC

load_dotenv()

@dataclass
class MinIOConfig:
    endpoint: str = os.getenv("S3_ENDPOINT", "localhost:9000")
    access_key: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    secret_key: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    secure: bool = os.getenv("S3_SECURE", "false").lower() == "true"

minio_config = MinIOConfig()
