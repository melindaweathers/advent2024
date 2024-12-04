import fs from "node:fs";

const DIRS = [
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 0],
  [-1, 0],
];

function part1(x, y, grid, word = "XMAS") {
  let count = 0;
  for (let [xdiff, ydiff] of DIRS) {
    let str = grid[x][y];
    for (let i = 1; i < word.length; i++) {
      str +=
        (grid[x + xdiff * i] ? grid[x + xdiff * i][y + ydiff * i] : "") || "";
    }
    if (str == word) count++;
  }

  return count;
}

function part2(x, y, grid) {
  let count = 0;
  const upleft = grid[x - 1] ? grid[x - 1][y - 1] : "";
  const upright = grid[x + 1] ? grid[x + 1][y - 1] : "";
  const downleft = grid[x - 1] ? grid[x - 1][y + 1] : "";
  const downright = grid[x + 1] ? grid[x + 1][y + 1] : "";

  if (
    ((upleft == "M" && downright == "S") ||
      (upleft == "S" && downright == "M")) &&
    ((upright == "M" && downleft == "S") || (upright == "S" && downleft == "M"))
  )
    count++;

  return count;
}

function countTotal(filename, anchorLetter, fun) {
  const data = fs.readFileSync(filename, "utf8");
  let sum = 0;
  let grid = data.split("\n");
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[x][y] == anchorLetter) sum += fun(x, y, grid);
    }
  }
  return sum;
}

console.log(countTotal("./input-test.txt", "X", part1));
console.log(countTotal("./input.txt", "X", part1));

console.log(countTotal("./input-test.txt", "A", part2));
console.log(countTotal("./input.txt", "A", part2));
