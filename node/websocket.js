const socketIO     = require('socket.io');
const database     = require('./database');
const elasticsearch = require('./elasticsearch');
const logstash     = require('./logstash');

function init(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('chatMessage', async (text) => {
            const message = { text, timestamp: new Date() };
            try {
                io.emit('chatMessage', message);
                await database.saveMessage(message);
                await elasticsearch.indexMessage(message);
            } catch (err) {
                console.error('Error saving message:', err);
            }

            logstash.logMessage(message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { init };
