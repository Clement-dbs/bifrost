import json
from io import BytesIO
from minio import Minio
from storage.config.config import minio_config

class MinIOClient:
    def __init__(self):
        self.client = Minio(
            endpoint=minio_config.endpoint,
            access_key=minio_config.access_key,
            secret_key=minio_config.secret_key,
            secure=minio_config.secure
        )
        self.bucket_bronze = "bronze"
        self.bucket_silver = "silver"
        self.bucket_gold = "gold"

    def create_bucket(self, bucket_name: str) -> None:
        """
            Permet de créer un bucket si il n'existe pas 
        """
        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)


    def upload_data(self, bucket_name: str, object_name: str, data) -> None:
        """
        Upload d'un dict/list ou d'un texte/JSON Lines déjà prêt.
        """
        if isinstance(data, (dict, list)):
            json_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        elif isinstance(data, str):
            json_bytes = data.encode("utf-8")
        elif isinstance(data, bytes):
            json_bytes = data
        else:
            raise TypeError(f"Type non supporté: {type(data)}")

        self.client.put_object(
            bucket_name=bucket_name,
            object_name=object_name,
            data=BytesIO(json_bytes),
            length=len(json_bytes),
            content_type="application/json"
        )
    
    def download_data(self, bucket_name: str, object_name: str) -> str:
        """
            Permet de télécharger un objet depuis un bucket
        """
        response = self.client.get_object(bucket_name, object_name)
        data_bytes = response.read()
        response.close()
        response.release_conn()
        
        return data_bytes.decode("utf-8") 
        
    def list_objects(self, bucket_name: str, prefix: str) -> list:
        """
            Permet de lister les objets présent dans un bucket
        """
        objects = self.client.list_objects(bucket_name, prefix=prefix)
        return [obj.object_name for obj in objects]
    
