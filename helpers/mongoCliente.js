// mongoClient.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  maxPoolSize: 20,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  retryWrites: true
});

async function connectClient() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client;
}

export { client, connectClient };
