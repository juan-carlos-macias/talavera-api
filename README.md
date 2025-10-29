# Talavera API

API Backend para el sistema de suscripciones Talavera, desarrollado con enfoque TDD/BDD.

## 📋 Estado del Proyecto

### ✅ Tier 0 — Repo Boot & Test Harness (COMPLETADO)

**Objetivo:** Configurar el repositorio con infraestructura básica y tests que fallan inicialmente (TDD/BDD approach).

#### Lo que está configurado:

- ✅ **Monorepo/Backend**: Estructura de proyecto backend organizada
- ✅ **Docker Compose**: PostgreSQL configurado con variables de entorno
- ✅ **Test Framework**: Vitest configurado y funcionando
- ✅ **Scripts NPM**: 
  - `npm run test` - Ejecuta tests (actualmente 10 tests fallando ✓)
  - `npm run lint` - Linter ESLint
  - `npm run format` - Formatter Prettier
  - `npm run dev` - Servidor de desarrollo
  - `npm run db:migrate` - Migraciones de Prisma
  - `npm run db:generate` - Generar Prisma Client
  - `npm run db:studio` - Prisma Studio
- ✅ **BDD/TDD Tests**: 10 tests de Tier 1 escritos PRIMERO que fallan correctamente

#### Tests de Tier 1 (Actualmente Fallando - Por Diseño):

```bash
npm run test
```

**Resultado Esperado:** 10 tests fallidos con status 404 (Route Not found)

Los tests cubren:
- 🔴 User Registration (4 tests)
- 🔴 User Login (3 tests)  
- 🔴 Protected Routes (3 tests)

**NOTA:** Estos tests DEBEN fallar porque aún no hay implementación. Este es el enfoque TDD/BDD correcto.

---

### 🔄 Tier 1 — Authentication & Basic CRUD (SIGUIENTE)

**Pendiente de implementación:**

- [ ] Implementar registro de usuarios (POST /api/auth/register)
- [ ] Implementar login (POST /api/auth/login)
- [ ] Implementar middleware de autenticación JWT
- [ ] Implementar rutas protegidas (GET /api/users/me)
- [ ] CRUD de Projects
- [ ] Gestión básica de suscripciones

**Criterio de éxito:** Todos los tests de Tier 1 deben pasar (verde).

---

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+ (recomendado 20+)
- Docker y Docker Compose
- npm o yarn

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone <repo-url>
cd talavera-api

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores (el archivo ya tiene defaults)
```

### 3. Levantar Base de Datos

```bash
# Iniciar PostgreSQL con Docker
docker compose up -d db

# Verificar que está corriendo
docker compose ps
```

### 4. Ejecutar Migraciones

```bash
# Crear y aplicar migraciones de Prisma
npm run db:migrate
```

### 5. Correr Tests

```bash
# Ejecutar suite de tests
npm run test

# Resultado esperado: 10 tests fallidos (esto es correcto para Tier 0)
```

### 6. Ejecutar en Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3000
```

---

## 🗂️ Estructura del Proyecto

```
talavera-api/
├── prisma/
│   ├── schema.prisma          # Schema de la base de datos
│   └── migrations/            # Migraciones de Prisma
├── src/
│   ├── @types/               # Tipos TypeScript personalizados
│   ├── app/                  # Configuración de la app
│   │   ├── index.ts         # Clase principal de la app
│   │   └── config/          # Configuraciones (winston, etc)
│   ├── controllers/         # Controladores (vacío - Tier 1)
│   ├── middlewares/         # Middlewares de Express
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio (vacío - Tier 1)
│   ├── tests/               # Tests BDD/TDD
│   │   ├── setup.ts        # Configuración de tests
│   │   └── features/       # Tests de features
│   ├── utils/               # Utilidades (ApiError, etc)
│   └── index.ts             # Punto de entrada
├── .env                     # Variables de entorno (git-ignored)
├── .env.example            # Ejemplo de variables de entorno
├── docker-compose.yml      # Configuración de Docker
├── Dockerfile              # Imagen Docker de la API
├── vitest.config.mjs       # Configuración de Vitest
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias y scripts

```

