'use strict';
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const pug = require('pug');
const { serialMake, serialUse } = require('./lib/make.js');
const path = require('path');

const app = new Hono();

// ページ表示
app.get('/', (c) => c.html(pug.compileFile('./views/index.pug')()));
app.get('/make', (c) => c.html(pug.compileFile('./views/make.pug')()));
app.get('/use', (c) => c.html(pug.compileFile('./views/use.pug')()));

// API
app.post('/make', async (c) => {
  const form = await c.req.formData();
  const count = form.get('count');
  const expiry = form.get('expiry');
  const password = form.get('password');

  if (!count || !expiry || !password) return c.json({ success: false, message: '入力が不完全です' });

  const serialNumber = serialMake(Number(count), expiry, password);
  return c.json({ success: true, serialNumber });
});

app.post('/use', async (c) => {
  const form = await c.req.formData();
  const serialNumber = form.get('serialNumber');
  const password = form.get('password');

  if (!serialNumber || !password) return c.json({ success: false, message: '入力が不完全です' });

  const result = serialUse(serialNumber, password);
  return c.json(result);
});

const port = process.env.PORT || 8000;
console.log(`${port}番ポートでサーバー起動中`);
serve({ fetch: app.fetch, port });
