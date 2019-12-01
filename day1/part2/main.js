const { readFile, writeFile } = require("fs").promises;

(async function solve() {
  const rawData = await readFile("input");
  const data = rawData
    .toString()
    .split("\n")
    .map(Number);
  const getFuelFromMass = mass => {
    if (mass <= 0) {
      return 0;
    }

    const fuel = Math.max(Math.floor(mass / 3) - 2, 0);
    const total = fuel + getFuelFromMass(fuel);

    return total;
  };
  const fuelRequirements = data.map(getFuelFromMass);
  const totalFuel = fuelRequirements.reduce(
    (total, current) => total + current,
    0
  );

  writeFile("output", String(totalFuel));
})();
