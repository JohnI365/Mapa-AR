/**
 * Motor de navegación entre escenas del mapa virtual.
 *
 * Responsabilidades:
 * - Pintar el panorama (a-sky) y los hotspots de la escena actual.
 * - Manejar la transición de fundido a negro entre escenas.
 * - Sincronizar la escena actual con el query param ?escena=, para que
 *   el botón "atrás" del navegador funcione y la URL sea compartible.
 *
 * No depende de ningún framework adicional: usa el DOM de A-Frame
 * directamente (createElement de a-entity), lo cual es la forma
 * recomendada de crear/destruir entidades dinámicamente en A-Frame.
 */
import { obtenerEscena } from "./escenas-config.js";

const elSky = document.getElementById("panorama-actual");
const elHotspots = document.getElementById("contenedor-hotspots");
const elChipEscena = document.getElementById("chip-escena");
const elFundido = document.getElementById("fundido-pantalla");

const DURACION_FUNDIDO_MS = 350; // debe calzar con la transición CSS de .fundido-pantalla

function crearHotspot(hotspot) {
  const entidad = document.createElement("a-entity");
  entidad.setAttribute("class", "hotspot");
  entidad.setAttribute("geometry", "primitive: sphere; radius: 0.3");
  entidad.setAttribute("material", "color: #4f7cff; opacity: 0.85; shader: flat");
  entidad.setAttribute("position", hotspot.posicion);
  entidad.setAttribute(
    "animation",
    "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.15 1.15 1.15"
  );

  const etiqueta = document.createElement("a-text");
  etiqueta.setAttribute("value", hotspot.etiqueta);
  etiqueta.setAttribute("align", "center");
  etiqueta.setAttribute("position", "0 0.55 0");
  etiqueta.setAttribute("scale", "1.1 1.1 1.1");
  entidad.appendChild(etiqueta);

  entidad.addEventListener("click", () => irAEscena(hotspot.destino));

  return entidad;
}

function renderizarEscena(escena) {
  // Panorama: imagen real si ya existe el asset; color sólido como
  // placeholder mientras tanto, para no bloquear el flujo de navegación.
  elSky.removeAttribute("src");
  if (escena.panorama) {
    elSky.setAttribute("src", escena.panorama);
  } else {
    elSky.setAttribute("color", escena.colorFondo || "#121826");
  }

  while (elHotspots.firstChild) {
    elHotspots.removeChild(elHotspots.firstChild);
  }
  escena.hotspots.forEach((hotspot) => elHotspots.appendChild(crearHotspot(hotspot)));

  elChipEscena.textContent = escena.nombre;
}

/**
 * Navega a una escena con transición de fundido.
 * @param {string} id - id de la escena destino
 * @param {{sinHistorial?: boolean}} opciones - sinHistorial evita hacer
 *        pushState (usado al responder al botón "atrás" del navegador).
 */
export function irAEscena(id, opciones = {}) {
  const escena = obtenerEscena(id);

  elFundido.classList.add("activo");

  setTimeout(() => {
    renderizarEscena(escena);

    if (!opciones.sinHistorial) {
      const params = new URLSearchParams(window.location.search);
      params.set("escena", escena.id);
      history.pushState({ escena: escena.id }, "", `?${params.toString()}`);
    }

    elFundido.classList.remove("activo");
  }, DURACION_FUNDIDO_MS);
}

window.addEventListener("popstate", (evento) => {
  const idDesdeUrl = new URLSearchParams(window.location.search).get("escena");
  const id = evento.state?.escena || idDesdeUrl || "bienvenida-mapa";
  irAEscena(id, { sinHistorial: true });
});

/** Punto de entrada: pinta la escena inicial según la URL actual. */
export function iniciarNavegacion() {
  const params = new URLSearchParams(window.location.search);
  const idInicial = params.get("escena") || "bienvenida-mapa";
  renderizarEscena(obtenerEscena(idInicial));
}
