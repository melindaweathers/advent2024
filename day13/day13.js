import fs from "node:fs";

function loadMachines(filename, part2) {
  const machines = [];
  for (let machineBlock of fs.readFileSync(filename, "utf8").split("\n\n")) {
    let [lineA, lineB, linePrize] = machineBlock.split("\n");
    machines.push({
      ax: Number(lineA.match(/X\+(\d+)/)[1]),
      ay: Number(lineA.match(/Y\+(\d+)/)[1]),
      bx: Number(lineB.match(/X\+(\d+)/)[1]),
      by: Number(lineB.match(/Y\+(\d+)/)[1]),
      px: Number(linePrize.match(/X=(\d+)/)[1]) + (part2 ? 10000000000000 : 0),
      py: Number(linePrize.match(/Y=(\d+)/)[1]) + (part2 ? 10000000000000 : 0),
    });
  }
  return machines;
}

function cheapestWin({ ax, bx, px, ay, by, py }) {
  const b = (ax * py - ay * px) / (ax * by - ay * bx);
  const a = (px - bx * b) / ax;
  if (Math.floor(b) == b && Math.floor(a) == a) {
    return a * 3 + b;
  } else {
    return 0;
  }
}

function cheapestWins(filename, part2 = false) {
  const machines = loadMachines(filename, part2);
  let total = 0;
  for (let machine of machines) {
    total += cheapestWin(machine);
  }
  return total;
}

console.log(cheapestWins("input-test.txt"));
console.log(cheapestWins("input.txt"));

console.log(cheapestWins("input-test.txt", true));
console.log(cheapestWins("input.txt", true));
