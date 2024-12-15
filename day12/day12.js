import fs from "node:fs";

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

function buildGrid(filename) {
  const grid = [];
  for (let row of fs.readFileSync(filename, "utf8").split("\n")) {
    grid.push(row.split("").map((letter) => ({ letter })));
  }
  return grid;
}

function perimeter(x, y, grid) {
  const letter = grid[y][x].letter;
  let perimeter = 0;
  for (let [dx, dy] of DIRS) {
    let cell = grid[y + dy] && grid[y + dy][x + dx];
    if (cell?.letter != letter) perimeter++;
  }
  return perimeter;
}

function unassignedNeighbors(x, y, grid) {
  const letter = grid[y][x].letter;
  const neighbors = [];
  for (let [dx, dy] of DIRS) {
    let cell = grid[y + dy] && grid[y + dy][x + dx];
    if (cell?.letter == letter && !cell.region) {
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function fillNewRegion(startX, startY, grid, region) {
  const letter = grid[startY][startX].letter;
  let frontier = [[startX, startY]];
  while (frontier.length) {
    let [x, y] = frontier.pop();
    if (!grid[y][x].region) {
      region.area++;
      region.perimeter += perimeter(x, y, grid);
      grid[y][x].region = region;
      frontier = frontier.concat(unassignedNeighbors(x, y, grid));
    }
  }
}

function buildRegions(filename) {
  const grid = buildGrid(filename);
  const regions = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (!grid[y][x].region) {
        let region = { area: 0, perimeter: 0, letter: grid[y][x].letter };
        fillNewRegion(x, y, grid, region);
        regions.push(region);
      }
    }
  }
  // console.log(regions);
  return regions;
}

function totalPrice(filename) {
  let total = 0;
  for (let region of buildRegions(filename)) {
    total += region.area * region.perimeter;
  }
  return total;
}

console.log(totalPrice("input-test-1.txt"));
console.log(totalPrice("input-test-2.txt"));
console.log(totalPrice("input-test-3.txt"));
console.log(totalPrice("input-test-4.txt"));
console.log(totalPrice("input.txt"));
