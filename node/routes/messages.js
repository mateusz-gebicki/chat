const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET - Wszystkie wiadomości
router.get('/', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

// POST - Dodaj wiadomość
router.post('/', async (req, res) => {
    const { userId, content } = req.body;

    const message = new Message({ userId, content });
    await message.save();

    res.status(201).json(message);
});

// PUT - Aktualizuj wiadomość
router.put('/:id', async (req, res) => {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.content = content;
    await message.save();

    res.json(message);
});

// DELETE - Usuń wiadomość
router.delete('/:id', async (req, res) => {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) return res.status(404).json({ error: 'Message not found' });

    res.status(204).send();
});

module.exports = router;
