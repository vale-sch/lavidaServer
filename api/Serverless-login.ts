

//@ts-ignore
import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb + srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';

export default async (req: VercelRequest, res: VercelResponse) => {
    const client = new MongoClient(MONGODB_URI, {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db('mongodb + srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority');
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
};
