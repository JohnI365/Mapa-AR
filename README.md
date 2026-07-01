# Reinducción AR · Ingeniería 365 S.A.S.

Experiencia de realidad aumentada en navegador (WebAR) para la
reinducción corporativa de ~900 colaboradores. Acceso vía QR, sin
instalación de app, con navegación 360°, contenido 3D y soporte de
giroscopio.

## Stack

- **Frontend**: HTML/CSS/JS estático + [A-Frame](https://aframe.io) (motor
  WebXR para el tour 360°/3D con giroscopio) + `canvas-confetti`
  (todo vía CDN, sin paso de build).
- **Backend**: FastAPI, sirve la API y el frontend estático en un solo
  servicio.
- **Despliegue**: contenedor Docker → Cloud Run.

## Estructura

```
reinduccion-ar/
├── backend/
│   ├── app/
│   │   ├── main.py              # App FastAPI + montaje de estáticos
│   │   └── api/colaboradores.py # Resuelve token de QR -> datos
│   └── requirements.txt
├── frontend/
│   ├── index.html               # Pantalla de bienvenida + confetti
│   ├── mapa.html                # Esqueleto de escena AR/360
│   ├── css/styles.css
│   └── js/
│       ├── app.js
│       └── confetti-effect.js
├── Dockerfile
└── .dockerignore / .gitignore
```

## Correr en local

```bash
cd reinduccion-ar
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8080
```

Abrir `http://localhost:8080/?token=demo123`.

> Nota: cámara y giroscopio solo funcionan en contexto seguro (HTTPS)
> o en `localhost`. Para probar en un celular real durante desarrollo,
> usa `ngrok` o similar para exponer el puerto 8080 con HTTPS.

## Build y prueba del contenedor

```bash
docker build -t reinduccion-ar .
docker run -p 8080:8080 reinduccion-ar
```

## Despliegue a Cloud Run

```bash
gcloud builds submit --tag gcr.io/TU_PROYECTO/reinduccion-ar

gcloud run deploy reinduccion-ar \
  --image gcr.io/TU_PROYECTO/reinduccion-ar \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Cloud Run entrega HTTPS por defecto, lo cual es obligatorio para que
funcionen cámara y orientación del dispositivo.

## Generar el QR

El QR debe apuntar a la URL pública de Cloud Run, por ejemplo:

```
https://reinduccion-ar-xxxxx-uc.a.run.app/?token=general
```

Si se quiere personalizar por colaborador, generar un token único por
persona y registrar el mapeo token → nombre/área en el backend
(`backend/app/api/colaboradores.py`, hoy con data demo).

## Próximos pasos

- Conectar `mapa.html` con las panorámicas 360 reales y navegación
  entre escenas.
- Cargar el modelo 3D del águila (GLB, comprimido con Draco) en la
  escena AR.
- Mover assets pesados (GLB, panorámicas) a Cloud Storage + Cloud CDN
  en lugar de servirlos desde el contenedor.
- Reemplazar `COLABORADORES_DEMO` por una consulta real (Supabase).
