// app.js
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();

// Pobranie konfiguracji z ENV:
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Zmienna sprawdzająca, czy jesteśmy w trybie testowym:
const isTest = process.env.NODE_ENV === 'test';

let redisClient;
let Message;

// W trybie innym niż "test" – podłączamy się do Mongo i Redis:
if (!isTest) {
  // Inicjalizacja Redis:
  redisClient = new Redis({ host: redisHost, port: redisPort });

  // Definicja schematu w MongoDB:
  const MessageSchema = new mongoose.Schema({ text: String });
  Message = mongoose.model('Message', MessageSchema);

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
} else {
  // W trybie testowym – wstawiamy proste, „dummy” obiekty:
  // redisClient.incr zawsze zwróci 1,
  // Message.findOne zawsze zwróci { text: 'Test message' }.
  redisClient = {
    incr: async () => {
      return 1;
    },
  };
  Message = {
    findOne: async () => {
      return { text: 'Test message' };
    },
  };
}

// Endpoint GET / zwracający tekst z Mongo i licznik z Redis:
app.get('/', async (req, res) => {
  try {
    // W trybie testowym Message.findOne() i redisClient.incr()
    // wykonują się natychmiast, więc nie czekamy na podłączenie do prawdziwych baz.
    const doc = (await Message.findOne().lean?.()) || (await Message.findOne());
    // Drobna uwaga: w „prawdziwym” Message to model mongoose, więc ma metodę .lean()
    // W testowym „dummy” Message nie ma .lean(), więc używamy doc = await Message.findOne().
    const text = doc ? doc.text : 'No message found';

    // Inkrementuj i pobierz wartość licznika w Redis (w testowym dummy zawsze 1):
    const visits = await redisClient.incr('visits');

    res.json({ message: text, visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jeżeli nie jesteśmy w trybie testowym, uruchamiamy serwer:
if (!isTest) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
