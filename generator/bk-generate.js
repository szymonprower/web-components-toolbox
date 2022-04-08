const shell = require("shelljs");

// CHANGE THIS
const GIT_REPO = "https://github.com/mits-gossau/web-components-toolbox-buelach-sued.git";
const NEW_PROJECT_DIR = "/var/www/html/vm_work";
const NEW_PROJECT_NAME = "web-components-toolbox-buelach-sued";

// LEAVE THIS AS IT IS!
const REF_REPO = "https://github.com/mits-gossau/web-components-toolbox-betriebsrestaurant.git";
const REF_DIR = "web-components-toolbox-betriebsrestaurant";

function init() {
  shell.cd(NEW_PROJECT_DIR);
  shell.exec(`git clone ${GIT_REPO}`);
  const gitDir = GIT_REPO.split("/").slice(-1)[0].slice(0, -4);
  shell.cd(gitDir);
}

function cloneRefProject() {
  shell.exec(`git clone ${REF_REPO}`);
}

function moveFiles() {
  shell.cd(REF_DIR);
  shell.cp("-r", "{.*,*}", "../");
  shell.cd("..");
  shell.rm("-rf", REF_DIR);
}

function cleanReadMe() {
  shell.sed("-i", REF_DIR, NEW_PROJECT_NAME, "README.md");
  const readme_content = shell.cat("README.md").toString();
  const keep = readme_content.match(/[\s\S]*?.*TODO/);
  shell.echo(keep[0]).to("README.md");
}

function replaceProjectName() {
  shell.sed("-i", REF_DIR, NEW_PROJECT_NAME, "index.html");
  shell.sed("-i", REF_DIR, NEW_PROJECT_NAME, "package.json");
}

function gitUpdateSubmodule() {
  shell.exec("git submodule update --init --recursive --remote --force");
}

function gitSetURLOrigin() {
  shell.exec(`git remote set-url origin ${GIT_REPO}`);
}

function installNPMPackages() {
  shell.exec("npm i");
}

function removeFiles() {
  shell.rm("package-lock.json");
}

function runLocalServer() {
  shell.exec("npm run serve");
}

init();
cloneRefProject();
moveFiles();
cleanReadMe();
replaceProjectName();
gitUpdateSubmodule();
gitSetURLOrigin();
installNPMPackages();
removeFiles();
runLocalServer();

// TODO:
// git push 