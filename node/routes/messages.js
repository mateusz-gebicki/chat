const express = require('express');
const router = express.Router();
const database = require('../database');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/messages:
 *   get:
 *     summary: Get all messages
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *       500:
 *         description: Failed to fetch messages
 */
router.get('/', async (req, res) => {
    try {
        const db = await database.getDb();
        const messages = await db.collection('messages')
            .find({})
            .sort({ timestamp: -1 })
            .toArray();
        res.json(messages);
    } catch (err) {
        console.error('Failed to fetch messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     summary: Create a new message
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Message created
 *       500:
 *         description: Failed to create message
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { userId, content } = req.body;
        const db = await database.getDb();

        const message = {
            userId,
            content,
            timestamp: new Date()
        };

        const result = await db.collection('messages').insertOne(message);
        res.status(201).json({ _id: result.insertedId, ...message });
    } catch (err) {
        console.error('Failed to create message:', err);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

/**
 * @swagger
 * /api/v1/messages/{id}:
 *   put:
 *     summary: Update a message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Message updated
 *       404:
 *         description: Message not found
 *       500:
 *         description: Failed to update message
 */
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const db = await database.getDb();

        const result = await db.collection('messages').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { content } },
            { returnDocument: 'after' }
        );

        if (!result.value) return res.status(404).json({ error: 'Message not found' });

        res.json(result.value);
    } catch (err) {
        console.error('Failed to update message:', err);
        res.status(500).json({ error: 'Failed to update message' });
    }
});

/**
 * @swagger
 * /api/v1/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Message deleted
 *       404:
 *         description: Message not found
 *       500:
 *         description: Failed to delete message
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const db = await database.getDb();

        const result = await db.collection('messages').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Message not found' });

        res.status(204).send();
    } catch (err) {
        console.error('Failed to delete message:', err);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
