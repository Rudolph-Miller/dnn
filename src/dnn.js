import Unit, { UnitType } from './unit';
import Connection from './connection';
import { rnorm } from './util';

export default class DNN {
  constructor({ numOfUnits, weights, means, sds }) {
    if(!numOfUnits) {
      throw new Error("numOfUnits must be specified.");
    }
    if(numOfUnits.length <= 2) {
      throw new Error("At least 1 hidden units must be specified.");
    }

    this.DEFAULT_WEIGHT = 0;
    this.numOfUnits = numOfUnits;
    this.learningCoefficient = 0.01;
    this.miniBatchSize = 10;
    this.connections = {};
    this.units = {};
    this.inputMeans = [];
    if(means) {
      this.inputMeans = means;
    }
    this.inputSDs = [];
    if(sds) {
      this.inputSDs = sds;
    }

    let layersArray = [];

    let inputUnitArray = [];
    inputUnitArray.push(new Unit(UnitType.BIAS)); // BIAS
    for (let i = 0; i < this.numOfUnits[0]; i++) {
      inputUnitArray.push(new Unit(UnitType.INPUT));
    }
    layersArray.push(inputUnitArray);

    for (let j = 1; j < this.numOfUnits.length - 1; j++) {
      let hiddenUnitArray = [];
      hiddenUnitArray.push(new Unit(UnitType.BIAS)); // BIAS
      for (let k = 0; k < this.numOfUnits[j]; k++) {
        hiddenUnitArray.push(new Unit(UnitType.HIDDEN));
      }
      layersArray.push(hiddenUnitArray);
    }

    let outputUnitArray = [];
    for (let l = 0; l < this.numOfUnits[this.numOfUnits.length - 1]; l++) {
      outputUnitArray.push(new Unit(UnitType.OUTPUT));
    }
    layersArray.push(outputUnitArray);

    this.units = layersArray;

    let allConnectionArray = [];
    for (let m = 0; m < this.numOfUnits.length - 1; m++) {
      let connectionArray = [];
      for (let n = 0; n < this.units[m].length; n++) {
        let connArray = [];
        let leftUnit = this.units[m][n];
        for (let p = 0; p < this.units[m + 1].length; p++) {
          let rightUnit = this.units[m + 1][p];
          if (rightUnit.getUnitType() !== UnitType.BIAS) {
            let conn = new Connection();

            conn.setRightUnit(rightUnit);
            conn.setLeftUnit(leftUnit);
            if (leftUnit.getUnitType() === UnitType.BIAS) {
              conn.setWeight(this.DEFAULT_WEIGHT);
            } else {
              conn.setWeight(this.DEFAULT_WEIGHT + rnorm(0, 1));
            }
            connArray.push(conn);

            let connTmpArray = rightUnit.getLeftConnections();
            connTmpArray.push(conn);
            rightUnit.setLeftConnections(connTmpArray);
          }
        }
        connectionArray.push(connArray);
        leftUnit.setRightConnections(connArray);
      }
      allConnectionArray.push(connectionArray);
    }

    this.connections = allConnectionArray;

    if (weights) {
      for (let s = 0; s < this.connections.length; s++) {
        for (let t = 0; t < this.connections[s].length; t++) {
          for (let u = 0; u < this.connections[s][t].length; u++) {
            this.connections[s][t][u].setWeight(weights[s][t][u]);
          }
        }
      }
    }
  }
}
