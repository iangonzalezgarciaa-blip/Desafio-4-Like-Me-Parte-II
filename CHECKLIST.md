# Checklist de entrega - Like Me (Parte I)

## Requerimientos

- [ ] CORS habilitado con el paquete `cors` (2 pts) - `app.use(cors())` en `index.js`
- [ ] Conexión a PostgreSQL con el paquete `pg` (2 pts) - `Pool` configurado con variables de entorno
- [ ] Ruta GET `/posts` que devuelve los registros de la tabla `posts` (3 pts)
- [ ] Ruta POST `/posts` que recibe y guarda un nuevo registro (3 pts)

## Antes de entregar

- [ ] Base `likeme` y tabla `posts` creadas con `setup.sql`
- [ ] `.env` creado a partir de `.env.example`
- [ ] `npm start` muestra "Servidor encendido en http://localhost:3000"
- [ ] El cliente React lista los posts y el formulario agrega uno nuevo
- [ ] Comprimir la carpeta sin `node_modules` (ni la del servidor ni la del cliente) y sin `.env`
