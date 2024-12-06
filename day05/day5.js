import fs from "node:fs";

function parseFile(filename) {
  const data = fs.readFileSync(filename, "utf8");
  let [rulesData, sectionsData] = data.split("\n\n");
  let ruleMap = {};
  for (let rule of rulesData.split("\n")) {
    let [leader, follower] = rule.split("|");
    ruleMap[leader] = (ruleMap[leader] || []).concat(Number(follower));
  }
  let sections = sectionsData
    .split("\n")
    .map((pages) => pages.split(",").map((num) => Number(num)));
  return [ruleMap, sections];
}

function firstInvalidIndex(ruleMap, section) {
  for (let i = 0; i < section.length; i++) {
    let page = section[i];
    for (let j = i + 1; j < section.length; j++) {
      if (!ruleMap[page]?.includes(section[j])) {
        return i;
      }
    }
  }
  return "none";
}

function validSection(ruleMap, section) {
  return firstInvalidIndex(ruleMap, section) == "none";
}

function sumValidSections(filename) {
  let [ruleMap, sections] = parseFile(filename);
  let total = 0;
  for (let section of sections) {
    if (validSection(ruleMap, section)) {
      total += section[Math.floor(section.length / 2)];
    }
  }
  return total;
}

function fixSection(ruleMap, section) {
  let fixed = [...section];

  // Shift the invalid index to the end and try again
  for (
    let invalid = firstInvalidIndex(ruleMap, fixed);
    invalid != "none";
    invalid = firstInvalidIndex(ruleMap, fixed)
  ) {
    let tmp = fixed[invalid];
    fixed = fixed
      .slice(0, invalid)
      .concat(fixed.slice(invalid + 1))
      .concat(tmp);
  }
  return fixed;
}

function fixInvalidSections(filename) {
  let [ruleMap, sections] = parseFile(filename);
  let total = 0;
  for (let section of sections) {
    if (!validSection(ruleMap, section)) {
      let fixedSection = fixSection(ruleMap, section);
      total += fixedSection[Math.floor(fixedSection.length / 2)];
    }
  }
  return total;
}

console.log(sumValidSections("./input-test.txt"));
console.log(sumValidSections("./input.txt"));

console.log(fixInvalidSections("./input-test.txt"));
console.log(fixInvalidSections("./input.txt"));
