# Like Me (Parte I)

Servidor en Express para la red social Like Me. Expone las rutas `GET /posts` y `POST /posts` y guarda los posts en PostgreSQL usando el paquete `pg`. Incluye la aplicación React de apoyo que consume estas rutas.

## Tecnologías

- Node.js, Express, cors, pg, dotenv
- PostgreSQL
- React + Vite + Axios (cliente de apoyo)

## Requisitos

- Node.js 18 o superior
- PostgreSQL

## Instalación y uso

### 1. Base de datos

Con psql:

```bash
psql -U postgres -f setup.sql
```

Con pgAdmin: crear la base `likeme` y ejecutar en ella el `CREATE TABLE` de `setup.sql`.

### 2. Variables de entorno

Copiar `.env.example` como `.env` y completar los datos de conexión:

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_DATABASE=likeme
DB_PORT=5432
```

### 3. Servidor

```bash
npm install
npm start
```

Queda disponible en `http://localhost:3000`.

### 4. Cliente

En otra terminal:

```bash
cd "Apoyo Desafio - Like Me (Parte I)"
npm install
npm run dev
```

Abrir `http://localhost:5173` y crear un post desde el formulario.

## Rutas

| Método | Ruta         | Descripción                                    |
|--------|--------------|------------------------------------------------|
| GET    | /posts       | Devuelve todos los posts                        |
| POST   | /posts       | Crea un post (`titulo`, `img`, `descripcion`)   |
| PUT    | /posts/:id   | Suma un like al post (usada por el cliente)     |

Ejemplo de cuerpo para `POST /posts`:

```json
{
  "titulo": "Mi primer post",
  "img": "https://picsum.photos/400/300",
  "descripcion": "Hola Like Me"
}
```

## Estructura

```
├── index.js                          Servidor Express
├── setup.sql                         Creación de la base y la tabla
├── .env.example                      Variables de entorno de ejemplo
├── package.json
└── Apoyo Desafio - Like Me (Parte I)  Cliente React
```
