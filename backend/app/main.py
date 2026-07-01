"""
Backend de la experiencia AR de reinducción corporativa.

Sirve:
1. La API (/api/...) que resuelve datos del colaborador a partir
   del token del QR.
2. El frontend estático (A-Frame + AR.js + confetti) que vive en
   /frontend.

BASE_DIR se calcula de forma relativa para que funcione igual en
local (ejecutando desde la raíz del repo) y en el contenedor de
Cloud Run (donde la raíz del repo se copia a /app).
"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api import colaboradores

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # raíz del repo
FRONTEND_DIR = BASE_DIR / "frontend"

app = FastAPI(title="Reinducción AR - Ingeniería 365 S.A.S.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajustar a dominios específicos en producción
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    colaboradores.router, prefix="/api/colaboradores", tags=["colaboradores"]
)


@app.get("/health")
def health():
    """Usado por Cloud Run / monitoreo para verificar que el servicio está vivo."""
    return {"status": "ok"}


# Debe ir AL FINAL: cualquier ruta no capturada por /api o /health
# se resuelve contra los archivos estáticos del frontend.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
