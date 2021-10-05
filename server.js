const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const socketController = require('./controllers/socketController');

const PORT = process.env.PORT || 3000;
const app = express();

// Initialize Socket.IO server
const server = http.createServer(app);
const io = new Server(server);

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse the body for POST and PUT requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/elections', require('./routes/elections'));
app.use('/api/voters', require('./routes/voters'));
app.use('/api/votes', require('./routes/votes'));

// Routes
app.get('/', (req, res) => res.sendFile(path.resolve('public', 'index.html')));

// Socket connection event handler
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);
  socketController(io, socket);
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
