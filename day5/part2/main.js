const { readFile, writeFile } = require('fs').promises;

function parseOpcode(rawOpcode) {
  rawOpcode = String(rawOpcode);
  const [A, B, C, D, E] = [
    ...new Array(5 - rawOpcode.length).fill(0),
    ...rawOpcode,
  ];

  return [Number(A), Number(B), Number(C), `${D}${E}`];
}

async function solve() {
  const rawData = await readFile('input');
  const instructions = rawData
    .toString()
    .split(',')
    .map(Number);
  const outputBuffer = [];
  const input = 5;

  processLoop: for (let pointer = 0; pointer < instructions.length; ) {
    const [mod3, mod2, mod1, opcode] = parseOpcode(instructions[pointer]);

    switch (opcode) {
      case '01': {
        // TODO: refactor this madness
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];
        const outPointer = instructions[pointer + 3];

        instructions[outPointer] = first + second;

        pointer += 4;
        break;
      }

      case '02': {
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];
        const outPointer = instructions[pointer + 3];

        instructions[outPointer] = first * second;

        pointer += 4;
        break;
      }

      case '03': {
        const inputPointer = instructions[pointer + 1];

        instructions[inputPointer] = input;

        pointer += 2;
        break;
      }

      case '04': {
        const output = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];

        outputBuffer.push(output);

        pointer += 2;
        break;
      }

      case '05': {
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];

        if (first !== 0) {
          pointer = second;
          break;
        }

        pointer += 3;
        break;
      }

      case '06': {
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];

        if (first === 0) {
          pointer = second;
          break;
        }

        pointer += 3;
        break;
      }

      case '07': {
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];
        const outPointer = instructions[pointer + 3];

        instructions[outPointer] = Number(first < second);

        pointer += 4;
        break;
      }

      case '08': {
        const first = mod1
          ? instructions[pointer + 1]
          : instructions[instructions[pointer + 1]];
        const second = mod2
          ? instructions[pointer + 2]
          : instructions[instructions[pointer + 2]];
        const outPointer = instructions[pointer + 3];

        instructions[outPointer] = Number(first === second);

        pointer += 4;
        break;
      }

      case '99': {
        break processLoop;
      }

      default:
        return;
    }
  }

  await writeFile('output', String(outputBuffer.pop()));
}

solve();
