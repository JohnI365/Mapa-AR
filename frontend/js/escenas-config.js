/**
 * Configuración del mapa virtual: cada "escena" es un punto del
 * recorrido de reinducción (panorámica 360 + hotspots de navegación).
 *
 * panorama: ruta a la imagen equirectangular real (frontend/assets/panoramas/...).
 *           Mientras no exista el asset definitivo, se deja en null y
 *           se usa colorFondo como placeholder, así el flujo de
 *           navegación se puede probar de inmediato sin esperar los
 *           assets finales.
 *
 * hotspots: puntos clicables/"gaze-ables" dentro de la escena.
 *   - destino: id de la escena a la que navega
 *   - posicion: "x y z" en el espacio 3D de A-Frame
 *   - etiqueta: texto que se muestra flotando sobre el hotspot
 */
export const ESCENAS = [
  {
    id: "bienvenida-mapa",
    nombre: "Punto de encuentro",
    panorama: null,
    colorFondo: "#16213a",
    hotspots: [
      { destino: "historia", posicion: "4 1.4 -5", etiqueta: "Nuestra Historia" },
      { destino: "cultura", posicion: "-4 1.4 -5", etiqueta: "Cultura y Valores" },
    ],
  },
  {
    id: "historia",
    nombre: "Nuestra Historia",
    panorama: null,
    colorFondo: "#1f2a44",
    hotspots: [
      { destino: "cultura", posicion: "4 1.4 -5", etiqueta: "Cultura y Valores" },
      { destino: "bienvenida-mapa", posicion: "0 1.4 5", etiqueta: "Volver al inicio" },
    ],
  },
  {
    id: "cultura",
    nombre: "Cultura y Valores",
    panorama: null,
    colorFondo: "#27314f",
    hotspots: [
      { destino: "cierre", posicion: "4 1.4 -5", etiqueta: "Cierre" },
      { destino: "historia", posicion: "-4 1.4 -5", etiqueta: "Nuestra Historia" },
      { destino: "bienvenida-mapa", posicion: "0 1.4 5", etiqueta: "Volver al inicio" },
    ],
  },
  {
    id: "cierre",
    nombre: "¡Bienvenido(a) al equipo!",
    panorama: null,
    colorFondo: "#2c2160",
    hotspots: [
      { destino: "bienvenida-mapa", posicion: "0 1.4 5", etiqueta: "Volver al inicio" },
    ],
  },
];

export function obtenerEscena(id) {
  return ESCENAS.find((escena) => escena.id === id) || ESCENAS[0];
}
