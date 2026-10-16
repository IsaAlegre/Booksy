# 📚 Booksy

Booksy es una red social y base de datos de libros pensada para armar una comunidad de lectores. Permite descubrir libros, leer y escribir reseñas, organizar una biblioteca personal y sugerir títulos nuevos para el catálogo, que un equipo de administración revisa.

Proyecto Integrador de **Paradigmas y Lenguajes de Programación III** (Ingeniería en Sistemas de Información, Universidad de la Cuenca del Plata). 

## ✨ Funcionalidades

- **Catálogo de libros** público, con búsqueda y vista de detalle.
- **Registro e inicio de sesión** con JWT, y recuperación de contraseña por email.
- **Biblioteca personal** con tres estados por libro: `read` (leído), `reading` (leyendo) y `to-read` (por leer).
- **Reseñas y valoraciones** (comentario + puntaje) en cada libro.
- **Perfiles de usuario** con foto y descripción editables, y perfil público con la biblioteca del usuario.
- **Sugerencias de libros**: cualquier persona puede proponer un título nuevo.
- **Panel de administración**: alta, edición y baja de libros (con portada), y revisión de sugerencias (marcar como vistas).
- **Roles y permisos**: `user` y `admin`, con rutas protegidas por middleware.
- **Subida de imágenes** a Cloudinary (portadas y fotos de perfil).

## 🛠️ Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend (`client/`) | React 19, Vite, React Router, Tailwind CSS 4, Axios, Framer Motion, Swiper, SweetAlert2, React Toastify |
| Backend (`backend/`) | Node.js, Express 5, TypeScript, TypeORM |
| Base de datos | PostgreSQL (con migraciones de TypeORM) |
| Autenticación | JWT + bcryptjs |
| Servicios externos | Cloudinary (imágenes), Nodemailer (emails) |

## 🗂️ Estructura

```
Booksy/
├── backend/
│   └── src/
│       ├── config/        # DataSource, Cloudinary, Multer, Nodemailer
│       ├── middleware/    # auth, admin, ownership, manejo de errores
│       ├── migrations/    # migraciones de TypeORM
│       └── modules/       # auth, users, books, libraries, reviews, suggestions
├── client/
│   └── src/
│       ├── api/           # instancia de Axios
│       ├── components/    # UI (Admin, BookDetail, UserProfile, formularios...)
│       ├── context/       # AuthContext, SearchContext
│       ├── hooks/
│       ├── layouts/
│       └── pages/
└── Proyecto de Paradigmas III.pdf
```

## 🚀 Puesta en marcha

### Requisitos

- Node.js y npm
- PostgreSQL
- Cuenta de Cloudinary (para subir imágenes)
- Un servidor SMTP (para el email de recuperación de contraseña)

### 1. Clonar el repositorio

```bash
git clone https://github.com/IsaAlegre/Booksy.git
cd Booksy
```

### 2. Backend

```bash
cd backend
npm install
```

Creá un archivo `.env` en `backend/`:

```env
PORT=3000

# Base de datos (local). En producción alcanza con DATABASE_URL.
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=booksy
# DATABASE_URL=postgres://usuario:password@host:5432/booksy

# Autenticación
JWT_SECRET=un_secreto_largo_y_aleatorio

# URL del frontend (se usa en el link de recuperación de contraseña)
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (SMTP, puerto 465 con SSL)
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
```

Creá la base de datos, corré las migraciones (se ejecutan sobre el código compilado) y levantá el servidor:

```bash
npm run build
npm run migration:run
npm run dev
```

La API queda disponible en `http://localhost:3000/api`.

### 3. Frontend

```bash
cd client
npm install
```

Creá un archivo `.env` en `client/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Y levantá la app:

```bash
npm run dev
```

Por defecto Vite la sirve en `http://localhost:5173`.

### 4. Crear un administrador

Los usuarios se registran con rol `user`. Para convertir una cuenta en administrador, cambiá su campo `role` a `admin` en la tabla `users` de la base de datos. Con eso se habilita el panel en `/admin/books`.

## 📜 Scripts

**Backend**

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor en modo desarrollo con recarga (`tsx watch`) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run migration:run` | Ejecuta las migraciones pendientes |
| `npm run migration:revert` | Revierte la última migración |
| `npm run start:prod` | Inicia el servidor compilado |
| `npm run start:render` | Build + migraciones + inicio (pensado para deploy en Render) |

**Frontend**

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta ESLint |

## 🔌 API

Todas las rutas cuelgan de `/api`.

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/register` | Público | Registrar usuario |
| POST | `/auth/login` | Público | Iniciar sesión |
| GET | `/auth/me` | Usuario | Datos del usuario autenticado |
| POST | `/auth/forgot-password` | Público | Solicitar recuperación de contraseña |
| POST | `/auth/reset-password/:token` | Público | Establecer nueva contraseña |
| GET | `/books` | Público | Listar libros |
| GET | `/books/:id` | Público | Detalle de un libro |
| POST | `/books` | Admin | Crear libro (con `coverImage`) |
| PUT | `/books/:id` | Admin | Editar libro |
| DELETE | `/books/:id` | Admin | Eliminar libro |
| GET | `/books/:bookId/reviews` | Público | Reseñas de un libro |
| POST | `/books/:bookId/reviews` | Usuario | Crear reseña |
| DELETE | `/books/:bookId/reviews/:reviewId` | Usuario | Eliminar reseña |
| GET | `/users/search` | Público | Buscar usuarios |
| GET | `/users` | Admin | Listar usuarios |
| GET | `/users/:id` | Público | Perfil básico |
| GET | `/users/:id/public` | Público | Perfil público con biblioteca |
| PUT | `/users/profile` | Usuario | Editar perfil (con `profilePicture`) |
| DELETE | `/users/:id` | Usuario | Eliminar usuario |
| GET | `/users/:userId/library` | Público | Biblioteca de un usuario |
| POST | `/users/:userId/library` | Dueño | Agregar libro a la biblioteca |
| PUT | `/users/:userId/library/:libraryId` | Dueño | Cambiar estado de lectura |
| DELETE | `/users/:userId/library/:libraryId` | Dueño | Quitar libro de la biblioteca |
| POST | `/suggestions` | Público | Enviar sugerencia de libro |
| GET | `/suggestions` | Admin | Listar sugerencias |
| PATCH | `/suggestions/:id/seen` | Admin | Marcar sugerencia como vista |

## 🗃️ Modelo de datos

- **User**: `username`, `email`, `password`, `profilePicture`, `description`, `role` (`admin` | `user`).
- **Book**: `title`, `author`, `genre`, `year`, `pages`, `description`, `coverUrl`.
- **Library**: relaciona un usuario con un libro y su `status` (`read` | `reading` | `to-read`).
- **Review**: `comment` y `rating` de un usuario sobre un libro.
- **Suggestion**: `title`, `author`, `genre`, `suggestion`, `seen` (el usuario es opcional).

## 👩‍💻 Autora

**Isabella Alegre** · [@IsaAlegre](https://github.com/IsaAlegre)
