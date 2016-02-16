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

  getUnitType() {
    return this.unitType;
  }

  setLeftConnections(connections) {
    switch(this.unitType) {
      case UnitType.HIDDEN, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        this.leftConnections = connections;
    }
  }

  setRightConnections(connections) {
    switch(this.unitType) {
      case UnitType.INPUT, UnitType.HIDDEN, UnitType.BIAS:
        throw new Error('Invalid unit type');
      default:
        this.rightConnections = connections;
    }
  }

  getLeftConnections() {
    switch(this.unitType) {
      case UnitType.HIDDEN, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        return this.leftConnections;
    }
  }

  getRightConnections() {
    switch(this.unitType) {
      case UnitType.INPUT, UnitType.HIDDEN, UnitType.BIAS:
        throw new Error('Invalid unit type');
      default:
        return this.rightConnections;
    }
  }

  setInput(value) {
    switch(this.unitType) {
      case UnitType.INPUT, UnitType.HIDDEN, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        this.inputValue = value;
    }
  }

  getInput() {
    switch(this.unitType) {
      case UnitType.INPUT, UnitType.HIDDEN, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        return this.inputValue;
    }
  }

  setOutput(value) {
    this.outputValue = value;
  }

  getOutput() {
    return this.outputValue;
  }

  setDelta(delta) {
    switch(this.unitType) {
      case UnitType.HIDDEn, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        this.delta = delta;
    }
  }

  getDelta() {
    switch(this.unitType) {
      case UnitType.HIDDEN, UnitType.OUTPUT:
        throw new Error('Invalid unit type');
      default:
        return this.delta;
    }
  }
}
