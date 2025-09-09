# SkillHub - Plateforme de Gestion des Compétences

## 🎯 Vue d'ensemble

SkillHub est une plateforme complète de gestion des compétences et des projets éducatifs. Elle permet aux formateurs de créer des projets, d'assigner des compétences, et d'évaluer les apprenants dans un environnement structuré et collaboratif.

## 🏗️ Architecture Technique

### Backend
- **Framework**: Node.js avec Express.js et TypeScript
- **Base de données**: PostgreSQL avec Prisma ORM
- **Cache**: Redis
- **Authentification**: JWT (JSON Web Tokens)
- **Documentation API**: Swagger/OpenAPI
- **Sécurité**: Helmet, CORS, Rate Limiting
- **Logging**: Winston avec Morgan middleware

### Frontend
*Note: Le frontend n'est pas encore implémenté dans ce repository*

## 📁 Structure du Projet

```
skillhub/
├── src/
│   ├── app.ts              # Configuration Express
│   ├── server.ts           # Point d'entrée du serveur
│   ├── config/             # Configurations (DB, Redis, serveur)
│   ├── middleware/         # Middlewares (auth, error, logger)
│   ├── modules/            # Modules métier
│   │   ├── auth/           # Authentification
│   │   ├── user/           # Gestion des utilisateurs
│   │   ├── project/        # Gestion des projets
│   │   ├── competence/     # Gestion des compétences
│   │   ├── submission/     # Soumissions de projets
│   │   └── ...             # Autres modules
│   ├── utils/              # Utilitaires
│   └── docs/               # Documentation Swagger
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   ├── migrations/         # Migrations
│   └── seed.ts            # Données de test
└── package.json
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v18 ou supérieur)
- PostgreSQL (v13 ou supérieur)
- Redis (v6 ou supérieur)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/chaima229/skillhub.git
cd skillhub
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
Créer un fichier `.env` à la racine :
```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/skillhub"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=3000
NODE_ENV=development
API_VERSION=v1

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Swagger
SWAGGER_ENABLED=true
```

4. **Configuration de la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Optionnel: Peupler la base avec des données de test
npx prisma db seed
```

5. **Démarrer l'application**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📚 Documentation API

Une fois l'application démarrée, la documentation Swagger est disponible à :
`http://localhost:3000/api-docs`

### Endpoints Principaux

#### Authentification
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/refresh` - Renouvellement du token

#### Utilisateurs
- `GET /api/v1/users` - Liste des utilisateurs
- `GET /api/v1/users/:id` - Détails d'un utilisateur
- `PUT /api/v1/users/:id` - Mise à jour d'un utilisateur

#### Projets
- `GET /api/v1/projects` - Liste des projets
- `POST /api/v1/projects` - Création d'un projet
- `GET /api/v1/projects/:id` - Détails d'un projet
- `PUT /api/v1/projects/:id` - Mise à jour d'un projet

#### Compétences
- `GET /api/v1/competences` - Liste des compétences
- `POST /api/v1/competences` - Création d'une compétence

## 👥 Rôles et Permissions

### APPRENANT
- Consulter ses projets assignés
- Soumettre des livrables
- Consulter ses évaluations
- Recevoir des notifications

### FORMATEUR
- Créer et gérer des projets
- Assigner des projets aux apprenants
- Évaluer les soumissions
- Gérer les compétences
- Créer des groupes

### RESPONSABLE
- Toutes les permissions du formateur
- Gérer les utilisateurs
- Gérer les promotions
- Accès aux statistiques globales

## 🗄️ Modèle de Données

### Entités Principales
- **User**: Utilisateurs du système (apprenants, formateurs, responsables)
- **Project**: Projets pédagogiques avec objectifs et critères
- **Competence**: Compétences techniques et transversales
- **Submission**: Soumissions de projets par les apprenants
- **ProjectAssignment**: Assignation de projets aux apprenants
- **Group**: Groupes d'apprenants
- **Promotion**: Promotions/classes
- **Notification**: Système de notifications

Voir [SCHEMA.md](./docs/SCHEMA.md) pour les détails complets.

## ✅ État des Fonctionnalités

### Fonctionnalités Terminées ✅
- [x] Système d'authentification et autorisation JWT
- [x] Gestion des utilisateurs avec rôles multiples
- [x] CRUD complet pour les projets
- [x] Système de compétences
- [x] Assignation de projets aux apprenants
- [x] Système de soumissions
- [x] Critères d'évaluation
- [x] Gestion des ressources de projet
- [x] Système de notifications
- [x] Gestion des groupes et promotions
- [x] Documentation API Swagger
- [x] Middleware de sécurité et logging
- [x] Rate limiting et gestion d'erreurs

### Fonctionnalités En Cours 🚧
- [ ] Interface utilisateur frontend (React/Vue.js)
- [ ] Upload de fichiers pour les soumissions
- [ ] Système de notation automatique
- [ ] Notifications en temps réel (WebSockets)
- [ ] Système d'emails
- [ ] Tableau de bord analytics
- [ ] Export de données (PDF, Excel)
- [ ] API de recherche avancée
- [ ] Système de commentaires sur les soumissions
- [ ] Historique des versions de projets

### Fonctionnalités Prévues 📋
- [ ] Application mobile (React Native)
- [ ] Intégration avec des outils externes (GitHub, GitLab)
- [ ] Système de badges et gamification
- [ ] Module de formation en ligne
- [ ] API REST complète pour intégrations tierces
- [ ] Tests automatisés (unit, integration, e2e)
- [ ] Pipeline CI/CD
- [ ] Monitoring et observabilité

## 🛠️ Développement

### Scripts Disponibles
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage en mode production
npm run test         # Tests (à implémenter)
npm run lint         # Linting du code (à implémenter)
```

### Contribution
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changes (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation API
- Vérifier les logs d'erreur

## 📚 Documentation Complète

Cette documentation fournit un aperçu général. Pour une documentation détaillée, consultez :

### 📖 Documents Détaillés
- **[Architecture Backend](./docs/BACKEND_ARCHITECTURE.md)** - Architecture technique détaillée
- **[Schéma Base de Données](./docs/DATABASE_SCHEMA.md)** - Documentation complète du modèle de données  
- **[Référence API](./docs/API_REFERENCE.md)** - Documentation complète de l'API REST
- **[Guide d'Installation](./docs/INSTALLATION.md)** - Installation et configuration détaillées
- **[État des Fonctionnalités](./docs/FEATURE_STATUS.md)** - Suivi détaillé du développement
- **[Roadmap Frontend](./docs/FRONTEND_ROADMAP.md)** - Planification de l'interface utilisateur

### 📋 Index Documentation
Consultez **[docs/README.md](./docs/README.md)** pour l'index complet de la documentation.

---

*Dernière mise à jour: Décembre 2024 - Version 1.0*