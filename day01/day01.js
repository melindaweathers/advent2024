import fs from "node:fs";

function parseFile(filename) {
  const data = fs.readFileSync(filename, "utf8");
  const rows = data.split("\n");
  let leftVals = [],
    rightVals = [];
  for (let row of rows) {
    let [left, right] = row.split(/\s+/);
    leftVals.push(Number(left));
    rightVals.push(Number(right));
  }
  return [leftVals, rightVals];
}

function findDiffs(filename) {
  let [leftSorted, rightSorted] = parseFile(filename).map((arr) => arr.sort());
  let total = 0;
  for (let i = 0; i < leftSorted.length; i++) {
    total += Math.abs(leftSorted[i] - rightSorted[i]);
  }
  return total;
}

function similarity(filename) {
  let [leftList, rightList] = parseFile(filename);
  let total = 0;
  for (let val of leftList) {
    total += val * rightList.filter((x) => x == val).length;
  }
  return total;
}

console.log(findDiffs("./input-test.txt"));
console.log(findDiffs("./input.txt"));

console.log(similarity("./input-test.txt"));
console.log(similarity("./input.txt"));
