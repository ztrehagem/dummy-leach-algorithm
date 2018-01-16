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
  }

  async lot() {
    if ((++this.round) % Math.floor(1 / this.p) == 0) {
      this.flag = false;
    }

    const rand = Math.random();
    const threshold = this.calcThrethold();

    this.isHead = rand < threshold;
    if (this.isHead) {
      this.flag = true;
      this.messages = [];
      this.advertise();
    }

    this.members = [];

    await wait(0);

    if (!this.isHead) {
      this.checkAdvertise();
      await wait(500);
      this.sendToHead();
    } else {
      await wait(100);
      console.log(`${this.id}`.padStart(2), ':', this.members.map(node => node.id).join(', '));
      if (!this.members.length) {
        console.log(`this is lonely cluster (${this.id})`);
      }
    }
  }

  calcThrethold() {
    return this.flag ? 0 : this.p / (1 - this.p * (this.round % Math.floor(1 / this.p)));
  }

  setNodes(nodes) {
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
    this.checkMessages();
  }

  checkMessages() {
    if (this.messages.length == this.members.length) {
      console.log(`all messages received (${this.id})`);
    }
  }
}
