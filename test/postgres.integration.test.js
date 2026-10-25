const test = require('node:test');
const assert = require('node:assert/strict');
const { Pool } = require('pg');
const { createApp } = require('../index');

test('POST, GET, PUT y DELETE persisten en PostgreSQL real', {
  skip: !process.env.TEST_DATABASE,
}, async () => {
  const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 5432),
  });
  let server;
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY, titulo VARCHAR(25) NOT NULL,
      img VARCHAR(1000) NOT NULL, descripcion VARCHAR(255) NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0
    )`);
    await db.query('TRUNCATE TABLE posts RESTART IDENTITY');
    server = createApp(db).listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const send = async (route, options) => {
      const response = await fetch(base + route, options);
      return { status: response.status, body: await response.json() };
    };
    let r = await send('/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Prueba',
        img: 'https://example.com/imagen.png',
        descripcion: 'Integración real',
      }),
    });
    assert.equal(r.status, 201);
    const id = r.body.id;
    assert.ok(id > 0);
    r = await send('/posts');
    assert.equal(r.status, 200);
    assert.equal(r.body.length, 1);
    assert.equal(r.body[0].likes, 0);
    r = await send(`/posts/${id}`, { method: 'PUT' });
    assert.equal(r.status, 200);
    assert.equal(r.body.likes, 1);
    r = await send(`/posts/${id}`, { method: 'PUT' });
    assert.equal(r.body.likes, 2);
    const check = await db.query('SELECT likes FROM posts WHERE id = $1', [id]);
    assert.equal(check.rows[0].likes, 2);
    r = await send(`/posts/${id}`, { method: 'DELETE' });
    assert.equal(r.status, 200);
    const count = await db.query('SELECT COUNT(*)::int AS total FROM posts');
    assert.equal(count.rows[0].total, 0);
    r = await send(`/posts/${id}`, { method: 'DELETE' });
    assert.equal(r.status, 404);
    await db.query('DROP TABLE posts');
    r = await send('/posts');
    assert.equal(r.status, 500);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
