require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
const pool = new Pool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE,
  port: process.env.DB_PORT, allowExitOnIdle: true,
});

function createApp(database = pool) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const idValido = (id) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) <= 2147483647;

  app.get('/posts', async (req, res) => {
    try {
      const { rows } = await database.query('SELECT * FROM posts ORDER BY id DESC');
      res.json(rows);
    } catch (error) {
      console.error('GET /posts:', error.message);
      res.status(500).json({ error: 'No se pudieron obtener los posts' });
    }
  });

  app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body ?? {};
    if ([titulo, img, descripcion].some((campo) => typeof campo !== 'string' || !campo.trim())) {
      return res.status(400).json({ error: 'titulo, img y descripcion son obligatorios' });
    }
    if (titulo.length > 25 || img.length > 1000 || descripcion.length > 255) {
      return res.status(400).json({ error: 'Máximo 25 caracteres para titulo, 1000 para img y 255 para descripcion' });
    }
    try {
      const sql = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
      const { rows } = await database.query(sql, [titulo.trim(), img.trim(), descripcion.trim(), 0]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('POST /posts:', error.message);
      res.status(500).json({ error: 'No se pudo guardar el post' });
    }
  });

  // Parte II: actualizo los likes directamente en PostgreSQL.
  app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ error: 'id inválido' });
    try {
      const { rows } = await database.query(
        'UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *', [id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Post no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      console.error('PUT /posts/:id:', error.message);
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  });

  // Parte II: elimino una publicación por su identificador.
  app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ error: 'id inválido' });
    try {
      const { rows } = await database.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
      if (!rows.length) return res.status(404).json({ error: 'Post no encontrado' });
      res.json({ mensaje: 'Post eliminado correctamente', post: rows[0] });
    } catch (error) {
      console.error('DELETE /posts/:id:', error.message);
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  });

  app.use((error, req, res, next) => {
    console.error('Solicitud inválida:', error.message);
    res.status(error.status || 500).json({ error: 'Solicitud inválida' });
  });
  return app;
}

if (require.main === module) {
  createApp().listen(PORT, () => console.log(`Servidor encendido en http://localhost:${PORT}`));
}
module.exports = { createApp };
