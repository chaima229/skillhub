# Référence API - SkillHub

## 🌐 Informations Générales

- **Base URL** : `http://localhost:3000/api/v1`
- **Format** : JSON
- **Authentification** : Bearer Token (JWT)
- **Encoding** : UTF-8

### Swagger Documentation
Documentation interactive disponible : `http://localhost:3000/api-docs`

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :
```
Authorization: Bearer <votre-token-jwt>
```

---

## 📚 Authentification & Autorisation

### POST `/auth/register`
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "APPRENANT"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "APPRENANT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### POST `/auth/login`
Connexion utilisateur.

**Body :**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "APPRENANT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

## 👤 Gestion des Utilisateurs

### GET `/users`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

Récupérer la liste des utilisateurs.

**Query Parameters :**
- `page` (optional) : Numéro de page (défaut: 1)
- `limit` (optional) : Nombre d'éléments par page (défaut: 10)
- `role` (optional) : Filtrer par rôle
- `promotion` (optional) : Filtrer par promotion

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clr123456",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "APPRENANT",
        "promotion": {
          "id": "clp789012",
          "name": "Promo 2024"
        },
        "groups": [
          {
            "id": "clg345678",
            "name": "Groupe A"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  },
  "message": "Users retrieved successfully"
}
```

### GET `/users/:id`
🔒 **Authentification requise**

Récupérer les détails d'un utilisateur.

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "clr123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "APPRENANT",
    "promotion": {
      "id": "clp789012",
      "name": "Promo 2024"
    },
    "groups": [
      {
        "id": "clg345678",
        "name": "Groupe A"
      }
    ],
    "projects": [
      {
        "id": "clprj901234",
        "title": "Application Web",
        "status": "EN_COURS"
      }
    ]
  },
  "message": "User retrieved successfully"
}
```

### PUT `/users/:id`
🔒 **Authentification requise** | Permissions : Propriétaire ou `RESPONSABLE`

Mettre à jour un utilisateur.

**Body :**
```json
{
  "name": "John Smith",
  "promotionId": "clp789012"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "clr123456",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "APPRENANT",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "User updated successfully"
}
```

### DELETE `/users/:id`
🔒 **Authentification requise** | Rôles : `RESPONSABLE`

Supprimer un utilisateur.

**Réponse (200) :**
```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

---

## 📚 Gestion des Projets

### GET `/projects`
🔒 **Authentification requise**

Récupérer la liste des projets (filtrée selon le rôle).

**Query Parameters :**
- `page` (optional) : Numéro de page
- `limit` (optional) : Nombre d'éléments par page
- `status` (optional) : Filtrer par statut
- `competence` (optional) : Filtrer par compétence

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "clprj901234",
        "title": "Application E-commerce",
        "description": "Développement d'une app complète",
        "objectives": "Maîtriser React, Node.js et PostgreSQL",
        "deadline": "2024-03-15T23:59:59Z",
        "competencies": [
          {
            "id": "clc567890",
            "name": "React",
            "level": "Avancé"
          }
        ],
        "criteria": [
          {
            "id": "clec111222",
            "name": "Fonctionnalités",
            "weight": 60
          }
        ],
        "createdBy": {
          "id": "clf333444",
          "name": "Prof Martin"
        },
        "createdAt": "2024-01-01T09:00:00Z"
      }
    ]
  },
  "message": "Projects retrieved successfully"
}
```

### GET `/projects/:id`
🔒 **Authentification requise**

