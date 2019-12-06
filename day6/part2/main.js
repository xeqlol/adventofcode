const { readFile, writeFile } = require('fs').promises;

function getPathToCOM(node, map) {
  const path = [];
  let nextNode = node;

  while (nextNode !== 'COM') {
    nextNode = map[nextNode];
    path.push(nextNode);
  }

  return path;
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
  const myPath = getPathToCOM('YOU', map);
  const santaPath = getPathToCOM('SAN', map);

  let currentNodeIndex = 1;
  let orbits = 0;
  let currentMyNode = myPath[myPath.length - currentNodeIndex - 1];
  let currentSantaNode = santaPath[santaPath.length - currentNodeIndex - 1];

  // dirty
  while (
    currentMyNode === currentSantaNode &&
    currentMyNode &&
    currentSantaNode
  ) {
    orbits += 2;
    currentNodeIndex += 1;
    currentMyNode = myPath[myPath.length - currentNodeIndex - 1];
    currentSantaNode = santaPath[santaPath.length - currentNodeIndex - 1];
  }

  const myPathLength = myPath.length - currentNodeIndex;
  const santaPathLength = santaPath.length - currentNodeIndex;
  const totalPath = myPathLength + santaPathLength;

  await writeFile('output', String(totalPath));
}

solve();
