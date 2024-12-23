const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const dayjs = require("dayjs");
const { PHRASES } = require("./phrases");

// Configuration
const REPO_PATH = "./"; // Repository path
const README_PATH = path.join(REPO_PATH, "README.md");
const LOG_FILE = path.join(REPO_PATH, "log.json");

const git = simpleGit(REPO_PATH);

(async () => {
  try {
    // 1. Ensure the log file exists and has the correct structure
    if (!fs.existsSync(LOG_FILE)) {
      console.log("Log file not found, creating a new one...");
      fs.writeFileSync(
        LOG_FILE,
        JSON.stringify({ commits: [], alreadyAdded: [] }, null, 2)
      );
    }

    const logData = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));

    // Ensure logData has commits and alreadyAdded arrays
    if (!logData.commits || !Array.isArray(logData.commits)) {
      logData.commits = [];
    }
    if (!logData.alreadyAdded || !Array.isArray(logData.alreadyAdded)) {
      logData.alreadyAdded = [];
    }

    const today = dayjs().format("YYYY-MM-DD");

    // Exit if a commit was already made today
    if (logData.commits.includes(today)) {
      console.log("A commit has already been made today. Exiting...");
      return;
    }

    // 2. Pull the latest changes from the repository
    console.log("Updating repository...");
    await git.pull();

    // 3. Filter phrases to avoid duplicates
    const availablePhrases = PHRASES.filter(
      (phrase) => !logData.alreadyAdded.includes(phrase)
    );

    if (availablePhrases.length === 0) {
      console.log("No new phrases available. Add more phrases to PHRASES.");
      return;
    }

    // Pick a random phrase and add it to README.md
    const randomPhrase =
      availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    const currentContent = fs.existsSync(README_PATH)
      ? fs.readFileSync(README_PATH, "utf8")
      : "";
    const newContent = `${currentContent}\n\n${randomPhrase}`;
    fs.writeFileSync(README_PATH, newContent, "utf8");
    console.log(`Phrase added to README.md: "${randomPhrase}"`);

    // 4. Commit and push changes
    console.log("Committing and pushing changes...");
    await git.add(README_PATH);
    await git.commit(randomPhrase);
    await git.push();

    // 5. Update the log
    logData.commits.push(today);
    logData.alreadyAdded.push(randomPhrase);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));

    console.log("Commit successfully completed.");
  } catch (error) {
    console.error("Error during execution:", error);
  }
})();
