import os
from fastapi import Header, HTTPException

def require_password(x_app_password: str = Header(default=None)):
    app_password = os.getenv("APP_PASSWORD")

    if not app_password:
        raise HTTPException(status_code=500, detail="APP_PASSWORD is not set on server")

    if x_app_password != app_password:
        raise HTTPException(status_code=401, detail="Unauthorized")