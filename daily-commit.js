const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const dayjs = require('dayjs');

// Configuración
const REPO_PATH = './'; // Ruta al repositorio
const README_PATH = path.join(REPO_PATH, 'README.md');
const LOG_FILE = path.join(REPO_PATH, 'log.json');
const PHRASES = [/* Array de 370 frases aquí */];
const git = simpleGit(REPO_PATH);

(async () => {
  try {
    // 1. Verificar el archivo de log
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, JSON.stringify({ commits: [] }, null, 2));
    }

    const logData = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    const today = dayjs().format('YYYY-MM-DD');

    // Si ya se realizó un commit hoy, salir
    if (logData.commits.includes(today)) {
      console.log('Ya se realizó un commit hoy. Saliendo...');
      return;
    }

    // 2. Actualizar el repositorio
    console.log('Actualizando el repositorio...');
    await git.pull();

    // 3. Modificar el archivo README.md
    const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const currentContent = fs.existsSync(README_PATH)
      ? fs.readFileSync(README_PATH, 'utf8')
      : '';
    const newContent = `${currentContent}\n\n${randomPhrase}`;
    fs.writeFileSync(README_PATH, newContent, 'utf8');
    console.log(`Frase agregada al README.md: "${randomPhrase}"`);

    // 4. Hacer commit y push
    console.log('Haciendo commit y push...');
    await git.add(README_PATH);
    await git.commit(randomPhrase);
    await git.push();

    // 5. Registrar el commit en el log
    logData.commits.push(today);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));

    console.log('Commit realizado con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución:', error);
  }
})();
