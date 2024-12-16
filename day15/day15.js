import fs from "node:fs";

const DIRS = new Map([
  ["^", { y: -1, x: 0 }],
  ["<", { y: 0, x: -1 }],
  ["v", { y: 1, x: 0 }],
  [">", { y: 0, x: 1 }],
]);

function loadFile(filename) {
  const [gridStr, moveStr] = fs.readFileSync(filename, "utf8").split("\n\n");
  const grid = [];
  let x = 0,
    y = 0;
  for (let row of gridStr.split("\n")) {
    grid.push(row.split(""));
    if (row.indexOf("@") > 0) {
      x = row.indexOf("@");
      y = grid.length - 1;
    }
  }
  const moves = moveStr.split("\n").join("").split("");
  return [grid, moves, x, y];
}

function canMove(grid, xStart, yStart, dir) {
  let [x, y] = [xStart, yStart];
  while (grid[y] && grid[y][x] != "#") {
    if (grid[y][x] == ".") return [x, y];
    [x, y] = [x + DIRS.get(dir).x, y + DIRS.get(dir).y];
  }
  return [null, null];
}

function moveRobot(grid, x, y, dir) {
  let [spaceX, spaceY] = canMove(grid, x, y, dir);
  if (spaceX && spaceY) {
    do {
      let [nextX, nextY] = [spaceX - DIRS.get(dir).x, spaceY - DIRS.get(dir).y];
      grid[spaceY][spaceX] = grid[nextY][nextX];
      grid[nextY][nextX] = ".";
      [spaceX, spaceY] = [nextX, nextY];
    } while (x != spaceX || y != spaceY);
    return [grid, x + DIRS.get(dir).x, y + DIRS.get(dir).y];
  } else {
    return [grid, x, y];
  }
}

function printGrid(grid) {
  console.log();
  for (let row of grid) console.log(row.join(""));
}

function gpsCoords(grid) {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == "O") count += 100 * y + x;
    }
  }
  return count;
}

function loadAndMove(filename) {
  let [grid, moves, x, y] = loadFile(filename);
  for (let move of moves) {
    // console.log("Move", move);
    [grid, x, y] = moveRobot(grid, x, y, move);
  }
  // printGrid(grid);
  return gpsCoords(grid);
}

console.log(loadAndMove("input-test-1.txt"));
console.log(loadAndMove("input-test-2.txt"));
console.log(loadAndMove("input.txt"));
