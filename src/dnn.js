import Unit, { UnitType } from './unit';
import Connection from './connection';
import {
  rnorm, getMeanAndSD,
  randomChoice, normalize
} from './util';

export default class DNN {
  constructor({ numOfUnits, weights, means, sds }) {
    if(!numOfUnits) {
      throw new Error('numOfUnits must be specified.');
    }
    if(numOfUnits.length <= 2) {
      throw new Error('At least 1 hidden units must be specified.');
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

  setLearningCoefficient(coefficient) {
    this.learningCoefficient = coefficient;
  }

  setMiniBatchSize(size) {
    this.miniBatchSize = size;
  }

  getModel() {
    let weights = [];
    for (let i = 0; i < this.connections.length; i++) {
      let weightsSub = [];
      for (let j = 0; j < this.connections[i].length; j++) {
        let weightsSubSub = [];
        for (let k = 0; k < this.connections[i][j].length; k++) {
          weightsSubSub.push(this.connections[i][j][k].getWeight());
        }
        weightsSub.push(weightsSubSub);
      }
      weights.push(weightsSub);
    }
    return {
      numOfUnits:this.numOfUnits,
      weights:weights,
      means:this.inputMeans,
      sds:this.inputSDs
    };
  }

 train(dataSet) {
    const msd = getMeanAndSD(dataSet);
    this.inputMeans = msd['means'];
    this.inputSDs = msd['sds'];

    const data = randomChoice(dataSet, this.miniBatchSize);

    for (let n = 0; n < data.length; n++) {
      this.predict(data[n]['data']);

      for (let k = this.numOfUnits.length - 1; k > 0; k--) {
        for (let l = 0; l < this.units[k].length; l++) {
          const unit = this.units[k][l];
          let delta = 0;

          if (unit.getUnitType() === UnitType.OUTPUT ||
              unit.getUnitType() === UnitType.HIDDEN) {
            if (unit.getUnitType() === UnitType.OUTPUT) {
              delta = unit.getOutput();
              if (data[n]['expected'] == l) {
                delta -= 1;
              }
            } else {
              const inputValue = unit.getInput();
              const rightConns = unit.getRightConnections();
              for (let m = 0; m < rightConns.length; m++) {
                delta += rightConns[m].getRightUnit().getDelta() *
                         rightConns[m].getWeight() *
                         ((inputValue < 0) ? 0 : 1);
              }
            }
            unit.setDelta(delta);

            const conns = unit.getLeftConnections();
            for (let p = 0; p < conns.length; p++) {
              let diff = conns[p].getWeightDiff(); 

              diff += delta * conns[p].getLeftUnit().getOutput();
              conns[p].setWeightDiff(diff);
            }
          }
        }
      }

      for (let q = 0; q < this.connections.length; q++) {
        for (let r = 0; r < this.connections[q].length; r++) {
          for (let s = 0; s < this.connections[q][r].length; s++) {
            const conn = this.connections[q][r][s];
            let weight = conn.getWeight();
            weight -= this.learningCoefficient * conn.getWeightDiff();

            conn.setWeight(weight);
            conn.setWeightDiff(0);
          }
        }
      }
    }
  }

  test(dataSet) {
    let e = 0;
    const data = randomChoice(dataSet, this.miniBatchSize);

    for (let n = 0; n < data.length; n++) {
      this.predict(data[n]['data']);
      const outputUnits = this.units[this.numOfUnits.length - 1];
      let sum = 0;

      for (let i = 0; i < outputUnits.length; i++) {
        if (data[n]['expected'] == i) {
          sum += Math.log(outputUnits[i].getOutput());
        }
      }
      e += -1 * sum;
    }
    const avg_e = e / data.length;
    return avg_e;
  }

  predict(dataSet) {
    let denom = 0;
    let denomArray = [];
    const data = normalize(
      dataSet,
      this.inputMeans,
      this.inputSDs
    );

    let g = 0;
    for (let h = 0; h < this.units[0].length; h++) {
      if (this.units[0][h].getUnitType() != UnitType.BIAS) {
        this.units[0][h].setInput(data[g]);
        this.units[0][h].setOutput(data[g]);
        g++;
      }
    }

    for (let i = 1; i < this.units.length; i++) {
      for (let j = 0; j < this.units[i].length; j++) {
        const unit = this.units[i][j];

        if (unit.getUnitType() === UnitType.HIDDEN ||
            unit.getUnitType() === UnitType.OUTPUT) {
          let sum = 0;
          const connArray = unit.getLeftConnections();
          for (let k = 0; k < connArray.length; k++) {
            const conn = connArray[k];

            sum += conn.getLeftUnit().getOutput() * conn.getWeight();
          }
          unit.setInput(sum);

          if (unit.getUnitType() === UnitType.OUTPUT) {
            const ex = Math.exp(unit.getInput());
            denom += ex;
            denomArray.push(ex);
          } else {
            if (unit.getInput() < 0) {
              unit.setOutput(0);
            } else {
              unit.setOutput(unit.getInput());
            }
          }
        }
      }
    }

    let result = [];
    const outputUnits = this.units[this.numOfUnits.length - 1];
    for (let p = 0; p < denomArray.length; p++) {
      let res = denomArray[p] / denom;
      result.push(res);
      outputUnits[p].setOutput(res);
    }

    let best = -1;
    let idx = -1;
    for (var q = 0; q < result.length; q++) {
      if (best < result[q]) {
        best = result[q];
        idx = q;
      }
    }

    return {best:idx, result:result};
  }
}
