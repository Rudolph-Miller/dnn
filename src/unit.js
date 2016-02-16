const UnitType = {
  INPUT: 0,
  HIDDEN: 1,
  BIAS: 2,
  OUTPUT: 3
};

export default class Unit {
  constructor(unitType) {
    this.unitType = unitType;
    this.leftConnections = [];
    this.rightConnections = [];
    this.inputValue = 0;

    if (unitType === UnitType.BIAS) {
      this.outputValue = 1;
    } else {
      this.outputValue = 0;
    }

    this.delta = 0;
  }
}
