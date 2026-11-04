# Proyecto: API REST - Catálogo de películas

TP integrador del Bootcamp 5.0 (Módulo Node.js). Entrega individual, 2 semanas.

## Stack
- Node.js + Express + TypeScript
- MongoDB Atlas con Mongoose
- Auth: Bcrypt + JWT
- Variables de entorno con dotenv (`MONGO_URI`, `JWT_SECRET`, `PORT`)
- Pruebas manuales con Thunder Client

## Comandos
- `npm run dev` → servidor en modo desarrollo (se reinicia al guardar)
- `npm run build` → compila TypeScript a `dist/`
- `npm start` → corre la versión compilada

## Arquitectura (estructura por componentes + capas)
```
src/
  app.ts              # configura Express (middlewares, rutas)
  server.ts           # conecta a la DB y levanta el servidor
  config/             # env, conexión a la DB
  middlewares/        # auth (JWT), logger, manejo de errores
  utils/              # clases/helpers compartidos (ej: HttpError)
  components/
    movies/           # movie.model, movie.repository, movie.service, movie.controller, movie.routes
    users/            # user.model, user.repository, user.service, user.controller, user.routes
```
Flujo de una petición: `routes → controller → service → repository → model (Mongoose)`.
- **Controller**: lee req/res, siempre con try/catch, decide el código de estado.
- **Service**: reglas de negocio y validaciones. No conoce Express.
- **Repository**: único lugar que habla con Mongoose.

## Entidad Película
`title`, `director`, `genre`, `rating` (puntaje).

## Requisitos del TP (no olvidar)
- CRUD completo: GET todos, GET por id, POST, PUT, DELETE
- ≥2 validaciones de negocio en el service (ej: rating de 1 a 10)
- POST/PUT/DELETE protegidos con middleware JWT; el token no lleva datos sensibles
- Códigos: 200, 201, 400, 401, 404, 500
- `.env` en `.gitignore`, `.env.example` sin valores
- Extras elegidos: filtros con `req.query` y middleware de logging
- README con instalación y lista de endpoints

## Cómo trabajar conmigo
- Soy trainee: explicame las decisiones importantes y los conceptos nuevos.
- Vamos paso a paso, una capa por vez, y hago commit al terminar cada paso.
