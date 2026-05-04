from storage.minio_client import MinIOClient
from database.database import create_config, get_config, update_config, delete_config

# Minio services
minio = MinIOClient()
def init_buckets():
    minio.create_bucket(minio.bucket_bronze)

def upload(data):
    minio.upload_data("bronze", "tmdb/daily_ids_export/movie_ids.json", data)

def get_all_sources():
    return minio.list_objects("bronze", prefix="sources/")

# Bifrost own database (API configuration)

def save_source(source: dict):
    create_config(source)

def list_sources() -> list:
    return get_config()

def remove_source(name: str):
    delete_config(name)

def edit_source(name: str, updates: dict):
    update_config(name, updates)
