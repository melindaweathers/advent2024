import fs from "node:fs";

function canBeProduced(result, inputs, includeConcat) {
  if (inputs.length == 1) {
    if (inputs[0] == result) return true;
    else return false;
  } else {
    const [first, second, ...rest] = inputs;
    return (
      canBeProduced(result, [first + second].concat(rest), includeConcat) ||
      canBeProduced(result, [first * second].concat(rest), includeConcat) ||
      (includeConcat &&
        canBeProduced(
          result,
          [Number(String(first) + String(second))].concat(rest),
          includeConcat
        ))
    );
  }
}

function totalCalibration(filename, includeConcat = false) {
  const data = fs.readFileSync(filename, "utf8");
  let total = 0;
  for (let row of data.split("\n")) {
    const [resultStr, inputsStr] = row.split(": ");
    const result = Number(resultStr);
    const inputs = inputsStr.split(" ").map((x) => Number(x));
    if (canBeProduced(result, inputs, includeConcat)) total += result;
  }
  return total;
}

console.log(totalCalibration("./input-test.txt"));
console.log(totalCalibration("./input.txt"));

console.log(totalCalibration("./input-test.txt", true));
console.log(totalCalibration("./input.txt", true));
