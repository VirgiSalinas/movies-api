# 🎬 API REST · Catálogo de películas

API REST para gestionar un catálogo de películas, con registro y login de usuarios.
Trabajo práctico integrador del **Bootcamp 5.0 · Módulo Node.js**.

- Cualquiera puede **consultar** el catálogo y buscar películas por género, director o título.
- Solo los usuarios **autenticados** (con JWT) pueden **crear, editar y eliminar** películas.
- Cada película tiene un puntaje de **1 a 5 estrellas**, con medias estrellas (pasos de 0.5).

## Tecnologías

| Para qué | Herramienta |
|---|---|
| Servidor | Node.js + Express 5 |
| Lenguaje | TypeScript |
| Base de datos | MongoDB Atlas + Mongoose |
| Contraseñas | bcrypt |
| Autenticación | JSON Web Token (jsonwebtoken) |
| Variables de entorno | dotenv |

## Instalación y ejecución

**Requisitos:** Node.js 20 o superior y un cluster de MongoDB Atlas (el plan gratuito M0 alcanza).

1. Clonar el repositorio e instalar las dependencias:

   ```bash
   git clone https://github.com/VirgiSalinas/movies-api.git
   cd movies-api
   npm install
   ```

2. Crear el archivo `.env` a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

3. Completar las variables del `.env`:

   | Variable | Descripción | Ejemplo |
   |---|---|---|
   | `PORT` | Puerto del servidor (opcional, por defecto 3000) | `3000` |
   | `MONGO_URI` | Cadena de conexión de MongoDB Atlas | `mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/` |
   | `JWT_SECRET` | Clave para firmar los tokens. Usá un texto largo y aleatorio | ver comando abajo |

   Para generar un `JWT_SECRET` seguro:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   > La base de datos se llama `movies` y se crea sola la primera vez que se guarda un dato.

4. Levantar el servidor:

   ```bash
   npm run dev
   ```

   Si todo está bien, en la consola aparece:

   ```
   MongoDB conectado (base: movies)
   Servidor escuchando en http://localhost:3000
   ```

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Modo desarrollo: se reinicia solo al guardar cambios |
| `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| `npm start` | Corre la versión compilada (primero `npm run build`) |

## Endpoints

URL base: `http://localhost:3000`

🔒 = requiere el header `Authorization: Bearer <token>` (el token se obtiene con el login).

### Autenticación

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario | 201, 400 |
| POST | `/api/auth/login` | Devuelve un token JWT (válido por 2 horas) | 200, 400, 401 |
| GET 🔒 | `/api/auth/me` | Datos del usuario logueado | 200, 401, 404 |

