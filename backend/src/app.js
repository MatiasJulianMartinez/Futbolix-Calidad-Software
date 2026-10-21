const express = require('express');
const cors = require('cors');

const reservaRoutes = require('./routes/reservaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', reservaRoutes);

module.exports = app;