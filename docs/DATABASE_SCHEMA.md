# Schéma de Base de Données - SkillHub

## 🗄️ Vue d'ensemble

La base de données SkillHub utilise **PostgreSQL** avec **Prisma ORM**. Elle est conçue pour gérer un système éducatif complet avec utilisateurs, projets, compétences et évaluations.

## 📊 Diagramme ERD

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│    User     │─────▶│  Promotion   │◀─────│   Group     │
│             │      │              │      │             │
└─────────────┘      └──────────────┘      └─────────────┘
       │                                          │
       │ 1:N                                     │ N:M
       ▼                                          ▼
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Project    │─────▶│ProjectAssign │      │ UserGroups  │
│             │      │   ment       │      │ (relation)  │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │
       │ N:M                │ 1:N
       ▼                     ▼
┌─────────────┐      ┌──────────────┐
│ Competence  │      │  Submission  │
│             │      │              │
└─────────────┘      └──────────────┘
       │                     
       │ 1:N                
       ▼                     
┌─────────────┐              
│CompetenceOn │              
│  Project    │              
└─────────────┘              
```

## 📋 Tables et Relations

### 👤 **User** (Utilisateurs)
Gère tous les utilisateurs du système avec leurs rôles et informations personnelles.

```prisma
model User {
  id              String           @id @default(cuid())
  email           String           @unique
  password        String
  name            String
  role            Role
  promotion       Promotion?       @relation(fields: [promotionId], references: [id])
  promotionId     String?
  groups          Group[]          @relation("UserGroups")
  projects        ProjectAssignment[]
  submissions     Submission[]
  notifications   Notification[]
  createdAt       DateTime         @default(now())
  projectsCreated Project[]        @relation("CreatedProjects")
}

enum Role {
  APPRENANT      // Étudiant
  FORMATEUR      // Enseignant
  RESPONSABLE    // Administrateur
}
```

**Relations:**
- `1:N` avec ProjectAssignment (un utilisateur peut avoir plusieurs projets)
- `1:N` avec Submission (un utilisateur peut avoir plusieurs soumissions)
- `1:N` avec Notification (un utilisateur peut avoir plusieurs notifications)
- `N:1` avec Promotion (plusieurs utilisateurs dans une promotion)
- `N:M` avec Group (un utilisateur peut être dans plusieurs groupes)
- `1:N` avec Project via "CreatedProjects" (un formateur peut créer plusieurs projets)

---

### 🎓 **Promotion** (Promotions/Classes)
Représente les promotions ou classes d'étudiants.

```prisma
model Promotion {
  id     String  @id @default(cuid())
  name   String
  users  User[]
  groups Group[]
}
```

**Relations:**
- `1:N` avec User (une promotion contient plusieurs utilisateurs)
- `1:N` avec Group (une promotion peut avoir plusieurs groupes)

---

### 👥 **Group** (Groupes)
Gère les groupes d'étudiants au sein des promotions.

```prisma
model Group {
  id          String     @id @default(cuid())
  name        String
  users       User[]     @relation("UserGroups")
  promotion   Promotion? @relation(fields: [promotionId], references: [id])
  promotionId String?
}
```

**Relations:**
- `N:M` avec User (relation many-to-many via "UserGroups")
- `N:1` avec Promotion (plusieurs groupes dans une promotion)

---

### 📘 **Project** (Projets)
Contient les projets pédagogiques avec leurs objectifs et critères.

```prisma
model Project {
  id           String                @id @default(cuid())
  title        String
  description  String
  objectives   String
  deadline     DateTime?
  competencies CompetenceOnProject[]
  criteria     EvaluationCriteria[]
  resources    Resource[]
  assignments  ProjectAssignment[]
  createdBy    User                  @relation("CreatedProjects", fields: [createdById], references: [id])
  createdById  String
  submissions  Submission[]
  createdAt    DateTime              @default(now())
  updatedAt    DateTime              @updatedAt
}
```

**Relations:**
- `1:N` avec ProjectAssignment (un projet peut être assigné à plusieurs utilisateurs)
- `1:N` avec Submission (un projet peut avoir plusieurs soumissions)
- `1:N` avec EvaluationCriteria (un projet a plusieurs critères d'évaluation)
- `1:N` avec Resource (un projet peut avoir plusieurs ressources)
- `N:M` avec Competence via CompetenceOnProject
- `N:1` avec User via "CreatedProjects" (créé par un formateur)

---

### 📝 **ProjectAssignment** (Assignations de Projets)
Table de liaison entre projets et utilisateurs avec statut de progression.

```prisma
model ProjectAssignment {
  id        String  @id @default(cuid())
  project   Project @relation(fields: [projectId], references: [id])
  projectId String
  user      User    @relation(fields: [userId], references: [id])
  userId    String
  status    AssignmentStatus @default(EN_COURS)
}

