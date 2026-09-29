/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

//const child_process = require("child_process");
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
    this.SETUP();
    BlacksmithOrganizationSystem.SET_WATCH(this, itemPath);
  }
  SETUP(){}
  emitBosEvent(emitName){
    this.BOS.EVENTS.emit(`on-model-${emitName}`, this);
  }
  init(){
    this.emitBosEvent('init');
  }
  open(){
    this.emitBosEvent('open');
  }
  create(){
    this.emitBosEvent('create');
  }
  change(){
    this.emitBosEvent('change');
  }
  close(){
    this.emitBosEvent('close');
  }
  delete(){
    this.emitBosEvent('delete');
  }
  move(){
    this.emitBosEvent('move');
  }
  remodel(){
    this.emitBosEvent('remodel');
  }
  upload(){
    this.emitBosEvent('upload');
  }
  download(){
    this.emitBosEvent('download');
  }
  static SET_WATCH(itemHook, watchedPath) {
    // not recursive: a recursive watch over a whole workshop exhausts inotify
    itemHook.watcher = fs.watch(watchedPath, function (eventType, filename) {
      itemHook.emit(
        "alert-fs-change",
        itemHook,
        eventType,
        filename,
        watchedPath
      );
    });
    itemHook.watcher.on("error", () => itemHook.watcher.close());
  }

  static get Subject() {
    return require("./basic-subject-model.js")(BOS);
  }
  static PathTo(...locationChain) {
    return path.join(this.BOS_ROOT_PATH, ...locationChain);
  }
  static get WORKSHOP_ROOT() {
    if (!BOS._workshopRoot) {
      BOS._workshopRoot = helpers.findWorkshopRoot(
        BOS.CONFIG.workshop && BOS.CONFIG.workshop.path
      );
    }
    return BOS._workshopRoot;
  }
  static WorkshopPath(...locationChain) {
    return path.join(BOS.WORKSHOP_ROOT, ...locationChain);
  }
  static get BOS() {
    return BlacksmithOrganizationSystem;
  }
  get BOS() {
    return BlacksmithOrganizationSystem;
  }
  static INITIALIZE(bosRootPath) {
    if (!this.hasOwnProperty("IS_INITIALIZED")) {
      this.IS_INITIALIZED = true;

      Object.assign(this, {
        SCOPE_ROOT: null,
        SCOPE_ITEMS: [],
        CONFIG: {},
        CONTROLLERS: {},
        MODELS: {},
        FACTORS: {},
        INTERFACES: {},
        COMMANDS: {},
      });

      this.BOS_ROOT_PATH = bosRootPath;

      this.EVENTS = new EventEmitter();

      this.CONTROLLERS = Controller.IncludeAll(this.PathTo("."), this);

      this.CONTROLLERS.loadAll();
    }
    return this;
  }
  static SETUP(options) {
    if (!BOS.hasOwnProperty("IS_SETUP")) {
      BOS.IS_SETUP = true;
      var startupScript = BOS.WorkshopPath(BOS.CONFIG.main.startup);
      if (!fs.existsSync(startupScript)) {
        helpers.SAFE_CREATE_DIR(path.dirname(startupScript));
        fs.copyFileSync(
          path.join(this.PathTo("."), "config", "startup.bos.default"),
          startupScript
        );
      }
      BOS.EVENTS.emit("run-startup-script", startupScript, BOS);
    }
  }

  static EXECUTE() {
    
  }
}

const BOS = BlacksmithOrganizationSystem;

//
module.exports = BlacksmithOrganizationSystem;
