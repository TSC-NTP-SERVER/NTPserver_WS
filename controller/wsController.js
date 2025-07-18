const WebSocket = require("ws");

function setupWS(wss) {
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.send(JSON.stringify({ message: "Connected to WebSocket Server" }));
  });
}

function broadcast(wss, data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = {
    setupWS,
    broadcast,
};