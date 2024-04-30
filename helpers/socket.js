const socketIO = require('socket.io');

function setupSocket(server) {
    const io = socketIO(server, {
        cors: { origin: "*" },
        pingTimeout: 50 * 1000, // 50 secs
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        // console.log(socket);
        socket.on('newMessage', (msg) => {
            console.log('Received new message:', msg);
            // Emit a message event back to the client
            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
}

module.exports = setupSocket;
