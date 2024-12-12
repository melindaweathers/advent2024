const parse = (str) => str.split(" ").map((x) => Number(x));

function blink(arr) {
  const newArr = [];
  for (let el of arr) {
    if (el == 0) {
      newArr.push(1);
    } else if (String(el).length % 2 == 0) {
      let elStr = String(el);
      newArr.push(Number(elStr.slice(0, elStr.length / 2)));
      newArr.push(Number(elStr.slice(elStr.length / 2)));
    } else {
      newArr.push(el * 2024);
    }
  }
  return newArr;
}

function multiBlink(arr, times) {
  for (let i = 0; i < times; i++) arr = blink(arr);
  return arr;
}

console.log(multiBlink(parse("125 17"), 25).length);
console.log(
  multiBlink(parse("0 7 6618216 26481 885 42 202642 8791"), 25).length
);

console.log(
  multiBlink(parse("0 7 6618216 26481 885 42 202642 8791"), 75).length
);
