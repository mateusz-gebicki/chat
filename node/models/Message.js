let db;

function init(database) {
    db = database;
}

async function getAllMessages() {
    return db.collection('messages')
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
}

async function getMessageById(id) {
    const { ObjectId } = require('mongodb');
    return db.collection('messages').findOne({ _id: new ObjectId(id) });
}

async function createMessage({ userId, content }) {
    const message = {
        userId,
        content,
        timestamp: new Date()
    };
    const result = await db.collection('messages').insertOne(message);
    return { ...message, _id: result.insertedId };
}

async function updateMessage(id, content) {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('messages').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { content } },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function deleteMessage(id) {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}

module.exports = {
    init,
    getAllMessages,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage
};