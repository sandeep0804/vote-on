module.exports = (io, socket) => {
  // When a new vote has been received
  const newVote = () => {
    // Broadcast a refresh event to all clients
    socket.emit('vote:refresh');
    socket.broadcast.emit('vote:refresh');
  };

  socket.on('vote:new', newVote);
};
