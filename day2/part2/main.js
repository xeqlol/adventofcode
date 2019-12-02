const { readFile, writeFile } = require("fs").promises;

(async function solve() {
  const rawData = await readFile("input");
  const [rawInstructions, rawTarget] = rawData.toString().split("\n");
  const instructions = rawInstructions.split(",").map(Number);
  const target = Number(rawTarget);

  // BRUTEFOOOOOOOOOOOOOOOOORCE
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const tempInstructions = [...instructions];
      tempInstructions[1] = noun;
      tempInstructions[2] = verb;

      const programOutput = runProgram(tempInstructions);

      if (programOutput === target) {
        writeFile("output", String(noun * 100 + verb));
        return;
      }
    }
  }
})();

function runProgram(instructions) {
  processLoop: for (let pointer = 0; pointer < instructions.length; ) {
    const opcode = instructions[pointer];

    switch (opcode) {
      case 1: {
        const [left, right, output] = getOpcodePointers(pointer, instructions);

        instructions[output] = instructions[left] + instructions[right];
        pointer += 4;
        break;
      }

      case 2: {
        const [left, right, output] = getOpcodePointers(pointer, instructions);

        instructions[output] = instructions[left] * instructions[right];
        pointer += 4;
        break;
      }

      case 99: {
        break processLoop;
      }
    }
  }

  return instructions[0];
}

function getOpcodePointers(pointer, instructions) {
  const leftPointer = instructions[pointer + 1];
  const rightPointer = instructions[pointer + 2];
  const outputPointer = instructions[pointer + 3];

  return [leftPointer, rightPointer, outputPointer];
}
