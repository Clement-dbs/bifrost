import requests
import time
import json
from api.config import BaseAPIConfig


class APIExtractor(BaseAPIConfig):
    def __init__(self, api_url:str, authentification_type:str, api_key:str,response_format:str,header_params:dict):
        self.api_url = api_url
        self.authentification_type = authentification_type
        self.api_key = api_key
        self.response_format = response_format
        self.header_params = header_params
    
    # Configuration de la requête
    def _get(self, params=None) -> json: 
        url = f"{self.api_url}"

        params = {"api_key": self.api_key}

        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            return response.json()
        except Exception as e:
            print(f"La requête a échoué : {e}")
    

if __name__ == "__main__":
    pass