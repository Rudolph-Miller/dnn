import DNN from './dnn';
import fs from 'fs';

const dataFile = 'src/data.text'

// 下記のネットワーク構成とします。
// 入力層: 4 ユニット
// 中間層: 4, 4 ユニット
// 出力層: 3 ユニット
var dnn = new DNN({numOfUnits:[4, 4, 4, 3]});

// 学習係数の設定
dnn.setLearningCoefficient(0.001);

// 学習データを読み込みます。
var data = fs.readFileSync(dataFile, 'utf-8');
 
// 改行で split します。データセットの取得先によって変わるかも。
var lines = data.split('\n');

// 10-fold cross validation を行います。
// 1 分割あたりのデータ数を計算
var size = Math.floor(lines.length / 10);

// 全てのデータセット
var allDataSets = [];
var i = 0;
 
// 精度計算用
var accuracySum = 0;
// ループ
while (1) {
  // データセット
  var dataSets = [];
 
  // 1 分割あたりのデータ数までを dataSets にセットします。
  for (var j = 0; j < size; j++) {
    if (i > lines.length - 1) {
      break;
    }
    var ary = lines[i].split(' ');
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
 
// 全データセット分ループ
for (var i = 0; i < allDataSets.length; i++) {
 
  // 学習データとテストデータ
  var trainData = [];
  var testData = [];
 
  // 再度全データセット分ループ
  for (var j = 0; j < allDataSets.length; j++) {
    // データセットをループ
    for (var k = 0; k < allDataSets[j].length; k++) {
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
  for (var l = 0; l < 10000; l++) {
 
    // DNN に渡すデータ
    var inputData = [];
    for (var m = 0; m < trainData.length; m++) {
      // ラベル部分を除外したもの
      var dataPart = [];
      for (var n = 1; n < trainData[m].length; n++) {
        dataPart.push(Number(trainData[m][n]));
      } 
      // DNN に渡すデータに追加
      inputData.push({expected:Number(trainData[m][0]), data:dataPart}); 
    }
 
    // 学習処理
    dnn.train(inputData);
 
    // 1 学習後のネットワークに対して入力データによる誤差関数の値を取得
    var result = dnn.test(inputData);
 
    // 誤差関数の値が 0.01 未満であれば break
    if (result < 0.01) {
      break;
    }
  }
 
  // 正解数
  var corrects = 0;
 
  // テストデータをループしてテスト
  for (var o = 0; o < testData.length; o++) {
 
    // ラベル以外の部分
    var dataPart = [];
    for (var p = 1; p < testData[o].length; p++) {
      dataPart.push(Number(testData[o][p]));
    }
 
    // 判定
    var result = dnn.predict(dataPart);
 
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
