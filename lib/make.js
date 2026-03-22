'use strict';
// シリアル番号を保存する配列
let serialNumber = [];

// ナンバーを追加する
function serialMake(makeDate, password) {
  let numbers;
  do {
    let temp = [];
    for (let i = 0; i < 12; i++) {
      temp.push(Math.floor(Math.random() * 10));
    }
    numbers = temp.join("");

  } while (serialNumber.find(s => s.number === numbers));

  serialNumber.push({ number: numbers, date: makeDate, pass: password });

  const now =  new Date();
  console.info(`[${now.toLocaleString()}] シリアルナンバーを生成しました：${numbers}`);
}

//ナンバーを利用する。