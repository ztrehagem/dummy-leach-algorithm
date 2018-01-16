const { wait } = require('./utils');

const AREA_RANGE = 1000;

module.exports = class Node {
  constructor(id, p) {
    this.id = id;
    this.p = p;
    this.x = Math.floor(Math.random() * AREA_RANGE);
    this.y = Math.floor(Math.random() * AREA_RANGE);
    this.round = -1;
    this.flag = false;
    this.advertisements = {};
    this.members = [];
    this.messages = [];
    this.nodes = [];
    this.head = null;
  }

  startRound() {
    this.initRound();

    const isHead = Math.random() < this.threshold;

    if (isHead) {
      this.doRoundAsHead();
    } else {
      this.doRoundAsMember();
    }

    return isHead;
  }

  initRound() {
    this.round += 1;
    if (this.roundMod == 0) this.flag = false;
    this.members = [];
    this.messages = [];
    this.head = null;
  }

  async doRoundAsHead() {
    this.flag = true;
    this.advertise();
    await wait(100);
    console.log('head', `${this.id}`.padStart(2), ':', this.members.map(node => node.id).join(', '));
    this.messages.push('this is self message');
  }

  async doRoundAsMember() {
    await wait(0);
    this.checkAdvertise();
    await wait(200);
    this.sendToHead();
  }

  setNodesRef(nodes) {
    this.nodes = nodes;
  }

  advertise() {
    this.nodes.filter(node => node.id != this.id).forEach(node => node.visitAdvertise(this));
  }

  visitAdvertise(node) {
    const distance = Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2);
    this.advertisements[node.id] = distance;
  }

  checkAdvertise() {
    const minId = Object.keys(this.advertisements).reduce((minId, id) => {
      const dMin = this.advertisements[minId];
      const d = this.advertisements[id];
      return dMin < d ? minId : id;
    });
    this.advertisements = {};
    this.head = this.nodes[minId];
    this.head.joinCluster(this);
  }

  joinCluster(node) {
    this.members.push(node);
  }

  sendToHead() {
    this.head.visitMessage(`I am ${this.id}`);
  }

  visitMessage(message) {
    this.messages.push(message);
  }

  get roundMod() {
    return this.round % Math.floor(1 / this.p);
  }

  get threshold() {
    return this.flag ? 0 : this.p / (1 - this.p * this.roundMod);
  }

  get isCompleted() {
    return (this.messages.length - 1) == this.members.length;
  }
}
