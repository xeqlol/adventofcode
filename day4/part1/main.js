const { readFile, writeFile } = require('fs').promises;

function checkIncreasity(number) {
  for (let index = 1; index < number.length; index++) {
    if (Number(number[index]) < Number(number[index - 1])) {
      return false;
    }
  }

  return true;
}

function checkAdjacentDigitsExistance(number) {
  let hasAdjacent = false;

  for (let index = 1; index < number.length; index++) {
    if (number[index] === number[index - 1]) {
      hasAdjacent = true;
    }
  }

  return hasAdjacent;
}

// aint optimal at all, but it's honest work
async function solve() {
  const rawData = await readFile('input');
  const [start, end] = rawData
    .toString()
    .split('-')
    .map(Number);
  let total = 0;

  for (let number = start; number <= end; number++) {
    number = String(number);
    if (checkIncreasity(number) && checkAdjacentDigitsExistance(number)) {
      total++;
    }
  }

  await writeFile('output', String(total));
}

solve();
