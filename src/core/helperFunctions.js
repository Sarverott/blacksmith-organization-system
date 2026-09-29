const fs = require("fs");
const os = require("os");
const path = require("path");

const WORKSHOP_DIRNAME = "__WORKSHOP";

function SAFE_CREATE_DIR(dirpath) {
  fs.mkdirSync(path.normalize(dirpath), { recursive: true });
}
function capitalFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// components live in git submodules: src/components/<type>/ITEMS/...
function componentPath(projectDir, type, ...rest) {
  return path.join(projectDir, "src", "components", type, "ITEMS", ...rest);
}

function expandHome(dirpath) {
  if (dirpath === "~") return os.homedir();
  if (dirpath.startsWith("~/")) return path.join(os.homedir(), dirpath.slice(2));
  return dirpath;
}

// active workshop: $BOS_WORKSHOP, else nearest ancestor of cwd named __WORKSHOP,
// else the configured default (~/__WORKSHOP)
function findWorkshopRoot(defaultPath = `~/${WORKSHOP_DIRNAME}`) {
  if (process.env.BOS_WORKSHOP) return path.resolve(expandHome(process.env.BOS_WORKSHOP));
  var dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (path.basename(dir) === WORKSHOP_DIRNAME) return dir;
    dir = path.dirname(dir);
  }
  return path.resolve(expandHome(defaultPath));
}

// every workshop on this machine: per user (~/__WORKSHOP) and per partition (/media/**/__WORKSHOP)
function listWorkshops(maxDepth = 4) {
  var found = new Set();
  var home = path.join(os.homedir(), WORKSHOP_DIRNAME);
  if (fs.existsSync(home)) found.add(home);
  (function scan(dir, depth) {
    if (depth > maxDepth) return;
    var entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (var entry of entries) {
      if (!entry.isDirectory()) continue;
      var entryPath = path.join(dir, entry.name);
      if (entry.name === WORKSHOP_DIRNAME) found.add(entryPath);
      else scan(entryPath, depth + 1);
    }
  })("/media", 1);
  return [...found];
}

module.exports = {
  WORKSHOP_DIRNAME,
  SAFE_CREATE_DIR,
  capitalFirstLetter,
  componentPath,
  expandHome,
  findWorkshopRoot,
  listWorkshops
};
