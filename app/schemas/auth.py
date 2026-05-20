from typing import Annotated, Union
from pydantic import BaseModel, Field
from typing import Literal

class AuthNone(BaseModel):
    type: Literal["none"] = "none"

class AuthBearer(BaseModel):
    type: Literal["bearer"] = "bearer"
    token: str

class AuthBasic(BaseModel):
    type: Literal["basic"] = "basic"
    username: str
    password: str

class AuthApiKeyHeader(BaseModel):
    type: Literal["api_key_header"] = "api_key_header"
    key_name: str  
    key_value: str

class AuthApiKeyQuery(BaseModel):
    type: Literal["api_key_query"] = "api_key_query"
    key_name: str    
    key_value: str

Auth = Annotated[
    Union[AuthNone, AuthBearer, AuthBasic, AuthApiKeyHeader, AuthApiKeyQuery],
    Field(discriminator="type")
]