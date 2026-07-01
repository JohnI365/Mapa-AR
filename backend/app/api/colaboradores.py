"""
Endpoints relacionados con la identificación del colaborador
que escanea el QR de reinducción.

NOTA: COLABORADORES_DEMO es data de ejemplo. En producción esto
debe reemplazarse por una consulta a Supabase/Postgres, indexada
por el token único que lleva cada QR individual (o uno genérico
si el evento usa un solo QR para todos).
"""
from fastapi import APIRouter, HTTPException

router = APIRouter()

COLABORADORES_DEMO = {
    "demo123": {"nombre": "Colaborador Demo", "area": "Innovación y Tecnología"},
    "general": {"nombre": "Equipo Ingeniería 365", "area": "Reinducción Corporativa"},
}


@router.get("/{token}")
def obtener_colaborador(token: str):
    colaborador = COLABORADORES_DEMO.get(token)
    if not colaborador:
        raise HTTPException(status_code=404, detail="Token no encontrado")
    return colaborador
