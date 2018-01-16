const Node = require('./lib/node');
const { wait } = require('./lib/utils');

const P = 0.1;

const nodes = new Array(100).fill(0).map((v, i) => new Node(i, P));
nodes.forEach(node => node.setNodesRef(nodes));

async function doRound() {
  console.log('------------round------------');
  const heads = nodes.filter(node => node.startRound());
  console.log('cluster numbers:', heads.length);
  await wait(500);
  console.log('all cluster-heads are received all messages in 500ms:', heads.every(node => node.isCompleted));
}

(async () => {
  for (let i = 0; i < (2 / P); i++) {
    await doRound();
    await wait(1000);
  }
})();
