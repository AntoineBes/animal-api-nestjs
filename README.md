Animalia API (NestJS + Prisma)
API de gestion des espèces et des animaux, avec validations DTO, documentation Swagger, tests unitaires et e2e, observabilité, et déploiement conteneurisé.

Sommaire
Prérequis

Démarrage rapide

Scripts npm

Variables d’environnement

Base de données

Tests (unitaires & e2e)

Docker & Compose

Endpoints santé

Erreurs & conventions

Développement & qualité

Roadmap

Licence

Prérequis
Node 18+

npm 9+

Docker Desktop (optionnel mais recommandé)

Prisma CLI (via npx)

Démarrage rapide
bash
# Installer les dépendances
npm ci

# Générer le client Prisma
npx prisma generate

# (Optionnel) Appliquer les migrations en dev
npx prisma migrate dev

# Lancer l'API en dev (hot reload)
npm run start:dev

# Swagger
# Ouvrir http://localhost:3000/docs
Scripts npm
bash
# Run API
npm run start:dev
npm run build && npm run start:prod

# Prisma
npx prisma generate
npx prisma migrate dev
npm run seed   # si un script de seed existe

# Qualité
npm run lint
npm test
npm run test:e2e
Variables d’environnement
Créer un fichier .env à la racine si nécessaire.

text
# Base de données (SQLite par défaut)
DATABASE_URL="file:./prisma/dev.db"

# Serveur
PORT=3000
NODE_ENV=development

# CORS (adapter plus tard si front)
CORS_ORIGINS="http://localhost:3000,http://localhost:4200,http://localhost:5173"
Base de données
Par défaut: SQLite via Prisma, fichier sous prisma/dev.db.

Pour Postgres: remplacer DATABASE_URL et exécuter npx prisma migrate deploy.

Tests (unitaires & e2e)
bash
# Tests unitaires
npm test

# Tests end-to-end
npm run test:e2e
Les tests couvrent CRUD espèces/animaux, validations, filtre d’erreurs, et endpoints santé (/health, /ready, /live).

Docker & Compose
Dockerfile multi-stage inclus.

docker-compose.integration.yml (local, build + run):

text
version: '3.9'
services:
  api:
    build: .
    container_name: animal-api
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: 'file:./prisma/dev.db'
    ports:
      - '3000:3000'
    volumes:
      - ./prisma:/app/prisma
    command: ['sh', '-c', 'npx prisma generate && npx prisma migrate deploy || true && node dist/main.js']
Commandes:

bash
# Démarrer
docker compose -f docker-compose.integration.yml up --build

# Arrêter
docker compose -f docker-compose.integration.yml down

# Logs
docker compose -f docker-compose.integration.yml logs -f
Endpoints santé
text
GET /health -> 200 { "status": "ok" }
GET /live   -> 200 { "status": "live" }        # liveness
GET /ready  -> 200 { "status": "ready" }       # readiness OK
             -> 503 { "status": "not-ready" }  # readiness KO (DB indisponible)
Erreurs & conventions
Validations DTO via class-validator (tailles, types, listes de valeurs).

Filtre global d’erreurs:

P2002 (unicité) -> 409 Conflict

P2025 (not found) -> 404 Not Found

HttpException -> statut d’origine

Sinon -> 500 Internal Server Error

Développement & qualité
CORS activé (origines locales par défaut).

Helmet pour les en-têtes de sécurité; rate limit global (100 req/min/IP par défaut).

LoggingInterceptor: logs JSON structurés (méthode, chemin, statut, durée).

Indices Prisma sur statutUICN, ordre, famille, genre.

Roadmap
Auth (JWT) pour sécuriser les endpoints d’écriture.

Passage Postgres pour environnements partagés.

Génération d’un client API (Orval/openapi-typescript) dès que le front démarre.

CI: pipeline build + tests (déjà prêt), ajout ultérieur du push d’image vers un registry si nécessaire.