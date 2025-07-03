from fastapi import FastAPI, Header, Cookie, Body
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="CryptoSims API",
    description="API documentation for CryptoSims project.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["servers"] = [
        {"url": "http://localhost:3000", "description": "Next.js API Proxy"}
    ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


class CreateWalletResponse(BaseModel):
    seedPhrase: str


class RateLimitResponse(BaseModel):
    error: str


@app.post(
    "/api/create",
    response_model=CreateWalletResponse,
    summary="Generate a new wallet",
    responses={
        429: {
            "description": "Too Many Requests - Rate limit exceeded",
            "model": RateLimitResponse,
            "content": {
                "application/json": {
                    "example": {"error": "Too many requests, please try again later."}
                }
            },
        }
    },
)
def create_wallet():
    """
    Generate a new wallet with a unique seed phrase.

    **Rate limiting:**
    If you exceed the allowed number of requests, you'll receive a 429 response:
    ```
    {
        "error": "Too many requests, please try again later."
    }
    ```
    """
    return {"seedPhrase": "example-seed-phrase"}
