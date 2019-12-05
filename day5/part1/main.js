const { readFile, writeFile } = require('fs').promises;

function parseOpcode(rawOpcode) {
  rawOpcode = String(rawOpcode);
  const [A, B, C, D] = [
    ...new Array(4 - rawOpcode.length).fill(0),
    ...rawOpcode,
  ];

  return { code: `${C}${D}`, mods: [Number(A), Number(B)] };
}

function parseArguments(mods, instructions, pointer) {
  const [mod2, mod1] = mods;

  const first = mod1
    ? instructions[pointer + 1]
    : instructions[instructions[pointer + 1]];
  const second = mod2
    ? instructions[pointer + 2]
    : instructions[instructions[pointer + 2]];
  const third = instructions[pointer + 3];

  return { first, second, third };
}

async function solve() {
  const rawData = await readFile('input');
  const instructions = rawData
    .toString()
    .split(',')
    .map(Number);
  const outputBuffer = [];
  const input = 1;

  processLoop: for (let pointer = 0; pointer < instructions.length; ) {
    const { code, mods } = parseOpcode(instructions[pointer]);
    const { first, second, third } = parseArguments(
      mods,
      instructions,
      pointer
    );

    switch (code) {
      case '01': {
        instructions[third] = first + second;

        pointer += 4;
        break;
      }

      case '02': {
        instructions[third] = first * second;

        pointer += 4;
        break;
      }

      case '03': {
        instructions[first] = input;

        pointer += 2;
        break;
      }

      case '04': {
        outputBuffer.push(first);

        pointer += 2;
        break;
      }

      case '99': {
        break processLoop;
      }
    }
  }

  await writeFile('output', String(outputBuffer.pop()));
}

solve();
