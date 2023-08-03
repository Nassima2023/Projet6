const express = require('express');
const cors = require('cors');

const app = express();
const port = 5500; // Le port de votre serveur front-end

// Utilisez cors() pour activer les en-têtes CORS
app.use(cors());

// Définissez vos routes ici

// Exécutez le serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur front-end démarré sur le port ${port}`);
});