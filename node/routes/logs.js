const express = require("express");
const router = express.Router();
const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
    node: process.env.ELASTICSEARCH_HOST || "http://elasticsearch:9200",
});

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     summary: Get logs from Elasticsearch
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       500:
 *         description: Failed to fetch logs
 */
router.get('/', async (req, res) => {
    const possibleIndices = ['laravel-logstash', 'nodejs-logstash', 'websocket-messages'];
    const existingIndices = [];

    try {
        for (const index of possibleIndices) {
            const exists = await esClient.indices.exists({ index });
            if (exists) {
                existingIndices.push(index);
            }
        }

        if (existingIndices.length === 0) {
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

        const logs = result.hits.hits.map(hit => hit._source);
        res.json(logs);
    } catch (error) {
        console.error('Elasticsearch query error:', error.meta?.body || error.message);
        res.status(500).json({ error: 'Failed to fetch logs from Elasticsearch' });
    }
});

module.exports = router;
