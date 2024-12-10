import fs from "node:fs";

function expand(encodedStr) {
  const arr = [];
  let id = 0;
  for (let i = 0; i < encodedStr.length; i++) {
    let num = Number(encodedStr[i]);
    if (i % 2 == 0) {
      for (let j = 0; j < num; j++) {
        arr.push(id);
      }
      id++;
    } else {
      for (let j = 0; j < num; j++) {
        arr.push(".");
      }
    }
  }
  return arr;
}

function checksum(expanded) {
  let sum = 0;
  for (let i = 0; i < expanded.length; i++) {
    if (expanded[i] != ".") {
      sum += i * expanded[i];
    }
  }
  return sum;
}

function part1(filename) {
  const data = expand(fs.readFileSync(filename, "utf8"));
  let from = 0;
  let r = data.length - 1;
  for (let l = 0; l <= r; l++) {
    if (data[l] == ".") {
      while (data[r] == ".") r--;
      data[l] = data[r];
      data[r] = ".";
      r--;
    }
  }

  return checksum(data);
}

// Find the best position for this file
function findNewFilePos(data, fileSize, maxPos) {
  let pos = -1;
  let size = 0;
  for (let i = 0; i <= maxPos; i++) {
    if (data[i] == ".") {
      if (pos == -1) pos = i;
      size++;
      if (size == fileSize) return pos;
    } else {
      pos = -1;
      size = 0;
    }
  }
  return -1;
}

function part2(filename) {
  const rawData = fs.readFileSync(filename, "utf8");
  const data = expand(rawData);

  let id = data[data.length - 1];
  let blockSize = 0;
  for (let r = data.length - 1; r >= 0; r--) {
    if (data[r] == id) {
      blockSize++;
    } else {
      if (blockSize > 0) {
        //move this block if we can
        let newPos = findNewFilePos(data, blockSize, r);
        if (newPos >= 0) {
          console.log(`${blockSize} blocks id ${id} from ${r} to ${newPos}`);
          for (let j = newPos; j < newPos + blockSize; j++) data[j] = id;
          for (let k = r + 1; k <= r + blockSize; k++) data[k] = ".";
        }
        blockSize = 0;
        // console.log(data.join(""));
      }
      if (data[r] == id - 1) {
        id = data[r];
        blockSize = 1;
      }
    }
  }

  return checksum(data);
}

// console.log(expand("12345"));
// console.log(expand("2333133121414131402"));

console.log(part1("input-test.txt"));
console.log(part1("input.txt"));

// console.log(part2("input-test.txt"));
console.log(part2("input.txt"));

// 6363268359248 too high
// 6363208421042 too low
