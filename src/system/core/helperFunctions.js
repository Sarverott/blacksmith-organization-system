const fs = require("fs");
const path = require("path");

function SAFE_CREATE_DIR(dirpath) {
  fs.mkdirSync(path.normalize(dirpath), { recursive: true });
}
function capitalFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = {
  SAFE_CREATE_DIR,
  capitalFirstLetter
};
