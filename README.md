# daily
A daily commit with auto start bat script on windows

## Modificar daily-commit.js

Modifica el script `daily-commit.js` con tus datos.

## Ubicar el .bat en la carpeta de Inicio de Windows

Para ejecutar este archivo al inicio de Windows, debes colocarlo en la carpeta "Startup". Esta carpeta contiene todos los programas que Windows ejecuta automáticamente al encenderse.

### Pasos:
- Presiona Win + R para abrir la ventana de Ejecutar.
- Escribe:
```cmd
shell:startup
```
- Presiona Enter. Esto abrirá la carpeta de inicio del usuario actual.
- Copia y pega tu archivo run-daily-commit.bat en esta carpeta.
