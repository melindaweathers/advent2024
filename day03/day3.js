import fs from "node:fs";

function mulEnabledAt(pos, data) {
  const lastDont = data.lastIndexOf("don't()", pos);
  const lastDo = data.lastIndexOf("do()", pos);
  return lastDont == -1 || lastDo > lastDont;
}

function totalMuls(filename, checkEnablement) {
  const data = fs.readFileSync(filename, "utf8");
  let sum = 0;
  let matches = data.matchAll(/mul\((\d+),(\d+)\)/g);
  for (let match of matches) {
    if (!checkEnablement || mulEnabledAt(match.index, data)) {
      sum += Number(match[1] * match[2]);
    }
  }
  return sum;
}

console.log(totalMuls("./input-test.txt", false));
console.log(totalMuls("./input.txt", false));

console.log(totalMuls("./input-test-2.txt", true));
console.log(totalMuls("./input.txt", true));
