"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
//@ts-ignore
const micro_cors_1 = require("micro-cors"); // Import the micro-cors package
const MONGODB_URI = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/test?retryWrites=true&w=majority';
// Create a CORS handler
const corsHandler = (0, micro_cors_1.cors)({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
});
exports.default = corsHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(MONGODB_URI, {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        yield client.connect();
        const db = client.db(); // Use the connected database
        const collection = db.collection('users');
        if (req.method === 'GET') {
            const users = yield collection.find({}).toArray();
            res.status(200).json(users);
        }
        else if (req.method === 'POST') {
            const newUser = req.body; // Assuming the request body contains the new user data
            const result = yield collection.insertOne(newUser);
            //@ts-ignore
            res.status(201).json(result.ops[0]);
        }
    }
    catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        yield client.close();
    }
}));
//@ts-ignore
const allowCors = fn => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return yield fn(req, res);
});
const handler = (req, res) => {
    const d = new Date();
    res.end(d.toString());
};
module.exports = allowCors(handler);
