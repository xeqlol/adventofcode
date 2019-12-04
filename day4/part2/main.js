const { readFile, writeFile } = require('fs').promises;

function checkIncreasity(number) {
  for (let index = 1; index < number.length; index++) {
    if (Number(number[index]) < Number(number[index - 1])) {
      return false;
    }
  }

  return true;
}

function checkAdjacentDigitRepeatedExactlyTwiceExistance(number) {
  const groups = [...number].reduce((hash, char) => {
    hash[char] = (hash[char] || 0) + 1;
    return hash;
  }, {});
  const hasNumberRepeatedExactlyTwice = Object.values(groups).some(
    count => count === 2
  );

  return hasNumberRepeatedExactlyTwice;
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
    if (
      checkIncreasity(number) &&
      // long function names, huh, Freud?
      checkAdjacentDigitRepeatedExactlyTwiceExistance(number)
    ) {
      total++;
    }
  }

  await writeFile('output', String(total));
}

solve();
