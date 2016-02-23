export const UnitType = {
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
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        this.leftConnections = connections;
        break;
      default:
        throw new Error('Invalid unit type');
    }
  }

  setRightConnections(connections) {
    switch(this.unitType) {
      case UnitType.INPUT:
      case UnitType.HIDDEN:
      case UnitType.BIAS:
        this.rightConnections = connections;
        break;
      default:
        throw new Error('Invalid unit type');
    }
  }

  getLeftConnections() {
    switch(this.unitType) {
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        return this.leftConnections;
      default:
        throw new Error('Invalid unit type');
    }
  }

  getRightConnections() {
    switch(this.unitType) {
      case UnitType.INPUT:
      case UnitType.HIDDEN:
      case UnitType.BIAS:
        return this.rightConnections;
      default:
        throw new Error('Invalid unit type');
    }
  }

  setInput(value) {
    switch(this.unitType) {
      case UnitType.INPUT:
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        this.inputValue = value;
        break;
      default:
        throw new Error('Invalid unit type');
    }
  }

  getInput() {
    switch(this.unitType) {
      case UnitType.INPUT:
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        return this.inputValue;
      default:
        throw new Error('Invalid unit type');
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
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        this.delta = delta;
        break;
      default:
        throw new Error('Invalid unit type');
    }
  }

  getDelta() {
    switch(this.unitType) {
      case UnitType.HIDDEN:
      case UnitType.OUTPUT:
        return this.delta;
      default:
        throw new Error('Invalid unit type');
    }
  }
}
