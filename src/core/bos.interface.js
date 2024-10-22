class BOS_Interface {
  constructor(initAction, context) {
    this.active = false;
    this.INIT = initAction;
    this.context = context;
  }
}

module.exports = BOS_Interface;
