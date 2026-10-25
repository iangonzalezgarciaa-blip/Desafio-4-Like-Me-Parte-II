require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
});

app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'No se pudieron obtener los posts' });
  }
});

app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion, likes = 0 } = req.body ?? {};

  if ([titulo, img, descripcion].some((campo) => typeof campo !== 'string' || !campo.trim())) {
    return res.status(400).json({ error: 'Faltan campos: titulo, img y descripcion son obligatorios' });
  }
  if (titulo.length > 25 || img.length > 1000 || descripcion.length > 255) {
    return res.status(400).json({ error: 'Máximo 25 caracteres para titulo, 1000 para img y 255 para descripcion' });
  }
  if (!Number.isInteger(likes) || likes < 0) {
    return res.status(400).json({ error: 'likes debe ser un número entero' });
  }

  try {
    const consulta = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(consulta, [titulo, img, descripcion, likes]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'No se pudo guardar el post' });
  }
});

// Usada por el botón de like del frontend
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'id inválido' });

  try {
    const { rows } = await pool.query(
      'UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'No se pudo actualizar el post' });
  }
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: 'Solicitud inválida' });
});

app.listen(PORT, () => {
  console.log(`Servidor encendido en http://localhost:${PORT}`);
});
