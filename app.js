const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Zmienna sprawdzająca, czy jesteśmy w trybie testowym:
const isTest = process.env.NODE_ENV === 'test';

let redisClient;
let Message;

if (!isTest) {
  redisClient = new Redis({ host: redisHost, port: redisPort });

  const MessageSchema = new mongoose.Schema({ text: String });
  Message = mongoose.model('Message', MessageSchema);

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

app.get('/', async (req, res) => {
  try {
    const doc = (await Message.findOne().lean?.()) || (await Message.findOne());
    const text = doc ? doc.text : 'No message found';

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
