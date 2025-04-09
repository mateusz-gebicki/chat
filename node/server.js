const express = require('express');
const http = require('http');
const path = require('path');

const database     = require('./database');
const elasticsearch = require('./elasticsearch');
const kibana       = require('./kibana');
const logstash     = require('./logstash');
const websocket    = require('./websocket');

const app = express();
const server = http.createServer(app);

database.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/messages', async (req, res) => {
    try {
        const messages = await database.getMessages();
        res.json(messages);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch messages',
            message: err
        });
    }
});

app.get('/logs', async (req, res) => {
    try {
        const logs = await elasticsearch.getLogs();
        res.json(logs);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch logs: ',
            message: err
        });
    }
});

kibana.init(app);

websocket.init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
