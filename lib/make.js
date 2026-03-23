'use strict';
const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, '..', 'numbers.json');
let serialList = [];

// JSONから復元
try {
  const data = fs.readFileSync(fileName, 'utf8');
  serialList = JSON.parse(data);
} catch (err) {
  console.log(`${fileName}から復元できませんでした`);
}

// 配列を保存
function saveList() {
  fs.writeFileSync(fileName, JSON.stringify(serialList, null, 2), 'utf8');
}

// ナンバーを生成
function serialMake(hits, makeDate, password) {
  let numbers;
  const [year, month, day] = makeDate.split('-').map(Number);
  const expiryMs = Date.UTC(year, month - 1, day);

  do {
    numbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
  } while (serialList.find(s => s.number === numbers));

  serialList.push({ hit: hits, number: numbers, date: expiryMs, pass: password, isDone: false });
  saveList();

  return numbers;
}

// ナンバーを利用
function serialUse(serialNumberInput, passwordInput) {
  const sanitizedInput = serialNumberInput.replace(/-/g, '');

  const u = serialList.find(s => s.number === sanitizedInput);
  if (!u) return { success: false, message: 'シリアルナンバーが無効です' };
  if (u.pass !== passwordInput) return { success: false, message: 'パスワードが違います' };
  if (Date.now() >= u.date) return { success: false, message: 'シリアルナンバーの有効期限が過ぎています' };
  if (u.isDone) return { success: false, message: 'このシリアルナンバーは既に使用されています' };

  u.isDone = true;
  saveList();

  return { success: true, message: `${u.hit}回券を利用しました` };
}

module.exports = { serialMake, serialUse };