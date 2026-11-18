"""Production entry point:  uvicorn app.asgi:app"""
import logging

from .main import create_app

logging.basicConfig(level=logging.INFO)
app = create_app()