enum AssignmentStatus {
  EN_COURS        // En cours de réalisation
  SOUMIS          // Soumis pour évaluation
  VALIDE          // Validé par le formateur
  A_RETRAVAILLER  // À retravailler
}
```

**Relations:**
- `N:1` avec Project (plusieurs assignations par projet)
- `N:1` avec User (plusieurs assignations par utilisateur)

---

### 🎯 **Competence** (Compétences)
Catalogue des compétences techniques et transversales.

```prisma
model Competence {
  id       String               @id @default(cuid())
  name     String
  level    String               // Niveau de difficulté
  projects CompetenceOnProject[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Relations:**
- `N:M` avec Project via CompetenceOnProject

---

### 🔗 **CompetenceOnProject** (Compétences sur Projets)
Table de liaison many-to-many entre Competence et Project.

```prisma
model CompetenceOnProject {
  projectId    String
  competenceId String
  project      Project    @relation(fields: [projectId], references: [id])
  competence   Competence @relation(fields: [competenceId], references: [id])

  @@id([projectId, competenceId])
}
```

---

### 📊 **EvaluationCriteria** (Critères d'Évaluation)
Définit les critères d'évaluation des projets avec leurs poids.

```prisma
model EvaluationCriteria {
  id        String   @id @default(cuid())
  name      String
  weight    Int      // Poids dans l'évaluation globale (sur 100)
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String
}
```

**Relations:**
- `N:1` avec Project (plusieurs critères par projet)

---

### 📤 **Submission** (Soumissions)
Gère les soumissions de projets par les étudiants.

```prisma
model Submission {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String
  url       String?  // URL du livrable (GitHub, etc.)
  comments  String?  // Commentaires de l'étudiant
  grade     Float?   // Note attribuée
  status    AssignmentStatus @default(SOUMIS)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Relations:**
- `N:1` avec User (plusieurs soumissions par utilisateur)
- `N:1` avec Project (plusieurs soumissions par projet)

---

### 📚 **Resource** (Ressources)
Ressources pédagogiques associées aux projets.

```prisma
model Resource {
  id        String   @id @default(cuid())
  type      String   // Type: "link", "file", "video", etc.
  url       String   // URL de la ressource
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Relations:**
- `N:1` avec Project (plusieurs ressources par projet)

---

### 🔔 **Notification** (Notifications)
Système de notifications pour les utilisateurs.

```prisma
model Notification {
  id        String   @id @default(cuid())
  message   String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

**Relations:**
- `N:1` avec User (plusieurs notifications par utilisateur)

## 🔍 Index et Performance

### Index Automatiques
Prisma crée automatiquement des index pour :
- Toutes les clés primaires (`@id`)
- Toutes les contraintes uniques (`@unique`)
- Toutes les clés étrangères (`@relation`)

### Index Personnalisés Recommandés
```prisma
// À ajouter pour optimiser les requêtes fréquentes
@@index([status, createdAt])     // ProjectAssignment
@@index([read, createdAt])       // Notification
@@index([role, promotionId])     // User
@@index([deadline, createdAt])   // Project
```

## 📋 Données de Seed

Le fichier `prisma/seed.ts` contient des données de test pour :
- Utilisateurs de test (admin, formateur, apprenants)
- Promotions et groupes
- Projets avec compétences
- Critères d'évaluation
- Ressources et notifications

```bash
# Exécuter le seed
npx prisma db seed
```

## 🔄 Migrations

### Commandes Utiles
```bash
# Créer une migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Reset complet (développement uniquement)
npx prisma migrate reset

# Générer le client
npx prisma generate
```

## 📈 Évolution du Schéma

### Améliorations Prévues
1. **Table `File`** pour gestion des uploads
2. **Table `Comment`** pour commentaires sur soumissions
3. **Table `Badge`** pour système de gamification
4. **Table `Course`** pour modules de formation
5. **Table `Grade`** pour détail des notes par critère
6. **Audit Trail** pour traçabilité des modifications

### Contraintes Business
- Un utilisateur ne peut soumettre qu'une fois par projet
- Seuls les FORMATEUR et RESPONSABLE peuvent créer des projets
- Les notifications sont automatiquement créées lors d'événements
- Les statuts suivent un workflow défini (EN_COURS → SOUMIS → VALIDE/A_RETRAVAILLER)

---

*Cette documentation reflète l'état actuel du schéma. Consultez `prisma/schema.prisma` pour la version la plus récente.*