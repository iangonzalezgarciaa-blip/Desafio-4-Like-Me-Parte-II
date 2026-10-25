# Like Me - Parte II

Actualicé el proyecto **Like Me (Parte I)** para incorporar los likes y la eliminación de publicaciones. Conservé la API Express, la base PostgreSQL y el cliente React.

## Changelog - Parte II

- **MODIFIQUÉ** la ruta `PUT /posts/:id` para actualizar los likes en PostgreSQL con `UPDATE`, usando un identificador validado y una consulta parametrizada.
- **AGREGUÉ** la ruta `DELETE /posts/:id` para eliminar publicaciones por ID con `DELETE FROM posts ... RETURNING *`.
- **INCORPORÉ** `try/catch` en las consultas realizadas mediante el paquete `pg` y respuestas HTTP controladas.
- **MODIFIQUÉ** `App.jsx` para actualizar las publicaciones después de dar un like y para quitar del listado los posts eliminados.
- **ACTUALICÉ** `Post.jsx` con un botón de like y otro para eliminar la publicación.
- **MEJORÉ** el formulario para limpiar los campos solamente si el servidor confirmó que se guardó la publicación.
- **AGREGUÉ** mensajes de error en pantalla, estados de carga y desactivación de botones durante las solicitudes.
- **ACTUALICÉ** `setup.sql` para definir el ID como clave primaria y los likes con valor inicial 0.
- **AÑADÍ** un conjunto de pruebas HTTP que verifica GET, POST, PUT, DELETE y los errores esperados.

## Parte I conservada

Conservé `GET /posts`, `POST /posts`, el servidor Express con `cors`, `dotenv` y `pg`, y el cliente React + Vite + Axios.

## Instalación

Necesito Node.js 18 o superior y PostgreSQL. Para una base nueva ejecuto:

```bash
psql -U postgres -f setup.sql
```

Si ya tengo la base `likeme` de la Parte I, no debo ejecutar `CREATE DATABASE` nuevamente. Las rutas nuevas funcionan con la tabla original.

Copio `.env.example` a `.env`, configuro la contraseña y los datos de PostgreSQL y ejecuto:

```bash
npm install
npm start
```

En otra terminal inicio React:

```bash
cd "Apoyo Desafio - Like Me (Parte I)"
npm install
npm run dev
```

Abro la URL local indicada por Vite, normalmente `http://localhost:5173`. La API utiliza por defecto `http://localhost:3000`.

## Endpoints

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/posts` | Listo las publicaciones |
| POST | `/posts` | Creo una publicación |
| PUT | `/posts/:id` | Aumento en uno sus likes |
| DELETE | `/posts/:id` | Elimino una publicación |

El POST recibe `titulo`, `img` y `descripcion` en JSON. PUT y DELETE reciben el ID en la ruta. Si el ID es inválido devuelvo 400, si el post no existe devuelvo 404 y si falla PostgreSQL devuelvo 500.

## Pruebas

```bash
npm test
```

Las pruebas HTTP utilizan una base simulada. Para verificar la persistencia real debo probar la aplicación con PostgreSQL iniciado.

**Proyecto original:** https://github.com/iangonzalezgarciaa-blip/Desafio-4-Like-Me-Parte-I
