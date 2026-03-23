'use strict';
// シリアル番号を保存する配列
let serialList = [];
const fs = require('node:fs');
const fileName = '../numbers.json';

// ファイルを復元
try {
  const data = fs.readFileSync(fileName, 'utf8');
  serialList = JSON.parse(data);
} catch (err) {
  console.log(`${fileName}から復元できませんでした`);
}

// selialList配列を保存する関数
function saveList() {
  fs.writeFileSync(fileName, JSON.stringify(tasks), 'utf8');
};

// ナンバーを追加する
function serialMake(hits, makeDate, password) {
  let numbers;
  const [year, month, day] = makeDate.split('-').map(Number);
  const expiryMs = Date.UTC(year, month - 1, day + 1); // 有効期限のミリ秒

  do {
    let temp = [];
    for (let i = 0; i < 12; i++) {
      temp.push(Math.floor(Math.random() * 10));
    }
    numbers = temp.join("");

  } while (serialList.find(s => s.number === numbers));

  serialList.push({ hit: hits, number: numbers, date: expiryMs, pass: password, isDone: false });

  const now = new Date();
  console.info(`[${now.toLocaleString()}] シリアルナンバーを生成しました：${numbers}`);

  saveList();
}

// ナンバーを利用する
function serialUse(serialNumberInput, passwordInput) {
  // 配列から該当するシリアルを検索
  const u = serialList.find(s => s.number === serialNumberInput);

  if (!u) {
    console.log('シリアルナンバーが無効です');
    return;
  };

  // パスワードを確認
  if (u.pass !== passwordInput) {
    console.log('パスワードが違います');
    return;
  }

  // 有効期限をチェック
  if (Date.now() >= u.date) {
    console.log('シリアルナンバーの有効期限が過ぎています');
    return;
  }

  // 利用済みチェック
  if (u.isDone) {
    console.log('このシリアルナンバーは既に使用されています');
    return;
  }

  // 利用処理
  u.isDone = true;
  console.log(`${u.hit}回券を利用しました`);
  saveList();
};

module.exports = {
  serialMake,
  serialUse,
}