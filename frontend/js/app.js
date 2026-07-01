import { lanzarConfettiBienvenida } from "./confetti-effect.js";

/**
 * Flujo:
 * 1. El QR apunta a algo como /?token=demo123
 * 2. Resolvemos el token contra el backend para obtener el nombre.
 * 3. Mostramos la tarjeta de bienvenida + confetti.
 * 4. El botón "Entrar" pasa el token al mapa AR/360 (mapa.html).
 */

const params = new URLSearchParams(window.location.search);
const token = params.get("token") || "general";

const elNombre = document.getElementById("nombre-colaborador");
const elSubtitulo = document.getElementById("subtitulo-bienvenida");
const elBotonEntrar = document.getElementById("boton-entrar");

async function cargarColaborador() {
  try {
    const resp = await fetch(`/api/colaboradores/${encodeURIComponent(token)}`);
    if (!resp.ok) throw new Error("token no encontrado");
    const data = await resp.json();
    elNombre.textContent = data.nombre;
    elSubtitulo.textContent = `Área: ${data.area}`;
  } catch (err) {
    // Si el token no existe en backend, igual mostramos bienvenida genérica
    // en lugar de bloquear la experiencia.
    elNombre.textContent = "Bienvenido(a) al equipo";
    elSubtitulo.textContent = "Reinducción corporativa 2026";
  }
}

elBotonEntrar.addEventListener("click", () => {
  window.location.href = `mapa.html?token=${encodeURIComponent(token)}`;
});

cargarColaborador().then(() => {
  lanzarConfettiBienvenida();
});
