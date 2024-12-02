import fs from "node:fs";

function anySafeWithDampener(levels) {
  for (let i = 0; i < levels.length; i++) {
    let without = levels.slice(0, i).concat(levels.slice(i + 1));
    if (safeLevels(without, false)) return true;
  }
  return false;
}

function safeLevels(levels, withDampener) {
  let increasing = levels[1] > levels[0];

  for (let i = 1; i < levels.length; i++) {
    let a = levels[i - 1];
    let b = levels[i];
    let diff = Math.abs(a - b);
    if (
      (increasing && b < a) ||
      (!increasing && b > a) ||
      diff < 1 ||
      diff > 3
    ) {
      if (withDampener) return anySafeWithDampener(levels);
      else return false;
    }
  }
  return true;
}

function countSafe(filename, withDampener) {
  const data = fs.readFileSync(filename, "utf8");
  const rows = data.split("\n");
  let count = 0;
  for (let row of rows) {
    let levels = row.split(" ").map((x) => Number(x));
    if (safeLevels(levels, withDampener)) count++;
  }
  return count;
}

console.log(countSafe("./input-test.txt", false));
console.log(countSafe("./input.txt", false));

console.log(countSafe("./input-test.txt", true));
console.log(countSafe("./input.txt", true));
