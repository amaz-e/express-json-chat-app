const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MESSAGE_LIMIT = 30;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const HTML_FILE = path.join(__dirname, 'index.html');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

// Load messages from file
function loadMessages() {
  if (fs.existsSync(MESSAGES_FILE)) {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    messages = JSON.parse(data);
  }
}

// Save messages to file
function saveMessages() {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

// Get latest messages
app.get('/messages', (req, res) => {
  loadMessages();
  const latestMessages = messages.slice(-MESSAGE_LIMIT);
  res.json(latestMessages);
});

// Post a new message
app.post('/messages', (req, res) => {
  const { text } = req.body;
  const newMessage = {
    text,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);
  saveMessages();

  res.status(201).json(newMessage);
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
