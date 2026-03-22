'use strict';
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const pug = require('pug');
const { logger } = require('hono/logger');

const app = new Hono();

app.get('/', (c) => {
  const template = pug.compileFile('./views/index.pug');
  const html = template({ title: 'Home' });
  return c.html(html);
});

app.get('/make', (c) => {
  const template = pug.compileFile('./views/make.pug');
  const html = template({ title: 'Make' });
  return c.html(html);
})

app.get('/use', (c) => {
  const template = pug.compileFile('./views/use.pug');
  const html = template({ title: 'Use' });
  return c.html(html);
})

const port = 8000;
console.log(`${port}番ポートでサーバー起動中`);

serve({
  fetch: app.fetch,
  port,
});