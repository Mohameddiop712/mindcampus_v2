const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/humeur', require('./routes/humeur'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/rendezvous', require('./routes/rendezvous'));
app.use('/api/recommandations', require('./routes/recommandations'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'MindCampus API running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
