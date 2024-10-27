const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let playlist;

const corsOptions = {
  origin: [process.env.LOCAL_URL, process.env.FRONTEND_URL], 
  methods: ['GET', 'OPTIONS'],
};

app.use(cors(corsOptions));

async function connectDb() {
    try {
        await client.connect();
        const db = client.db('Spotify');
        playlist = db.collection('Playlist');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

connectDb()

app.get('/api/playlists', async (req, res) => {
  try {
    const songs = await playlist.find({}).toArray();
    res.status(200).json(songs);
  } catch (error) {
      console.error("Error fetching songs", error);
      res.status(500).json({ error: "Could not fetch songs" });
  }
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${port}`);
})