const { Client } = require('@elastic/elasticsearch');

const ES_URL = process.env.ES_URL || 'http://localhost:9200';
const client = new Client({ node: ES_URL });

async function indexMessage(message) {
    await client.index({
        index: 'messages',
        body: message
    });
}

async function getLogs() {
    const result = await client.search({
        index: 'logstash-*',
        body: {
            size: 50,
            sort: [{ "@timestamp": { order: "desc" } }],
            query: { match_all: {} }
        }
    });
    return result.hits.hits.map(hit => hit._source);
}

module.exports = { indexMessage, getLogs };
