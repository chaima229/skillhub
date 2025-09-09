# Guide d'Installation et de Configuration - SkillHub

## 🛠️ Prérequis Système

Avant d'installer SkillHub, assurez-vous d'avoir les éléments suivants installés sur votre système :

### Logiciels Requis
- **Node.js** >= 18.x.x ([Télécharger](https://nodejs.org/))
- **npm** >= 8.x.x ou **yarn** >= 1.22.x
- **PostgreSQL** >= 13.x.x ([Télécharger](https://www.postgresql.org/download/))
- **Redis** >= 6.x.x ([Télécharger](https://redis.io/download/))
- **Git** pour cloner le repository

### Vérification des Prérequis
```bash
# Vérifier Node.js
node --version  # Doit afficher >= 18.x.x

# Vérifier npm
npm --version   # Doit afficher >= 8.x.x

# Vérifier PostgreSQL
psql --version  # Doit afficher >= 13.x.x

# Vérifier Redis
redis-server --version  # Doit afficher >= 6.x.x
```

## 📥 Installation

### 1. Cloner le Repository
```bash
git clone https://github.com/chaima229/skillhub.git
cd skillhub
```

### 2. Installer les Dépendances
```bash
# Avec npm
npm install

# Ou avec yarn
yarn install
```

### 3. Configuration de l'Environnement
Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env  # Si un fichier exemple existe
# Ou créez le fichier manuellement
```

#### Contenu du fichier `.env`
```env
# ===================
# Base de données
# ===================
DATABASE_URL="postgresql://skillhub_user:skillhub_password@localhost:5432/skillhub_db"

# ===================
# Redis
# ===================
REDIS_URL="redis://localhost:6379"

# ===================
# JWT Configuration
# ===================
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# ===================
# Serveur
# ===================
PORT=3000
NODE_ENV=development
API_VERSION=v1

# ===================
# CORS Configuration
# ===================
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# ===================
# Rate Limiting
# ===================
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requêtes par fenêtre

# ===================
# Features
# ===================
SWAGGER_ENABLED=true
LOG_LEVEL=info
```

## 🗄️ Configuration de la Base de Données

### 1. Création de la Base de Données PostgreSQL
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le terminal PostgreSQL
CREATE DATABASE skillhub_db;
CREATE USER skillhub_user WITH ENCRYPTED PASSWORD 'skillhub_password';
GRANT ALL PRIVILEGES ON DATABASE skillhub_db TO skillhub_user;

# Quitter PostgreSQL
\q
```

### 2. Configuration Prisma
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Optionnel: Peupler avec des données de test
npx prisma db seed
```

### 3. Vérification de la Connexion
```bash
# Tester la connexion à la base
npx prisma db pull
```

## 🔴 Configuration de Redis

### Installation Redis (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server

# Démarrer Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Tester la connexion
redis-cli ping  # Doit retourner "PONG"
```

### Installation Redis (macOS avec Homebrew)
```bash
brew install redis

# Démarrer Redis
brew services start redis

# Tester la connexion
redis-cli ping  # Doit retourner "PONG"
```

### Configuration Redis (Optionnel)
Pour un environnement de production, modifiez `/etc/redis/redis.conf` :
```bash
# Sécuriser Redis avec un mot de passe
requirepass your-redis-password

# Configurer la persistance
save 900 1
save 300 10
save 60 10000
```

## 🚀 Démarrage de l'Application

### Mode Développement
```bash
npm run dev
```

L'application sera accessible sur :
- **API** : http://localhost:3000
- **Documentation** : http://localhost:3000/api-docs
- **Health Check** : http://localhost:3000/health

### Mode Production
```bash
# Build de l'application
npm run build

# Démarrage en production
npm start
```

## ✅ Vérification de l'Installation

### 1. Health Check
```bash
curl http://localhost:3000/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 42.123,
    "environment": "development"
  },
  "message": "Server is healthy"
}
```

### 2. Test de l'API
```bash
# Test d'une route sans authentification
curl http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "APPRENANT"
  }'
```

### 3. Accès à la Documentation
Ouvrez http://localhost:3000/api-docs dans votre navigateur pour accéder à la documentation Swagger.

## 🛡️ Configuration de Sécurité

### Variables Sensibles
⚠️ **Important** : Ne jamais committer le fichier `.env` !

```bash
# Ajouter .env au .gitignore
echo ".env" >> .gitignore
```

### JWT Secret
```bash
# Générer une clé JWT sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### HTTPS en Production
Pour la production, configurez un reverse proxy (nginx) avec SSL :

```nginx
# /etc/nginx/sites-available/skillhub
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🐳 Déploiement avec Docker (Optionnel)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/skillhub
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: skillhub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 🔧 Résolution de Problèmes

### Problème : Erreur de Connexion à la Base
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Vérifier les permissions
sudo -u postgres psql -c "\l"
```

### Problème : Erreur de Connexion Redis
```bash
# Vérifier que Redis est démarré
sudo systemctl status redis-server

# Tester la connexion
redis-cli ping
```

### Problème : Port déjà utilisé
```bash
# Trouver le processus utilisant le port 3000
lsof -ti:3000

# Tuer le processus
kill -9 <PID>
```

### Problème : Migrations Prisma
```bash
# Reset complet (développement uniquement)
npx prisma migrate reset

# Forcer la synchronisation
npx prisma db push
```

## 📊 Monitoring et Logs

### Logs de l'Application
```bash
# Logs en temps réel
tail -f logs/combined.log

# Logs d'erreur uniquement
tail -f logs/error.log
```

### Monitoring des Ressources
```bash
# Utilisation CPU/RAM
top -p $(pgrep node)

# Connexions base de données
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🚀 Scripts de Développement

### Scripts NPM Disponibles
```bash
npm run dev          # Démarrage développement avec hot-reload
npm run build        # Build de production
npm run start        # Démarrage production
npm run test         # Tests (à implémenter)
npm run lint         # Linting du code (à implémenter)
npm run prisma:studio # Interface graphique Prisma
```

### Commandes Utiles
```bash
# Réinitialiser complètement
npm run clean && npm install && npx prisma migrate reset

# Mise à jour des dépendances
npm update

# Audit de sécurité
npm audit --audit-level high
```

---

**Installation terminée !** 🎉

Votre instance SkillHub est maintenant prête à être utilisée. Consultez la [documentation API](./API_REFERENCE.md) pour commencer à développer.