Récupérer les détails d'un projet.

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "clprj901234",
    "title": "Application E-commerce",
    "description": "Développement d'une application...",
    "objectives": "Maîtriser React, Node.js et PostgreSQL",
    "deadline": "2024-03-15T23:59:59Z",
    "competencies": [
      {
        "id": "clc567890",
        "name": "React",
        "level": "Avancé"
      }
    ],
    "criteria": [
      {
        "id": "clec111222",
        "name": "Fonctionnalités",
        "weight": 60
      }
    ],
    "resources": [
      {
        "id": "clr555666",
        "type": "link",
        "url": "https://reactjs.org/docs"
      }
    ],
    "assignments": [
      {
        "id": "clpa777888",
        "user": {
          "id": "clr123456",
          "name": "John Doe"
        },
        "status": "EN_COURS"
      }
    ]
  },
  "message": "Project retrieved successfully"
}
```

### POST `/projects`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

Créer un nouveau projet.

**Body :**
```json
{
  "title": "API REST avec Node.js",
  "description": "Développer une API complète avec authentification",
  "objectives": "Maîtriser Node.js, Express, JWT",
  "deadline": "2024-04-15T23:59:59Z",
  "competencyIds": ["clc567890", "clc567891"],
  "criteria": [
    {
      "name": "Architecture",
      "weight": 40
    },
    {
      "name": "Sécurité",
      "weight": 30
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://nodejs.org/docs"
    }
  ]
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "id": "clprj999000",
    "title": "API REST avec Node.js",
    "description": "Développer une API complète...",
    "createdById": "clf333444",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Project created successfully"
}
```

### PUT `/projects/:id`
🔒 **Authentification requise** | Permissions : Créateur ou `RESPONSABLE`

Mettre à jour un projet.

**Body :**
```json
{
  "title": "API REST avancée avec Node.js",
  "deadline": "2024-04-30T23:59:59Z"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "clprj999000",
    "title": "API REST avancée avec Node.js",
    "deadline": "2024-04-30T23:59:59Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Project updated successfully"
}
```

---

## 📋 Assignations de Projets

### GET `/project-assignments`
🔒 **Authentification requise**

Récupérer les assignations (filtrées selon le rôle).

**Query Parameters :**
- `projectId` (optional) : Filtrer par projet
- `userId` (optional) : Filtrer par utilisateur
- `status` (optional) : Filtrer par statut

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "clpa777888",
      "project": {
        "id": "clprj901234",
        "title": "Application E-commerce"
      },
      "user": {
        "id": "clr123456",
        "name": "John Doe"
      },
      "status": "EN_COURS"
    }
  ],
  "message": "Assignments retrieved successfully"
}
```

### POST `/project-assignments`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

Assigner un projet à un utilisateur.

**Body :**
```json
{
  "projectId": "clprj901234",
  "userId": "clr123456"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "id": "clpa999111",
    "projectId": "clprj901234",
    "userId": "clr123456",
    "status": "EN_COURS"
  },
  "message": "Project assigned successfully"
}
```

### PUT `/project-assignments/:id`
🔒 **Authentification requise** | Permissions : Variable selon rôle

Mettre à jour le statut d'une assignation.

**Body :**
```json
{
  "status": "SOUMIS"
}
```

---

## 📝 Soumissions de Projets

### GET `/submissions`
🔒 **Authentification requise**

Récupérer les soumissions.

**Query Parameters :**
- `projectId` (optional) : Filtrer par projet
- `userId` (optional) : Filtrer par utilisateur
- `status` (optional) : Filtrer par statut

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "cls222333",
      "user": {
        "id": "clr123456",
        "name": "John Doe"
      },
      "project": {
        "id": "clprj901234",
        "title": "Application E-commerce"
      },
      "url": "https://github.com/john/ecommerce-app",
      "comments": "Version finale avec tests",
      "grade": null,
      "status": "SOUMIS",
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "message": "Submissions retrieved successfully"
}
```

### POST `/submissions`
🔒 **Authentification requise** | Rôles : `APPRENANT`

Soumettre un projet.

**Body :**
```json
{
  "projectId": "clprj901234",
  "url": "https://github.com/john/my-project",
  "comments": "Projet terminé avec toutes les fonctionnalités"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "id": "cls444555",
    "projectId": "clprj901234",
    "userId": "clr123456",
    "url": "https://github.com/john/my-project",
    "status": "SOUMIS",
    "createdAt": "2024-01-15T15:00:00Z"
  },
  "message": "Submission created successfully"
}
```

### PUT `/submissions/:id`
🔒 **Authentification requise** | Permissions : Variable selon rôle

Mettre à jour une soumission (noter, commenter).

**Body :**
```json
{
  "grade": 85.5,
  "comments": "Excellent travail, quelques améliorations possibles",
  "status": "VALIDE"
}
```

---

## 🎯 Gestion des Compétences

### GET `/competences`
🔒 **Authentification requise**

Récupérer la liste des compétences.

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "clc567890",
      "name": "React",
      "level": "Avancé",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Competences retrieved successfully"
}
```

