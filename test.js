const Node = require('./lib/node');
const { wait } = require('./lib/utils');

const P = 0.1;

const nodes = new Array(100).fill(0).map((v, i) => new Node(i, P));
nodes.forEach(node => node.setNodes(nodes));

const doRound = async () => {
  console.log('------------round------------');
  nodes.forEach(node => node.lot());

  await wait(100);

  console.log('heads:', nodes.filter(node => node.isHead).length);
};

(async () => {
  await doRound();
  await wait(1000);
  await doRound();
  await wait(1000);
  await doRound();
})();