### Películas

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/movies` | Lista todas las películas (acepta filtros) | 200 |
| GET | `/api/movies/:id` | Obtiene una película por id | 200, 404 |
| POST 🔒 | `/api/movies` | Crea una película | 201, 400, 401 |
| PUT 🔒 | `/api/movies/:id` | Modifica una película (se pueden enviar solo algunos campos) | 200, 400, 401, 404 |
| DELETE 🔒 | `/api/movies/:id` | Elimina una película | 200, 401, 404 |

Cualquier endpoint puede responder **500** ante un error inesperado del servidor.

### Filtros de búsqueda

Se combinan como query params en `GET /api/movies`:

| Parámetro | Cómo busca | Ejemplo |
|---|---|---|
| `genre` | Coincidencia exacta, sin distinguir mayúsculas | `/api/movies?genre=drama` |
| `director` | Contiene el texto, sin distinguir mayúsculas | `/api/movies?director=nolan` |
| `title` | Contiene el texto, sin distinguir mayúsculas | `/api/movies?title=matrix` |

Ejemplo combinado: `/api/movies?genre=drama&director=nolan`

### Ejemplos de body

**Registro** · `POST /api/auth/register`

```json
{ "name": "Ana", "email": "ana@mail.com", "password": "unaClave123" }
```

**Login** · `POST /api/auth/login`

```json
{ "email": "ana@mail.com", "password": "unaClave123" }
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "name": "Ana", "email": "ana@mail.com" }
}
```

**Crear película** · `POST /api/movies` 🔒

```json
{
  "title": "Interstellar",
  "director": "Christopher Nolan",
  "genre": "Ciencia Ficción",
  "rating": 4.5
}
```

**Editar película** · `PUT /api/movies/:id` 🔒

```json
{ "rating": 5 }
```

Los errores siempre vuelven con el mismo formato:

```json
{ "message": "El puntaje debe estar entre 1 y 5" }
```

## Validaciones

**Reglas de negocio** (en `movie.service.ts`):

1. **Puntaje de 1 a 5 en pasos de 0.5** (1, 1.5, 2 … 5), pensado para mostrarse como estrellas. Un 3.7 o un 6 se rechazan con 400.
2. **Títulos únicos:** no puede haber dos películas con el mismo título, sin distinguir mayúsculas ("Matrix" = "matrix").

**Otras validaciones:**

- `title`, `director` y `genre` son obligatorios y no pueden estar vacíos.
- El email debe tener formato válido y no estar registrado.
- La contraseña debe tener al menos 6 caracteres.
- Un id con formato inválido responde 404 (no 500).
- Un body con JSON mal escrito responde 400.

## Seguridad

- Las contraseñas se guardan **hasheadas con bcrypt**, nunca en texto plano, y no se devuelven en ninguna respuesta.
- El JWT contiene **solo el id del usuario**, sin datos sensibles, y vence a las 2 horas.
- El login responde el mismo mensaje si el email no existe o si la contraseña es incorrecta, para no revelar qué emails están registrados.
- Los secretos (`MONGO_URI`, `JWT_SECRET`) están en `.env`, que está excluido del repositorio por `.gitignore`.

## Arquitectura

Estructura **por componentes**, y dentro de cada uno, **separación en capas**:

```
src/
├── app.ts                 # Configura Express: middlewares y rutas
├── server.ts              # Conecta a MongoDB y levanta el servidor
├── config/
│   ├── env.ts             # Lee las variables del .env
│   └── db.ts              # Conexión con Mongoose
├── middlewares/
│   ├── auth.ts            # Verifica el JWT en las rutas protegidas
│   ├── logger.ts          # Muestra método, URL, código y duración de cada petición
│   └── errorHandlers.ts   # 404 para rutas inexistentes y manejador global de errores
├── utils/
│   ├── HttpError.ts       # Error con código de estado HTTP
│   └── handleError.ts     # Convierte un error en la respuesta HTTP correspondiente
└── components/
    ├── movies/
    │   ├── movie.routes.ts
    │   ├── movie.controller.ts
    │   ├── movie.service.ts
    │   ├── movie.repository.ts
    │   └── movie.model.ts
    └── users/
        ├── user.routes.ts
        ├── user.controller.ts
        ├── user.service.ts
        ├── user.repository.ts
        └── user.model.ts
```

Recorrido de una petición:

```
routes → [middleware auth] → controller → service → repository → model (MongoDB)
```

| Capa | Responsabilidad |
|---|---|
| **Routes** | Asocia cada método + URL con su controller (y el middleware `auth` si corresponde) |
| **Controller** | Lee `req`, llama al service y responde con el código de estado. Todos usan `try/catch` |
| **Service** | Reglas de negocio y validaciones. No conoce Express |
| **Repository** | Único lugar que consulta la base de datos con Mongoose |
| **Model** | Define la estructura de los documentos (schema de Mongoose) |

## Extras implementados

- ✅ **Filtros con `req.query`:** búsqueda por género, director y título.
- ✅ **Middleware de logging:** cada petición se muestra en consola, por ejemplo `POST /api/movies -> 201 (45 ms)`.

## Pruebas

Los endpoints se probaron con **Thunder Client**, incluyendo los casos de error (400, 401 y 404).
<!-- Agregar acá la colección exportada o las capturas -->
