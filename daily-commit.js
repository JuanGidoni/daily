const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const dayjs = require("dayjs");
const { PHRASES } = require("./phrases");

// Configuración
const REPO_PATH = "./"; // Ruta al repositorio
const README_PATH = path.join(REPO_PATH, "README.md");
const LOG_FILE = path.join(REPO_PATH, "log.json");
const git = simpleGit(REPO_PATH);

(async () => {
  try {
    // 1. Asegurarse de que el archivo de log exista y tenga la estructura correcta
    if (!fs.existsSync(LOG_FILE)) {
      console.log("Archivo de log no encontrado, creando uno nuevo...");
      fs.writeFileSync(
        LOG_FILE,
        JSON.stringify({ commits: [], alreadyAdded: [] }, null, 2)
      );
    }

    // Intentar leer el archivo JSON
    let logData = {};
    try {
      logData = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
    } catch (error) {
      // Si ocurre un error al parsear, inicializamos el archivo con datos válidos
      console.log(
        "Error al leer el archivo log.json, inicializando con datos predeterminados..."
      );
      logData = { commits: [], alreadyAdded: [] };
      fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));
    }

    // Asegurarse de que logData tenga los arrays commits y alreadyAdded
    if (!logData.commits || !Array.isArray(logData.commits)) {
      logData.commits = [];
    }
    if (!logData.alreadyAdded || !Array.isArray(logData.alreadyAdded)) {
      logData.alreadyAdded = [];
    }

    const today = dayjs().format("YYYY-MM-DD");

    // Si ya se hizo un commit hoy, salir
    if (logData.commits.includes(today)) {
      console.log("Ya se realizó un commit hoy. Saliendo...");
      return;
    }

    // 2. Actualizar el repositorio
    console.log("Actualizando repositorio...");
    await git.pull();

    // 3. Filtrar frases para evitar duplicados
    const availablePhrases = PHRASES.filter(
      (phrase) => !logData.alreadyAdded.includes(phrase)
    );

    if (availablePhrases.length === 0) {
      console.log(
        "No hay frases nuevas disponibles. Agrega más frases a PHRASES."
      );
      return;
    }

    // Escoger una frase aleatoria y agregarla al README.md
    const randomPhrase =
      availablePhrases[Math.floor(Math.random() * availablePhrases.length)];

    // Contador de commits
    const commitCount = logData.commits.length + 1; // El contador será la cantidad de commits realizados
    const commitBar = createCommitProgressBar(commitCount);

    // Nuevo contenido para el README, reemplazando todo el contenido
    const newContent = `# Daily Development Check-ins

Commit #${commitCount}
${commitBar}

> "${randomPhrase}"`;

    fs.writeFileSync(README_PATH, newContent, "utf8");
    console.log(`Frase agregada al README.md: "${randomPhrase}"`);

    // 4. Hacer commit y push de todos los cambios
    console.log("Haciendo commit y push de todos los cambios...");

    // 5. Actualizar el log
    logData.commits.push(today);
    logData.alreadyAdded.push(randomPhrase);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));

    await git.add("."); // Usamos `git add .` para agregar todos los cambios
    await git.commit(randomPhrase); // El mensaje de commit será la frase agregada al README.md
    await git.push();

    console.log("Commit realizado con éxito y repositorio actualizado.");
  } catch (error) {
    console.error("Error durante la ejecución:", error);
  }
})();

// Función para crear la barra de progreso del contador de commits
function createCommitProgressBar(commitCount) {
  const totalCommits = 365; // Total de commits para que el progreso sea sobre 100
  const percentage = Math.min(commitCount / totalCommits, 1); // Asegurarse de que no se pase de 100%
  const barLength = 30; // Longitud de la barra de progreso
  const filledLength = Math.round(barLength * percentage); // Longitud del relleno

  const filled = "=".repeat(filledLength); // Parte rellena de la barra
  const empty = "-".repeat(barLength - filledLength); // Parte vacía de la barra

  return `[${filled}${empty}] ${Math.round(
    percentage * 100
  )}% (${commitCount}/${totalCommits} commits)`;
}
