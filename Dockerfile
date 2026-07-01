# Imagen liviana de Python; el frontend es estático (HTML/CSS/JS + CDNs),
# por eso no se necesita una etapa de build de Node aquí.
FROM python:3.12-slim

WORKDIR /app

# Instala dependencias primero para aprovechar la cache de Docker
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copia el resto del proyecto manteniendo la misma estructura relativa
# que se usa en desarrollo local (backend/ y frontend/ como hermanos).
COPY backend backend
COPY frontend frontend

# Cloud Run inyecta la variable PORT; uvicorn debe escuchar en 0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
