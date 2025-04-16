const { MongoClient } = require('mongodb');

const DB_URI  = process.env.DB_URI  || 'mongodb://mongo:27017/chatapp';
const DB_NAME = process.env.DB_NAME || 'chatdb';

let client;
let db;
let collection;

async function connect() {
    client = new MongoClient(DB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection('messages');
}

function getDb() {
    if (!db) throw new Error('Database not initialized');
    return db;
}

async function saveMessage(message) {
    if (!collection) throw new Error('Database not initialized');
    await collection.insertOne(message);
}

async function getMessages() {
    if (!collection) throw new Error('Database not initialized');
    return collection.find().sort({ _id: 1 }).toArray();
}

module.exports = { connect, getDb, saveMessage, getMessages };