const fs = require("fs");
const path = require("path");

const Controller = require("../core/bos.controller.js");

function loadDefaultsIfNeeded(context) {
  var defaultConfigList = fs
    .readdirSync(path.join(context.projectDir, "config"), {
      withFileTypes: true,
    })
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .filter((name) => path.extname(name) == ".default");
  for (var defaultConfig of defaultConfigList) {
    var defaultsPath = path.join(
      context.projectDir,
      "config",
      defaultConfig
    );
    var configPath = path.join(
      context.projectDir,
      "config",
      path.basename(defaultConfig, ".default")
    );
    if (!fs.existsSync(configPath)) {
      console.log(`default config copied `, defaultsPath, configPath);
      fs.copyFileSync(defaultsPath, configPath);
    }
  }
}


function loadAllConfigs(context) {
  var configs = {};
  var configList = fs
    .readdirSync(path.join(context.projectDir, "config"), {
      withFileTypes: true,
    })
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .filter((name) => path.extname(name) == ".json");
  for (var configname of configList) {
    console.log(
      "CONFIG[",
      path.basename(configname, ".json"),
      "] from path ",
      path.join(context.projectDir, "config", configname)
    );
    configs[path.basename(configname, ".json")] = JSON.parse(
      fs.readFileSync(
        path.join(context.projectDir, "config", configname),
        {
          encoding: "utf-8",
        }
      )
    );
  }
  return configs;
}

class ConfigControll extends Controller {
  LOAD() {
    loadDefaultsIfNeeded(this);
    this.context.CONFIG = loadAllConfigs(this);
  }
}

module.exports = ConfigControll;
