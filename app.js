const express = require('express');
const app = express();
const cors = require('cors');
const dbConnection = require('./src/config/dbconfig.provider');

app.use(cors({ origin: '*' }));
app.use(express.json())
app.use('/api', require('./src/index.routes'));




const port = process.env.PORT || 3000;

dbConnection.connexion.sync({ force: false })
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.listen(port, () => {
    console.log(`app running on ${port}`);
});
