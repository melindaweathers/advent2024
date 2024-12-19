function runStep(a, b, c, instr, ptr) {
  const opcode = instr[ptr];
  const literal = instr[ptr + 1];
  const combo = [0, 1, 2, 3, a, b, c][literal];
  let output = null;

  // adv
  if (opcode == 0) {
    a = Math.floor(a / 2 ** combo);
    ptr += 2;
    // bxl
  } else if (opcode == 1) {
    b = b ^ literal;
    ptr += 2;
    // bst
  } else if (opcode == 2) {
    b = combo % 8;
    ptr += 2;
    // jnz
  } else if (opcode == 3) {
    if (a == 0) ptr += 2;
    else ptr = literal;
    // bxc
  } else if (opcode == 4) {
    b = b ^ c;
    ptr += 2;
    // out
  } else if (opcode == 5) {
    output = combo % 8;
    ptr += 2;
    // bdv
  } else if (opcode == 6) {
    b = Math.floor(a / 2 ** combo);
    ptr += 2;
    // cdv
  } else if (opcode == 7) {
    c = Math.floor(a / 2 ** combo);
    ptr += 2;
  }

  return [a, b, c, ptr, output];
}

function runProgram(a, b, c, instr) {
  let outputs = [];
  let ptr = 0;
  let newOutput = null;

  while (ptr < instr.length) {
    [a, b, c, ptr, newOutput] = runStep(a, b, c, instr, ptr);
    if (newOutput != null) outputs.push(newOutput);
    newOutput = null;
  }

  return [a, b, c, outputs.join(",")];
}

let a, b, c, ptr, output;
[a, b, c, output] = runProgram(0, 0, 9, [2, 6]);
console.log(b == 1);

[a, b, c, output] = runProgram(10, 0, 0, [5, 0, 5, 1, 5, 4]);
console.log(output == "0,1,2");

[a, b, c, output] = runProgram(2024, 0, 0, [0, 1, 5, 4, 3, 0]);
console.log(output == "4,2,5,6,7,7,7,7,3,1,0");
console.log(a == 0);

[a, b, c, output] = runProgram(0, 29, 0, [1, 7]);
console.log(b == 26);

[a, b, c, output] = runProgram(0, 2024, 43690, [4, 0]);
console.log(b == 44354);

console.log(runProgram(729, 0, 0, [0, 1, 5, 4, 3, 0]));

console.log(
  runProgram(34615120, 0, 0, [2, 4, 1, 5, 7, 5, 1, 6, 0, 3, 4, 3, 5, 5, 3, 0])
);
