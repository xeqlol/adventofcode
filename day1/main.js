const { readFile, writeFile } = require("fs").promises;

async function solve() {
  console.log("kek");
  const rawData = await readFile("input");
  const data = rawData
    .toString()
    .split("\n")
    .map(Number);
  const getFuelFromMass = mass => {
    return Math.floor(mass / 3) - 2;
  };
  const fuelRequirements = data.map(getFuelFromMass);
  const totalFuel = fuelRequirements.reduce(
    (total, current) => total + current,
    0
  );

  writeFile("output", String(totalFuel));
}

solve();
