import fs from "node:fs";

function findNodes(filename) {
  const data = fs.readFileSync(filename, "utf8");
  let nodes = new Map();
  let rows = data.split("\n");
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const char = rows[y][x];
      if (char != ".") {
        nodes.set(char, (nodes.get(char) || []).concat({ x, y }));
      }
    }
  }
  return [nodes, rows[0].length - 1, rows.length - 1];
}

const inRange = ({ x, y }, maxX, maxY) =>
  x >= 0 && x <= maxX && y >= 0 && y <= maxY;

function antinodesNoResonance(a, b, maxX, maxY) {
  let antinodes = [];
  let anti1 = { x: 2 * a.x - b.x, y: 2 * a.y - b.y };
  if (inRange(anti1, maxX, maxY)) antinodes.push(anti1);
  let anti2 = { x: 2 * b.x - a.x, y: 2 * b.y - a.y };
  if (inRange(anti2, maxX, maxY)) antinodes.push(anti2);
  return antinodes;
}

function antinodesWithResonance(a, b, maxX, maxY) {
  let antinodes = [];
  let newNodeCount = -1;
  for (let res = 0; newNodeCount != 0; res++) {
    newNodeCount = 0;
    let anti1 = { x: b.x + res * (b.x - a.x), y: b.y + res * (b.y - a.y) };
    if (inRange(anti1, maxX, maxY)) {
      antinodes.push(anti1);
      newNodeCount++;
    }
    let anti2 = { x: a.x - res * (b.x - a.x), y: a.y - res * (b.y - a.y) };
    if (inRange(anti2, maxX, maxY)) {
      antinodes.push(anti2);
      newNodeCount++;
    }
  }
  return antinodes;
}

function findAntinodes(positions, maxX, maxY, fun = antinodesNoResonance) {
  let antinodes = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      antinodes = antinodes.concat(fun(positions[i], positions[j], maxX, maxY));
    }
  }
  return antinodes;
}

function countAntinodes(filename, fun) {
  let antinodes = new Map();
  const [nodes, maxX, maxY] = findNodes(filename);

  for (let [_, positions] of nodes) {
    for (let antinode of findAntinodes(positions, maxX, maxY, fun)) {
      antinodes.set(JSON.stringify(antinode), antinode);
    }
  }
  return antinodes.size;
}

console.log(countAntinodes("./input-test.txt"));
console.log(countAntinodes("./input.txt"));

console.log(countAntinodes("./input-test.txt", antinodesWithResonance));
console.log(countAntinodes("./input.txt", antinodesWithResonance));
