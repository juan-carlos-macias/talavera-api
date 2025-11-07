# Talavera API

Backend API for the Talavera subscription system, developed with TDD/BDD approach.

## 📋 Project Status

### ✅ Tier 0 — Repo Boot & Test Harness (COMPLETED)

**Goal:** Set up the repository with basic infrastructure and initially failing tests (TDD/BDD approach).

#### What's Configured:

- ✅ **Monorepo/Backend**: Organized backend project structure
- ✅ **Docker Compose**: PostgreSQL configured with environment variables
- ✅ **Test Framework**: Vitest configured and working
- ✅ **NPM Scripts**: 
  - `npm run test` - Run tests
  - `npm run lint` - ESLint linter
  - `npm run format` - Prettier formatter
  - `npm run dev` - Development server
  - `npm run db:migrate` - Prisma migrations
  - `npm run db:generate` - Generate Prisma Client
  - `npm run db:studio` - Prisma Studio
- ✅ **BDD/TDD Tests**: 10 Tier 1 tests written FIRST that fail correctly

#### Tier 1 Tests (Currently Failing - By Design):

```bash
npm run test
```

**Expected Result:** 10 failed tests with 404 status (Route Not found)

Tests cover:
- 🔴 User Registration (4 tests)
- 🔴 User Login (3 tests)  
- 🔴 Protected Routes (3 tests)

**NOTE:** These tests MUST fail because there's no implementation yet. This is the correct TDD/BDD approach.

---

### ✅ Tier 1 — Authentication & Basic CRUD (COMPLETED)

**Implementation completed:**

- ✅ User registration (POST /api/auth/register) with validation
- ✅ Login (POST /api/auth/login) with JWT
- ✅ JWT authentication middleware
- ✅ Protected routes (GET /api/users/me)
- ✅ Complete Projects CRUD (owner-scoped)
- ✅ Project quota (FREE plan: max 3 projects)
- ✅ Zod validation for all endpoints

**Tests:** ✅ 10/10 tests passing

**Implemented Routes:**

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login and JWT token retrieval
- `GET /api/users/me` - Get current user (protected)

**Projects (all protected):**
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project (respects FREE quota)
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Success Criteria:** ✅ All Tier 1 tests passed (green).

---

### ✅ Tier 2 — Subscriptions & Payment Integration (COMPLETED)

**Goal:** Implement subscription management with payment processing (Stripe mock).

#### Implementation completed:

- ✅ **Plans Management**: GET /api/plans endpoint
- ✅ **Subscription Creation**: POST /api/subscriptions (PRO plan only)
- ✅ **Current Subscription**: GET /api/subscriptions/current (protected)
- ✅ **Stripe Mock Integration**: Simulated payment processing with mock payment intents
- ✅ **Invoice Generation**: Automatic invoice creation on subscription
- ✅ **PRO Plan Quota**: 10 projects quota enforcement
- ✅ **Quota Upgrade Flow**: FREE → PRO upgrade increases quota from 3 to 10
- ✅ **Validation**: Cannot create FREE plan subscriptions, duplicate subscriptions blocked
- ✅ **Database Schema**: Invoice model with payment tracking

**Tests:** ✅ 20/20 tests passing (Tier 1: 10, Tier 2: 10)

---

### ✅ Audio Transcription & Analysis (COMPLETED)

**Goal:** Implement AI-powered audio transcription and summarization using OpenAI agents.

#### Implementation completed:

- ✅ **Audio Upload**: POST /api/audio/analyze endpoint with multipart/form-data
- ✅ **Whisper Integration**: Automatic transcription using OpenAI Whisper API
- ✅ **GPT-4o-mini Agent**: Intelligent analysis extracting titles, keywords, and summaries
- ✅ **Audio Summaries CRUD**: Create, read, and delete audio summaries
- ✅ **Multi-format Support**: MP3, WAV, M4A, OGG, WEBM, and more
- ✅ **Secure Storage**: User-scoped audio summaries with authentication
- ✅ **Spanish Language**: Optimized for Spanish transcription (configurable)