---

## 🧪 Testing

El proyecto sigue un enfoque **TDD/BDD** (Test-Driven Development / Behavior-Driven Development):

### Filosofía TDD/BDD

1. **Red**: Escribir tests que fallen
2. **Green**: Implementar código mínimo para pasar tests
3. **Refactor**: Mejorar el código manteniendo tests verdes

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test -- --watch

# Ejecutar tests con coverage
npm run test -- --coverage
```

### Estado Actual de Tests

```
✓ Tier 0: Test harness configurado
✗ 10 tests fallando (esperado - no hay implementación aún)
```

---

## 🐳 Docker

### Solo Base de Datos

```bash
# Iniciar solo PostgreSQL
docker compose up -d db

# Ver logs
docker compose logs -f db

# Detener
docker compose down
```

### API + Base de Datos

```bash
# Construir y levantar todo
docker compose up -d

# Ver logs
docker compose logs -f

# Detener todo
docker compose down
```

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con hot-reload
npm run build        # Compilar TypeScript a JavaScript
npm run start        # Ejecutar build compilado
npm run test         # Ejecutar tests con Vitest
npm run lint         # Linter con ESLint
npm run format       # Format con Prettier
npm run db:generate  # Generar Prisma Client
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
```

---

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nombre de la base de datos | `talavera` |
| `POSTGRES_PORT` | Puerto de PostgreSQL | `5432` |
| `JWT_SECRET` | Secret para JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Tiempo de expiración de JWT | `7d` |

---

## 🗄️ Base de Datos

### Schema Prisma

El proyecto usa Prisma ORM con PostgreSQL. Los modelos principales son:

- **User**: Usuarios del sistema
- **Project**: Proyectos de usuarios
- **Invoice**: Facturas de suscripciones
- **PlanType**: Enum (FREE, PRO)

### Comandos Útiles

```bash
# Generar cliente de Prisma después de cambios en schema
npm run db:generate

# Crear una nueva migración
npm run db:migrate

# Ver/editar datos con interfaz gráfica
npm run db:studio

# Reset de base de datos (¡cuidado!)
npx prisma migrate reset
```

---

## 🤝 Contribución

### Workflow de Desarrollo

1. Los tests se escriben PRIMERO (Red)
2. Implementar la funcionalidad mínima (Green)
3. Refactorizar si es necesario (Refactor)
4. Commit y push

### Convenciones de Código

- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** recomendado

---

## 📝 Notas de Desarrollo

### Tier 0 Completado

- ✅ Configuración inicial del proyecto
- ✅ Docker Compose con PostgreSQL
- ✅ Prisma ORM configurado
- ✅ Tests BDD/TDD escritos (fallando)
- ✅ Scripts npm funcionando
- ✅ Linting y formatting configurados

### Próximos Pasos (Tier 1)

1. Implementar autenticación (register, login)
2. Crear middleware JWT
3. Implementar CRUD de Projects
4. Hacer que los 10 tests pasen
5. Agregar más tests según sea necesario

---

## 📚 Tecnologías

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript
- **Framework**: Express 5
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL 15
- **Testing**: Vitest + Supertest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Containerization**: Docker

---

## 📄 Licencia

ISC

---

## 🆘 Troubleshooting

### Tests no corren

```bash
# Verificar que node_modules esté instalado
npm install

# Verificar versión de Node (debe ser 18+)
node --version
```

### Base de datos no conecta

```bash
# Verificar que Docker esté corriendo
docker ps

# Verificar logs de PostgreSQL
docker compose logs db

# Reiniciar contenedor
docker compose restart db
```

### Prisma Client no se encuentra

```bash
# Generar el cliente
npm run db:generate
```

---

**Último Update:** Tier 0 completado - Octubre 2025
