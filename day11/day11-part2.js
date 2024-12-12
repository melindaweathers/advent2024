const parse = (str) => {
  let map = new Map();
  for (let num of str.split(" ")) {
    map.set(Number(num), (map.get(Number(num)) || 0) + 1);
  }
  return map;
};

function blink(map) {
  const newMap = new Map();
  const inc = (map, num, count) => map.set(num, (map.get(num) || 0) + count);

  for (const [el, count] of map) {
    if (el == 0) {
      inc(newMap, 1, count);
    } else if (String(el).length % 2 == 0) {
      let elStr = String(el);
      inc(newMap, Number(elStr.slice(0, elStr.length / 2)), count);
      inc(newMap, Number(elStr.slice(elStr.length / 2)), count);
    } else {
      inc(newMap, el * 2024, count);
    }
  }
  return newMap;
}

function multiBlink(map, times) {
  for (let i = 0; i < times; i++) map = blink(map);
  let sum = 0;
  for (let [key, value] of map) {
    sum += value;
  }
  return sum;
}

console.log(multiBlink(parse("125 17"), 25));
console.log(multiBlink(parse("0 7 6618216 26481 885 42 202642 8791"), 25));
console.log(multiBlink(parse("0 7 6618216 26481 885 42 202642 8791"), 75));
