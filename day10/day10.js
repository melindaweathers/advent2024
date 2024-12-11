import fs from "node:fs";

const DIRS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function readMap(filename) {
  const data = fs.readFileSync(filename, "utf8");
  return data.split("\n");
}

function pointExists(arr, x, y) {
  return arr.filter(([a, b]) => a == x && b == y).length > 0;
}

function scoreTrailhead(data, startX, startY, part2) {
  let frontier = [[startX, startY]];
  let nextFrontier = [];
  for (let elev = 1; elev <= 9; elev++) {
    for (let [x, y] of frontier) {
      for (let [xDiff, yDiff] of DIRS) {
        if (data[y + yDiff] && data[y + yDiff][x + xDiff] == elev) {
          if (part2 || !pointExists(nextFrontier, x + xDiff, y + yDiff)) {
            nextFrontier.push([x + xDiff, y + yDiff]);
          }
        }
      }
    }
    frontier = nextFrontier;
    nextFrontier = [];
  }
  return frontier.length;
}

function sumTrailheads(filename, part2 = false) {
  let data = readMap(filename);
  let sum = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      if (data[y][x] == "0") sum += scoreTrailhead(data, x, y, part2);
    }
  }
  return sum;
}

console.log(sumTrailheads("input-test.txt"));
console.log(sumTrailheads("input.txt"));

console.log(sumTrailheads("input-test.txt", true));
console.log(sumTrailheads("input.txt", true));