### POST `/competences`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

Créer une nouvelle compétence.

**Body :**
```json
{
  "name": "Vue.js",
  "level": "Intermédiaire"
}
```

---

## 👥 Gestion des Promotions

### GET `/promotions`
🔒 **Authentification requise**

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp789012",
      "name": "Promotion 2024",
      "users": [
        {
          "id": "clr123456",
          "name": "John Doe"
        }
      ],
      "groups": [
        {
          "id": "clg345678",
          "name": "Groupe A"
        }
      ]
    }
  ],
  "message": "Promotions retrieved successfully"
}
```

### POST `/promotions`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

**Body :**
```json
{
  "name": "Promotion 2025"
}
```

---

## 👥 Gestion des Groupes

### GET `/groups`
🔒 **Authentification requise**

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "clg345678",
      "name": "Groupe A",
      "promotion": {
        "id": "clp789012",
        "name": "Promotion 2024"
      },
      "users": [
        {
          "id": "clr123456",
          "name": "John Doe"
        }
      ]
    }
  ],
  "message": "Groups retrieved successfully"
}
```

---

## 🔔 Notifications

### GET `/notifications`
🔒 **Authentification requise**

Récupérer les notifications de l'utilisateur connecté.

**Query Parameters :**
- `read` (optional) : Filtrer par statut de lecture (true/false)

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "cln666777",
      "message": "Nouveau projet assigné : Application E-commerce",
      "read": false,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "message": "Notifications retrieved successfully"
}
```

### PUT `/notifications/:id/read`
🔒 **Authentification requise**

Marquer une notification comme lue.

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "cln666777",
    "read": true
  },
  "message": "Notification marked as read"
}
```

---

## 📊 Ressources de Projets

### GET `/resources`
🔒 **Authentification requise**

**Query Parameters :**
- `projectId` (optional) : Filtrer par projet

### POST `/resources`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

**Body :**
```json
{
  "projectId": "clprj901234",
  "type": "video",
  "url": "https://youtube.com/watch?v=example"
}
```

---

## 📈 Critères d'Évaluation

### GET `/evaluation-criteria`
🔒 **Authentification requise**

**Query Parameters :**
- `projectId` (required) : ID du projet

### POST `/evaluation-criteria`
🔒 **Authentification requise** | Rôles : `FORMATEUR`, `RESPONSABLE`

**Body :**
```json
{
  "projectId": "clprj901234",
  "name": "Qualité du code",
  "weight": 25
}
```

---

## ❌ Codes d'Erreur

### Format des Erreurs
```json
{
  "success": false,
  "error": {
    "message": "Description de l'erreur",
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Codes Courants
- `400` : Données invalides
- `401` : Authentification requise
- `403` : Permissions insuffisantes
- `404` : Ressource non trouvée
- `409` : Conflit (ressource existante)
- `429` : Trop de requêtes
- `500` : Erreur serveur

### Exemples d'Erreurs
```json
{
  "success": false,
  "error": {
    "message": "Email already exists",
    "code": "USER_ALREADY_EXISTS"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔧 Rate Limiting

- **Limite** : 100 requêtes par 15 minutes
- **Headers de réponse** :
  - `X-RateLimit-Limit` : Limite maximale
  - `X-RateLimit-Remaining` : Requêtes restantes
  - `X-RateLimit-Reset` : Timestamp de reset

---

*Documentation générée automatiquement. Consultez `/api-docs` pour la version interactive.*