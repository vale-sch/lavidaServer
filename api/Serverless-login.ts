//@ts-ignore
import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
//@ts-ignore

import { cors } from 'micro-cors'; // Import the micro-cors package

const MONGODB_URI = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/test?retryWrites=true&w=majority';

// Create a CORS handler
const corsHandler = cors({
    origin: 'http://127.0.0.1:5500', // Replace with your actual client origin
    methods: ['GET', 'POST'],
});

export default corsHandler(async (req: VercelRequest, res: VercelResponse) => {
    const client = new MongoClient(MONGODB_URI, {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(); // Use the connected database

        const collection = db.collection('users');

        if (req.method === 'GET') {
            const users = await collection.find({}).toArray();
            res.status(200).json(users);
        } else if (req.method === 'POST') {
            const newUser = req.body; // Assuming the request body contains the new user data
            const result = await collection.insertOne(newUser);
            //@ts-ignore
            res.status(201).json(result.ops[0]);
        }
    } catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});
//@ts-ignore
const allowCors = fn => async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

const handler = (req: any, res: any) => {
    const d = new Date()
    res.end(d.toString())
}

module.exports = allowCors(handler)

