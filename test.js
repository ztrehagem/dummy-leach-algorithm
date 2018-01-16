const Node = require('./lib/node');
const { wait } = require('./lib/utils');

const P = 0.1;

const nodes = new Array(100).fill(0).map((v, i) => new Node(i, P));
nodes.forEach(node => node.setNodes(nodes));

const doRound = async () => {
  console.log('------------round------------');
  nodes.forEach(node => node.lot());

  await wait(100);

  const heads = nodes.filter(node => node.isHead);
  console.log('heads:', heads.length);

  heads.forEach((node) => {
    console.log(`${node.id}`.padStart(2), ':', node.members.map(node => node.id).join(', '));
  });
};

(async () => {
  await doRound();
  await wait(1000);
  await doRound();
  await wait(1000);
  await doRound();
})();