**Implemented Routes:**

**Audio (all protected):**
- `POST /api/audio/analyze` - Upload and analyze audio file
- `GET /api/audio` - List user's audio summaries
- `GET /api/audio/:id` - Get specific audio summary
- `DELETE /api/audio/:id` - Delete audio summary

**Features:**
- 🎙️ **Automatic Transcription**: Speech-to-text using Whisper
- 🤖 **Intelligent Analysis**: AI agent extracts key insights
- 📝 **Structured Output**: Title, keywords, transcript, and summary
- 🔒 **Protected Endpoints**: User authentication required
- 💾 **Database Storage**: All summaries stored with PostgreSQL

**Documentation:** 📄 See [AUDIO_TRANSCRIPTION_GUIDE.md](./AUDIO_TRANSCRIPTION_GUIDE.md) for detailed usage instructions and API examples.

**Success Criteria:** ✅ Audio transcription and analysis fully functional.

**Implemented Routes:**

**Plans (public):**
- `GET /api/plans` - List available plans with i18n support (?locale=en|es)
  - FREE plan: $0/month, 3 projects
  - PRO plan: $9.99/month, 10 projects

**Subscriptions (all protected):**
- `POST /api/subscriptions` - Create PRO subscription with payment processing
- `GET /api/subscriptions/current` - Get user's current subscription details

**Features:**
- ✨ **Payment Mock**: Stripe payment intent simulation (`pi_mock_*` format)
- ✨ **Automatic Upgrades**: Quota automatically increases on PRO subscription
- ✨ **Status Tracking**: Invoice status (paid, pending, failed)
- ✨ **Business Rules**: 
  - Cannot subscribe to FREE plan (it's default)
  - Cannot create duplicate active subscriptions
  - Project creation respects current plan quota

**Success Criteria:** ✅ All Tier 2 tests passed (green).

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended 20+)
- Docker and Docker Compose
- npm or yarn

### 1. Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd talavera-api

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values (file already has defaults)
```

### 3. Start Database

```bash
# Start PostgreSQL with Docker
docker compose up -d db

# Verify it's running
docker compose ps
```

### 4. Run Migrations

```bash
# Create and apply Prisma migrations
npm run db:migrate
```

### 5. Run Tests

```bash
# Execute test suite
npm run test

# Expected result: 10 passing tests
```

### 6. Run in Development Mode

```bash
# Start development server
npm run dev

# Server will be available at http://localhost:3000
```

---

## 🗂️ Project Structure

```
talavera-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Prisma migrations
├── src/
│   ├── @types/               # Custom TypeScript types
│   ├── app/                  # App configuration
│   │   ├── index.ts         # Main app class
│   │   └── config/          # Configurations (winston, cors, helmet, etc)
│   ├── controllers/         # Controllers
│   ├── middlewares/         # Express middlewares
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic
│   ├── tests/               # BDD/TDD tests
│   │   ├── setup.ts        # Test configuration
│   │   └── features/       # Feature tests
│   ├── utils/               # Utilities (ApiError, etc)
│   └── index.ts             # Entry point
├── .env                     # Environment variables (git-ignored)
├── .env.example            # Environment variables example
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # API Docker image
├── vitest.config.mjs       # Vitest configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🧪 Testing

The project follows a **TDD/BDD** approach (Test-Driven Development / Behavior-Driven Development):

### TDD/BDD Philosophy

1. **Red**: Write failing tests
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### Current Test Status

```
✅ Tier 0: Test harness configured
✅ Tier 1: 10/10 tests passing
```

---

## 🐳 Docker

### Database Only

```bash
# Start PostgreSQL only
docker compose up -d db

# View logs
docker compose logs -f db

# Stop
docker compose down
```

