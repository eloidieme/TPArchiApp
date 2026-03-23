# Rapport TP NodeJS

## Objectif

Le projet met en place un micro-service de messages en NodeJS avec Express, puis relie ce service au front-end du mini forum realise pendant la partie client.

## Structure generale

- `index.html`, `style.css`, `script.js` : interface client
- `index.js` : serveur NodeJS / Express
- `package.json` : dependances et script de lancement
- `render.yaml` : configuration de deploiement Render

## Choix de mise en oeuvre

Le serveur stocke les messages dans une variable globale `allMsgs`. Chaque message est represente par un objet contenant :

```js
{
  pseudo: "Alice",
  msg: "Bonjour",
  date: "2026-03-05T09:15:32"
}
```

Cette structure est plus riche qu'un simple tableau de chaines, mais elle permet de satisfaire la partie du sujet qui demande de faire apparaitre le pseudo et la date dans la page.

## Routes implementees

- `GET /msg/getAll`
  - retourne tous les messages
- `GET /msg/nber`
  - retourne le nombre de messages
- `GET /msg/get/[numero]`
  - retourne `{ code: 1, msg: ... }` si le message existe
  - retourne `{ code: 0 }` sinon
- `GET /msg/post/[message]?pseudo=...&date=...`
  - ajoute un message et retourne l'index du nouveau message
- `GET /msg/del/[numero]`
  - supprime un message si l'index existe

## Fonctionnement du client

Au chargement de la page, `script.js` appelle `fetch("/msg/getAll")` pour recuperer la liste des messages et remplir dynamiquement le fil de discussion.

Quand l'utilisateur poste un message :

1. le formulaire est valide cote client
2. le message est envoye au micro-service via `GET /msg/post/...`
3. la liste locale est mise a jour
4. l'interface se rerend immediatement

Le bouton "Mettre a jour les messages" relance un appel vers le serveur afin de recuperer l'etat courant.

## Points techniques

- ajout du support CORS dans `index.js`
- port configurable avec `process.env.PORT || 8080`
- front connecte au micro-service du sujet
- conservation de l'UI/UX amelioree realisee sur la partie client

## Lancement local

Installer les dependances :

```bash
npm install
```

Lancer le serveur :

```bash
npm start
```

Si le port `8080` est deja occupe :

```bash
PORT=8081 npm start
```

## Deploiement

Une configuration `render.yaml` a ete ajoutee pour un deploiement sur Render en offre gratuite.

Principe :

1. pousser le depot sur GitHub
2. connecter le depot a Render
3. creer un Web Service avec le plan `free`
4. laisser Render utiliser `npm install` puis `npm start`

## Remarque

La route de publication utilise `GET`, conformement au sujet, meme si un `POST` serait plus naturel dans une application reelle.
