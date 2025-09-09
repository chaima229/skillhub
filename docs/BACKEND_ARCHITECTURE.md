# Architecture Backend - SkillHub

## 🏗️ Vue d'ensemble de l'architecture

SkillHub suit une architecture modulaire basée sur le pattern **MVC (Model-View-Controller)** avec une séparation claire des responsabilités.

## 📁 Structure Modulaire

Chaque module suit la même structure organisationnelle :

```
modules/
├── auth/
│   ├── controller/         # Contrôleurs HTTP
│   ├── service/           # Logique métier
│   ├── repository/        # Accès aux données (couche DAO)
│   ├── dto/              # Data Transfer Objects
│   └── router/           # Routes Express
├── user/
├── project/
└── ...
```

### Couches d'Architecture

#### 1. **Router Layer** (Routes)
- Point d'entrée des requêtes HTTP
- Validation des paramètres d'URL
- Délégation vers les contrôleurs

#### 2. **Controller Layer** (Contrôleurs)
- Gestion des requêtes et réponses HTTP
- Validation des données d'entrée avec Zod
- Orchestration entre services
- Formatage des réponses

#### 3. **Service Layer** (Services)
- Logique métier principale
- Règles de gestion
- Orchestration entre repositories
- Transformation des données

#### 4. **Repository Layer** (Repositories)
- Abstraction d'accès aux données
- Requêtes Prisma
- Gestion des relations
- Cache Redis

#### 5. **DTO Layer** (Data Transfer Objects)
- Schémas de validation Zod
- Types TypeScript
- Contrats d'API

## 🔧 Technologies et Middleware

### Core Stack
- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **Prisma** : ORM pour PostgreSQL
- **Redis** : Cache et sessions
- **JWT** : Authentification stateless

### Middleware Stack
```typescript
app.use(helmet());              // Sécurité HTTP
app.use(cors());               // Cross-Origin Resource Sharing  
app.use(rateLimit());          // Limitation de requêtes
app.use(compression());        // Compression gzip
app.use(requestLogger);        // Logging des requêtes
app.use(errorHandler);         // Gestion globale d'erreurs
```

## 🔐 Système d'Authentification

### JWT Implementation
```
┌─────────────┐    login    ┌──────────────┐    JWT     ┌─────────────┐
│   Client    │ ───────────▶│   Auth API   │ ─────────▶│  Protected  │
│             │             │              │           │   Routes    │
└─────────────┘    ◀─────── └──────────────┘    ◀───── └─────────────┘
                   token                     validation
```

### Middleware d'Authentification
```typescript
// Exemple de protection de route
router.get('/protected', 
  authMiddleware,           // Vérifie le JWT
  roleMiddleware(['ADMIN']), // Vérifie les permissions
  controller.protectedAction
);
```

## 📊 Gestion des Données

### Pattern Repository
```typescript
// Interface générique
interface BaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(filters?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implémentation spécifique
class UserRepository implements BaseRepository<User> {
  // Implémentation avec Prisma
}
```

### Cache Strategy avec Redis
```typescript
// Pattern de cache automatique
async getUser(id: string): Promise<User> {
  // 1. Vérifier le cache
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  // 2. Requête base de données
  const user = await prisma.user.findUnique({ where: { id } });
  
  // 3. Mise en cache
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  
  return user;
}
```

## 🔄 Flux de Requête Typique

```
1. Client Request
   │
   ▼
2. Express Router
   │
   ▼
3. Middleware Stack
   ├─ Authentication
   ├─ Validation
   └─ Rate Limiting
   │
   ▼
4. Controller
   ├─ Validation Zod
   ├─ Service Call
   └─ Response Formatting
   │
   ▼
5. Service Layer
   ├─ Business Logic
   ├─ Repository Calls
   └─ Data Transformation
   │
   ▼
6. Repository Layer
   ├─ Cache Check (Redis)
   ├─ Database Query (Prisma)
   └─ Cache Update
   │
   ▼
7. Response to Client
```

## 🚨 Gestion d'Erreurs

### Hiérarchie d'Erreurs
```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor() {
    super('Authentication required', 401);
  }
}
```

### Error Handler Global
```typescript
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);
  
  if (error instanceof AppError) {
    return ResponseUtil.error(res, error.message, error.statusCode);
  }
  
  // Erreur inconnue
  return ResponseUtil.error(res, 'Internal server error', 500);
};
```

## 📡 API Response Format

### Format Standard
```typescript
// Succès
{
  success: true,
  data: any,
  message: string,
  timestamp: string
}

// Erreur
{
  success: false,
  error: {
    message: string,
    code?: string,
    details?: any
  },
  timestamp: string
}
```

## 🔍 Logging et Monitoring

### Configuration Winston
```typescript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'skillhub-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});
```

## 🔧 Configuration et Environnement

### Variables d'Environnement
```typescript
export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Redis
  REDIS_URL: process.env.REDIS_URL!,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100,
  
  // Features
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED === 'true',
  API_VERSION: process.env.API_VERSION || 'v1'
};
```

## 🚀 Performance et Optimisation

### Stratégies Implémentées
1. **Compression gzip** pour réduire la taille des réponses
2. **Rate limiting** pour prévenir les abus
3. **Cache Redis** pour les données fréquemment consultées
4. **Connection pooling** avec Prisma
5. **Lazy loading** des relations

### Métriques de Performance
- Temps de réponse API : < 200ms (P95)
- Throughput : 1000+ req/sec
- Uptime : 99.9%

---

Cette architecture garantit la **scalabilité**, la **maintenabilité** et la **sécurité** de l'application SkillHub.