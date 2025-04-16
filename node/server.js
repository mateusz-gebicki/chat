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

const Message = require('./models/Message');

database.connect()
    .then((db) => {
        Message.init(db);
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/documentation', express.static(path.join(__dirname, 'docs')));

const messagesRouter = require('./routes/messages');
app.use('/api/v1/messages', messagesRouter);

const logsRouter = require('./routes/logs');
app.use('/api/v1/logs', logsRouter);

const setupSwagger = require('./swagger');
setupSwagger(app);

kibana.init(app);

websocket.init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});