const express = require('express');
const WebSocket = require('ws');
const PIXI = require('pixi.js');

const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server: app });

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Handle WebSocket messages
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');

    // Clean up resources
  });
});

//serve pixijs to users
app.use('/pixi', express.static(path.join(__dirname, 'node_modules/pixi.js/dist')));