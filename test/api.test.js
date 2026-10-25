const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../index');

function baseFalsa() {
  let posts = [{ id: 1, titulo: 'Primer post', img: 'https://example.com/1.png', descripcion: 'Hola', likes: 0 }];
  let siguienteId = 2;
  let fallar = false;
  return {
    provocarError(valor) { fallar = valor; },
    async query(sql, valores = []) {
      if (fallar) throw new Error('Conexión a PostgreSQL fallida');
      if (sql.startsWith('SELECT')) return { rows: [...posts].reverse() };
      if (sql.startsWith('INSERT')) {
        const [titulo, img, descripcion, likes] = valores;
        const post = { id: siguienteId++, titulo, img, descripcion, likes };
        posts.push(post);
        return { rows: [post] };
      }
      if (sql.startsWith('UPDATE')) {
        const post = posts.find((item) => item.id === Number(valores[0]));
        if (!post) return { rows: [] };
        post.likes = (post.likes ?? 0) + 1;
        return { rows: [{ ...post }] };
      }
      if (sql.startsWith('DELETE')) {
        const indice = posts.findIndex((item) => item.id === Number(valores[0]));
        if (indice === -1) return { rows: [] };
        return { rows: [posts.splice(indice, 1)[0]] };
      }
      throw new Error('Consulta inesperada');
    },
  };
}

test('API Like Me: GET, POST, PUT y DELETE', async () => {
  const base = baseFalsa();
  const servidor = createApp(base).listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  const url = `http://127.0.0.1:${servidor.address().port}`;
  const pedir = async (ruta, opciones) => {
    const respuesta = await fetch(`${url}${ruta}`, opciones);
    return { estado: respuesta.status, cuerpo: await respuesta.json() };
  };
  try {
    let r = await pedir('/posts');
    assert.equal(r.estado, 200);
    assert.equal(r.cuerpo.length, 1);

    r = await pedir('/posts', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: 'Foto', img: 'https://example.com/2.png', descripcion: 'Nueva publicación' }),
    });
    assert.equal(r.estado, 201);
    assert.equal(r.cuerpo.likes, 0);
    const id = r.cuerpo.id;

    r = await pedir(`/posts/${id}`, { method: 'PUT' });
    assert.equal(r.estado, 200);
    assert.equal(r.cuerpo.likes, 1);
    r = await pedir(`/posts/${id}`, { method: 'PUT' });
    assert.equal(r.cuerpo.likes, 2);

    r = await pedir(`/posts/${id}`, { method: 'DELETE' });
    assert.equal(r.estado, 200);
    assert.equal(r.cuerpo.post.id, id);
    r = await pedir('/posts');
    assert.ok(r.cuerpo.every((post) => post.id !== id));

    for (const metodo of ['PUT', 'DELETE']) {
      r = await pedir('/posts/9999', { method: metodo });
      assert.equal(r.estado, 404);
      r = await pedir('/posts/invalido', { method: metodo });
      assert.equal(r.estado, 400);
    }

    r = await pedir('/posts', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: '', img: '', descripcion: '' }),
    });
    assert.equal(r.estado, 400);

    base.provocarError(true);
    for (const [ruta, opciones] of [
      ['/posts', undefined],
      ['/posts/1', { method: 'PUT' }],
      ['/posts/1', { method: 'DELETE' }],
    ]) {
      r = await pedir(ruta, opciones);
      assert.equal(r.estado, 500);
    }
  } finally {
    await new Promise((resolve) => servidor.close(resolve));
  }
});
