const { readFile, writeFile } = require('fs').promises;

function getSegmentsFromPath(path) {
  let currentPoint = [0, 0];
  const segments = [];

  for (let shift of path) {
    let [direction, ...distance] = shift;
    distance = Number(distance.join(''));
    const [currentX, currentY] = currentPoint;
    let nextX, nextY;

    switch (direction) {
      case 'R': {
        [nextX, nextY] = [currentX + distance, currentY];
        break;
      }
      case 'L': {
        [nextX, nextY] = [currentX - distance, currentY];
        break;
      }
      case 'U': {
        [nextX, nextY] = [currentX, currentY + distance];
        break;
      }
      case 'D': {
        [nextX, nextY] = [currentX, currentY - distance];
        break;
      }
    }

    segments.push([currentX, currentY, nextX, nextY]);
    currentPoint = [nextX, nextY];
  }

  return segments;
}

function getIntersection(firstSegment, secondSegment) {
  const [x1, y1, x2, y2] = firstSegment;
  const [x3, y3, x4, y4] = secondSegment;

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return [x, y];
}

function getIntersections(firstSegments, secondSegments) {
  const intersections = [];

  for (let firstSegment of firstSegments) {
    for (let secondSegment of secondSegments) {
      const intersection = getIntersection(firstSegment, secondSegment);

      if (intersection) {
        intersections.push(intersection);
      }
    }
  }

  intersections.shift(); // remove origin

  return intersections;
}

function manhattanDistance(start, end) {
  let distance = 0;
  const dimensions = Math.max(start.length, end.length);

  for (let index = 0; index < dimensions; index++) {
    distance += Math.abs((end[index] || 0) - (start[index] || 0));
  }

  return distance;
}

async function solve() {
  const rawData = await readFile('input');
  const [firstWirePath, secondWirePath] = rawData
    .toString()
    .split('\n')
    .map(coords => coords.split(','));

  const firstWireSegments = getSegmentsFromPath(firstWirePath);
  const secondWireSegments = getSegmentsFromPath(secondWirePath);

  const intersections = getIntersections(firstWireSegments, secondWireSegments);

  const manhattanDistances = intersections.map(intersection =>
    manhattanDistance([0, 0], intersection)
  );

  const minDistance = Math.min(...manhattanDistances);

  await writeFile('output', String(minDistance));
}

solve();
