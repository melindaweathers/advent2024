import fs from "node:fs";

// Next step in x, y
const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function printMap(map) {
  console.log("");
  console.log("");
  for (let row of map) console.log(row.join(""));
  console.log("");
  console.log("");
}

function loadMap(filename) {
  const data = fs.readFileSync(filename, "utf8");
  let map = data.split("\n").map((row) => row.split(""));
  let status = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] == "^") {
        status.y = y;
        status.x = x;
        status.dirPos = 0; // Position in the DIRS array
        map[y][x] = "X";
        status.map = map;
        status.visited = [{ x, y, dirPos: 0 }];
        return status;
      }
    }
  }
}

function alreadyVisited(status) {
  for (let visited of status.visited) {
    if (
      visited.x == status.x &&
      visited.y == status.y &&
      visited.dirPos == status.dirPos
    )
      return true;
  }
}

function tick(status) {
  let [stepX, stepY] = DIRS[status.dirPos];
  // Turn right if we encounter an obstacle
  if (
    status.x + stepX < 0 ||
    status.x + stepX >= status.map[0].length ||
    status.y + stepY < 0 ||
    status.y + stepY >= status.map.length
  ) {
    status.done = true;
  } else if (status.map[status.y + stepY][status.x + stepX] == "#") {
    status.dirPos = (status.dirPos + 1) % 4;
  } else {
    status.x = status.x + stepX;
    status.y = status.y + stepY;
    status.map[status.y][status.x] = "X";
    if (alreadyVisited(status)) {
      status.done = true;
      status.loop = true;
    } else {
      status.visited.push({ x: status.x, y: status.y, dirPos: status.dirPos });
    }
  }
}

// Count the X characters in the grid
function countXs(grid) {
  let count = 0;
  for (let row of grid) {
    count += row.filter((val) => val == "X").length;
  }
  return count;
}

function countVisitedFromStatus(status) {
  let done = false;
  while (!done) {
    tick(status);
    if (status.done) {
      if (status.loop) return "LOOP";
      return countXs(status.map);
    }
  }
}

const countVisited = (filename) => countVisitedFromStatus(loadMap(filename));

function replaceEl(arr, pos, el) {
  return arr
    .slice(0, pos)
    .concat([el])
    .concat(arr.slice(pos + 1));
}

function countLoopPositions(filename) {
  let status = loadMap(filename);
  let count = 0;
  for (let y = 0; y < status.map.length; y++) {
    for (let x = 0; x < status.map[0].length; x++) {
      if (status.map[y][x] == "." && !(y == status.y && x == status.x)) {
        const newRow = replaceEl(status.map[y], x, "#");
        status.map = replaceEl(status.map, y, newRow);
        console.log(x, y);
        if (countVisitedFromStatus(status) == "LOOP") count++;
        status = loadMap(filename);
      }
    }
  }
  return count;
}

console.log(countVisited("./input-test.txt"));
console.log(countVisited("./input.txt"));

console.log(countLoopPositions("./input-test.txt"));
console.log(countLoopPositions("./input.txt"));
