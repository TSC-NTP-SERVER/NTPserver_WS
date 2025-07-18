const express = require("express");
const { MongoClient } = require("mongodb");
const WebSocket = require("ws");

const { updateWatcher } = require("./service/wsService");
const { setupWS, broadcast } = require("./controller/wsController");

const app = express();
const PORT = 4000;
const MONGO_URI =
  "mongodb+srv://admin:1234@testrecieve.ekkcpkz.mongodb.net/db?retryWrites=true&w=majority&appName=s";
const DB_NAME = "db";

async function start() {
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  console.log("Connected to MongoDB");

  const db = mongoClient.db(DB_NAME);

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  const wss = new WebSocket.Server({ server });

  setupWS(wss);
  updateWatcher(db, (data) => broadcast(wss, data));
}

start().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});

