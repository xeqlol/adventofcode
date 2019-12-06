const { readFile, writeFile } = require('fs').promises;

function calcOrbits(node, map) {
  orbits = 0;
  let nextNode = node;

  while (nextNode !== 'COM') {
    nextNode = map[nextNode];
    orbits++;
  }

  return orbits;
}

async function solve() {
  const rawData = await readFile('input');
  const rawMap = rawData
    .toString()
    .split('\n')
    .map(node => node.split(')'));
  const map = rawMap.reduce((map, [left, right]) => {
    map[right] = left;
    return map;
  }, {});
  const orbits = Object.keys(map).reduce(
    (total, key) => total + calcOrbits(key, map),
    0
  );

  await writeFile('output', String(orbits));
}

solve();
