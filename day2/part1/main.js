const { readFile, writeFile } = require("fs").promises;

(async function solve() {
  const rawData = await readFile("input");
  const data = rawData
    .toString()
    .split(",")
    .map(Number);

  data[1] = 12;
  data[2] = 2;

  processLoop: for (let pointer = 0; pointer < data.length; ) {
    const opcode = data[pointer];

    switch (opcode) {
      case 1: {
        const [left, right, output] = getOpcodePointers(pointer, data);

        data[output] = data[left] + data[right];
        pointer += 4;
        break;
      }

      case 2: {
        const [left, right, output] = getOpcodePointers(pointer, data);

        data[output] = data[left] * data[right];
        pointer += 4;
        break;
      }

      case 99: {
        break processLoop;
      }
    }
  }

  writeFile("output", data[0]);
})();

function getOpcodePointers(pointer, data) {
  const leftPointer = data[pointer + 1];
  const rightPointer = data[pointer + 2];
  const outputPointer = data[pointer + 3];

  return [leftPointer, rightPointer, outputPointer];
}
