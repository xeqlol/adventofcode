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

  let index = 1;
  for (; index < Math.min(myPath.length, santaPath.length); index += 1) {
    const currentMyNode = myPath[myPath.length - index - 1];
    const currentSantaNode = santaPath[santaPath.length - index - 1];
    const hasSamePath = currentMyNode === currentSantaNode;

    if (!hasSamePath) {
      break;
    }
  }

  const myPathLength = myPath.length - index;
  const santaPathLength = santaPath.length - index;
  const totalPath = myPathLength + santaPathLength;

  await writeFile('output', String(totalPath));
}

solve();
