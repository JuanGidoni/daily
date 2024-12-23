# daily

A daily commit with auto start bat script on windows

## Para usar este script:

- Clonar repo

```bash
  git clone https://github.com/JuanGidoni/daily
```

- Instalar dependencias

```bash
npm install simple-git dayjs fs
```

- Modifica el script `daily-commit.js` con tus datos.
- Ubicar el .bat en la carpeta de Inicio de Windows, Como? A continuación te lo explico.

### Para ejecutar este archivo al inicio de Windows, debes colocarlo en la carpeta "Startup". Esta carpeta contiene todos los programas que Windows ejecuta automáticamente al encenderse.

Pasos:

- Presiona Win + R para abrir la ventana de Ejecutar.
- Escribe:

```cmd
shell:startup
```

- Presiona Enter. Esto abrirá la carpeta de inicio del usuario actual.
- Copia y pega tu archivo run-daily-commit.bat en esta carpeta.


You're not just a developer; you're a creator of experiences.

Every challenge in frontend is an opportunity to grow.