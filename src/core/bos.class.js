/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

const child_process = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const Controller = require("./bos.controller.js");
const helpers = require("./helperFunctions.js");

class BlacksmithOrganizationSystem extends EventEmitter {
  constructor(itemPath, parrent) {
    super();
    BlacksmithOrganizationSystem.SCOPE_ITEMS.push(this);
    Object.assign(this, this.constructor.defaultData);
    helpers.SAFE_CREATE_DIR(itemPath);
    this.type = this.constructor.name.replace("Blacksmith", "");
    for (var eventname in this.constructor.events) {
      this.on(eventname, this.constructor.events[eventname]);
    }
    for (var methodname in this.constructor.methods) {
      this[methodname] = this.constructor.methods[methodname];
    }
    for (var listenername in this.constructor.listeners) {
      this.constructor.listeners[listenername](
        this,
        listenername,
        this.constructor
      );
    }
    this.path = itemPath;
    this.parrentItem = parrent;
    this.childrenItems = [];
    BlacksmithOrganizationSystem.SET_WATCH(this, itemPath);
    
  }
  static SET_WATCH(itemHook, watchedPath) {
    fs.watch(watchedPath, { recursive: false }, function (eventType, filename) {
      itemHook.emit(
        "alert-fs-change",
        itemHook,
        eventType,
        filename,
        watchedPath
      );
    });
  }
  
  static get Subject() {
    return require("./basic-subject-model.js")(BOS);
  }
  static PathTo(...locationChain) {
    return path.join(__dirname, "..", "..", ...locationChain);
  }
  static get BOS() {
    return BlacksmithOrganizationSystem;
  }
  get BOS() {
    return BlacksmithOrganizationSystem;
  }
  static get INITIALIZE() {
    if (!BOS.hasOwnProperty("IS_INITIALIZED")) {
      BOS.IS_INITIALIZED = true;
      this.EVENTS = new EventEmitter();

      this.CONTROLLERS = Controller.IncludeAll(this.PathTo("."), this);
      this.CONTROLLERS.ConfigControll.LOAD();
      this.CONTROLLERS.ModelsControll.LOAD();
      this.CONTROLLERS.CommandsControll.LOAD();
      this.CONTROLLERS.InterfacesControll.LOAD();
    }
    return this;
  }
  static BOX_EMPTY(boxHook) {
    return Object.keys(boxHook).length == 0;
  }
  static get LOAD() {
    if (!BOS.hasOwnProperty("IS_LOADED")) {
      BOS.IS_LOADED = true;
      this.CONTROLLERS.ScopeControll.LOAD();
      this.CONTROLLERS.ScrapbookControll.LOAD();
      this.CONTROLLERS.ProjectsControll.LOAD();
      this.CONTROLLERS.BridgesControll.LOAD();
      this.CONTROLLERS.FactorsControll.LOAD();
      this.CONTROLLERS.SandboxControll.LOAD();
      this.CONTROLLERS.PublicationControll.LOAD();
      this.CONTROLLERS.DeploymentControll.LOAD();
      if (
        !fs.existsSync(
          path.join(
            os.homedir(),
            BOS.CONFIG.main["context-path"],
            BOS.CONFIG.main.startup
          )
        )
      ) {
        fs.copyFileSync(
          path.join(this.PathTo("."), "..", "config", "startup.bos.default"),
          path.join(
            os.homedir(),
            BOS.CONFIG.main["context-path"],
            BOS.CONFIG.main.startup
          )
        );
      }
      BOS.EVENTS.emit(
        "run-startup-script",
        path.join(
          os.homedir(),
          BOS.CONFIG.main["context-path"],
          BOS.CONFIG.main.startup
        ),
        BOS
      );
      
    }
    return this;
  }
}

const BOS = BlacksmithOrganizationSystem;

BOS.SCOPE_ROOT = null;

BOS.SCOPE_ITEMS = [];

BOS.CONFIG = {};
BOS.CONTROLLERS = {};
BOS.MODELS = {};
BOS.FACTORS = {};
BOS.INTERFACES = {};
BOS.COMMANDS = {};

//
module.exports = BlacksmithOrganizationSystem;
