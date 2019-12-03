const { readFile, writeFile } = require('fs').promises;

function getSegmentsFromPath(path) {
  let currentPoint = [0, 0];
  let distance = 0;
  const segments = [];

  for (let shift of path) {
    let [direction, ...step] = shift;
    step = Number(step.join(''));
    const [currentX, currentY] = currentPoint;
    let nextX, nextY;

    switch (direction) {
      case 'R': {
        [nextX, nextY] = [currentX + step, currentY];
        break;
      }
      case 'L': {
        [nextX, nextY] = [currentX - step, currentY];
        break;
      }
      case 'U': {
        [nextX, nextY] = [currentX, currentY + step];
        break;
      }
      case 'D': {
        [nextX, nextY] = [currentX, currentY - step];
        break;
      }
    }
    segments.push({
      distance,
      coords: [currentX, currentY, nextX, nextY],
    });
    distance += step;
    currentPoint = [nextX, nextY];
  }

  return segments;
}

function getIntersection(firstSegment, secondSegment) {
  const { distance: firstDistance, coords: firstSegmentCoords } = firstSegment;
  const {
    distance: secondDistance,
    coords: secondSegmentCoords,
  } = secondSegment;

  const [x1, y1, x2, y2] = firstSegmentCoords;
  const [x3, y3, x4, y4] = secondSegmentCoords;

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  const firstDistanceToIntersection = Math.hypot(x1 - x, y1 - y);
  const secondDistanceToIntersection = Math.hypot(x3 - x, y3 - y);

  const distance =
    firstDistance +
    secondDistance +
    firstDistanceToIntersection +
    secondDistanceToIntersection;

  return { coords: [x, y], distance };
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

  return intersections;
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

  const distances = intersections.map(({ totalDistance }) => totalDistance);

  const minDistance = Math.min(...distances);

  await writeFile('output', String(minDistance));
}

solve();
