FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend
COPY config ./config
COPY knowledge_base ./knowledge_base
COPY frontend ./frontend
ENV DATA_DIR=/data
WORKDIR /app/backend
EXPOSE 8000
CMD ["sh","-c","uvicorn app.asgi:app --host 0.0.0.0 --port ${PORT:-8000}"]
