import { rnorm, randomChoice, getMeanAndSD } from './util';
import Unit from './unit';
import Connection from './connection';

console.log(rnorm(10, 5));
console.log(randomChoice([1, 2, 3], 2));
console.log(getMeanAndSD([
  { data: [1, 2, 3] },
  { data: [2, 3, 4] },
  { data: [3, 4, 5] }
]));

const unit = new Unit('INPUT');
const connection = new Connection();
