const { readFile, writeFile } = require('fs').promises;

function getOpcodePointers(pointer, instructions) {
  const leftPointer = instructions[pointer + 1];
  const rightPointer = instructions[pointer + 2];
  const outputPointer = instructions[pointer + 3];

  return [leftPointer, rightPointer, outputPointer];
}

async function solve() {
  const rawData = await readFile('input');
  const instructions = rawData
    .toString()
    .split(',')
    .map(Number);

  instructions[1] = 12;
  instructions[2] = 2;

  processLoop: for (let pointer = 0; pointer < instructions.length; ) {
    const opcode = instructions[pointer];
    const [left, right, output] = getOpcodePointers(pointer, instructions);

    switch (opcode) {
      case 1: {
        instructions[output] = instructions[left] + instructions[right];
        pointer += 4;
        break;
      }

      case 2: {
        instructions[output] = instructions[left] * instructions[right];
        pointer += 4;
        break;
      }

      case 99: {
        break processLoop;
      }
    }
  }

  await writeFile('output', instructions[0]);
}

solve();
