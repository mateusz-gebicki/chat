const net = require('net');

function logMessage(message) {
    const client = net.createConnection({ host: 'logstash', port: 5000 }, () => {
        client.write(JSON.stringify(message) + '\n');
        client.end();
    });

    client.on('error', (err) => {
        console.error("Could not connect to Logstash:", err.message);
    });
}

module.exports = { logMessage };
