export default class Connection {
  constructor() {
    this.leftUnit = {};
    this.rightUnit = {};
    this.weight = 1;
    this.weightDiff = 0;
  }

  setLeftUnit(unit) {
    this.leftUnit = unit;
  }

  setRightUnit(unit) {
    this.rightUnit = unit;
  }

  getLeftUnit() {
    return this.leftUnit;
  }

  getRightUnit() {
    return this.rightUnit;
  }

  setWeight(weight) {
    this.weight = weight;
  }

  getWeight() {
    return this.weight;
  }

  setWeightDiff(diff) {
    this.weightDiff = diff;
  }

  getWeightDiff() {
    return this.weightDiff;
  }
}
