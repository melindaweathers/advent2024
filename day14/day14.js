import fs from "node:fs";
import * as readline from "node:readline/promises";

function loadRobots(filename) {
  const robots = [];
  // p=0,4 v=3,-3
  for (let line of fs.readFileSync(filename, "utf8").split("\n")) {
    const [u1, px, py, u2, vx, vy] = line.split(/[, =]/).map((x) => Number(x));
    robots.push({ px, py, vx, vy });
  }
  return robots;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function moveRobot(robot, times, width, height) {
  return {
    px: mod(robot.px + robot.vx * times, width),
    py: mod(robot.py + robot.vy * times, height),
    vx: robot.vx,
    vy: robot.vy,
  };
}

function safetyFactor(robots, width, height) {
  let [q1, q2, q3, q4] = [0, 0, 0, 0];
  const halfW = (width - 1) / 2;
  const halfH = (height - 1) / 2;
  for (let { px, py } of robots) {
    if (px < halfW && py < halfH) q1++;
    else if (px > halfW && py < halfH) q2++;
    else if (px < halfW && py > halfH) q3++;
    else if (px > halfW && py > halfH) q4++;
  }
  // console.log(q1, q2, q3, q4);
  return q1 * q2 * q3 * q4;
}

function safetyFactorAfterMove(filename, times, width, height) {
  let robots = loadRobots(filename);
  robots = robots.map((robot) => moveRobot(robot, times, width, height));
  return safetyFactor(robots, width, height);
}

console.log(safetyFactorAfterMove("input-test.txt", 100, 11, 7));
console.log(safetyFactorAfterMove("input.txt", 100, 101, 103));

function printRobots(robots, width, height) {
  const grid = new Array(height);
  for (let y = 0; y < height; y++) grid[y] = Array(width).fill(0);
  for (let robot of robots) grid[robot.py][robot.px]++;
  for (let row of grid) {
    console.log(row.map((num) => (num == 0 ? "." : String(num))).join(""));
  }
}

async function infiniteVideo(filename, width, height) {
  let robots = loadRobots(filename);
  let seconds = 0;
  let factor = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    robots = robots.map((robot) => moveRobot(robot, 1, width, height));
    seconds++;
    factor = safetyFactor(robots, width, height);
    if (factor < 65281986) {
      console.log("");
      console.log("");
      console.log("Seconds Elapsed", seconds);
      printRobots(robots, width, height);
      console.log(factor);
      await rl.question("Press Enter to continue...");
    }
  }
}

// infiniteVideo("input-test.txt", 11, 7);
infiniteVideo("input.txt", 101, 103);
