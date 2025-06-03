const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();

// Pobranie konfiguracji z ENV:
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Inicjalizacja Redis:
const redis = new Redis({ host: redisHost, port: redisPort });

// Definicja schematu w MongoDB:
const MessageSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model('Message', MessageSchema);

// Połączenie do MongoDB i utworzenie domyślnej wiadomości, jeśli kolekcja jest pusta:
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Message.countDocuments();
    if (count === 0) {
      await Message.create({ text: 'Hello from MongoDB!' });
      console.log('Default message created in MongoDB');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Endpoint GET / zwracający tekst z Mongo i licznik z Redis:
app.get('/', async (req, res) => {
  try {
    // pobierz pierwszy dokument:
    const doc = await Message.findOne().lean();
    const text = doc ? doc.text : 'No message found';

    // Inkrementuj i pobierz wartość licznika w Redis:
    const visits = await redis.incr('visits');

    res.json({ message: text, visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
