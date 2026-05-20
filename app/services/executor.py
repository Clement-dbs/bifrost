import base64
import httpx
from app.schemas.auth import AuthBearer, AuthBasic, AuthApiKeyHeader, AuthApiKeyQuery
from app.schemas.schemas import ConnectorCreate

class Executor:
    """
    Construit et exécute l'appel HTTP vers l'API externe.
    Prend un ConnectorCreate ou ConnectorRead et retourne le résultat brut.
    """

    def __init__(self, connector: ConnectorCreate):
        self.connector = connector

    def _build_headers(self) -> dict:
        headers = dict(self.connector.headers or {})
        auth = self.connector.auth

        if isinstance(auth, AuthBearer):
            headers["Authorization"] = f"Bearer {auth.token}"
        elif isinstance(auth, AuthBasic):
            credentials = base64.b64encode(
                f"{auth.username}:{auth.password}".encode()
            ).decode()
            headers["Authorization"] = f"Basic {credentials}"
        elif isinstance(auth, AuthApiKeyHeader):
            headers[auth.key_name] = auth.key_value

        return headers

    def _build_params(self) -> dict:
        params = dict(self.connector.params or {})
        auth = self.connector.auth

        if isinstance(auth, AuthApiKeyQuery):
            params[auth.key_name] = auth.key_value

        return params

    def run(self) -> dict:
        """
        Exécute la requête HTTP.
        Retourne : status, http_status, duration_ms, data, error.
        """

        try:
            response = httpx.request(
                method=self.connector.method,
                url=self.connector.url,
                headers=self._build_headers(),
                params=self._build_params(),
                json=self.connector.body if self.connector.method in ("POST", "PUT", "PATCH") else None,
                timeout=15.0,
            )
    
            response.raise_for_status()

            data = response.json() if self.connector.response_format == "JSON" else response.text

            return {
                "status": "success",
                "http_status": response.status_code,
                "data": data,
                "error": None,
            }

        except httpx.TimeoutException:
            return self._error("Timeout", None)
        except httpx.HTTPStatusError as e:
            return self._error(f"HTTP {e.response.status_code}", e.response.status_code)
        except httpx.RequestError as e:
            return self._error(str(e), None)

    def _error(self, msg: str, http_status: int | None) -> dict:
        return {
            "status": "error",
            "http_status": http_status,
            "data": None,
            "error": msg,
        }

    @classmethod
    def test(cls, connector: ConnectorCreate) -> None:
        """
        Teste la connectivité avant sauvegarde.
        Lève une ValueError si l'appel échoue.
        """
        result = cls(connector).run()
        if result["status"] == "error":
            raise ValueError(result["error"])