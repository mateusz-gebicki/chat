const express = require("express");
const router = express.Router();
const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
    node: process.env.ELASTICSEARCH_HOST || "http://elasticsearch:9200",
});

router.get('/', async (req, res) => {
    const possibleIndices = ['laravel-logstash', 'nodejs-logstash', 'websocket-messages'];
    const existingIndices = [];

    try {
        for (const index of possibleIndices) {
            const exists = await esClient.indices.exists({ index });
            console.log(`Index '${index}' exists:`, exists);
            if (exists) {
                existingIndices.push(index);
            }
        }

        console.log("Indices being searched:", existingIndices);

        if (existingIndices.length === 0) {
            console.log("No indices found.");
            return res.json([]);
        }

        const result = await esClient.search({
            index: existingIndices,
            size: 50,
            body: {
                query: {
                    match_all: {}
                },
                sort: [
                    { "timestamp": { "order": "desc", "unmapped_type": "date" } }
                ]
            }
        });


        console.log("🔍 Raw search result:", JSON.stringify(result, null, 2));

        const logs = result.hits.hits.map(hit => hit._source);
        console.log("Final logs returned:", logs);

        res.json(logs);
    } catch (error) {
        console.error('Elasticsearch query error:', error.meta?.body || error.message);
        res.status(500).json({ error: 'Failed to fetch logs from Elasticsearch' });
    }
});


module.exports = router;
