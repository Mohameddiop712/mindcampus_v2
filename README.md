# MindCampus — Application de soutien psychologique étudiant

## Stack technique
- **Frontend** : React + Vite + Tailwind CSS
- **Backend** : Node.js + Express
- **Base de données** : MongoDB + Mongoose

## Structure du projet
```
mindcampus/
├── backend/
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Auth JWT
│   ├── models/          # Schémas Mongoose
│   ├── routes/          # Routes API
│   ├── .env             # Variables d'environnement
│   ├── server.js        # Point d'entrée
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Layout, composants réutilisables
    │   ├── context/     # AuthContext
    │   ├── pages/       # Toutes les pages
    │   └── App.jsx
    ├── index.html
    └── package.json
```

## Lancer le projet

### 1. Prérequis
- Node.js >= 18
- MongoDB installé et lancé
- npm ou yarn

### 2. Backend
```bash
cd backend
npm install
# Vérifiez le fichier .env (MONGO_URI, JWT_SECRET)
npm run dev
# Serveur sur http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App sur http://localhost:5173
```

## Comptes de test
Créez des comptes via /register avec les rôles :
- `etudiant` — accès complet étudiant
- `pair` — tableau de bord pair-aidant
- `professionnel` — gestion rendez-vous

## Fonctionnalités
- Authentification JWT (inscription/connexion)
- Suivi humeur quotidien avec emojis
- Recommandations automatiques selon l'humeur
- Demandes d'aide (pair ou professionnel)
- Chat anonyme en temps réel
- Prise de rendez-vous
- Dashboard avec graphiques
- Design responsive mobile + desktop
