"""
Genera el QR único que se imprime/comparte para el evento de reinducción.

Uso:
    pip install qrcode[pil]
    python scripts/generar_qr.py https://reinduccion-ar-xxxxx-uc.a.run.app/?token=general

Genera qr_reinduccion.png en el directorio actual, en alta resolución
para impresión (apto para carteles/volantes en el evento).
"""
import sys

import qrcode


def generar_qr(url: str, salida: str = "qr_reinduccion.png") -> None:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=20, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(salida)
    print(f"QR generado: {salida} -> {url}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Uso: python scripts/generar_qr.py <url-de-cloud-run>")
    generar_qr(sys.argv[1])
