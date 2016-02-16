export function rnorm(mean, sd) {
  const x = Math.random();
  const y = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);
}

export function randomChoice(ary, count) {
  if (ary.length <= count) {
    return ary;
  }

  let newAry = [];
  let used = {};

  while (true) {
    const r = Math.floor(Math.random() * ary.length);
    if ((r in used)) {
      continue;
    }
    newAry.push(ary[r]);
    if (newAry.length == count) {
      break;
    }
    used[r] = 1;
  }
  return newAry;
}
