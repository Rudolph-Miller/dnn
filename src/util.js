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

export function getMeanAndSD(dataSet) {
  let sum = [];
  for (let i = 0; i < dataSet.length; i++) {
    const items = dataSet[i]['data'];
    for (let j = 0; j < items.length; j++) {
      if (sum[j] === undefined) {
        sum[j] = 0;
      }
      sum[j] += items[j];
    }
  }

  let means = [];
  for (let k = 0; k < sum.length; k++) {
    means[k] = sum[k] / dataSet.length;
  }

  let squaredSum = [];
  for (let l = 0; l < dataSet.length; l++) {
    const items2 = dataSet[l]['data'];
    for (let m = 0; m < items2.length; m++) {
      if (squaredSum[m] === undefined) {
        squaredSum[m] = 0;
      }
      squaredSum[m] += Math.pow((items2[m] - means[m]), 2);
    }
  }

  let sds = [];
  for (let p = 0; p < dataSet.length; p++) {
    const items3 = dataSet[p]['data'];
    for (let q = 0; q < items3.length; q++) {
      sds[q] = Math.sqrt(squaredSum[q] / dataSet.length);
    }
  }
  return {means: means, sds: sds};
}
