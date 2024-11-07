# santupro-api

## Description du projet

SantuPro API est un service backend pour la gestion des comptes, des clients et des factures. Il fournit un ensemble de points de terminaison API RESTful pour effectuer des opérations CRUD sur ces entités. Le projet est construit en utilisant Node.js et Express, et utilise MongoDB comme base de données.

## Fonctionnalités

- Gestion des comptes (création, lecture, mise à jour, suppression)
- Gestion des clients (création, lecture, mise à jour, suppression)
- Gestion des factures (création, lecture, mise à jour, suppression)
- Authentification et autorisation
- Gestion des erreurs et journalisation des requêtes

## Instructions d'installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- npm (v6 ou supérieur)

### Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/aboubacar3012/santu-api.git
cd santu-api
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` dans le répertoire racine et ajoutez les variables d'environnement suivantes :

```env
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
MAIL=your_email
MAIL_PASSWORD=your_email_password
JWT_EXPIRE=1d
```

4. Démarrez le serveur :

```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`.

## Instructions d'utilisation

### Authentification

Pour utiliser l'API, vous devez vous authentifier en utilisant un jeton JWT. Vous pouvez obtenir un jeton en vous connectant avec votre email et votre mot de passe.

### Points de terminaison de l'API

#### Comptes

- `GET /api/accounts`: Obtenir tous les comptes
- `GET /api/accounts/:id`: Obtenir un compte par ID
- `POST /api/accounts/auth`: Authentifier et créer un nouveau compte
- `PUT /api/accounts/updatepassword/:id`: Changer le mot de passe après la première connexion
- `PUT /api/accounts/update/:id`: Mettre à jour un compte
- `DELETE /api/accounts/:id`: Supprimer un compte

#### Clients

- `GET /api/clients`: Obtenir tous les clients
- `GET /api/clients/:id`: Obtenir un client par ID
- `POST /api/clients/create`: Créer un nouveau client
- `PUT /api/clients/update/:id`: Mettre à jour un client
- `DELETE /api/clients/delete/:id`: Supprimer un client

#### Factures

- `GET /api/invoices/dashboard/:accountId`: Obtenir toutes les factures pour un compte spécifique
- `GET /api/invoices/:id`: Obtenir une facture par ID
- `POST /api/invoices/create`: Créer une nouvelle facture

## Middleware

Le projet inclut un middleware pour la gestion des erreurs et la journalisation des requêtes. Le middleware est situé dans `src/utils/middleware.js`.

## Connexion à la base de données

Le projet utilise Mongoose pour la connexion à la base de données et la définition des schémas. La connexion à la base de données est configurée dans `src/model/dbConnection.js`.

## Variables d'environnement

Le projet utilise `dotenv` pour les variables d'environnement. Les variables d'environnement sont définies dans le fichier `.env` et chargées dans `src/utils/config.js`.

## Licence

Ce projet est sous licence MIT.
