import DNN from './dnn';
import fs from 'fs';

const dataFile = 'src/data.txt'

const data = fs.readFileSync(dataFile, 'utf-8');
const lines = data.split('\n');
const size = Math.floor(lines.length / 10);
let allDataSets = [];
let i = 0;
// ループ
while (1) {
  // データセット
  let dataSets = [];
 
  // 1 分割あたりのデータ数までを dataSets にセットします。
  for (let j = 0; j < size; j++) {
    if (i > lines.length - 1) {
      break;
    }
    let ary = lines[i].split(' ');
    dataSets.push(ary);
    i++;
  }
 
  // 全データセットに配列として追加します。
  allDataSets.push(dataSets);
 
  // 10 データセットになったら break
  if (allDataSets.length == 10) {
    break;
  } 
}
 
const start = new Date();

const dnn = new DNN({numOfUnits:[4, 4, 4, 3]});
dnn.setLearningCoefficient(0.001);

let accuracySum = 0;

// 全データセット分ループ
for (let i = 0; i < allDataSets.length; i++) {
 
  // 学習データとテストデータ
  let trainData = [];
  let testData = [];
 
  // 再度全データセット分ループ
  for (let j = 0; j < allDataSets.length; j++) {
    // データセットをループ
    for (let k = 0; k < allDataSets[j].length; k++) {
      // テストデータを保存
      if (i == j) {
        testData.push(allDataSets[j][k]);
      // 学習データを保存
      } else {
        trainData.push(allDataSets[j][k]);
      }
    }
  }
 
  // 誤差関数の出力が規定の値未満になるまで最大 10000 回ループします。
  for (let l = 0; l < 10000; l++) {
 
    // DNN に渡すデータ
    let inputData = [];
    for (let m = 0; m < trainData.length; m++) {
      // ラベル部分を除外したもの
      let dataPart = [];
      for (let n = 1; n < trainData[m].length; n++) {
        dataPart.push(Number(trainData[m][n]));
      } 
      // DNN に渡すデータに追加
      inputData.push({expected:Number(trainData[m][0]), data:dataPart}); 
    }
 
    // 学習処理
    dnn.train(inputData);
 
    // 1 学習後のネットワークに対して入力データによる誤差関数の値を取得
    let result = dnn.test(inputData);
 
    // 誤差関数の値が 0.01 未満であれば break
    if (result < 0.01) {
      break;
    }
  }
 
  // 正解数
  let corrects = 0;
 
  // テストデータをループしてテスト
  for (let o = 0; o < testData.length; o++) {
 
    // ラベル以外の部分
    let dataPart = [];
    for (let p = 1; p < testData[o].length; p++) {
      dataPart.push(Number(testData[o][p]));
    }
 
    // 判定
    let result = dnn.predict(dataPart);
 
    // best には最も値の高かったラベルが入っています。
    if (result['best'] == Number(testData[o][0])) {
      corrects++;
    }
  }
 
  // 1 回のループ（学習と判定）における精度の平均値を加算
  accuracySum += 100 * corrects / testData.length;
}
 
// 全ループによる精度の平均値を出力
console.log('accuracy: ' + (accuracySum / allDataSets.length) + '%');
console.log('time: ' + (new Date() - start) + 'ms');