### API + Database

```bash
# Build and start everything
docker compose up -d

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

---

## 📦 Available Scripts

```bash
npm run dev          # Development server with hot-reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled build
npm run test         # Run tests with Vitest
npm run lint         # Lint with ESLint
npm run format       # Format with Prettier
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:pass@localhost:5432/db` |
| `POSTGRES_USER` | PostgreSQL user | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `POSTGRES_DB` | Database name | `talavera` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | JWT secret key | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `OPENAI_API_KEY` | OpenAI API key for Whisper & GPT | `sk-proj-...` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000,http://localhost:5173` |

---

## 🗄️ Database

### Prisma Schema

The project uses Prisma ORM with PostgreSQL. Main models are:

- **User**: System users
- **Project**: User projects
- **Invoice**: Subscription invoices
- **PlanType**: Enum (FREE, PRO)

### Useful Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a new migration
npm run db:migrate

# View/edit data with GUI
npm run db:studio

# Reset database (careful!)
npx prisma migrate reset
```

---

## 🤝 Contributing

### Development Workflow

1. Write tests FIRST (Red)
2. Implement minimal functionality (Green)
3. Refactor if necessary (Refactor)
4. Commit and push

### Code Conventions

- **TypeScript** strict mode
- **ESLint** for linting
- **Prettier** for formatting
- **Conventional Commits** recommended

---

## 📚 Technologies

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express 5
- **ORM**: Prisma (see justification below)
- **Database**: PostgreSQL 15
- **Testing**: Vitest + Supertest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Containerization**: Docker

### Why Prisma Over Knex?

**Prisma** was chosen as the ORM for this project due to:

✅ **Type Safety**: Auto-generated TypeScript types from schema  
✅ **Developer Experience**: Intuitive API with excellent auto-completion  
✅ **Migrations**: Built-in migration system with rollback support  
✅ **Schema-First**: Single source of truth for database structure  
✅ **Security**: SQL injection prevention by design  
✅ **Tooling**: Prisma Studio for visual database management  

While **Knex** offers more control over raw SQL and greater flexibility, Prisma's benefits outweigh these advantages for our use case:
- Modern TypeScript-first project
- Relatively simple schema (User, Project, Invoice)
- Team productivity prioritized over raw SQL control
- Better onboarding experience for new developers

For detailed comparison, see [AI_USAGE.md](./AI_USAGE.md#why-prisma-over-knex)

---

## 🤖 AI-Assisted Development

This project was developed using AI-assisted development practices with **Cline (Claude)** as the AI pair programmer.

### Key Metrics

- **Development Time**: ~12 hours total (~4 hours human work, ~8 hours saved by AI)
- **AI Contribution**: ~2,000 lines of code generated
- **Acceptance Rate**: 60% accepted as-is, 35% modified, 5% rejected
- **Test Coverage**: 100% for implemented features
- **Code Quality**: 0 ESLint errors, 0 TypeScript errors

### What AI Helped With

✅ Boilerplate code generation (configs, setup)  
✅ CRUD implementation patterns  
✅ Type safety enforcement  
✅ Code refactoring and optimization  
✅ Security configuration (CORS, Helmet)  

### Human Oversight

🔍 Security validation  
🔍 Business logic decisions  
🔍 Code simplification  
🔍 Test verification  
🔍 Architecture decisions  

**For detailed AI usage, prompts, and lessons learned, see [AI_USAGE.md](./AI_USAGE.md)**

---

## 📄 License

ISC

---

## 🆘 Troubleshooting

### Tests not running

```bash
# Verify node_modules is installed
npm install

# Check Node version (must be 18+)
node --version
```

### Database not connecting

```bash
# Verify Docker is running
docker ps

# Check PostgreSQL logs
docker compose logs db

# Restart container
docker compose restart db
```

### Prisma Client not found

```bash
# Generate the client
npm run db:generate
```

---
