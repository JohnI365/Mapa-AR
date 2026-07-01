/**
 * iOS 13+ exige un gesto explícito del usuario (tap) para conceder
 * acceso a los sensores de orientación del dispositivo; sin esto,
 * look-controls de A-Frame no recibe datos del giroscopio en Safari
 * y la navegación 360 se queda fija. Android no necesita este paso.
 *
 * Devuelve una Promise<boolean> que resuelve cuando ya se puede
 * arrancar la escena (con o sin giroscopio concedido).
 */
export function solicitarPermisoGiroscopio() {
  return new Promise((resolve) => {
    const necesitaPermisoExplicito =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (!necesitaPermisoExplicito) {
      resolve(true);
      return;
    }

    const overlay = document.getElementById("overlay-permiso-giroscopio");
    const boton = document.getElementById("boton-activar-giroscopio");
    overlay.classList.add("visible");

    boton.addEventListener(
      "click",
      async () => {
        let concedido = false;
        try {
          const respuesta = await DeviceOrientationEvent.requestPermission();
          concedido = respuesta === "granted";
        } catch (err) {
          concedido = false;
        }
        overlay.classList.remove("visible");
        resolve(concedido);
      },
      { once: true }
    );
  });
}
